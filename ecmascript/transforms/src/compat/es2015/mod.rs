pub use self::{
    arrow::arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, function_name::function_name, instanceof::InstanceOf,
    parameters::parameters, shorthand_property::Shorthand, spread::Spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};
use super::helpers::Helpers;
use ast::Module;
use crate::pass::Pass;
use std::sync::Arc;
use swc_common::Fold;

mod arrow;
mod block_scoped_fn;
mod block_scoping;
mod classes;
mod computed_props;
mod destructuring;
mod duplicate_keys;
mod function_name;
mod instanceof;
mod parameters;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

/// Compiles es2015 to es5.
pub fn es2015(helpers: &Arc<Helpers>) -> impl Fold<Module> {
    chain!(
        chain!(arrow(), duplicate_keys(),),
        Classes {
            helpers: helpers.clone(),
        },
        BlockScopedFns,
        parameters(),
        function_name(),
        Shorthand,
        chain!(
            Spread {
                helpers: helpers.clone(),
            },
            StickyRegex,
            InstanceOf {
                helpers: helpers.clone(),
            },
            TypeOfSymbol {
                helpers: helpers.clone(),
            },
            TemplateLiteral {
                helpers: helpers.clone(),
            }
        ),
        computed_properties(helpers.clone()),
        destructuring(helpers.clone()),
        block_scoping()
    )
}
