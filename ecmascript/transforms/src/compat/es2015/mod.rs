pub use self::{
    arrow::Arrow, block_scoping::block_scoping, classes::Classes, function_name::function_name,
    instanceof::InstanceOf, shorthand_property::Shorthand, spread::Spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};

use super::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

mod arrow;
mod block_scoping;
mod classes;
mod function_name;
mod instanceof;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

/// Compiles es2015 to es5.
pub fn es2015(helpers: &Arc<Helpers>) -> impl Fold<Module> {
    Classes {
        helpers: helpers.clone(),
    }
    .then(Arrow)
    .then(function_name())
    .then(Spread {
        helpers: helpers.clone(),
    })
    .then(StickyRegex)
    .then(Shorthand)
    .then(InstanceOf {
        helpers: helpers.clone(),
    })
    .then(TypeOfSymbol {
        helpers: helpers.clone(),
    })
    .then(TemplateLiteral {
        helpers: helpers.clone(),
    })
    .then(block_scoping())
}
