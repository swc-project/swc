//! Private wire format and verified materialization for SWC's native carriers.
//!
//! A digest establishes equality with the embedded addon, not publisher
//! identity. The installed carrier must already be trusted like any other
//! native addon.

pub mod cache;
mod error;
pub mod format;
pub mod platform;
pub mod replacement;

pub use error::{Error, ErrorKind, Result};
