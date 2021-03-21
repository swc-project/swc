pub use self::{
    member_expr_lits::member_expression_literals, prop_lits::property_literals,
    reserved_word::reserved_words,
};
use swc_common::chain;
use swc_ecma_visit::Fold;

mod member_expr_lits;
mod prop_lits;
mod reserved_word;

/// Make output es3-compatible.
pub fn es3(preserve_import: bool) -> impl Fold {
    chain!(
        property_literals(),
        member_expression_literals(),
        reserved_words(preserve_import)
    )
}
