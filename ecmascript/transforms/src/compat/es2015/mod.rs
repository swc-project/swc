pub use self::{
    arrow::arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, for_of::for_of, function_name::function_name,
    instanceof::InstanceOf, parameters::parameters, resolver::resolver,
    shorthand_property::Shorthand, spread::Spread, sticky_regex::StickyRegex,
    template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};
use crate::{helpers::Helpers, pass::Pass};
use ast::{Expr, Module, Stmt};
use std::sync::Arc;

mod arrow;
mod block_scoped_fn;
mod block_scoping;
mod classes;
mod computed_props;
mod destructuring;
mod duplicate_keys;
mod for_of;
mod function_name;
mod instanceof;
mod parameters;
mod resolver;
mod shorthand_property;
mod spread;
mod sticky_regex;
mod template_literal;
mod typeof_symbol;

/// Compiles es2015 to es5.
pub fn es2015(helpers: &Arc<Helpers>) -> impl Pass {
    fn exprs(helpers: &Arc<Helpers>) -> impl Pass {
        chain_at!(
            Expr,
            arrow(),
            duplicate_keys(),
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
            },
            Shorthand,
        )
    }

    fn stmts(helpers: &Arc<Helpers>) -> impl Pass {
        chain_at!(
            Stmt,
            function_name(),
            exprs(helpers),
            BlockScopedFns,
            parameters(),
        )
    }

    chain_at!(
        Module,
        resolver(),
        Classes {
            helpers: helpers.clone(),
        },
        stmts(helpers),
        for_of(),
        computed_properties(helpers.clone()),
        destructuring(helpers.clone()),
        block_scoping(),
    )
}
