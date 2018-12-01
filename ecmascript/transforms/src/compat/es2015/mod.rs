pub use self::{
    arrow::arrow, block_scoped_fn::BlockScopedFns, block_scoping::block_scoping, classes::Classes,
    computed_props::computed_properties, destructuring::destructuring,
    duplicate_keys::duplicate_keys, function_name::function_name, instanceof::InstanceOf,
    parameters::parameters, shorthand_property::Shorthand, spread::Spread,
    sticky_regex::StickyRegex, template_literal::TemplateLiteral, typeof_symbol::TypeOfSymbol,
};
use super::helpers::Helpers;
use ast::{Expr, Module, Stmt};
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

pub fn exprs(helpers: &Arc<Helpers>) -> impl Fold<Expr> {
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

pub fn stmts(helpers: &Arc<Helpers>) -> impl Fold<Stmt> {
    chain_at!(
        Stmt,
        exprs(helpers),
        Classes {
            helpers: helpers.clone(),
        },
        BlockScopedFns,
        function_name(),
        parameters(),
    )
}

/// Compiles es2015 to es5.
pub fn es2015(helpers: &Arc<Helpers>) -> impl Fold<Module> {
    chain_at!(
        Module,
        stmts(helpers),
        computed_properties(helpers.clone()),
        destructuring(helpers.clone()),
        block_scoping(),
    )
}
