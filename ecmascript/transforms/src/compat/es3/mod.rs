pub use self::{
    member_expr_lits::MemberExprLit, prop_lits::PropertyLiteral, reserved_word::ReservedWord,
};
use ast::Expr;
use swc_common::Fold;

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3() -> impl Fold<Expr> {
    chain_at!(Expr, PropertyLiteral, MemberExprLit)
}
