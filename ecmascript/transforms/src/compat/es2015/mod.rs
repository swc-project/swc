pub use self::{
    arrow::Arrow, classes::Classes, shorthand_property::Shorthand, spread::Spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral,
};

use super::helpers::Helpers;
use ast::Module;
use std::sync::Arc;
use swc_common::Fold;

mod arrow;
mod classes;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;

/// Compiles es2015 to es5.
pub fn es2015(helpers: Arc<Helpers>) -> impl Fold<Module> {
    Classes {
        helpers: helpers.clone(),
    }
    .then(Spread {
        helpers: helpers.clone(),
    })
    .then(StickyRegex)
    .then(Shorthand)
}
