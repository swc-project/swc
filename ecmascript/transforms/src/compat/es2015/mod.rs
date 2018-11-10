pub use self::{
    arrow::Arrow, shorthand_property::Shorthand, spread::SpreadElement, sticky_regex::StickyRegex,
    template_literal::TemplateLiteral,
};

use swc_common::Fold;
use swc_ecma_ast::Module;

mod arrow;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;

/// Compiles es2015 to es5.
pub fn es2015() -> impl Fold<Module> {
    Shorthand.then(SpreadElement::default()).then(StickyRegex)
}
