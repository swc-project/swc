pub use self::{
    member_expr_lits::MemberExprLit, prop_lits::PropertyLiteral, reserved_word::ReservedWord,
};
use swc_ecma_ast::Expr;
use swc_ecma_visit::Fold;

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3(preserve_import: bool) -> impl Fold {
    chain_at!(
        Expr,
        PropertyLiteral,
        MemberExprLit,
        ReservedWord { preserve_import }
    )
}
