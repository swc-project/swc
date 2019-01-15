pub use self::{
    member_expr_lits::MemberExprLit, prop_lits::PropertyLiteral, reserved_word::ReservedWord,
};
use crate::pass::Pass;
use ast::Expr;

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3() -> impl Pass + Clone {
    chain_at!(Expr, PropertyLiteral, MemberExprLit, ReservedWord)
}
