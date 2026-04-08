//! ============================================================================
//! OFT CETES — LayerZero V2 Omnichain Fungible Token (Arbitrum Stylus)
//! Tokenized Mexican Treasury Bonds for cross-chain transfer
//! ============================================================================

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageU256, StorageString},
};

sol_storage! {
    #[entrypoint]
    pub struct OFTCetes {
        // ERC-20 base
        StorageString name;
        StorageString symbol;
        StorageU256 total_supply;
        StorageMap<Address, StorageU256> balances;
        StorageMap<Address, StorageMap<Address, StorageU256>> allowances;

        // OFT / LayerZero
        StorageAddress lz_endpoint;
        StorageMap<u32, StorageAddress> trusted_remotes; // chainId => remote OFT address

        // CETES Metadata
        StorageU256 maturity_date;
        StorageU256 coupon_rate_bps;
        StorageU256 face_value;
        StorageAddress issuer;
        StorageBool iso20022_compliant;
        StorageBool kyc_required;

        // Admin
        StorageAddress owner;
        StorageBool paused;
    }
}

sol! {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event SendToChain(uint16 indexed dstChainId, address indexed from, bytes toAddress, uint256 amount);
    event ReceiveFromChain(uint16 indexed srcChainId, address indexed to, uint256 amount);
    event CETESMinted(address indexed to, uint256 amount, uint256 maturityDate);
    event CETESRedeemed(address indexed from, uint256 amount, uint256 faceValue);
    event TrustedRemoteSet(uint16 indexed chainId, address remote);
}

sol! {
    error CETESNotMatured(uint256 maturityDate, uint256 currentTime);
    error KYCRequired();
    error UntrustedRemote(uint16 chainId);
    error InsufficientBalance(uint256 available, uint256 required);
    error OFTPaused();
    error Unauthorized();
}

#[public]
impl OFTCetes {
    // -----------------------------------------------------------------------
    // ERC-20 Core
    // -----------------------------------------------------------------------

    pub fn name(&self) -> String {
        self.name.get_string()
    }

    pub fn symbol(&self) -> String {
        self.symbol.get_string()
    }

    pub fn decimals(&self) -> u8 {
        6 // CETES use 6 decimals (aligned with USDC)
    }

    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(account)
    }

    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        self.require_not_paused()?;
        let from = msg::sender();
        self.internal_transfer(from, to, amount)?;
        Ok(true)
    }

    pub fn approve(&mut self, spender: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let owner = msg::sender();
        self.allowances.get(owner).insert(spender, amount);
        evm::log(Approval { owner, spender, value: amount });
        Ok(true)
    }

    pub fn allowance(&self, owner: Address, spender: Address) -> U256 {
        self.allowances.get(owner).get(spender)
    }

    pub fn transfer_from(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
    ) -> Result<bool, Vec<u8>> {
        self.require_not_paused()?;

        let spender = msg::sender();
        let current_allowance = self.allowances.get(from).get(spender);
        if current_allowance < amount {
            return Err(InsufficientBalance { available: current_allowance, required: amount }.encode());
        }
        self.allowances.get(from).insert(spender, current_allowance - amount);
        self.internal_transfer(from, to, amount)?;
        Ok(true)
    }

    // -----------------------------------------------------------------------
    // CETES-Specific Functions
    // -----------------------------------------------------------------------

    /// Mint new CETES tokens (issuer only, KYC verified)
    pub fn mint_cetes(
        &mut self,
        to: Address,
        amount: U256,
        maturity_date: U256,
    ) -> Result<(), Vec<u8>> {
        self.require_owner()?;

        self.balances.insert(to, self.balances.get(to) + amount);
        self.total_supply.set(self.total_supply.get() + amount);
        self.maturity_date.set(maturity_date);

        evm::log(CETESMinted {
            to,
            amount,
            maturityDate: maturity_date,
        });

        Ok(())
    }

    /// Redeem matured CETES for face value
    pub fn redeem_cetes(&mut self, amount: U256) -> Result<U256, Vec<u8>> {
        self.require_not_paused()?;

        let current_time = U256::from(evm::block_timestamp());
        let maturity = self.maturity_date.get();
        if current_time < maturity {
            return Err(CETESNotMatured {
                maturityDate: maturity,
                currentTime: current_time,
            }
            .encode());
        }

        let sender = msg::sender();
        let balance = self.balances.get(sender);
        if balance < amount {
            return Err(InsufficientBalance { available: balance, required: amount }.encode());
        }

        // Burn CETES tokens
        self.balances.insert(sender, balance - amount);
        self.total_supply.set(self.total_supply.get() - amount);

        let face = self.face_value.get();
        evm::log(CETESRedeemed {
            from: sender,
            amount,
            faceValue: face,
        });

        Ok(face)
    }

    /// Get CETES maturity date
    pub fn maturity_date(&self) -> U256 {
        self.maturity_date.get()
    }

    /// Check ISO-20022 compliance
    pub fn is_iso20022_compliant(&self) -> bool {
        self.iso20022_compliant.get()
    }

    // -----------------------------------------------------------------------
    // LayerZero V2 OFT Cross-Chain
    // -----------------------------------------------------------------------

    /// Send tokens cross-chain via LayerZero
    pub fn send_to_chain(
        &mut self,
        dst_chain_id: u16,
        to: Address,
        amount: U256,
    ) -> Result<(), Vec<u8>> {
        self.require_not_paused()?;

        let sender = msg::sender();
        let balance = self.balances.get(sender);
        if balance < amount {
            return Err(InsufficientBalance { available: balance, required: amount }.encode());
        }

        // Burn on source chain
        self.balances.insert(sender, balance - amount);
        self.total_supply.set(self.total_supply.get() - amount);

        // In production: call LZ endpoint.send()
        evm::log(SendToChain {
            dstChainId: dst_chain_id,
            from: sender,
            toAddress: to.as_slice().to_vec().into(),
            amount,
        });

        Ok(())
    }

    /// Receive tokens from another chain (LZ endpoint only)
    pub fn receive_from_chain(
        &mut self,
        src_chain_id: u16,
        to: Address,
        amount: U256,
    ) -> Result<(), Vec<u8>> {
        self.require_lz_endpoint()?;

        // Mint on destination chain
        self.balances.insert(to, self.balances.get(to) + amount);
        self.total_supply.set(self.total_supply.get() + amount);

        evm::log(ReceiveFromChain {
            srcChainId: src_chain_id,
            to,
            amount,
        });

        Ok(())
    }

    /// Set trusted remote for a chain
    pub fn set_trusted_remote(&mut self, chain_id: u32, remote: Address) -> Result<(), Vec<u8>> {
        self.require_owner()?;
        self.trusted_remotes.insert(chain_id, remote);
        evm::log(TrustedRemoteSet {
            chainId: chain_id as u16,
            remote,
        });
        Ok(())
    }

    // -----------------------------------------------------------------------
    // Internal
    // -----------------------------------------------------------------------

    fn internal_transfer(
        &mut self,
        from: Address,
        to: Address,
        amount: U256,
    ) -> Result<(), Vec<u8>> {
        let from_balance = self.balances.get(from);
        if from_balance < amount {
            return Err(InsufficientBalance { available: from_balance, required: amount }.encode());
        }
        self.balances.insert(from, from_balance - amount);
        self.balances.insert(to, self.balances.get(to) + amount);
        evm::log(Transfer { from, to, value: amount });
        Ok(())
    }

    fn require_not_paused(&self) -> Result<(), Vec<u8>> {
        if self.paused.get() {
            return Err(OFTPaused {}.encode());
        }
        Ok(())
    }

    fn require_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(Unauthorized {}.encode());
        }
        Ok(())
    }

    fn require_lz_endpoint(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.lz_endpoint.get() {
            return Err(Unauthorized {}.encode());
        }
        Ok(())
    }
}
