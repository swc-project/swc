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
use swc_atoms::Atom;
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith};

use crate::{
    common::{helper_loader::Helper, var_declarations::VarDeclarationsStore},
    context::{TransformCtx, TraverseCtx},
    utils::ast_builder::{create_assignment, create_prototype_member},
};

/// Identifier binding name
type BoundIdentifier = String;

/// Address type for tracking statement locations
type Address = usize;

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
    /// Helper method to handle a decorated class element (method, property, or
    /// accessor). Accumulates decoration statements in the current
    /// decoration stack.
    fn handle_decorated_class_element(
        &mut self,
        is_static: bool,
        key: &mut PropName,
        descriptor: Expr,
        decorations: Expr,
        ctx: &mut TraverseCtx,
    ) {
        let current_class = self.class_decorations_stack.last_mut().unwrap();

        if !current_class.should_transform {
            return;
        }

        // Get current class binding from stack
        let class_binding = current_class.class_binding.get_or_insert_with(|| {
            // We need to generate a unique identifier for the class
            // For now, use a simple default name
            self.ctx.var_declarations.create_uid_var("default")
        });

        let prefix = Self::get_class_member_prefix(class_binding, is_static, ctx);
        let name = self.get_name_of_property_key(key, ctx);
        let decorator_stmt = self.create_decorator(decorations, prefix, name, descriptor, ctx);

        // Push to current decoration stack
        self.class_decorations_stack
            .last_mut()
            .unwrap()
            .decoration_stmts
            .push(decorator_stmt);
    }

    /// Transforms a statement that is a class declaration
    ///
    ///
    /// Input:
    /// ```ts
    /// @dec
    /// class Class {
    ///   method(@dec param) {}
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let Class = class Class {
    ///   method(param) { }
    /// };
    ///
    /// _decorate([
    ///   _decorateParam(0, dec)
    /// ], Class.prototype, "method", null);
    ///
    /// Class = _decorate([
    ///   dec
    /// ], Class);
    /// ```
    // `#[inline]` so that compiler sees that `stmt` is a `Stmt::Decl(Decl::Class(_))`.
    #[inline]
    fn transform_class_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        let Stmt::Decl(Decl::Class(class_decl)) = stmt else {
            unreachable!()
        };

        let Some(ClassDecoratedData {
            binding,
            alias_binding,
        }) = self.class_decorated_data.take()
        else {
            return;
        };

        let new_stmt = Self::transform_class_decorated(
            &mut class_decl.class,
            &binding,
            alias_binding.as_ref(),
            ctx,
        );

        *stmt = new_stmt;
    }

    /// Transforms a statement that is a export default class declaration
    ///
    /// Input:
    /// ```ts
    /// @dec
    /// export default class Class {
    ///   method(@dec param) {}
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let Class = class Class {
    ///   method(param) { }
    /// };
    ///
    /// _decorate([
    ///   _decorateParam(0, dec)
    /// ], Class.prototype, "method", null);
    ///
    /// Class = _decorate([
    ///   dec
    /// ], Class);
    ///
    /// export default Class;
    /// ```
    // `#[inline]` so that compiler sees that `stmt` is a `Stmt::Decl(Decl::ExportDefaultDecl(_))`.
    #[inline]
    fn transform_export_default_class(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        let Stmt::Decl(Decl::ExportDefaultDecl(export)) = stmt else {
            unreachable!()
        };
        let DefaultDecl::Class(class_expr) = &mut export.decl else {
            return;
        };

        let Some(ClassDecoratedData {
            binding,
            alias_binding,
        }) = self.class_decorated_data.take()
        else {
            return;
        };

        let new_stmt = Self::transform_class_decorated(
            &mut class_expr.class,
            &binding,
            alias_binding.as_ref(),
            ctx,
        );

        // `export default Class`
        let export_default_class_reference =
            Self::create_export_default_class_reference(&binding, ctx);

        // TODO: Insert statements properly - need statement injector
        *stmt = new_stmt;
        // self.ctx.statement_injector.insert_after(&new_stmt,
        // export_default_class_reference);
    }

    /// Transforms a statement that is a export named class declaration
    ///
    /// Input:
    /// ```ts
    /// @dec
    /// export class Class {
    ///   method(@dec param) {}
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// let Class = class Class {
    ///   method(param) { }
    /// };
    ///
    /// _decorate([
    ///   _decorateParam(0, dec)
    /// ], Class.prototype, "method", null);
    ///
    /// Class = _decorate([
    ///   dec
    /// ], Class);
    ///
    /// export { Class };
    /// ```
    // `#[inline]` so that compiler sees that `stmt` is a `Stmt::Decl(Decl::ExportDecl(_))`.
    #[inline]
    fn transform_export_named_class(&mut self, stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        let Stmt::Decl(Decl::ExportDecl(export)) = stmt else {
            unreachable!()
        };
        let Decl::Class(class_decl) = &mut export.decl else {
            return;
        };

        let Some(ClassDecoratedData {
            binding,
            alias_binding,
        }) = self.class_decorated_data.take()
        else {
            return;
        };

        let new_stmt = Self::transform_class_decorated(
            &mut class_decl.class,
            &binding,
            alias_binding.as_ref(),
            ctx,
        );

        // `export { Class }`
        let export_class_reference = Self::create_export_named_class_reference(&binding, ctx);

        // TODO: Insert statements properly - need statement injector
        *stmt = new_stmt;
        // self.ctx.statement_injector.insert_after(&new_stmt,
        // export_class_reference);
    }

    fn transform_class(&mut self, class: &mut Class, ctx: &mut TraverseCtx) {
        let current_class_decorations = self.class_decorations_stack.pop().unwrap();

        // Legacy decorator does not allow in class expression.
        if current_class_decorations.should_transform {
            let class_or_constructor_parameter_is_decorated =
                Self::check_class_has_decorated(class);

            if class_or_constructor_parameter_is_decorated {
                self.transform_class_declaration_with_class_decorators(
                    class,
                    current_class_decorations,
                    ctx,
                );
                return;
            } else if !current_class_decorations.decoration_stmts.is_empty() {
                self.transform_class_declaration_without_class_decorators(
                    class,
                    current_class_decorations,
                    ctx,
                );
            }
        } else {
            debug_assert!(
                current_class_decorations.class_binding.is_none(),
                "Legacy decorator does not allow class expression, so that it should not have \
                 class binding."
            );
        }

        debug_assert!(
            !self.emit_decorator_metadata || self.metadata.pop_constructor_metadata().is_none(),
            "`pop_constructor_metadata` should be `None` because there are no class decorators, \
             so no metadata was generated."
        );
    }

    /// Transforms a decorated class declaration and appends the resulting
    /// statements. If the class requires an alias to avoid issues with
    /// double-binding, the alias is returned.
    fn transform_class_declaration_with_class_decorators(
        &mut self,
        class: &mut Class,
        current_class_decorations: ClassDecorations,
        ctx: &mut TraverseCtx,
    ) {
        // When we emit an ES6 class that has a class decorator, we must tailor the
        // emit to certain specific cases.
        //
        // In the simplest case, we emit the class declaration as a let declaration, and
        // evaluate decorators after the close of the class body:
        //
        //  [Example 1]
        //  ---------------------------------------------------------------------
        //  TypeScript                      | Javascript
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = class C {
        //  class C {                       | }
        //  }                               | C = _decorate([dec], C);
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = class C {
        //  export class C {                | }
        //  }                               | C = _decorate([dec], C);
        //                                  | export { C };
        //  ---------------------------------------------------------------------
        //
        // If a class declaration contains a reference to itself *inside* of the class
        // body, this introduces two bindings to the class: One outside of the
        // class body, and one inside of the class body. If we apply decorators
        // as in [Example 1] above, there is the possibility that the decorator
        // `dec` will return a new value for the constructor, which would result
        // in the binding inside of the class no longer pointing to the same
        // reference as the binding outside of the class.
        //
        // As a result, we must instead rewrite all references to the class *inside* of
        // the class body to instead point to a local temporary alias for the
        // class:
        //
        //  [Example 2]
        //  ---------------------------------------------------------------------
        //  TypeScript                      | Javascript
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = C_1 = class C {
        //  class C {                       |   static x() { return C_1.y; }
        //    static x() { return C.y; }    | }
        //    static y = 1;                 | C.y = 1;
        //  }                               | C = C_1 = _decorate([dec], C);
        //                                  | var C_1;
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = class C {
        //  export class C {                |   static x() { return C_1.y; }
        //    static x() { return C.y; }    | }
        //    static y = 1;                 | C.y = 1;
        //  }                               | C = C_1 = _decorate([dec], C);
        //                                  | export { C };
        //                                  | var C_1;
        //  ---------------------------------------------------------------------
        //
        // If a class declaration is the default export of a module, we instead emit
        // the export after the decorated declaration:
        //
        //  [Example 3]
        //  ---------------------------------------------------------------------
        //  TypeScript                      | Javascript
        //  ---------------------------------------------------------------------
        //  @dec                            | let default_1 = class {
        //  export default class {          | }
        //  }                               | default_1 = _decorate([dec], default_1);
        //                                  | export default default_1;
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = class C {
        //  export default class C {        | }
        //  }                               | C = _decorate([dec], C);
        //                                  | export default C;
        //  ---------------------------------------------------------------------
        //
        // If the class declaration is the default export and a reference to itself
        // inside of the class body, we must emit both an alias for the class *and*
        // move the export after the declaration:
        //
        //  [Example 4]
        //  ---------------------------------------------------------------------
        //  TypeScript                      | Javascript
        //  ---------------------------------------------------------------------
        //  @dec                            | let C = class C {
        //  export default class C {        |   static x() { return C_1.y; }
        //    static x() { return C.y; }    | }
        //    static y = 1;                 | C.y = 1;
        //  }                               | C = C_1 = _decorate([dec], C);
        //                                  | export default C;
        //                                  | var C_1;
        //  ---------------------------------------------------------------------
        //

        // TODO(improve-on-typescript): we can take the class id without keeping it
        // as-is. Now: `class C {}` -> `let C = class C {}`
        // After: `class C {}` -> `let C = class {}`
        let class_binding = class.ident.as_ref().map(|ident| ident.sym.to_string());

        let class_alias_binding = class_binding.as_ref().and_then(|_id| {
            // TODO: Implement ClassReferenceChanger to detect if we need an alias
            None
        });

        let ClassDecorations {
            class_binding: class_binding_tmp,
            mut decoration_stmts,
            class_has_private_in_expression_in_decorator,
            should_transform: _,
        } = current_class_decorations;

        let class_binding = class_binding.unwrap_or_else(|| {
            // `class_binding_tmp` maybe already generated a default class binding for
            // unnamed classes, so use it.
            class_binding_tmp.unwrap_or_else(|| self.ctx.var_declarations.create_uid_var("default"))
        });

        let constructor_decoration = self.transform_decorators_of_class_and_constructor(
            class,
            &class_binding,
            class_alias_binding.as_ref(),
            ctx,
        );

        let class_alias_with_this_assignment = {
            // If we're emitting to ES2022 or later then we need to reassign the class alias
            // before static initializers are evaluated.
            // <https://github.com/microsoft/TypeScript/blob/b86ab7dbe0eb2f1c9a624486d72590d638495c97/src/compiler/transformers/legacyDecorators.ts#L345-L366>
            class_alias_binding
                .as_ref()
                .and_then(|class_alias_binding| {
                    let has_static_field_or_block = class.body.iter().any(|element| {
                        matches!(element, ClassMember::StaticBlock(_))
                            || matches!(element, ClassMember::ClassProp(prop) if prop.is_static)
                    });

                    if has_static_field_or_block {
                        // `_Class = this`;
                        let this_expr = Box::new(Expr::This(ThisExpr { span: DUMMY_SP }));
                        let class_alias_assignment =
                            create_assignment(class_alias_binding, *this_expr, ctx);
                        let stmt = Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(class_alias_assignment),
                        });
                        let block_stmt = BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![stmt],
                            ..Default::default()
                        };
                        Some(ClassMember::StaticBlock(StaticBlock {
                            span: DUMMY_SP,
                            body: block_stmt,
                        }))
                    } else {
                        None
                    }
                })
        };

        if class_has_private_in_expression_in_decorator {
            let decorations = mem::take(&mut decoration_stmts);
            Self::insert_decorations_into_class_static_block(class, decorations, ctx);
        } else {
            // Get address for the class
            let address = class as *const Class as usize;

            decoration_stmts.push(constructor_decoration);
            self.decorations
                .entry(address)
                .or_default()
                .append(&mut decoration_stmts);
            self.class_decorated_data = Some(ClassDecoratedData {
                binding: class_binding,
                // If the class alias has reassigned to `this` in the static block, then
                // don't assign `class` to the class alias again.
                //
                // * class_alias_with_this_assignment is `None`: `Class = _Class = class Class {}`
                // * class_alias_with_this_assignment is `Some`: `Class = class Class { static {
                //   _Class = this; } }`
                alias_binding: if class_alias_with_this_assignment.is_none() {
                    class_alias_binding
                } else {
                    None
                },
            });
        }

        if let Some(class_alias_with_this_assignment) = class_alias_with_this_assignment {
            class.body.insert(0, class_alias_with_this_assignment);
        }
    }

    /// Transform class to a variable declaration, whose binding name is the
    /// same as class.
    ///
    /// * `alias_binding` is `None`: `class C {}` -> `let C = class C {}`
    /// * `alias_binding` is `Some`: `class C {}` -> `let C = _C = class C {}`
    fn transform_class_decorated(
        class: &mut Class,
        binding: &BoundIdentifier,
        alias_binding: Option<&BoundIdentifier>,
        ctx: &mut TraverseCtx,
    ) -> Stmt {
        let span = class.span;
        let initializer = Self::get_class_initializer(
            Expr::Class(ClassExpr {
                ident: None,
                class: Box::new(class.take()),
            }),
            alias_binding,
            ctx,
        );
        let declarator = VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent::from(Ident::new(
                Atom::from(binding.as_str()),
                DUMMY_SP,
            ))),
            init: Some(Box::new(initializer)),
            definite: false,
        };
        let var_declaration = VarDecl {
            span,
            kind: VarDeclKind::Let,
            declare: false,
            decls: vec![declarator],
            ..Default::default()
        };
        Stmt::Decl(Decl::Var(Box::new(var_declaration)))
    }

    /// Transforms a non-decorated class declaration.
    fn transform_class_declaration_without_class_decorators(
        &mut self,
        class: &mut Class,
        current_class_decorations: ClassDecorations,
        ctx: &mut TraverseCtx,
    ) {
        let ClassDecorations {
            class_binding,
            mut decoration_stmts,
            class_has_private_in_expression_in_decorator,
            should_transform: _,
        } = current_class_decorations;

        let Some(class_binding) = class_binding else {
            unreachable!(
                "Always has a class binding because there are decorators in class elements,
                so that it has been added in `handle_decorated_class_element`"
            );
        };

        // No class id, add one by using the class binding
        if class.ident.is_none() {
            class.ident = Some(Ident::new(Atom::from(class_binding.as_str()), DUMMY_SP));
        }

        if class_has_private_in_expression_in_decorator {
            Self::insert_decorations_into_class_static_block(class, decoration_stmts, ctx);
        } else {
            // Get address for the class
            let stmt_address = class as *const Class as usize;
            self.decorations
                .entry(stmt_address)
                .or_default()
                .append(&mut decoration_stmts);
        }
    }

    /// Transform the decorators of class and constructor method.
    ///
    /// Input:
    /// ```ts
    /// @dec
    /// class Class {
    ///   method(@dec param) {}
    /// }
    /// ```
    ///
    /// These decorators transform into:
    /// ```
    /// _decorate([
    ///   _decorateParam(0, dec)
    ///   ], Class.prototype, "method", null);
    ///
    /// Class = _decorate([
    ///   dec
    /// ], Class);
    /// ```
    fn transform_decorators_of_class_and_constructor(
        &mut self,
        class: &mut Class,
        class_binding: &BoundIdentifier,
        class_alias_binding: Option<&BoundIdentifier>,
        ctx: &mut TraverseCtx,
    ) -> Stmt {
        // Find first constructor method from the class
        let constructor = class.body.iter_mut().find_map(|element| match element {
            ClassMember::Constructor(ctor) => Some(ctor),
            _ => None,
        });

        let decorations = if let Some(constructor) = constructor {
            // Constructor cannot have decorators, swap decorators of class and constructor
            // to use `get_all_decorators_of_class_method` to get all decorators
            // of the class and constructor params
            mem::swap(
                &mut class.decorators,
                &mut constructor.body.as_mut().unwrap().stmts,
            );
            // TODO: This is wrong - we need to handle constructor decorators differently
            Self::convert_decorators_to_array_expression(mem::take(&mut class.decorators), ctx)
        } else {
            debug_assert!(
                !self.emit_decorator_metadata || self.metadata.pop_constructor_metadata().is_none(),
                "`pop_constructor_metadata` should be `None` because there is no `constructor`, \
                 so no metadata was generated."
            );
            Self::convert_decorators_to_array_expression(mem::take(&mut class.decorators), ctx)
        };

        // `Class = _decorate(decorations, Class)`
        let class_ref = Expr::Ident(Ident::new(Atom::from(class_binding.as_str()), DUMMY_SP));
        let arguments = vec![
            ExprOrSpread {
                spread: None,
                expr: Box::new(decorations),
            },
            ExprOrSpread {
                spread: None,
                expr: Box::new(class_ref),
            },
        ];
        let helper = self
            .ctx
            .helper_loader
            .load_helper(Helper::Decorate, DUMMY_SP)
            .as_call(DUMMY_SP, arguments);
        let left = AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(Ident::new(
            Atom::from(class_binding.as_str()),
            DUMMY_SP,
        ))));
        let right = Self::get_class_initializer(helper, class_alias_binding, ctx);
        let assignment = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::Assign,
            left,
            right: Box::new(right),
        });
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(assignment),
        })
    }

    /// Insert all decorations into a static block of a class because there is a
    /// private-in expression in the decorator.
    ///
    /// Input:
    /// ```ts
    /// class Class {
    ///   #a =0;
    ///   @(#a in Class ? dec() : dec2())
    ///   prop = 0;
    /// }
    /// ```
    ///
    /// Output:
    /// ```js
    /// class Class {
    ///   #a = 0;
    ///   prop = 0;
    ///   static {
    ///     _decorate([
    ///         (#a in Class ? dec() : dec2())
    ///     ], Class.prototype, "prop", void 0);
    ///   }
    /// }
    /// ```
    fn insert_decorations_into_class_static_block(
        class: &mut Class,
        decorations: Vec<Stmt>,
        _ctx: &mut TraverseCtx,
    ) {
        let block = BlockStmt {
            span: DUMMY_SP,
            stmts: decorations,
            ..Default::default()
        };
        let element = ClassMember::StaticBlock(StaticBlock {
            span: DUMMY_SP,
            body: block,
        });
        class.body.push(element);
    }

    /// Transforms the decorators of the parameters of a class method.
    #[expect(clippy::cast_precision_loss)]
    fn transform_decorators_of_parameters(
        &self,
        decorations: &mut Vec<Option<ExprOrSpread>>,
        params: &mut Vec<Param>,
        ctx: &mut TraverseCtx,
    ) {
        for (index, param) in params.iter_mut().enumerate() {
            if param.decorators.is_empty() {
                continue;
            }
            decorations.extend(param.decorators.drain(..).map(|decorator| {
                // (index, decorator)
                let index_expr = Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: index as f64,
                    raw: None,
                }));
                let arguments = vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(index_expr),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: decorator.expr,
                    },
                ];
                // _decorateParam(index, decorator)
                let helper = self
                    .ctx
                    .helper_loader
                    .load_helper(Helper::DecorateParam, decorator.span)
                    .as_call(decorator.span, arguments);
                Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(helper),
                })
            }));
        }
    }

    /// Injects the class decorator statements after class-properties plugin has
    /// run, ensuring that all transformed fields are injected before the
    /// class decorator statements.
    pub fn exit_class_at_end(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        // TODO: Implement proper insertion of decorations
        // for (address, stmts) in mem::take(&mut self.decorations) {
        //     self.ctx.statement_injector.insert_many_after(&address, stmts);
        // }
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

    /// Get all decorators of a class method.
    ///
    /// ```ts
    /// class Class {
    ///   @dec
    ///   method(@dec param) {}
    /// }
    /// ```
    ///
    /// Returns:
    /// ```js
    /// [
    ///   dec,
    ///   _decorateParam(0, dec)
    /// ]
    /// ```
    fn get_all_decorators_of_class_method(
        &mut self,
        method: &mut ClassMethod,
        ctx: &mut TraverseCtx,
    ) -> Option<Expr> {
        let params = &mut method.function.params;
        let param_decoration_count = params
            .iter()
            .fold(0, |acc, param| acc + param.decorators.len());
        let method_decoration_count = method.function.decorators.len() + param_decoration_count;

        if method_decoration_count == 0 {
            if self.emit_decorator_metadata {
                if method.kind == MethodKind::Method
                    && matches!(
                        &method.key,
                        PropName::Ident(IdentName { sym, .. }) if sym == "constructor"
                    )
                {
                    debug_assert!(
                        self.metadata.pop_constructor_metadata().is_none(),
                        "No method decorators, so `pop_constructor_metadata` should be `None`"
                    );
                } else {
                    debug_assert!(
                        self.metadata.pop_method_metadata().is_none(),
                        "No method decorators, so `pop_method_metadata` should be `None`"
                    );
                }
            }
            return None;
        }

        let mut decorations = Vec::with_capacity(method_decoration_count);

        // Method decorators should always be injected before all other decorators
        decorations.extend(mem::take(&mut method.function.decorators).into_iter().map(
            |decorator| {
                Some(ExprOrSpread {
                    spread: None,
                    expr: decorator.expr,
                })
            },
        ));

        // The decorators of params are always inserted at the end if any.
        if param_decoration_count > 0 {
            self.transform_decorators_of_parameters(&mut decorations, params, ctx);
        }

        if self.emit_decorator_metadata {
            // `decorateMetadata` should always be injected after param decorators
            if method.kind == MethodKind::Method
                && matches!(
                    &method.key,
                    PropName::Ident(IdentName { sym, .. }) if sym == "constructor"
                )
            {
                if let Some(metadata) = self.metadata.pop_constructor_metadata() {
                    decorations.push(Some(ExprOrSpread {
                        spread: None,
                        expr: Box::new(metadata),
                    }));
                }
            } else if let Some(metadata) = self.metadata.pop_method_metadata() {
                decorations.push(Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(metadata.r#type),
                }));
                decorations.push(Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(metadata.param_types),
                }));
                if let Some(return_type) = metadata.return_type {
                    decorations.push(Some(ExprOrSpread {
                        spread: None,
                        expr: Box::new(return_type),
                    }));
                }
            }
        }

        Some(Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: decorations,
        }))
    }

    /// * class_alias_binding is `Some`: `Class = _Class = expr`
    /// * class_alias_binding is `None`: `Class = expr`
    fn get_class_initializer(
        expr: Expr,
        class_alias_binding: Option<&BoundIdentifier>,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        if let Some(class_alias_binding) = class_alias_binding {
            let left = AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(
                Ident::new(Atom::from(class_alias_binding.as_str()), DUMMY_SP),
            )));
            Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left,
                right: Box::new(expr),
            })
        } else {
            expr
        }
    }

    /// Check if a class or its constructor parameters have decorators.
    fn check_class_has_decorated(class: &Class) -> bool {
        if !class.decorators.is_empty() {
            return true;
        }

        class.body.iter().any(|element| {
            matches!(element,
                ClassMember::Constructor(ctor) if Self::class_method_parameter_is_decorated(&ctor.params)
            )
        })
    }

    /// Check if a class method parameter is decorated.
    fn class_method_parameter_is_decorated(params: &[ParamOrTsParamProp]) -> bool {
        params.iter().any(|param| match param {
            ParamOrTsParamProp::Param(p) => !p.decorators.is_empty(),
            ParamOrTsParamProp::TsParamProp(p) => !p.decorators.is_empty(),
        })
    }

    /// * is_static is `true`: `Class`
    /// * is_static is `false`: `Class.prototype`
    fn get_class_member_prefix(
        class_binding: &BoundIdentifier,
        is_static: bool,
        ctx: &mut TraverseCtx,
    ) -> Expr {
        let ident = Expr::Ident(Ident::new(Atom::from(class_binding.as_str()), DUMMY_SP));
        if is_static {
            ident
        } else {
            create_prototype_member(ident, ctx)
        }
    }

    /// Get the name of the property key.
    ///
    /// * StaticIdentifier: `a = 0;` -> `a`
    /// * PrivateIdentifier: `#a = 0;` -> `""`
    /// * Computed property key:
    ///  * Copiable key:
    ///    * NumericLiteral: `[1] = 0;` -> `1`
    ///    * StringLiteral: `["a"] = 0;` -> `"a"`
    ///    * TemplateLiteral: `[`a`] = 0;` -> `a`
    ///    * NullLiteral: `[null] = 0;` -> `null`
    ///  * Non-copiable key:
    ///    * `[a()] = 0;` mutates the key to `[_a = a()] = 0;` and returns `_a`
    fn get_name_of_property_key(&self, key: &mut PropName, ctx: &mut TraverseCtx) -> Expr {
        match key {
            PropName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: ident.sym.clone(),
                raw: None,
            })),
            // Legacy decorators do not support private key
            PropName::PrivateName(_) => Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: Atom::from(""),
                raw: None,
            })),
            // Copiable literals
            PropName::Num(literal) => Expr::Lit(Lit::Num(literal.clone())),
            PropName::Str(literal) => Expr::Lit(Lit::Str(literal.clone())),
            PropName::Computed(computed) => {
                // Check if it's a simple template literal
                if let Expr::Tpl(tpl) = &*computed.expr {
                    if tpl.exprs.is_empty() {
                        return Expr::Tpl(tpl.clone());
                    }
                }
                // Check if it's null
                if matches!(&*computed.expr, Expr::Lit(Lit::Null(_))) {
                    return Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
                }

                // Create a unique binding for the computed property key, and insert it outside
                // of the class
                let binding = self.ctx.var_declarations.create_uid_var("key");
                let left = AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(
                    Ident::new(Atom::from(binding.as_str()), DUMMY_SP),
                )));
                let right = computed.expr.take();
                let key_expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left,
                    right,
                });
                *key = PropName::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(key_expr),
                });
                Expr::Ident(Ident::new(Atom::from(binding.as_str()), DUMMY_SP))
            }
            PropName::BigInt(big_int) => Expr::Lit(Lit::BigInt(big_int.clone())),
        }
    }

    /// `_decorator([...decorators], Class, name, descriptor)`
    fn create_decorator(
        &self,
        decorations: Expr,
        prefix: Expr,
        name: Expr,
        descriptor: Expr,
        ctx: &mut TraverseCtx,
    ) -> Stmt {
        let arguments = vec![
            ExprOrSpread {
                spread: None,
                expr: Box::new(decorations),
            },
            ExprOrSpread {
                spread: None,
                expr: Box::new(prefix),
            },
            ExprOrSpread {
                spread: None,
                expr: Box::new(name),
            },
            ExprOrSpread {
                spread: None,
                expr: Box::new(descriptor),
            },
        ];
        let helper = self
            .ctx
            .helper_loader
            .load_helper(Helper::Decorate, DUMMY_SP)
            .as_call(DUMMY_SP, arguments);
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(helper),
        })
    }

    /// `export default Class`
    fn create_export_default_class_reference(
        class_binding: &BoundIdentifier,
        _ctx: &mut TraverseCtx,
    ) -> Stmt {
        let export_default = ExportDefaultDecl {
            span: DUMMY_SP,
            decl: DefaultDecl::Expr(Box::new(Expr::Ident(Ident::new(
                Atom::from(class_binding.as_str()),
                DUMMY_SP,
            )))),
        };
        Stmt::Decl(Decl::ExportDefaultDecl(Box::new(export_default)))
    }

    /// `export { Class }`
    fn create_export_named_class_reference(
        class_binding: &BoundIdentifier,
        _ctx: &mut TraverseCtx,
    ) -> Stmt {
        let specifier = ExportSpecifier::Named(ExportNamedSpecifier {
            span: DUMMY_SP,
            orig: ModuleExportName::Ident(Ident::new(Atom::from(class_binding.as_str()), DUMMY_SP)),
            exported: None,
            is_type_only: false,
        });
        let export_named = NamedExport {
            span: DUMMY_SP,
            specifiers: vec![specifier],
            src: None,
            with: None,
            type_only: false,
        };
        Stmt::Decl(Decl::ExportNamed(Box::new(export_named)))
    }
}

/// Visitor to detect if a private-in expression is present in a decorator
#[derive(Default)]
struct PrivateInExpressionDetector {
    has_private_in_expression: bool,
}

impl Visit for PrivateInExpressionDetector {
    fn visit_private_name(&mut self, _n: &PrivateName) {
        // In SWC, we need to check for private names in binary expressions with "in"
        // operator
        self.has_private_in_expression = true;
    }
}

impl PrivateInExpressionDetector {
    fn has_private_in_expression(expression: &Expr) -> bool {
        let mut detector = Self::default();
        expression.visit_with(&mut detector);
        detector.has_private_in_expression
    }
}
