use swc_ecma_ast::Pass;

pub use self::{
    member_expr_lits::member_expression_literals, prop_lits::property_literals,
    reserved_word::reserved_words,
};

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3(preserve_import: bool) -> impl Pass {
    (
        property_literals(),
        member_expression_literals(),
        reserved_words(preserve_import),
    )
}
