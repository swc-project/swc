use pos::Spanned;
use std::fmt::Debug;

/// A marker trait for ast nodes.
///
///
pub trait AstNode: Debug + PartialEq + Clone + Spanned {}

impl<N: Debug + PartialEq + Clone + Spanned> AstNode for N {}
