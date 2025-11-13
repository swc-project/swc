//! Legacy decorator
//!
//! This plugin transforms legacy decorators by calling `_decorate` and
//! `_decorateParam` helpers to apply decorators.
//!
//! ## Examples
//!
//! Input:
//! ```ts
//! @dec
//! class Class {
//!   @dec
//!   prop = 0;
//!
//!   @dec
//!   method(@dec param) {}
//! }
//! ```
//!
//! Output:
//! ```js
//! let Class = class Class {
//!   prop = 0;
//!   method(param) {}
//! };
//!
//! _decorate([dec], Class.prototype, "method", null);
//!
//! _decorate([
//!   _decorateParam(0, dec)
//! ], Class.prototype, "method", null);
//!
//! Class = _decorate([dec], Class);
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [TypeScript Experimental Decorators](https://github.com/microsoft/TypeScript/blob/d85767abfd83880cea17cea70f9913e9c4496dcc/src/compiler/transformers/legacyDecorators.ts).
//!
//! For testing, we have copied over all legacy decorator test cases from [TypeScript](https://github.com/microsoft/TypeScript/blob/d85767abfd83880cea17cea70f9913e9c4496dcc/tests/cases/conformance/decorators),
//! where the test cases are located in
//! `./tasks/transform_conformance/tests/legacy-decorators/test/fixtures`.
//!
//! ## References:
//! * TypeScript Experimental Decorators documentation: <https://www.typescriptlang.org/docs/handbook/decorators.html>

mod metadata;

use std::mem;

use metadata::LegacyDecoratorMetadata;
use rustc_hash::FxHashMap;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::ExprFactory;

use crate::{
    common::{
        helper_loader::Helper,
        statement_injector::Address,
        var_declarations::{BoundIdentifier, VarDeclarationsStore},
    },
    context::{TransformCtx, TraverseCtx},
    utils::ast_builder::{create_assignment, create_prototype_member},
};

struct ClassDecoratedData {
    // Class binding. When a class is without binding, it will be `_default`,
    binding: BoundIdentifier,
    // Alias binding exist when the class body contains a reference that refers to class itself.
    alias_binding: Option<BoundIdentifier>,
}

/// Class decorations state for the current class being processed.
#[derive(Default)]
struct ClassDecorations {
    /// Flag indicating whether the current class needs to transform or not,
    /// `false` if the class is an expression or `declare`.
    should_transform: bool,
    /// Decoration statements accumulated for the current class.
    /// These will be applied when the class processing is complete.
    decoration_stmts: Vec<Stmt>,
    /// Binding for the current class being processed.
    /// Generated on-demand when the first decorator needs it.
    class_binding: Option<BoundIdentifier>,
    /// Flag indicating whether the current class has a private `in` expression
    /// in any decorator. This affects where decorations are placed (in
    /// static block vs after class).
    class_has_private_in_expression_in_decorator: bool,
}

impl ClassDecorations {
    fn with_should_transform(mut self, should_transform: bool) -> Self {
        self.should_transform = should_transform;
        self
    }
}

pub struct LegacyDecorator<'a, 'ctx> {
    emit_decorator_metadata: bool,
    metadata: LegacyDecoratorMetadata<'a, 'ctx>,
    /// Decorated class data exists when a class or constructor is decorated.
    ///
    /// The data assigned in [`Self::transform_class`] and used in places where
    /// statements contain a decorated class declaration because decorated
    /// class needs to transform into `let c = class c {}`. The reason we
    /// why don't transform class in [`Self::exit_stmt`] is the decorator
    /// transform must run first. Since the `class-properties` plugin
    /// transforms class in `exit_class`, so that we have to transforms
    /// decorators to `exit_class` otherwise after class is being transformed by
    /// `class-properties` plugin, the decorators' nodes might be lost.
    class_decorated_data: Option<ClassDecoratedData>,
    /// Transformed decorators, they will be inserted in the statements at
    /// [`Self::exit_class_at_end`].
    decorations: FxHashMap<Address, Vec<Stmt>>,
    /// Stack for managing nested class decoration state.
    /// Each level represents the decoration state for a class in the hierarchy,
    /// with the top being the currently processed class.
    class_decorations_stack: Vec<ClassDecorations>,
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> LegacyDecorator<'a, 'ctx> {
    pub fn new(emit_decorator_metadata: bool, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            emit_decorator_metadata,
            metadata: LegacyDecoratorMetadata::new(ctx),
            class_decorated_data: None,
            decorations: FxHashMap::default(),
            class_decorations_stack: vec![ClassDecorations::default()],
            ctx,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for LegacyDecorator<'_, '_> {
    #[inline]
    fn exit_program(&mut self, node: &mut Program, ctx: &mut TraverseCtx) {
        if self.emit_decorator_metadata {
            self.metadata.exit_program(node, ctx);
        }

        debug_assert!(
            self.class_decorations_stack.len() == 1,
            "All class decorations should have been popped."
        );
    }

    #[inline]
    fn enter_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        if self.emit_decorator_metadata {
            self.metadata.enter_stmt(stmt, ctx);
        }
    }

    #[inline]
    fn enter_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        let should_transform = !class.span.is_dummy(); // Class expressions have dummy span
        self.class_decorations_stack
            .push(ClassDecorations::default().with_should_transform(should_transform));

        if self.emit_decorator_metadata {
            self.metadata.enter_class(class, ctx);
        }
    }

    #[inline]
    fn exit_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        self.transform_class(class, ctx);
    }

    // `#[inline]` because this is a hot path
    #[inline]
    fn exit_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        match stmt {
            Stmt::Decl(Decl::Class(_)) => self.transform_class_stmt(stmt, ctx),
            Stmt::Decl(Decl::ExportDecl(ExportDecl {
                decl: Decl::Class(_),
                ..
            })) => {
                self.transform_export_named_class(stmt, ctx);
            }
            Stmt::Decl(Decl::ExportDefaultDecl(ExportDefaultDecl {
                decl: DefaultDecl::Class(_),
                ..
            })) => {
                self.transform_export_default_class(stmt, ctx);
            }
            _ => {}
        }
    }

    #[inline]
    fn enter_class_method(&mut self, node: &mut ClassMethod, ctx: &mut TraverseCtx) {
        if self.emit_decorator_metadata {
            self.metadata.enter_class_method(node, ctx);
        }
    }

    #[inline]
    fn enter_auto_accessor(&mut self, node: &mut AutoAccessor, ctx: &mut TraverseCtx) {
        if self.emit_decorator_metadata {
            self.metadata.enter_auto_accessor(node, ctx);
        }
    }

    #[inline]
    fn enter_class_prop(&mut self, node: &mut ClassProp, ctx: &mut TraverseCtx) {
        if self.emit_decorator_metadata {
            self.metadata.enter_class_prop(node, ctx);
        }
    }

    #[inline]
    fn exit_class_method(&mut self, method: &mut ClassMethod, ctx: &mut TraverseCtx) {
        // `constructor` will handle in `transform_decorators_of_class_and_constructor`.
        if method.kind == MethodKind::Method
            && matches!(
                &method.key,
                PropName::Ident(IdentName { sym, .. }) if sym == "constructor"
            )
        {
            return;
        }

        if let Some(decorations) = self.get_all_decorators_of_class_method(method, ctx) {
            // We emit `null` here to indicate to `_decorate` that it can invoke
            // `Object.getOwnPropertyDescriptor` directly.
            let descriptor = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
            self.handle_decorated_class_element(
                method.is_static,
                &mut method.key,
                descriptor,
                decorations,
                ctx,
            );
        }
    }

    #[inline]
    fn exit_class_prop(&mut self, prop: &mut ClassProp, ctx: &mut TraverseCtx) {
        if prop.decorators.is_empty() {
            return;
        }

        let decorations =
            Self::convert_decorators_to_array_expression(mem::take(&mut prop.decorators), ctx);

        // We emit `void 0` here to indicate to `_decorate` that it can invoke
        // `Object.defineProperty` directly.
        let descriptor = Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: UnaryOp::Void,
            arg: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 0.0,
                raw: None,
            }))),
        });
        self.handle_decorated_class_element(
            prop.is_static,
            &mut prop.key,
            descriptor,
            decorations,
            ctx,
        );
    }

    #[inline]
    fn exit_auto_accessor(&mut self, accessor: &mut AutoAccessor, ctx: &mut TraverseCtx) {
        if accessor.decorators.is_empty() {
            return;
        }

        let decorations =
            Self::convert_decorators_to_array_expression(mem::take(&mut accessor.decorators), ctx);
        // We emit `null` here to indicate to `_decorate` that it can invoke
        // `Object.getOwnPropertyDescriptor` directly.
        let descriptor = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
        self.handle_decorated_class_element(
            accessor.is_static,
            &mut accessor.key,
            descriptor,
            decorations,
            ctx,
        );
    }

    fn enter_decorator(&mut self, node: &mut Decorator, _ctx: &mut TraverseCtx) {
        let current_class = self.class_decorations_stack.last_mut().unwrap();
        if current_class.should_transform
            && !current_class.class_has_private_in_expression_in_decorator
        {
            current_class.class_has_private_in_expression_in_decorator =
                PrivateInExpressionDetector::has_private_in_expression(&node.expr);
        }
    }
}

impl LegacyDecorator<'_, '_> {
    /// Placeholder implementation - will be filled in next step
    fn transform_class(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        // TODO: Implement
        unimplemented!("transform_class")
    }

    /// Placeholder implementation - will be filled in next step
    fn transform_class_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // TODO: Implement
        unimplemented!("transform_class_stmt")
    }

    /// Placeholder implementation - will be filled in next step
    fn transform_export_named_class(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // TODO: Implement
        unimplemented!("transform_export_named_class")
    }

    /// Placeholder implementation - will be filled in next step
    fn transform_export_default_class(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // TODO: Implement
        unimplemented!("transform_export_default_class")
    }

    /// Placeholder implementation - will be filled in next step
    fn handle_decorated_class_element(
        &mut self,
        _is_static: bool,
        _key: &mut PropName,
        _descriptor: Expr,
        _decorations: Expr,
        _ctx: &mut TraverseCtx,
    ) {
        // TODO: Implement
        unimplemented!("handle_decorated_class_element")
    }

    /// Placeholder implementation - will be filled in next step
    fn get_all_decorators_of_class_method(
        &mut self,
        _method: &mut ClassMethod,
        _ctx: &mut TraverseCtx,
    ) -> Option<Expr> {
        // TODO: Implement
        unimplemented!("get_all_decorators_of_class_method")
    }

    /// Converts a vec of [`Decorator`] to [`Expr::Array`].
    fn convert_decorators_to_array_expression(
        decorators_iter: Vec<Decorator>,
        _ctx: &TraverseCtx,
    ) -> Expr {
        let elements = decorators_iter
            .into_iter()
            .map(|decorator| {
                Some(ExprOrSpread {
                    spread: None,
                    expr: decorator.expr,
                })
            })
            .collect();
        Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: elements,
        })
    }

    /// Placeholder implementation - will be filled in next step
    pub fn exit_class_at_end(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        // TODO: Implement
        unimplemented!("exit_class_at_end")
    }
}

/// Visitor to detect if a private-in expression is present in a decorator
#[derive(Default)]
struct PrivateInExpressionDetector {
    has_private_in_expression: bool,
}

impl PrivateInExpressionDetector {
    fn has_private_in_expression(_expression: &Expr) -> bool {
        // TODO: Implement proper visitor for private in expressions
        // For now, return false as a placeholder
        false
    }
}
