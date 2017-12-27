use EqIgnoreSpan;
use std::fmt::Debug;

/// Currently just a marker trait.
///
///
///
///
/// # Derive
/// This trait can be derived with `#[derive(AstNode)]`.
///
pub trait AstNode: Debug + EqIgnoreSpan + Clone {}
