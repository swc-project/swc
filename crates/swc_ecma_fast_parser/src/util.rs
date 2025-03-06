//! Utility functions for the parser. This module is copied from hashbrown

// FIXME: Branch prediction hint. This is currently only available on nightly
// but it consistently improves performance by 10-15%.
#[cfg(not(feature = "nightly"))]
pub(crate) use std::convert::{identity as likely, identity as unlikely};
#[cfg(feature = "nightly")]
pub(crate) use std::intrinsics::{likely, unlikely};
