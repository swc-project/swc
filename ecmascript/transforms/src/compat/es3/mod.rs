use swc_common::Fold;
use swc_ecma_ast::Module;

pub use self::{
    member_expr_lits::MemberExprLit, prop_lits::PropertyLiteral, reserved_word::ReservedWord,
};

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3() -> impl Fold<Module> {
    PropertyLiteral.then(MemberExprLit)
}
