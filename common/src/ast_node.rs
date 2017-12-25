use EqIgnoreSpan;
use std::fmt::Debug;

/// Currently just a marker trait.
///
pub trait AstNode: Debug + EqIgnoreSpan + Clone {}
