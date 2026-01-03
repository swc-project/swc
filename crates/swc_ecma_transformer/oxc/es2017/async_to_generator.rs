//! ES2017: Async / Await
//!
//! This plugin transforms async functions to generator functions
//! and wraps them with `asyncToGenerator` helper function.
//!
//! ## Example
//!
//! Input:
//! ```js
//! async function foo() {
//!   await bar();
//! }
//! const foo2 = async () => {
//!   await bar();
//! };
//! async () => {
//!   await bar();
//! }
//! ```
//!
//! Output:
//! ```js
//! function foo() {
//!   return _foo.apply(this, arguments);
//! }
//! function _foo() {
//!   _foo = babelHelpers.asyncToGenerator(function* () {
//!           yield bar();
//!   });
//!   return _foo.apply(this, arguments);
//! }
//! const foo2 = function() {
//!   var _ref = babelHelpers.asyncToGenerator(function* () {
//!           yield bar();
//!   });
//!   return function foo2() {
//!      return _ref.apply(this, arguments);
//!   };
//! }();
//! babelHelpers.asyncToGenerator(function* () {
//!   yield bar();
//! });
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-async-to-generator](https://babel.dev/docs/babel-plugin-transform-async-to-generator).
//!
//! Reference:
//! * Babel docs: <https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator>
//! * Babel implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-async-to-generator>
//! * Async / Await TC39 proposal: <https://github.com/tc39/proposal-async-await>

use std::{borrow::Cow, mem};

use oxc_allocator::{Box as ArenaBox, StringBuilder as ArenaStringBuilder, TakeIn};
use oxc_ast::{NONE, ast::*};
use oxc_ast_visit::Visit;
use oxc_semantic::{ReferenceFlags, ScopeFlags, ScopeId, SymbolFlags};
use oxc_span::{Atom, GetSpan, SPAN};
use oxc_syntax::{
    identifier::{is_identifier_name, is_identifier_part, is_identifier_start},
    keyword::is_reserved_keyword,
};
use oxc_traverse::{Ancestor, BoundIdentifier, Traverse};

use crate::{
    common::helper_loader::Helper,
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct AsyncToGenerator<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    executor: AsyncGeneratorExecutor<'a, 'ctx>,
}

impl<'a, 'ctx> AsyncToGenerator<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx, executor: AsyncGeneratorExecutor::new(Helper::AsyncToGenerator, ctx) }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for AsyncToGenerator<'a, '_> {
    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let new_expr = match expr {
            Expression::AwaitExpression(await_expr) => {
                Self::transform_await_expression(await_expr, ctx)
            }
            Expression::FunctionExpression(func) => {
                if func.r#async && !func.generator && !func.is_typescript_syntax() {
                    Some(self.executor.transform_function_expression(func, ctx))
                } else {
                    None
                }
            }
            Expression::ArrowFunctionExpression(arrow) => {
                if arrow.r#async {
                    Some(self.executor.transform_arrow_function(arrow, ctx))
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(new_expr) = new_expr {
            *expr = new_expr;
        }
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        let function = match stmt {
            Statement::FunctionDeclaration(func) => Some(func),
            Statement::ExportDefaultDeclaration(decl) => {
                if let ExportDefaultDeclarationKind::FunctionDeclaration(func) =
                    &mut decl.declaration
                {
                    Some(func)
                } else {
                    None
                }
            }
            Statement::ExportNamedDeclaration(decl) => {
                if let Some(Declaration::FunctionDeclaration(func)) = &mut decl.declaration {
                    Some(func)
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(function) = function
            && function.r#async
            && !function.generator
            && !function.is_typescript_syntax()
        {
            let new_statement = self.executor.transform_function_declaration(function, ctx);
            self.ctx.statement_injector.insert_after(stmt, new_statement);
        }
    }

    fn exit_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if func.r#async
            && !func.is_typescript_syntax()
            && AsyncGeneratorExecutor::is_class_method_like_ancestor(ctx.parent())
        {
            self.executor.transform_function_for_method_definition(func, ctx);
        }
    }
}

impl<'a> AsyncToGenerator<'a, '_> {
    /// Check whether the current node is inside an async function.
    fn is_inside_async_function(ctx: &TraverseCtx<'a>) -> bool {
        // Early return if current scope is top because we don't need to transform top-level await expression.
        if ctx.current_scope_flags().is_top() {
            return false;
        }

        for ancestor in ctx.ancestors() {
            match ancestor {
                Ancestor::FunctionBody(func) => return *func.r#async(),
                Ancestor::ArrowFunctionExpressionBody(func) => {
                    return *func.r#async();
                }
                _ => {}
            }
        }
        false
    }

    /// Transforms `await` expressions to `yield` expressions.
    /// Ignores top-level await expressions.
    fn transform_await_expression(
        expr: &mut AwaitExpression<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        // We don't need to handle top-level await.
        if Self::is_inside_async_function(ctx) {
            Some(ctx.ast.expression_yield(SPAN, false, Some(expr.argument.take_in(ctx.ast))))
        } else {
            None
        }
    }
}

pub struct AsyncGeneratorExecutor<'a, 'ctx> {
    helper: Helper,
    ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> AsyncGeneratorExecutor<'a, 'ctx> {
    pub fn new(helper: Helper, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { helper, ctx }
    }

    /// Transforms async method definitions to generator functions wrapped in asyncToGenerator.
    ///
    /// ## Example
    ///
    /// Input:
    /// ```js
    /// class A { async foo() { await bar(); } }
    /// ```
    ///
    /// Output:
    /// ```js
    /// class A {
    /// foo() {
    ///     return babelHelpers.asyncToGenerator(function* () {
    ///         yield bar();
    ///     })();
    /// }
    /// ```
    pub fn transform_function_for_method_definition(
        &self,
        func: &mut Function<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let Some(body) = func.body.take() else {
            return;
        };

        // If parameters could throw errors, we need to move them to the inner function,
        // because it is an async function, which should return a rejecting promise if
        // there is an error.
        let needs_move_parameters_to_inner_function =
            Self::could_throw_errors_parameters(&func.params);

        let (generator_scope_id, wrapper_scope_id) = {
            let new_scope_id = ctx.create_child_scope(ctx.current_scope_id(), ScopeFlags::Function);
            let scope_id = func.scope_id.replace(Some(new_scope_id)).unwrap();
            // We need to change the parent id to new scope id because we need to this function's body inside the wrapper function,
            // and then the new scope id will be wrapper function's scope id.
            ctx.scoping_mut().change_scope_parent_id(scope_id, Some(new_scope_id));
            if !needs_move_parameters_to_inner_function {
                // We need to change formal parameters's scope back to the original scope,
                // because we only move out the function body.
                Self::move_formal_parameters_to_target_scope(new_scope_id, &func.params, ctx);
            }

            (scope_id, new_scope_id)
        };

        let params = if needs_move_parameters_to_inner_function {
            // Make sure to not change the value of the "length" property. This is
            // done by generating dummy arguments for the outer function equal to
            // the expected length of the function:
            //
            //   async function foo(a, b, c = d, ...e) {
            //   }
            //
            // This turns into:
            //
            //   function foo(_x, _x1) {
            //     return _asyncToGenerator(function* (a, b, c = d, ...e) {
            //     }).call(this, arguments);
            //   }
            //
            // The "_x" and "_x1" are dummy variables to ensure "foo.length" is 2.
            let new_params = Self::create_placeholder_params(&func.params, wrapper_scope_id, ctx);
            mem::replace(&mut func.params, new_params)
        } else {
            Self::create_empty_params(ctx)
        };

        let callee = self.create_async_to_generator_call(params, body, generator_scope_id, ctx);
        let (callee, arguments) = if needs_move_parameters_to_inner_function {
            // callee.apply(this, arguments)
            let property = ctx.ast.identifier_name(SPAN, "apply");
            let callee =
                Expression::from(ctx.ast.member_expression_static(SPAN, callee, property, false));

            // this, arguments
            let this_argument = Argument::from(ctx.ast.expression_this(SPAN));
            let arguments_argument = Argument::from(ctx.create_unbound_ident_expr(
                SPAN,
                Atom::new_const("arguments"),
                ReferenceFlags::Read,
            ));
            (callee, ctx.ast.vec_from_array([this_argument, arguments_argument]))
        } else {
            // callee()
            (callee, ctx.ast.vec())
        };

        let expression = ctx.ast.expression_call(SPAN, callee, NONE, arguments, false);
        let statement = ctx.ast.statement_return(SPAN, Some(expression));

        // Modify the wrapper function
        func.r#async = false;
        func.generator = false;
        func.body = Some(ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), ctx.ast.vec1(statement)));
        func.scope_id.set(Some(wrapper_scope_id));
    }

    /// Transforms [`Function`] whose type is [`FunctionType::FunctionExpression`] to a generator function
    /// and wraps it in asyncToGenerator helper function.
    pub fn transform_function_expression(
        &self,
        wrapper_function: &mut Function<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let body = wrapper_function.body.take().unwrap();
        let params = wrapper_function.params.take_in_box(ctx.ast);
        let id = wrapper_function.id.take();
        let has_function_id = id.is_some();

        if !has_function_id && !Self::is_function_length_affected(&params) {
            return self.create_async_to_generator_call(
                params,
                body,
                wrapper_function.scope_id.take().unwrap(),
                ctx,
            );
        }

        let (generator_scope_id, wrapper_scope_id) = {
            let wrapper_scope_id =
                ctx.create_child_scope(ctx.current_scope_id(), ScopeFlags::Function);
            let scope_id = wrapper_function.scope_id.replace(Some(wrapper_scope_id)).unwrap();
            // Change the parent scope of the function scope with the current scope.
            ctx.scoping_mut().change_scope_parent_id(scope_id, Some(wrapper_scope_id));
            // If there is an id, then we will use it as the name of caller_function,
            // and the caller_function is inside the wrapper function.
            // so we need to move the id to the new scope.
            if let Some(id) = id.as_ref() {
                Self::move_binding_identifier_to_target_scope(wrapper_scope_id, id, ctx);
                let symbol_id = id.symbol_id();
                *ctx.scoping_mut().symbol_flags_mut(symbol_id) = SymbolFlags::Function;
            }
            (scope_id, wrapper_scope_id)
        };

        let bound_ident = Self::create_bound_identifier(
            id.as_ref(),
            wrapper_scope_id,
            SymbolFlags::FunctionScopedVariable,
            ctx,
        );

        let caller_function = {
            let scope_id = ctx.create_child_scope(wrapper_scope_id, ScopeFlags::Function);
            let params = Self::create_placeholder_params(&params, scope_id, ctx);
            let statements = ctx.ast.vec1(Self::create_apply_call_statement(&bound_ident, ctx));
            let body = ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), statements);
            let id = id.or_else(|| Self::infer_function_id_from_parent_node(wrapper_scope_id, ctx));
            Self::create_function(id, params, body, scope_id, ctx)
        };

        {
            // Modify the wrapper function to add new body, params, and scope_id.
            let async_to_gen_decl = self.create_async_to_generator_declaration(
                &bound_ident,
                params,
                body,
                generator_scope_id,
                ctx,
            );
            let statements = if has_function_id {
                let id = caller_function.id.as_ref().unwrap();
                // If the function has an id, then we need to return the id.
                // `function foo() { ... }` -> `function foo() {} return foo;`
                let reference = ctx.create_bound_ident_expr(
                    SPAN,
                    id.name,
                    id.symbol_id(),
                    ReferenceFlags::Read,
                );
                let func_decl = Statement::FunctionDeclaration(caller_function);
                let statement_return = ctx.ast.statement_return(SPAN, Some(reference));
                ctx.ast.vec_from_array([async_to_gen_decl, func_decl, statement_return])
            } else {
                // If the function doesn't have an id, then we need to return the function itself.
                // `function() { ... }` -> `return function() { ... };`
                let statement_return = ctx
                    .ast
                    .statement_return(SPAN, Some(Expression::FunctionExpression(caller_function)));
                ctx.ast.vec_from_array([async_to_gen_decl, statement_return])
            };
            debug_assert!(wrapper_function.body.is_none());
            wrapper_function.r#async = false;
            wrapper_function.generator = false;
            wrapper_function.body.replace(ctx.ast.alloc_function_body(
                SPAN,
                ctx.ast.vec(),
                statements,
            ));
        }

        // Construct the IIFE
        let callee = Expression::FunctionExpression(wrapper_function.take_in_box(ctx.ast));
        ctx.ast.expression_call_with_pure(SPAN, callee, NONE, ctx.ast.vec(), false, true)
    }

    /// Transforms async function declarations into generator functions wrapped in the asyncToGenerator helper.
    pub fn transform_function_declaration(
        &self,
        wrapper_function: &mut Function<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let (generator_scope_id, wrapper_scope_id) = {
            let wrapper_scope_id =
                ctx.create_child_scope(ctx.current_scope_id(), ScopeFlags::Function);
            let scope_id = wrapper_function.scope_id.replace(Some(wrapper_scope_id)).unwrap();
            // Change the parent scope of the function scope with the current scope.
            ctx.scoping_mut().change_scope_parent_id(scope_id, Some(wrapper_scope_id));
            (scope_id, wrapper_scope_id)
        };
        let body = wrapper_function.body.take().unwrap();
        let params =
            Self::create_placeholder_params(&wrapper_function.params, wrapper_scope_id, ctx);
        let params = mem::replace(&mut wrapper_function.params, params);

        let bound_ident = Self::create_bound_identifier(
            wrapper_function.id.as_ref(),
            ctx.current_scope_id(),
            SymbolFlags::Function,
            ctx,
        );

        // Modify the wrapper function
        {
            wrapper_function.r#async = false;
            wrapper_function.generator = false;
            let statements = ctx.ast.vec1(Self::create_apply_call_statement(&bound_ident, ctx));
            debug_assert!(wrapper_function.body.is_none());
            wrapper_function.body.replace(ctx.ast.alloc_function_body(
                SPAN,
                ctx.ast.vec(),
                statements,
            ));
        }

        // function _name() { _ref.apply(this, arguments); }
        {
            let statements = ctx.ast.vec_from_array([
                self.create_async_to_generator_assignment(
                    &bound_ident,
                    params,
                    body,
                    generator_scope_id,
                    ctx,
                ),
                Self::create_apply_call_statement(&bound_ident, ctx),
            ]);
            let body = ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), statements);

            let scope_id = ctx.create_child_scope(ctx.current_scope_id(), ScopeFlags::Function);
            // The generator function will move to this function, so we need
            // to change the parent scope of the generator function to the scope of this function.
            ctx.scoping_mut().change_scope_parent_id(generator_scope_id, Some(scope_id));

            let params = Self::create_empty_params(ctx);
            let id = Some(bound_ident.create_binding_identifier(ctx));
            let caller_function = Self::create_function(id, params, body, scope_id, ctx);
            Statement::FunctionDeclaration(caller_function)
        }
    }

    /// Transforms async arrow functions into generator functions wrapped in the asyncToGenerator helper.
    pub(self) fn transform_arrow_function(
        &self,
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let mut body = arrow.body.take_in_box(ctx.ast);

        // If the arrow's expression is true, we need to wrap the only one expression with return statement.
        if arrow.expression {
            let statement = body.statements.first_mut().unwrap();
            let expression = match statement {
                Statement::ExpressionStatement(es) => es.expression.take_in(ctx.ast),
                _ => unreachable!(),
            };
            *statement = ctx.ast.statement_return(expression.span(), Some(expression));
        }

        let params = arrow.params.take_in_box(ctx.ast);
        let generator_function_id = arrow.scope_id();
        ctx.scoping_mut().scope_flags_mut(generator_function_id).remove(ScopeFlags::Arrow);
        let function_name = Self::infer_function_name_from_parent_node(ctx);

        if function_name.is_none() && !Self::is_function_length_affected(&params) {
            return self.create_async_to_generator_call(params, body, generator_function_id, ctx);
        }

        let wrapper_scope_id = ctx.create_child_scope(ctx.current_scope_id(), ScopeFlags::Function);

        // The generator function will move to inside wrapper, so we need
        // to change the parent scope of the generator function to the wrapper function.
        ctx.scoping_mut().change_scope_parent_id(generator_function_id, Some(wrapper_scope_id));

        let bound_ident = Self::create_bound_identifier(
            None,
            wrapper_scope_id,
            SymbolFlags::FunctionScopedVariable,
            ctx,
        );

        let caller_function = {
            let scope_id = ctx.create_child_scope(wrapper_scope_id, ScopeFlags::Function);
            let params = Self::create_placeholder_params(&params, scope_id, ctx);
            let statements = ctx.ast.vec1(Self::create_apply_call_statement(&bound_ident, ctx));
            let body = ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), statements);
            let id = function_name.map(|name| {
                ctx.generate_binding(name, wrapper_scope_id, SymbolFlags::Function)
                    .create_binding_identifier(ctx)
            });
            let function = Self::create_function(id, params, body, scope_id, ctx);
            let argument = Some(Expression::FunctionExpression(function));
            ctx.ast.statement_return(SPAN, argument)
        };

        // Wrapper function
        {
            let statement = self.create_async_to_generator_declaration(
                &bound_ident,
                params,
                body,
                generator_function_id,
                ctx,
            );
            let statements = ctx.ast.vec_from_array([statement, caller_function]);
            let body = ctx.ast.alloc_function_body(SPAN, ctx.ast.vec(), statements);
            let params = Self::create_empty_params(ctx);
            let wrapper_function = Self::create_function(None, params, body, wrapper_scope_id, ctx);
            // Construct the IIFE
            let callee = Expression::FunctionExpression(wrapper_function);
            ctx.ast.expression_call(SPAN, callee, NONE, ctx.ast.vec(), false)
        }
    }

    /// Infers the function id from [`TraverseCtx::parent`].
    fn infer_function_id_from_parent_node(
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<BindingIdentifier<'a>> {
        let name = Self::infer_function_name_from_parent_node(ctx)?;
        Some(
            ctx.generate_binding(name, scope_id, SymbolFlags::Function)
                .create_binding_identifier(ctx),
        )
    }

    /// Infers the function name from the [`TraverseCtx::parent`].
    fn infer_function_name_from_parent_node(ctx: &TraverseCtx<'a>) -> Option<Atom<'a>> {
        match ctx.parent() {
            // infer `foo` from `const foo = async function() {}`
            Ancestor::VariableDeclaratorInit(declarator) => {
                declarator.id().get_binding_identifier().map(|id| id.name)
            }
            // infer `foo` from `({ foo: async function() {} })`
            Ancestor::ObjectPropertyValue(property) if !*property.method() => {
                property.key().static_name().map(|key| Self::normalize_function_name(&key, ctx))
            }
            _ => None,
        }
    }

    /// Normalizes the function name.
    ///
    /// Examples:
    ///
    /// // Valid
    /// * `foo` -> `foo`
    ///   // Contains space
    /// * `foo bar` -> `foo_bar`
    ///   // Reserved keyword
    /// * `this` -> `_this`
    /// * `arguments` -> `_arguments`
    fn normalize_function_name(input: &Cow<'a, str>, ctx: &TraverseCtx<'a>) -> Atom<'a> {
        let input_str = input.as_ref();
        if !is_reserved_keyword(input_str) && is_identifier_name(input_str) {
            return ctx.ast.atom_from_cow(input);
        }

        let mut name = ArenaStringBuilder::with_capacity_in(input_str.len() + 1, ctx.ast.allocator);
        let mut capitalize_next = false;

        let mut chars = input_str.chars();
        if let Some(first) = chars.next()
            && is_identifier_start(first)
        {
            name.push(first);
        }

        for c in chars {
            if c == ' ' {
                name.push('_');
            } else if !is_identifier_part(c) {
                capitalize_next = true;
            } else if capitalize_next {
                name.push(c.to_ascii_uppercase());
                capitalize_next = false;
            } else {
                name.push(c);
            }
        }

        if name.is_empty() {
            return Atom::from("_");
        }

        if is_reserved_keyword(name.as_str()) {
            name.push_ascii_byte_start(b'_');
        }

        Atom::from(name)
    }

    /// Creates a [`Function`] with the specified params, body and scope_id.
    #[inline]
    fn create_function(
        id: Option<BindingIdentifier<'a>>,
        params: ArenaBox<'a, FormalParameters<'a>>,
        body: ArenaBox<'a, FunctionBody<'a>>,
        scope_id: ScopeId,
        ctx: &TraverseCtx<'a>,
    ) -> ArenaBox<'a, Function<'a>> {
        let r#type = if id.is_some() {
            FunctionType::FunctionDeclaration
        } else {
            FunctionType::FunctionExpression
        };
        ctx.ast.alloc_function_with_scope_id(
            SPAN,
            r#type,
            id,
            false,
            false,
            false,
            NONE,
            NONE,
            params,
            NONE,
            Some(body),
            scope_id,
        )
    }

    /// Creates a [`Statement`] that calls the `apply` method on the bound identifier.
    ///
    /// The generated code structure is:
    /// ```js
    /// bound_ident.apply(this, arguments);
    /// ```
    fn create_apply_call_statement(
        bound_ident: &BoundIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let symbol_id = ctx.scoping().find_binding(ctx.current_scope_id(), "arguments");
        let arguments_ident = Argument::from(ctx.create_ident_expr(
            SPAN,
            Atom::from("arguments"),
            symbol_id,
            ReferenceFlags::Read,
        ));

        // (this, arguments)
        let this = Argument::from(ctx.ast.expression_this(SPAN));
        let arguments = ctx.ast.vec_from_array([this, arguments_ident]);
        // _ref.apply
        let callee = Expression::from(ctx.ast.member_expression_static(
            SPAN,
            bound_ident.create_read_expression(ctx),
            ctx.ast.identifier_name(SPAN, "apply"),
            false,
        ));
        let argument = ctx.ast.expression_call(SPAN, callee, NONE, arguments, false);
        ctx.ast.statement_return(SPAN, Some(argument))
    }

    /// Creates an [`Expression`] that calls the [`AsyncGeneratorExecutor::helper`] helper function.
    ///
    /// This function constructs the helper call with arguments derived from the provided
    /// parameters, body, and scope_id.
    ///
    /// The generated code structure is:
    /// ```js
    /// asyncToGenerator(function* (PARAMS) {
    ///    BODY
    /// });
    /// ```
    fn create_async_to_generator_call(
        &self,
        params: ArenaBox<'a, FormalParameters<'a>>,
        body: ArenaBox<'a, FunctionBody<'a>>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let mut function = Self::create_function(None, params, body, scope_id, ctx);
        function.generator = true;
        let arguments = ctx.ast.vec1(Argument::FunctionExpression(function));
        self.ctx.helper_call_expr(self.helper, SPAN, arguments, ctx)
    }

    /// Creates a helper declaration statement for async-to-generator transformation.
    ///
    /// This function generates code that looks like:
    /// ```js
    /// var _ref = asyncToGenerator(function* (PARAMS) {
    ///   BODY
    /// });
    /// ```
    fn create_async_to_generator_declaration(
        &self,
        bound_ident: &BoundIdentifier<'a>,
        params: ArenaBox<'a, FormalParameters<'a>>,
        body: ArenaBox<'a, FunctionBody<'a>>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let init = self.create_async_to_generator_call(params, body, scope_id, ctx);
        let declarations = ctx.ast.vec1(ctx.ast.variable_declarator(
            SPAN,
            VariableDeclarationKind::Var,
            bound_ident.create_binding_pattern(ctx),
            Some(init),
            false,
        ));
        Statement::from(ctx.ast.declaration_variable(
            SPAN,
            VariableDeclarationKind::Var,
            declarations,
            false,
        ))
    }

    /// Creates a helper assignment statement for async-to-generator transformation.
    ///
    /// This function generates code that looks like:
    /// ```js
    /// _ref = asyncToGenerator(function* (PARAMS) {
    ///   BODY
    /// });
    /// ```
    fn create_async_to_generator_assignment(
        &self,
        bound: &BoundIdentifier<'a>,
        params: ArenaBox<'a, FormalParameters<'a>>,
        body: ArenaBox<'a, FunctionBody<'a>>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let right = self.create_async_to_generator_call(params, body, scope_id, ctx);
        let expression = ctx.ast.expression_assignment(
            SPAN,
            AssignmentOperator::Assign,
            bound.create_write_target(ctx),
            right,
        );
        ctx.ast.statement_expression(SPAN, expression)
    }

    /// Creates placeholder [`FormalParameters`] which named `_x` based on the passed-in parameters.
    /// `function p(x, y, z, d = 0, ...rest) {}` -> `function* (_x, _x1, _x2) {}`
    fn create_placeholder_params(
        params: &FormalParameters<'a>,
        scope_id: ScopeId,
        ctx: &mut TraverseCtx<'a>,
    ) -> ArenaBox<'a, FormalParameters<'a>> {
        let mut parameters = ctx.ast.vec_with_capacity(params.items.len());
        for param in &params.items {
            if param.pattern.kind.is_assignment_pattern() {
                break;
            }
            let binding = ctx.generate_uid("x", scope_id, SymbolFlags::FunctionScopedVariable);
            parameters.push(
                ctx.ast.plain_formal_parameter(param.span(), binding.create_binding_pattern(ctx)),
            );
        }

        ctx.ast.alloc_formal_parameters(
            SPAN,
            FormalParameterKind::FormalParameter,
            parameters,
            NONE,
        )
    }

    /// Creates an empty [FormalParameters] with [FormalParameterKind::FormalParameter].
    #[inline]
    fn create_empty_params(ctx: &TraverseCtx<'a>) -> ArenaBox<'a, FormalParameters<'a>> {
        ctx.ast.alloc_formal_parameters(
            SPAN,
            FormalParameterKind::FormalParameter,
            ctx.ast.vec(),
            NONE,
        )
    }

    /// Creates a [`BoundIdentifier`] for the id of the function.
    #[inline]
    fn create_bound_identifier(
        id: Option<&BindingIdentifier<'a>>,
        scope_id: ScopeId,
        flags: SymbolFlags,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        ctx.generate_uid(id.as_ref().map_or_else(|| "ref", |id| id.name.as_str()), scope_id, flags)
    }

    /// Check whether the given [`Ancestor`] is a class method-like node.
    pub(crate) fn is_class_method_like_ancestor(ancestor: Ancestor) -> bool {
        match ancestor {
            // `class A { async foo() {} }`
            Ancestor::MethodDefinitionValue(_) => true,
            // Only `({ async foo() {} })` does not include non-method like `({ foo: async function() {} })`,
            // because it's just a property with a function value
            Ancestor::ObjectPropertyValue(property) => *property.method(),
            _ => false,
        }
    }

    /// Checks if the function length is affected by the parameters.
    ///
    /// TODO: Needs to handle `ignoreFunctionLength` assumption.
    // <https://github.com/babel/babel/blob/3bcfee232506a4cebe410f02042fb0f0adeeb0b1/packages/babel-helper-wrap-function/src/index.ts#L164>
    #[inline]
    fn is_function_length_affected(params: &FormalParameters<'_>) -> bool {
        params.items.first().is_some_and(|param| !param.pattern.kind.is_assignment_pattern())
    }

    /// Check whether the function parameters could throw errors.
    #[inline]
    fn could_throw_errors_parameters(params: &FormalParameters<'a>) -> bool {
        params.items.iter().any(|param|
            matches!(
                &param.pattern.kind,
                BindingPatternKind::AssignmentPattern(pattern) if Self::could_potentially_throw_error_expression(&pattern.right)
            )
        )
    }

    /// Check whether the expression could potentially throw an error.
    #[inline]
    fn could_potentially_throw_error_expression(expr: &Expression<'a>) -> bool {
        !(matches!(
            expr,
            Expression::NullLiteral(_)
                | Expression::BooleanLiteral(_)
                | Expression::NumericLiteral(_)
                | Expression::StringLiteral(_)
                | Expression::BigIntLiteral(_)
                | Expression::ArrowFunctionExpression(_)
                | Expression::FunctionExpression(_)
        ) || expr.is_undefined())
    }

    #[inline]
    fn move_formal_parameters_to_target_scope(
        target_scope_id: ScopeId,
        params: &FormalParameters<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        BindingMover::new(target_scope_id, ctx).visit_formal_parameters(params);
    }

    #[inline]
    fn move_binding_identifier_to_target_scope(
        target_scope_id: ScopeId,
        ident: &BindingIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        BindingMover::new(target_scope_id, ctx).visit_binding_identifier(ident);
    }
}

/// Moves the bindings from original scope to target scope.
struct BindingMover<'a, 'ctx> {
    ctx: &'ctx mut TraverseCtx<'a>,
    target_scope_id: ScopeId,
}

impl<'a, 'ctx> BindingMover<'a, 'ctx> {
    fn new(target_scope_id: ScopeId, ctx: &'ctx mut TraverseCtx<'a>) -> Self {
        Self { ctx, target_scope_id }
    }
}

impl<'a> Visit<'a> for BindingMover<'a, '_> {
    /// Visits a binding identifier and moves it to the target scope.
    fn visit_binding_identifier(&mut self, ident: &BindingIdentifier<'a>) {
        let symbols = self.ctx.scoping();
        let symbol_id = ident.symbol_id();
        let current_scope_id = symbols.symbol_scope_id(symbol_id);
        let scopes = self.ctx.scoping_mut();
        scopes.move_binding(current_scope_id, self.target_scope_id, ident.name.as_str());
        let symbols = self.ctx.scoping_mut();
        symbols.set_symbol_scope_id(symbol_id, self.target_scope_id);
    }
}
