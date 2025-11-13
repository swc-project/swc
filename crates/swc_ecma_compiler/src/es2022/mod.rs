use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod class_properties;
mod class_static_block;
mod options;

use class_properties::ClassProperties;
pub use class_properties::ClassPropertiesOptions;
use class_static_block::ClassStaticBlock;
pub use options::ES2022Options;

pub struct ES2022<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    options: ES2022Options,

    // Plugins
    class_static_block: Option<ClassStaticBlock>,
    class_properties: Option<ClassProperties<'a, 'ctx>>,
}

impl<'a, 'ctx> ES2022<'a, 'ctx> {
    pub fn new(
        options: ES2022Options,
        remove_class_fields_without_initializer: bool,
        ctx: &'ctx TransformCtx<'a>,
    ) -> Self {
        // Class properties transform performs the static block transform differently.
        // So only enable static block transform if class properties transform is
        // disabled.
        let (class_static_block, class_properties) =
            if let Some(properties_options) = options.class_properties {
                let class_properties = ClassProperties::new(
                    properties_options,
                    options.class_static_block,
                    remove_class_fields_without_initializer,
                    ctx,
                );
                (None, Some(class_properties))
            } else {
                let class_static_block = if options.class_static_block {
                    Some(ClassStaticBlock::new())
                } else {
                    None
                };
                (class_static_block, None)
            };
        Self {
            ctx,
            options,
            class_static_block,
            class_properties,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2022<'_, '_> {
    #[inline] // Because this is a no-op in release mode
    fn exit_program(&mut self, program: &mut Program, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.exit_program(program, ctx);
        }
    }

    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.enter_expr(expr, ctx);
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.exit_expr(expr, ctx);
        }
    }

    fn enter_class_body(&mut self, body: &mut Vec<ClassMember>, ctx: &mut TraverseCtx) {
        match &mut self.class_properties {
            Some(class_properties) => {
                class_properties.enter_class_body(body, ctx);
            }
            _ => {
                if let Some(class_static_block) = &mut self.class_static_block {
                    class_static_block.enter_class_body(body, ctx);
                }
            }
        }
    }

    fn exit_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.exit_class(class, ctx);
        }
    }

    fn enter_assign_target(&mut self, target: &mut AssignTarget, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.enter_assign_target(target, ctx);
        }
    }

    fn enter_class_prop(&mut self, prop: &mut ClassProp, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.enter_class_prop(prop, ctx);
        }
    }

    fn exit_class_prop(&mut self, prop: &mut ClassProp, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.exit_class_prop(prop, ctx);
        }
    }

    fn enter_static_block(&mut self, block: &mut StaticBlock, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.enter_static_block(block, ctx);
        }
    }

    fn exit_static_block(&mut self, block: &mut StaticBlock, ctx: &mut TraverseCtx) {
        if let Some(class_properties) = &mut self.class_properties {
            class_properties.exit_static_block(block, ctx);
        }
    }

    fn enter_expr_await(&mut self, node: &mut AwaitExpr, ctx: &mut TraverseCtx) {
        if self.options.top_level_await && Self::is_top_level(ctx) {
            // TODO: Port diagnostic system to SWC
            // For now, we'll emit a warning through ctx
            eprintln!(
                "Warning: Top-level await is not available in the configured target environment."
            );
        }
    }
}

impl ES2022<'_, '_> {
    fn is_top_level(ctx: &TraverseCtx) -> bool {
        ctx.current_hoist_scope_id() == ctx.scoping().root_scope_id()
    }
}
