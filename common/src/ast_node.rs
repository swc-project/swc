use EqIgnoreSpan;
use std::fmt::Debug;
use std::hash::Hash;

/// Currently just a marker trait.
///
pub trait AstNode: Debug + EqIgnoreSpan + Hash + Clone {}
