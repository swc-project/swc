use swc_common::Fold;
use swc_ecma_ast::Module;

mod arrow;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;

pub fn es2015() -> impl Fold<Module> {
        shorthand_property::Shorthand
                .then(spread::SpreadElement::default())
                .then(sticky_regex::StickyRegex)
}
