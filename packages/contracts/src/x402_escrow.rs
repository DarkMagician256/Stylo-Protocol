//! ============================================================================
//! x402 ESCROW — Agentic Micropayment Settlement (Arbitrum Stylus)
//! Atomic escrow for AI agent intelligence payments ($0.01-$0.05 USDC)
//! ============================================================================

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageU256},
};

/// USDC has 6 decimals on Arbitrum One
const USDC_DECIMALS: u64 = 6;
const MIN_PAYMENT: u64 = 10_000;   // $0.01 USDC (6 decimals)
const MAX_PAYMENT: u64 = 50_000;   // $0.05 USDC (6 decimals)

sol_storage! {
    #[entrypoint]
    pub struct X402Escrow {
        // USDC token
        StorageAddress usdc_token;

        // Escrow balances
        StorageMap<Address, StorageU256> agent_balances;
        StorageMap<Address, StorageU256> payer_deposits;

        // Settlement tracking
        StorageU256 total_settlements;
        StorageU256 total_volume;
        StorageU256 settlement_nonce;

        // Fee configuration
        StorageU256 protocol_fee_bps; // basis points taken by protocol
        StorageAddress fee_recipient;

        // Admin
        StorageAddress owner;
        StorageBool paused;

        // Agent registry
        StorageMap<Address, StorageBool> registered_agents;
        StorageMap<Address, StorageU256> agent_earnings;
        StorageMap<Address, StorageU256> agent_settlement_count;
    }
}

sol! {
    event PaymentDeposited(address indexed payer, uint256 amount);
    event PaymentSettled(
        address indexed payer,
        address indexed agent,
        uint256 amount,
        uint256 protocolFee,
        uint256 nonce
    );
    event PaymentRefunded(address indexed payer, uint256 amount);
    event AgentWithdrawal(address indexed agent, uint256 amount);
    event AgentRegistered(address indexed agent, bool status);
    event ProtocolFeeUpdated(uint256 newFeeBps);
}

sol! {
    error PaymentTooLow(uint256 amount, uint256 minimum);
    error PaymentTooHigh(uint256 amount, uint256 maximum);
    error InsufficientDeposit(uint256 available, uint256 required);
    error AgentNotRegistered(address agent);
    error EscrowPaused();
    error Unauthorized();
    error WithdrawalFailed();
}

#[public]
impl X402Escrow {
    // -----------------------------------------------------------------------
    // Deposit & Settlement
    // -----------------------------------------------------------------------

    /// Deposit USDC into escrow for future agent payments
    pub fn deposit(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        self.require_not_paused()?;

        let payer = msg::sender();
        let current = self.payer_deposits.get(payer);
        self.payer_deposits.insert(payer, current + amount);

        evm::log(PaymentDeposited { payer, amount });
        Ok(())
    }

    /// Settle a payment from payer to agent (x402 protocol)
    /// Called by the x402 middleware after verifying the API call
    pub fn settle_payment(
        &mut self,
        payer: Address,
        agent: Address,
        amount: U256,
    ) -> Result<U256, Vec<u8>> {
        self.require_not_paused()?;
        self.require_owner()?; // Only middleware can settle

        // Validate payment bounds
        let min = U256::from(MIN_PAYMENT);
        let max = U256::from(MAX_PAYMENT);
        if amount < min {
            return Err(PaymentTooLow { amount, minimum: min }.encode());
        }
        if amount > max {
            return Err(PaymentTooHigh { amount, maximum: max }.encode());
        }

        // Verify agent is registered
        if !self.registered_agents.get(agent) {
            return Err(AgentNotRegistered { agent }.encode());
        }

        // Check payer has sufficient deposit
        let payer_balance = self.payer_deposits.get(payer);
        if payer_balance < amount {
            return Err(InsufficientDeposit {
                available: payer_balance,
                required: amount,
            }
            .encode());
        }

        // Calculate protocol fee
        let fee_bps = self.protocol_fee_bps.get();
        let protocol_fee = amount
            .checked_mul(fee_bps)
            .unwrap_or(U256::ZERO)
            .checked_div(U256::from(10000u64))
            .unwrap_or(U256::ZERO);

        let agent_payment = amount.saturating_sub(protocol_fee);

        // Execute settlement
        self.payer_deposits.insert(payer, payer_balance - amount);
        let agent_bal = self.agent_balances.get(agent);
        self.agent_balances.insert(agent, agent_bal + agent_payment);

        // Track fee recipient balance
        if protocol_fee > U256::ZERO {
            let fee_recip = self.fee_recipient.get();
            let fee_bal = self.agent_balances.get(fee_recip);
            self.agent_balances.insert(fee_recip, fee_bal + protocol_fee);
        }

        // Update statistics
        let nonce = self.settlement_nonce.get() + U256::from(1u64);
        self.settlement_nonce.set(nonce);
        self.total_settlements.set(self.total_settlements.get() + U256::from(1u64));
        self.total_volume.set(self.total_volume.get() + amount);

        // Update agent stats
        let earnings = self.agent_earnings.get(agent);
        self.agent_earnings.insert(agent, earnings + agent_payment);
        let count = self.agent_settlement_count.get(agent);
        self.agent_settlement_count.insert(agent, count + U256::from(1u64));

        evm::log(PaymentSettled {
            payer,
            agent,
            amount,
            protocolFee: protocol_fee,
            nonce,
        });

        Ok(nonce)
    }

    /// Agent withdraws accumulated earnings
    pub fn agent_withdraw(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        self.require_not_paused()?;

        let agent = msg::sender();
        let balance = self.agent_balances.get(agent);
        if balance < amount {
            return Err(InsufficientDeposit { available: balance, required: amount }.encode());
        }

        self.agent_balances.insert(agent, balance - amount);

        // In production: transfer USDC to agent
        evm::log(AgentWithdrawal { agent, amount });
        Ok(())
    }

    /// Refund unused deposits to payer
    pub fn refund(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        self.require_not_paused()?;

        let payer = msg::sender();
        let balance = self.payer_deposits.get(payer);
        if balance < amount {
            return Err(InsufficientDeposit { available: balance, required: amount }.encode());
        }

        self.payer_deposits.insert(payer, balance - amount);
        evm::log(PaymentRefunded { payer, amount });
        Ok(())
    }

    // -----------------------------------------------------------------------
    // View Functions
    // -----------------------------------------------------------------------

    pub fn get_agent_balance(&self, agent: Address) -> U256 {
        self.agent_balances.get(agent)
    }

    pub fn get_payer_deposit(&self, payer: Address) -> U256 {
        self.payer_deposits.get(payer)
    }

    pub fn get_total_settlements(&self) -> U256 {
        self.total_settlements.get()
    }

    pub fn get_total_volume(&self) -> U256 {
        self.total_volume.get()
    }

    pub fn get_agent_earnings(&self, agent: Address) -> U256 {
        self.agent_earnings.get(agent)
    }

    pub fn get_agent_settlement_count(&self, agent: Address) -> U256 {
        self.agent_settlement_count.get(agent)
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------

    pub fn register_agent(&mut self, agent: Address, status: bool) -> Result<(), Vec<u8>> {
        self.require_owner()?;
        self.registered_agents.insert(agent, status);
        evm::log(AgentRegistered { agent, status });
        Ok(())
    }

    pub fn set_protocol_fee(&mut self, fee_bps: U256) -> Result<(), Vec<u8>> {
        self.require_owner()?;
        // Max fee: 5% (500 bps)
        if fee_bps > U256::from(500u64) {
            return Err(Unauthorized {}.encode());
        }
        self.protocol_fee_bps.set(fee_bps);
        evm::log(ProtocolFeeUpdated { newFeeBps: fee_bps });
        Ok(())
    }

    fn require_not_paused(&self) -> Result<(), Vec<u8>> {
        if self.paused.get() {
            return Err(EscrowPaused {}.encode());
        }
        Ok(())
    }

    fn require_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(Unauthorized {}.encode());
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_payment_bounds() {
        assert!(MIN_PAYMENT == 10_000);  // $0.01
        assert!(MAX_PAYMENT == 50_000);  // $0.05
        assert!(MIN_PAYMENT < MAX_PAYMENT);
    }

    #[test]
    fn test_fee_calculation() {
        let amount = U256::from(50_000u64); // $0.05
        let fee_bps = U256::from(100u64);   // 1%
        let fee = amount * fee_bps / U256::from(10000u64);
        assert_eq!(fee, U256::from(500u64)); // $0.005
    }
}
