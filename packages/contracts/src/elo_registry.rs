//! ============================================================================
//! ELO REGISTRY — On-Chain Agent Meritocracy (Arbitrum Stylus)
//! Rank agents by Sharpe Ratio and PnL for transparent performance tracking
//! ============================================================================

use alloc::vec::Vec;
use stylus_sdk::{
    alloy_primitives::{Address, U256},
    evm, msg,
    prelude::*,
    storage::{StorageAddress, StorageBool, StorageMap, StorageU256},
};

/// Default starting ELO rating
const DEFAULT_ELO: u64 = 1200;
/// K-factor for ELO calculation
const K_FACTOR: u64 = 32;

sol_storage! {
    #[entrypoint]
    pub struct EloRegistry {
        // Agent ratings
        StorageMap<Address, StorageU256> elo_ratings;
        StorageMap<Address, StorageU256> sharpe_ratios; // stored as fixed-point (x1000)
        StorageMap<Address, StorageU256> total_pnl;     // signed as U256 with offset
        StorageMap<Address, StorageU256> total_trades;
        StorageMap<Address, StorageU256> win_count;

        // Registry
        StorageMap<Address, StorageBool> registered;
        StorageU256 agent_count;

        // Leaderboard — top 10 tracking
        StorageU256 leaderboard_size;

        // Admin
        StorageAddress owner;
        StorageAddress oracle; // Performance oracle
    }
}

sol! {
    event AgentRegistered(address indexed agent, uint256 initialElo);
    event EloUpdated(address indexed agent, uint256 oldElo, uint256 newElo);
    event PerformanceRecorded(
        address indexed agent,
        uint256 pnl,
        bool isProfit,
        uint256 sharpeRatio,
        uint256 newElo
    );
    event MatchResult(
        address indexed agentA,
        address indexed agentB,
        address indexed winner,
        uint256 newEloA,
        uint256 newEloB
    );
}

sol! {
    error AgentAlreadyRegistered(address agent);
    error AgentNotRegistered(address agent);
    error UnauthorizedOracle();
    error InvalidRating();
}

#[public]
impl EloRegistry {
    /// Register a new agent with default ELO
    pub fn register_agent(&mut self, agent: Address) -> Result<(), Vec<u8>> {
        if self.registered.get(agent) {
            return Err(AgentAlreadyRegistered { agent }.encode());
        }

        self.registered.insert(agent, true);
        self.elo_ratings.insert(agent, U256::from(DEFAULT_ELO));
        self.sharpe_ratios.insert(agent, U256::ZERO);
        self.total_pnl.insert(agent, U256::ZERO);
        self.total_trades.insert(agent, U256::ZERO);
        self.win_count.insert(agent, U256::ZERO);
        self.agent_count.set(self.agent_count.get() + U256::from(1u64));

        evm::log(AgentRegistered {
            agent,
            initialElo: U256::from(DEFAULT_ELO),
        });

        Ok(())
    }

    /// Record agent performance (called by oracle)
    /// pnl_offset: value above/below U256 midpoint represents profit/loss
    pub fn record_performance(
        &mut self,
        agent: Address,
        pnl: U256,
        is_profit: bool,
        sharpe_x1000: U256,
    ) -> Result<(), Vec<u8>> {
        self.require_oracle()?;
        self.require_registered(agent)?;

        // Update PnL
        let current_pnl = self.total_pnl.get(agent);
        if is_profit {
            self.total_pnl.insert(agent, current_pnl + pnl);
        } else {
            self.total_pnl.insert(agent, current_pnl.saturating_sub(pnl));
        }

        // Update Sharpe ratio (exponential moving average)
        let current_sharpe = self.sharpe_ratios.get(agent);
        let new_sharpe = (current_sharpe * U256::from(7u64) + sharpe_x1000 * U256::from(3u64))
            / U256::from(10u64);
        self.sharpe_ratios.insert(agent, new_sharpe);

        // Update trade count
        let trades = self.total_trades.get(agent) + U256::from(1u64);
        self.total_trades.insert(agent, trades);

        if is_profit {
            let wins = self.win_count.get(agent) + U256::from(1u64);
            self.win_count.insert(agent, wins);
        }

        // Adjust ELO based on performance
        let old_elo = self.elo_ratings.get(agent);
        let new_elo = if is_profit {
            // Win: increase ELO proportional to Sharpe
            let bonus = sharpe_x1000
                .checked_div(U256::from(100u64))
                .unwrap_or(U256::ZERO);
            old_elo + U256::from(K_FACTOR) + bonus
        } else {
            // Loss: decrease ELO
            old_elo.saturating_sub(U256::from(K_FACTOR / 2))
        };

        self.elo_ratings.insert(agent, new_elo);

        evm::log(PerformanceRecorded {
            agent,
            pnl,
            isProfit: is_profit,
            sharpeRatio: new_sharpe,
            newElo: new_elo,
        });

        Ok(())
    }

    /// Head-to-head ELO match between two agents
    pub fn record_match(
        &mut self,
        agent_a: Address,
        agent_b: Address,
        winner: Address,
    ) -> Result<(), Vec<u8>> {
        self.require_oracle()?;
        self.require_registered(agent_a)?;
        self.require_registered(agent_b)?;

        let elo_a = self.elo_ratings.get(agent_a);
        let elo_b = self.elo_ratings.get(agent_b);

        let (new_elo_a, new_elo_b) = if winner == agent_a {
            (
                elo_a + U256::from(K_FACTOR),
                elo_b.saturating_sub(U256::from(K_FACTOR)),
            )
        } else {
            (
                elo_a.saturating_sub(U256::from(K_FACTOR)),
                elo_b + U256::from(K_FACTOR),
            )
        };

        self.elo_ratings.insert(agent_a, new_elo_a);
        self.elo_ratings.insert(agent_b, new_elo_b);

        evm::log(MatchResult {
            agentA: agent_a,
            agentB: agent_b,
            winner,
            newEloA: new_elo_a,
            newEloB: new_elo_b,
        });

        Ok(())
    }

    // -----------------------------------------------------------------------
    // View Functions
    // -----------------------------------------------------------------------

    pub fn get_elo(&self, agent: Address) -> U256 {
        self.elo_ratings.get(agent)
    }

    pub fn get_sharpe_ratio(&self, agent: Address) -> U256 {
        self.sharpe_ratios.get(agent)
    }

    pub fn get_total_pnl(&self, agent: Address) -> U256 {
        self.total_pnl.get(agent)
    }

    pub fn get_win_rate(&self, agent: Address) -> U256 {
        let trades = self.total_trades.get(agent);
        if trades == U256::ZERO {
            return U256::ZERO;
        }
        let wins = self.win_count.get(agent);
        wins.checked_mul(U256::from(10000u64))
            .unwrap_or(U256::ZERO)
            .checked_div(trades)
            .unwrap_or(U256::ZERO)
    }

    pub fn get_agent_stats(&self, agent: Address) -> (U256, U256, U256, U256, U256) {
        (
            self.elo_ratings.get(agent),
            self.sharpe_ratios.get(agent),
            self.total_pnl.get(agent),
            self.total_trades.get(agent),
            self.win_count.get(agent),
        )
    }

    pub fn get_agent_count(&self) -> U256 {
        self.agent_count.get()
    }

    pub fn is_registered(&self, agent: Address) -> bool {
        self.registered.get(agent)
    }

    // -----------------------------------------------------------------------
    // Admin
    // -----------------------------------------------------------------------

    pub fn set_oracle(&mut self, oracle: Address) -> Result<(), Vec<u8>> {
        self.require_owner()?;
        self.oracle.set(oracle);
        Ok(())
    }

    fn require_oracle(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.oracle.get() {
            return Err(UnauthorizedOracle {}.encode());
        }
        Ok(())
    }

    fn require_registered(&self, agent: Address) -> Result<(), Vec<u8>> {
        if !self.registered.get(agent) {
            return Err(AgentNotRegistered { agent }.encode());
        }
        Ok(())
    }

    fn require_owner(&self) -> Result<(), Vec<u8>> {
        if msg::sender() != self.owner.get() {
            return Err(UnauthorizedOracle {}.encode());
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_elo() {
        assert_eq!(DEFAULT_ELO, 1200);
    }

    #[test]
    fn test_k_factor() {
        assert_eq!(K_FACTOR, 32);
    }

    #[test]
    fn test_elo_increase() {
        let elo = U256::from(1200u64);
        let new_elo = elo + U256::from(K_FACTOR);
        assert_eq!(new_elo, U256::from(1232u64));
    }

    #[test]
    fn test_elo_decrease_no_underflow() {
        let elo = U256::from(10u64);
        let new_elo = elo.saturating_sub(U256::from(K_FACTOR));
        assert_eq!(new_elo, U256::ZERO);
    }
}
