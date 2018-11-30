pub use self::{
    arrow::Arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::DuplicateKeys, function_name::function_name, instanceof::InstanceOf,
    parameters::parameters, shorthand_property::Shorthand, spread::Spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};
use super::helpers::Helpers;
use crate::pass::Pass;
use std::sync::Arc;

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
pub fn es2015(helpers: &Arc<Helpers>) -> Box<Pass> {
    box chain!(
        DuplicateKeys,
        Classes {
            helpers: helpers.clone(),
        },
        BlockScopedFns,
        parameters(),
        function_name(),
        Shorthand,
        chain!(
            Arrow,
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
