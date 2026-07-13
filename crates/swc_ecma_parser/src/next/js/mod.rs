//! JavaScript grammar productions that build owned SWC AST nodes directly.

mod assignment;
mod class;
mod expression;
pub(crate) use expression::is_legacy_integer_literal;
#[cfg(feature = "flow")]
mod flow;
mod function;
mod jsx;
mod lhs;
mod module;
mod object;
mod operator;
mod pattern;
mod statement;
pub(crate) mod template;
