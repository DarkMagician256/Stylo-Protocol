//! ============================================================================
//! STYLO PROTOCOL — Arbitrum Stylus Smart Contracts
//! Root library for all contract modules
//! ============================================================================

#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

#[global_allocator]
static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

pub mod stylo_vault;
pub mod privacy_layer;
pub mod oft_cetes;
pub mod x402_escrow;
pub mod elo_registry;
