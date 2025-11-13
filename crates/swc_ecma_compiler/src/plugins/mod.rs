mod options;
mod styled_components;

pub use options::PluginsOptions;
pub use styled_components::StyledComponentsOptions;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{
    context::{TransformCtx, TraverseCtx},
    plugins::styled_components::StyledComponents,
};

/// Container for various plugin transforms.
///
/// This struct manages optional plugin transformations, delegating visitor
/// calls to the appropriate plugin implementation when enabled.
pub struct Plugins<'a> {
    styled_components: Option<StyledComponents<'a>>,
}

impl<'a> Plugins<'a> {
    /// Creates a new plugins manager with the given options.
    ///
    /// # Arguments
    ///
    /// * `options` - Configuration for which plugins to enable and their
    ///   settings
    /// * `ctx` - Transform context for accessing utilities and error reporting
    pub fn new(options: PluginsOptions, ctx: &'a TransformCtx) -> Self {
        Self {
            styled_components: options
                .styled_components
                .map(|options| StyledComponents::new(options, ctx)),
        }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for Plugins<'a> {
    fn enter_program(&mut self, node: &mut Program, ctx: &mut TraverseCtx<'a>) {
        if let Some(styled_components) = &mut self.styled_components {
            styled_components.enter_program(node, ctx);
        }
    }

    fn enter_var_declarator(&mut self, node: &mut VarDeclarator, ctx: &mut TraverseCtx<'a>) {
        if let Some(styled_components) = &mut self.styled_components {
            styled_components.enter_var_declarator(node, ctx);
        }
    }

    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx<'a>) {
        if let Some(styled_components) = &mut self.styled_components {
            styled_components.enter_expr(node, ctx);
        }
    }

    fn enter_call_expr(&mut self, node: &mut CallExpr, ctx: &mut TraverseCtx<'a>) {
        if let Some(styled_components) = &mut self.styled_components {
            styled_components.enter_call_expr(node, ctx);
        }
    }
}
