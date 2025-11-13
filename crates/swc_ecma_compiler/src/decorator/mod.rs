mod legacy;
mod options;

use legacy::LegacyDecorator;
pub use options::DecoratorOptions;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

/// Decorator transform plugin that handles both legacy and standard decorators.
///
/// This plugin transforms decorator syntax to equivalent JavaScript code.
/// Currently supports legacy decorators (TypeScript experimental decorators).
pub struct DecoratorTransform<'a, 'ctx> {
    options: DecoratorOptions,

    // Plugins
    legacy_decorator: LegacyDecorator<'a, 'ctx>,
}

impl<'a, 'ctx> DecoratorTransform<'a, 'ctx> {
    pub fn new(options: DecoratorOptions, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            legacy_decorator: LegacyDecorator::new(options.emit_decorator_metadata, ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for DecoratorTransform<'_, '_> {
    #[inline]
    fn exit_program(&mut self, node: &mut Program, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_program(node, ctx);
        }
    }

    #[inline]
    fn enter_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_stmt(stmt, ctx);
        }
    }

    #[inline]
    fn exit_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_stmt(stmt, ctx);
        }
    }

    #[inline]
    fn enter_class(&mut self, node: &mut Class, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_class(node, ctx);
        }
    }

    #[inline]
    fn exit_class(&mut self, node: &mut Class, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_class(node, ctx);
        }
    }

    #[inline]
    fn enter_class_method(&mut self, node: &mut ClassMethod, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_class_method(node, ctx);
        }
    }

    #[inline]
    fn exit_class_method(&mut self, node: &mut ClassMethod, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_class_method(node, ctx);
        }
    }

    #[inline]
    fn enter_auto_accessor(&mut self, node: &mut AutoAccessor, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_auto_accessor(node, ctx);
        }
    }

    #[inline]
    fn exit_auto_accessor(&mut self, node: &mut AutoAccessor, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_auto_accessor(node, ctx);
        }
    }

    #[inline]
    fn enter_class_prop(&mut self, node: &mut ClassProp, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_class_prop(node, ctx);
        }
    }

    #[inline]
    fn exit_class_prop(&mut self, node: &mut ClassProp, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_class_prop(node, ctx);
        }
    }

    #[inline]
    fn enter_decorator(&mut self, node: &mut swc_ecma_ast::Decorator, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.enter_decorator(node, ctx);
        }
    }
}

impl DecoratorTransform<'_, '_> {
    #[inline]
    pub fn exit_class_at_end(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        if self.options.legacy {
            self.legacy_decorator.exit_class_at_end(class, ctx);
        }
    }
}
