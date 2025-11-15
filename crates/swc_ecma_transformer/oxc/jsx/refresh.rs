use std::{collections::hash_map::Entry, iter, str};

use base64::{
    encoded_len as base64_encoded_len,
    prelude::{BASE64_STANDARD, Engine},
};
use rustc_hash::{FxHashMap, FxHashSet};
use sha1::{Digest, Sha1};

use oxc_allocator::{
    Address, CloneIn, GetAddress, StringBuilder as ArenaStringBuilder, TakeIn, Vec as ArenaVec,
};
use oxc_ast::{AstBuilder, NONE, ast::*, match_expression};
use oxc_ast_visit::{
    Visit,
    walk::{walk_call_expression, walk_declaration},
};
use oxc_semantic::{ReferenceFlags, ScopeFlags, ScopeId, SymbolFlags, SymbolId};
use oxc_span::{Atom, GetSpan, SPAN};
use oxc_syntax::operator::AssignmentOperator;
use oxc_traverse::{Ancestor, BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

use super::options::ReactRefreshOptions;

/// Parse a string into a `RefreshIdentifierResolver` and convert it into an `Expression`
#[derive(Debug)]
enum RefreshIdentifierResolver<'a> {
    /// Simple IdentifierReference (e.g. `$RefreshReg$`)
    Identifier(IdentifierReference<'a>),
    /// StaticMemberExpression (object, property) (e.g. `window.$RefreshReg$`)
    Member((IdentifierReference<'a>, IdentifierName<'a>)),
    /// Used for `import.meta` expression (e.g. `import.meta.$RefreshReg$`)
    Expression(Expression<'a>),
}

impl<'a> RefreshIdentifierResolver<'a> {
    /// Parses a string into a RefreshIdentifierResolver
    pub fn parse(input: &str, ast: AstBuilder<'a>) -> Self {
        let mut parts = input.split('.');

        let first_part = parts.next().unwrap();
        let Some(second_part) = parts.next() else {
            // Handle simple identifier reference
            return Self::Identifier(ast.identifier_reference(SPAN, ast.atom(input)));
        };

        if first_part == "import" {
            // Handle `import.meta.$RefreshReg$` expression
            let mut expr = ast.expression_meta_property(
                SPAN,
                ast.identifier_name(SPAN, "import"),
                ast.identifier_name(SPAN, ast.atom(second_part)),
            );
            if let Some(property) = parts.next() {
                expr = Expression::from(ast.member_expression_static(
                    SPAN,
                    expr,
                    ast.identifier_name(SPAN, ast.atom(property)),
                    false,
                ));
            }
            return Self::Expression(expr);
        }

        // Handle `window.$RefreshReg$` member expression
        let object = ast.identifier_reference(SPAN, ast.atom(first_part));
        let property = ast.identifier_name(SPAN, ast.atom(second_part));
        Self::Member((object, property))
    }

    /// Converts the RefreshIdentifierResolver into an Expression
    pub fn to_expression(&self, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        match self {
            Self::Identifier(ident) => {
                let reference_id = ctx.create_unbound_reference(&ident.name, ReferenceFlags::Read);
                ctx.ast.expression_identifier_with_reference_id(
                    ident.span,
                    ident.name,
                    reference_id,
                )
            }
            Self::Member((ident, property)) => {
                let reference_id = ctx.create_unbound_reference(&ident.name, ReferenceFlags::Read);
                let ident = ctx.ast.expression_identifier_with_reference_id(
                    ident.span,
                    ident.name,
                    reference_id,
                );
                Expression::from(ctx.ast.member_expression_static(
                    SPAN,
                    ident,
                    property.clone(),
                    false,
                ))
            }
            Self::Expression(expr) => expr.clone_in(ctx.ast.allocator),
        }
    }
}

/// React Fast Refresh
///
/// Transform React functional components to integrate Fast Refresh.
///
/// References:
///
/// * <https://github.com/facebook/react/issues/16604#issuecomment-528663101>
/// * <https://github.com/facebook/react/blob/v18.3.1/packages/react-refresh/src/ReactFreshBabelPlugin.js>
pub struct ReactRefresh<'a, 'ctx> {
    refresh_reg: RefreshIdentifierResolver<'a>,
    refresh_sig: RefreshIdentifierResolver<'a>,
    emit_full_signatures: bool,
    ctx: &'ctx TransformCtx<'a>,
    // States
    registrations: Vec<(BoundIdentifier<'a>, Atom<'a>)>,
    /// Used to wrap call expression with signature.
    /// (eg: hoc(() => {}) -> _s1(hoc(_s1(() => {}))))
    last_signature: Option<(BindingIdentifier<'a>, ArenaVec<'a, Argument<'a>>)>,
    // (function_scope_id, key)
    function_signature_keys: FxHashMap<ScopeId, String>,
    non_builtin_hooks_callee: FxHashMap<ScopeId, Vec<Option<Expression<'a>>>>,
    /// Used to determine which bindings are used in JSX calls.
    used_in_jsx_bindings: FxHashSet<SymbolId>,
}

impl<'a, 'ctx> ReactRefresh<'a, 'ctx> {
    pub fn new(
        options: &ReactRefreshOptions,
        ast: AstBuilder<'a>,
        ctx: &'ctx TransformCtx<'a>,
    ) -> Self {
        Self {
            refresh_reg: RefreshIdentifierResolver::parse(&options.refresh_reg, ast),
            refresh_sig: RefreshIdentifierResolver::parse(&options.refresh_sig, ast),
            emit_full_signatures: options.emit_full_signatures,
            registrations: Vec::default(),
            ctx,
            last_signature: None,
            function_signature_keys: FxHashMap::default(),
            non_builtin_hooks_callee: FxHashMap::default(),
            used_in_jsx_bindings: FxHashSet::default(),
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ReactRefresh<'a, '_> {
    fn enter_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        self.used_in_jsx_bindings = UsedInJSXBindingsCollector::collect(program, ctx);

        let mut new_statements = ctx.ast.vec_with_capacity(program.body.len() * 2);
        for mut statement in program.body.take_in(ctx.ast) {
            let next_statement = self.process_statement(&mut statement, ctx);
            new_statements.push(statement);
            if let Some(assignment_expression) = next_statement {
                new_statements.push(assignment_expression);
            }
        }
        program.body = new_statements;
    }

    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.registrations.is_empty() {
            return;
        }

        let var_decl = Statement::from(ctx.ast.declaration_variable(
            SPAN,
            VariableDeclarationKind::Var,
            ctx.ast.vec(), // This is replaced at the end
            false,
        ));

        let mut variable_declarator_items = ctx.ast.vec_with_capacity(self.registrations.len());
        let calls = self.registrations.iter().map(|(binding, persistent_id)| {
            variable_declarator_items.push(ctx.ast.variable_declarator(
                SPAN,
                VariableDeclarationKind::Var,
                binding.create_binding_pattern(ctx),
                None,
                false,
            ));

            let callee = self.refresh_reg.to_expression(ctx);
            let arguments = ctx.ast.vec_from_array([
                Argument::from(binding.create_read_expression(ctx)),
                Argument::from(ctx.ast.expression_string_literal(SPAN, *persistent_id, None)),
            ]);
            ctx.ast.statement_expression(
                SPAN,
                ctx.ast.expression_call(SPAN, callee, NONE, arguments, false),
            )
        });

        let var_decl_index = program.body.len();
        program.body.extend(iter::once(var_decl).chain(calls));

        let Statement::VariableDeclaration(var_decl) = &mut program.body[var_decl_index] else {
            unreachable!()
        };
        var_decl.declarations = variable_declarator_items;
    }

    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let signature = match expr {
            Expression::FunctionExpression(func) => self.create_signature_call_expression(
                func.scope_id(),
                func.body.as_mut().unwrap(),
                ctx,
            ),
            Expression::ArrowFunctionExpression(arrow) => {
                let call_fn =
                    self.create_signature_call_expression(arrow.scope_id(), &mut arrow.body, ctx);

                // If the signature is found, we will push a new statement to the arrow function body. So it's not an expression anymore.
                if call_fn.is_some() {
                    Self::transform_arrow_function_to_block(arrow, ctx);
                }
                call_fn
            }
            // hoc(_c = function() { })
            Expression::AssignmentExpression(_) => return,
            // hoc1(hoc2(...))
            Expression::CallExpression(_) => self.last_signature.take(),
            _ => None,
        };

        let Some((binding_identifier, mut arguments)) = signature else {
            return;
        };
        let binding = BoundIdentifier::from_binding_ident(&binding_identifier);

        if !matches!(expr, Expression::CallExpression(_)) {
            // Try to get binding from parent VariableDeclarator
            if let Ancestor::VariableDeclaratorInit(declarator) = ctx.parent()
                && let Some(ident) = declarator.id().get_binding_identifier()
            {
                let id_binding = BoundIdentifier::from_binding_ident(ident);
                self.handle_function_in_variable_declarator(&id_binding, &binding, arguments, ctx);
                return;
            }
        }

        let mut found_call_expression = false;
        for ancestor in ctx.ancestors() {
            if ancestor.is_assignment_expression() {
                continue;
            }
            if ancestor.is_call_expression() {
                found_call_expression = true;
            }
            break;
        }

        if found_call_expression {
            self.last_signature =
                Some((binding_identifier.clone(), arguments.clone_in(ctx.ast.allocator)));
        }

        arguments.insert(0, Argument::from(expr.take_in(ctx.ast)));
        *expr = ctx.ast.expression_call(
            SPAN,
            binding.create_read_expression(ctx),
            NONE,
            arguments,
            false,
        );
    }

    fn exit_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if !func.is_function_declaration() {
            return;
        }

        let Some((binding_identifier, mut arguments)) = self.create_signature_call_expression(
            func.scope_id(),
            func.body.as_mut().unwrap(),
            ctx,
        ) else {
            return;
        };

        let Some(id) = func.id.as_ref() else {
            return;
        };
        let id_binding = BoundIdentifier::from_binding_ident(id);

        arguments.insert(0, Argument::from(id_binding.create_read_expression(ctx)));

        let binding = BoundIdentifier::from_binding_ident(&binding_identifier);
        let callee = binding.create_read_expression(ctx);
        let expr = ctx.ast.expression_call(SPAN, callee, NONE, arguments, false);
        let statement = ctx.ast.statement_expression(SPAN, expr);

        // Get the address of the statement containing this `FunctionDeclaration`
        let address = match ctx.parent() {
            // For `export function Foo() {}`
            // which is a `Statement::ExportNamedDeclaration`
            Ancestor::ExportNamedDeclarationDeclaration(decl) => decl.address(),
            // For `export default function() {}`
            // which is a `Statement::ExportDefaultDeclaration`
            Ancestor::ExportDefaultDeclarationDeclaration(decl) => decl.address(),
            // Otherwise just a `function Foo() {}`
            // which is a `Statement::FunctionDeclaration`.
            // `Function` is always stored in a `Box`, so has a stable memory address.
            _ => Address::from_ref(func),
        };
        self.ctx.statement_injector.insert_after(&address, statement);
    }

    fn enter_call_expression(
        &mut self,
        call_expr: &mut CallExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        let current_scope_id = ctx.current_scope_id();
        if !ctx.scoping().scope_flags(current_scope_id).is_function() {
            return;
        }

        let hook_name = match &call_expr.callee {
            Expression::Identifier(ident) => ident.name,
            Expression::StaticMemberExpression(member) => member.property.name,
            _ => return,
        };

        if !is_use_hook_name(&hook_name) {
            return;
        }

        if !is_builtin_hook(&hook_name) {
            // Check if a corresponding binding exists where we emit the signature.
            let (binding_name, is_member_expression) = match &call_expr.callee {
                Expression::Identifier(ident) => (Some(ident.name), false),
                Expression::StaticMemberExpression(member) => {
                    if let Expression::Identifier(object) = &member.object {
                        (Some(object.name), true)
                    } else {
                        (None, false)
                    }
                }
                _ => unreachable!(),
            };

            if let Some(binding_name) = binding_name {
                self.non_builtin_hooks_callee.entry(current_scope_id).or_default().push(
                    ctx.scoping()
                        .find_binding(
                            ctx.scoping().scope_parent_id(ctx.current_scope_id()).unwrap(),
                            binding_name.as_str(),
                        )
                        .map(|symbol_id| {
                            let mut expr = ctx.create_bound_ident_expr(
                                SPAN,
                                binding_name,
                                symbol_id,
                                ReferenceFlags::Read,
                            );

                            if is_member_expression {
                                // binding_name.hook_name
                                expr = Expression::from(ctx.ast.member_expression_static(
                                    SPAN,
                                    expr,
                                    ctx.ast.identifier_name(SPAN, hook_name),
                                    false,
                                ));
                            }
                            expr
                        }),
                );
            }
        }

        let declarator_id = if let Ancestor::VariableDeclaratorInit(declarator) = ctx.parent() {
            // TODO: if there is no LHS, consider some other heuristic.
            declarator.id().span().source_text(self.ctx.source_text)
        } else {
            ""
        };

        let args = &call_expr.arguments;
        let (args_key, mut key_len) = if hook_name == "useState" && !args.is_empty() {
            let args_key = args[0].span().source_text(self.ctx.source_text);
            (args_key, args_key.len() + 4)
        } else if hook_name == "useReducer" && args.len() > 1 {
            let args_key = args[1].span().source_text(self.ctx.source_text);
            (args_key, args_key.len() + 4)
        } else {
            ("", 2)
        };

        key_len += hook_name.len() + declarator_id.len();

        let string = match self.function_signature_keys.entry(current_scope_id) {
            Entry::Occupied(entry) => {
                let string = entry.into_mut();
                string.reserve(key_len + 2);
                string.push_str("\\n");
                string
            }
            Entry::Vacant(entry) => entry.insert(String::with_capacity(key_len)),
        };

        // `hook_name{{declarator_id(args_key)}}` or `hook_name{{declarator_id}}`
        let old_len = string.len();

        string.push_str(&hook_name);
        string.push('{');
        string.push_str(declarator_id);
        if !args_key.is_empty() {
            string.push('(');
            string.push_str(args_key);
            string.push(')');
        }
        string.push('}');

        debug_assert_eq!(key_len, string.len() - old_len);
    }
}

// Internal Methods
impl<'a> ReactRefresh<'a, '_> {
    fn create_registration(
        &mut self,
        persistent_id: Atom<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> AssignmentTarget<'a> {
        let binding = ctx.generate_uid_in_root_scope("c", SymbolFlags::FunctionScopedVariable);
        let target = binding.create_target(ReferenceFlags::Write, ctx);
        self.registrations.push((binding, persistent_id));
        target
    }

    /// Similar to the `findInnerComponents` function in `react-refresh/babel`.
    fn replace_inner_components(
        &mut self,
        inferred_name: &str,
        expr: &mut Expression<'a>,
        is_variable_declarator: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> bool {
        match expr {
            Expression::Identifier(ident) => {
                // For case like:
                // export const Something = hoc(Foo)
                // we don't want to wrap Foo inside the call.
                // Instead we assume it's registered at definition.
                return is_componentish_name(&ident.name);
            }
            Expression::FunctionExpression(_) => {}
            Expression::ArrowFunctionExpression(arrow) => {
                // Don't transform `() => () => {}`
                if arrow
                    .get_expression()
                    .is_some_and(|expr| matches!(expr, Expression::ArrowFunctionExpression(_)))
                {
                    return false;
                }
            }
            Expression::CallExpression(call_expr) => {
                let allowed_callee = matches!(
                    call_expr.callee,
                    Expression::Identifier(_)
                        | Expression::ComputedMemberExpression(_)
                        | Expression::StaticMemberExpression(_)
                );

                if allowed_callee {
                    let callee_span = call_expr.callee.span();

                    let Some(argument_expr) =
                        call_expr.arguments.first_mut().and_then(|e| e.as_expression_mut())
                    else {
                        return false;
                    };

                    let found_inside = self.replace_inner_components(
                        format!(
                            "{}${}",
                            inferred_name,
                            callee_span.source_text(self.ctx.source_text)
                        )
                        .as_str(),
                        argument_expr,
                        /* is_variable_declarator */ false,
                        ctx,
                    );

                    if !found_inside {
                        return false;
                    }

                    // const Foo = hoc1(hoc2(() => {}))
                    // export default memo(React.forwardRef(function() {}))
                    if is_variable_declarator {
                        return true;
                    }
                } else {
                    return false;
                }
            }
            _ => {
                return false;
            }
        }

        if !is_variable_declarator {
            *expr = ctx.ast.expression_assignment(
                SPAN,
                AssignmentOperator::Assign,
                self.create_registration(ctx.ast.atom(inferred_name), ctx),
                expr.take_in(ctx.ast),
            );
        }

        true
    }

    /// _c = id.name;
    fn create_assignment_expression(
        &mut self,
        id: &BindingIdentifier<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Statement<'a> {
        let left = self.create_registration(id.name, ctx);
        let right =
            ctx.create_bound_ident_expr(SPAN, id.name, id.symbol_id(), ReferenceFlags::Read);
        let expr = ctx.ast.expression_assignment(SPAN, AssignmentOperator::Assign, left, right);
        ctx.ast.statement_expression(SPAN, expr)
    }

    fn create_signature_call_expression(
        &mut self,
        scope_id: ScopeId,
        body: &mut FunctionBody<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<(BindingIdentifier<'a>, ArenaVec<'a, Argument<'a>>)> {
        let key = self.function_signature_keys.remove(&scope_id)?;

        let key = if self.emit_full_signatures {
            ctx.ast.atom(&key)
        } else {
            // Prefer to hash when we can (e.g. outside of ASTExplorer).
            // This makes it deterministically compact, even if there's
            // e.g. a useState initializer with some code inside.
            // We also need it for www that has transforms like cx()
            // that don't understand if something is part of a string.
            const SHA1_HASH_LEN: usize = 20;
            const ENCODED_LEN: usize = {
                let len = base64_encoded_len(SHA1_HASH_LEN, true);
                match len {
                    Some(l) => l,
                    None => panic!("Invalid base64 length"),
                }
            };

            let mut hasher = Sha1::new();
            hasher.update(&key);
            let hash = hasher.finalize();
            debug_assert_eq!(hash.len(), SHA1_HASH_LEN);

            // Encode to base64 string directly in arena, without an intermediate string allocation
            #[expect(clippy::items_after_statements)]
            const ZEROS_STR: &str = {
                const ZEROS_BYTES: [u8; ENCODED_LEN] = [0; ENCODED_LEN];
                match str::from_utf8(&ZEROS_BYTES) {
                    Ok(s) => s,
                    Err(_) => unreachable!(),
                }
            };

            let mut hashed_key = ArenaStringBuilder::from_str_in(ZEROS_STR, ctx.ast.allocator);
            // SAFETY: Base64 encoding only produces ASCII bytes. Even if our assumptions are incorrect,
            // and Base64 bytes do not fill `hashed_key` completely, the remaining bytes are 0, so also ASCII.
            let hashed_key_bytes = unsafe { hashed_key.as_mut_str().as_bytes_mut() };
            let encoded_bytes = BASE64_STANDARD.encode_slice(hash, hashed_key_bytes).unwrap();
            debug_assert_eq!(encoded_bytes, ENCODED_LEN);
            Atom::from(hashed_key)
        };

        let callee_list = self.non_builtin_hooks_callee.remove(&scope_id).unwrap_or_default();
        let callee_len = callee_list.len();
        let custom_hooks_in_scope = ctx.ast.vec_from_iter(
            callee_list.into_iter().filter_map(|e| e.map(ArrayExpressionElement::from)),
        );

        let force_reset = custom_hooks_in_scope.len() != callee_len;

        let mut arguments = ctx.ast.vec();
        arguments.push(Argument::from(ctx.ast.expression_string_literal(SPAN, key, None)));

        if force_reset || !custom_hooks_in_scope.is_empty() {
            arguments.push(Argument::from(ctx.ast.expression_boolean_literal(SPAN, force_reset)));
        }

        if !custom_hooks_in_scope.is_empty() {
            // function () { return custom_hooks_in_scope }
            let formal_parameters = ctx.ast.formal_parameters(
                SPAN,
                FormalParameterKind::FormalParameter,
                ctx.ast.vec(),
                NONE,
            );
            let function_body = ctx.ast.function_body(
                SPAN,
                ctx.ast.vec(),
                ctx.ast.vec1(ctx.ast.statement_return(
                    SPAN,
                    Some(ctx.ast.expression_array(SPAN, custom_hooks_in_scope)),
                )),
            );
            let scope_id = ctx.create_child_scope_of_current(ScopeFlags::Function);
            let function =
                Argument::from(ctx.ast.expression_function_with_scope_id_and_pure_and_pife(
                    SPAN,
                    FunctionType::FunctionExpression,
                    None,
                    false,
                    false,
                    false,
                    NONE,
                    NONE,
                    formal_parameters,
                    NONE,
                    Some(function_body),
                    scope_id,
                    false,
                    false,
                ));
            arguments.push(function);
        }

        // _s = refresh_sig();
        let init = ctx.ast.expression_call(
            SPAN,
            self.refresh_sig.to_expression(ctx),
            NONE,
            ctx.ast.vec(),
            false,
        );
        let binding = self.ctx.var_declarations.create_uid_var_with_init("s", init, ctx);

        // _s();
        let call_expression = ctx.ast.statement_expression(
            SPAN,
            ctx.ast.expression_call(
                SPAN,
                binding.create_read_expression(ctx),
                NONE,
                ctx.ast.vec(),
                false,
            ),
        );

        body.statements.insert(0, call_expression);

        // Following is the signature call expression, will be generated in call site.
        // _s(App, signature_key, false, function() { return [] });
        //                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ custom hooks only
        let binding_identifier = binding.create_binding_identifier(ctx);
        Some((binding_identifier, arguments))
    }

    fn process_statement(
        &mut self,
        statement: &mut Statement<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Statement<'a>> {
        match statement {
            Statement::VariableDeclaration(variable) => {
                self.handle_variable_declaration(variable, ctx)
            }
            Statement::FunctionDeclaration(func) => self.handle_function_declaration(func, ctx),
            Statement::ExportNamedDeclaration(export_decl) => {
                if let Some(declaration) = &mut export_decl.declaration {
                    match declaration {
                        Declaration::FunctionDeclaration(func) => {
                            self.handle_function_declaration(func, ctx)
                        }
                        Declaration::VariableDeclaration(variable) => {
                            self.handle_variable_declaration(variable, ctx)
                        }
                        _ => None,
                    }
                } else {
                    None
                }
            }
            Statement::ExportDefaultDeclaration(stmt_decl) => {
                match &mut stmt_decl.declaration {
                    declaration @ match_expression!(ExportDefaultDeclarationKind) => {
                        let expression = declaration.to_expression_mut();
                        if !matches!(expression, Expression::CallExpression(_)) {
                            // For now, we only support possible HOC calls here.
                            // Named function declarations are handled in FunctionDeclaration.
                            // Anonymous direct exports like export default function() {}
                            // are currently ignored.
                            return None;
                        }

                        // This code path handles nested cases like:
                        // export default memo(() => {})
                        // In those cases it is more plausible people will omit names
                        // so they're worth handling despite possible false positives.
                        // More importantly, it handles the named case:
                        // export default memo(function Named() {})
                        self.replace_inner_components(
                            "%default%",
                            expression,
                            /* is_variable_declarator */ false,
                            ctx,
                        );

                        None
                    }
                    ExportDefaultDeclarationKind::FunctionDeclaration(func) => {
                        if let Some(id) = &func.id {
                            if func.is_typescript_syntax() || !is_componentish_name(&id.name) {
                                return None;
                            }

                            return Some(self.create_assignment_expression(id, ctx));
                        }
                        None
                    }
                    _ => None,
                }
            }
            _ => None,
        }
    }

    fn handle_function_declaration(
        &mut self,
        func: &Function<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Statement<'a>> {
        let Some(id) = &func.id else {
            return None;
        };

        if func.is_typescript_syntax() || !is_componentish_name(&id.name) {
            return None;
        }

        Some(self.create_assignment_expression(id, ctx))
    }

    fn handle_variable_declaration(
        &mut self,
        decl: &mut VariableDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Statement<'a>> {
        if decl.declarations.len() != 1 {
            return None;
        }

        let declarator = decl.declarations.first_mut().unwrap_or_else(|| unreachable!());
        let init = declarator.init.as_mut()?;
        let id = declarator.id.get_binding_identifier()?;
        let symbol_id = id.symbol_id();

        if !is_componentish_name(&id.name) {
            return None;
        }

        match init {
            // Likely component definitions.
            Expression::ArrowFunctionExpression(arrow) => {
                // () => () => {}
                if arrow.get_expression().is_some_and(|expr| matches!(expr, Expression::ArrowFunctionExpression(_))) {
                    return None;
                }
            }
            Expression::FunctionExpression(_)
            // Maybe something like styled.div`...`
            | Expression::TaggedTemplateExpression(_) => {
                // Special case when a variable would get an inferred name:
                // let Foo = () => {}
                // let Foo = function() {}
                // let Foo = styled.div``;
                // We'll register it on next line so that
                // we don't mess up the inferred 'Foo' function name.
                // (eg: with @babel/plugin-transform-react-display-name or
                // babel-plugin-styled-components)
            }
            Expression::CallExpression(call_expr) => {
                let is_import_expression = match call_expr.callee.get_inner_expression() {
                    Expression::ImportExpression(_) => {
                        true
                    }
                    Expression::Identifier(ident) => {
                        ident.name.starts_with("require")
                    },
                    _ => false
                };

                if is_import_expression {
                    return None;
                }
            }
            _ => {
                return None;
            }
        }

        // Maybe a HOC.
        // Try to determine if this is some form of import.
        let found_inside = self
            .replace_inner_components(&id.name, init, /* is_variable_declarator */ true, ctx);

        if !found_inside && !self.used_in_jsx_bindings.contains(&symbol_id) {
            return None;
        }

        Some(self.create_assignment_expression(id, ctx))
    }

    /// Handle `export const Foo = () => {}` or `const Foo = function() {}`
    fn handle_function_in_variable_declarator(
        &self,
        id_binding: &BoundIdentifier<'a>,
        binding: &BoundIdentifier<'a>,
        mut arguments: ArenaVec<'a, Argument<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        // Special case when a function would get an inferred name:
        // let Foo = () => {}
        // let Foo = function() {}
        // We'll add signature it on next line so that
        // we don't mess up the inferred 'Foo' function name.

        // Result: let Foo = () => {}; __signature(Foo, ...);
        arguments.insert(0, Argument::from(id_binding.create_read_expression(ctx)));
        let statement = ctx.ast.statement_expression(
            SPAN,
            ctx.ast.expression_call(
                SPAN,
                binding.create_read_expression(ctx),
                NONE,
                arguments,
                false,
            ),
        );

        // Get the address of the statement containing this `VariableDeclarator`
        let address =
            if let Ancestor::ExportNamedDeclarationDeclaration(export_decl) = ctx.ancestor(2) {
                // For `export const Foo = () => {}`
                // which is a `VariableDeclaration` inside a `Statement::ExportNamedDeclaration`
                export_decl.address()
            } else {
                // Otherwise just a `const Foo = () => {}` which is a `Statement::VariableDeclaration`
                let var_decl = ctx.ancestor(1);
                debug_assert!(matches!(var_decl, Ancestor::VariableDeclarationDeclarations(_)));
                var_decl.address()
            };
        self.ctx.statement_injector.insert_after(&address, statement);
    }

    /// Convert arrow function expression to normal arrow function
    ///
    /// ```js
    /// () => 1
    /// ```
    /// to
    /// ```js
    /// () => { return 1 }
    /// ```
    fn transform_arrow_function_to_block(
        arrow: &mut ArrowFunctionExpression<'a>,
        ctx: &TraverseCtx<'a>,
    ) {
        if !arrow.expression {
            return;
        }

        arrow.expression = false;

        let Some(Statement::ExpressionStatement(statement)) = arrow.body.statements.pop() else {
            unreachable!("arrow function body is never empty")
        };

        arrow
            .body
            .statements
            .push(ctx.ast.statement_return(SPAN, Some(statement.unbox().expression)));
    }
}

fn is_componentish_name(name: &str) -> bool {
    name.as_bytes().first().is_some_and(u8::is_ascii_uppercase)
}

fn is_use_hook_name(name: &str) -> bool {
    name.starts_with("use") && name.as_bytes().get(3).is_none_or(u8::is_ascii_uppercase)
}

#[rustfmt::skip]
fn is_builtin_hook(hook_name: &str) -> bool {
    matches!(
        hook_name,
        "useState" | "useReducer" | "useEffect" |
        "useLayoutEffect" | "useMemo" | "useCallback" |
        "useRef" | "useContext" | "useImperativeHandle" |
        "useDebugValue" | "useId" | "useDeferredValue" |
        "useTransition" | "useInsertionEffect" | "useSyncExternalStore" |
        "useFormStatus" | "useFormState" | "useActionState" |
        "useOptimistic"
    )
}

/// Collects all bindings that are used in JSX elements or JSX-like calls.
///
/// For <https://github.com/facebook/react/blob/ba6a9e94edf0db3ad96432804f9931ce9dc89fec/packages/react-refresh/src/ReactFreshBabelPlugin.js#L161-L199>
struct UsedInJSXBindingsCollector<'a, 'b> {
    ctx: &'b TraverseCtx<'a>,
    bindings: FxHashSet<SymbolId>,
}

impl<'a, 'b> UsedInJSXBindingsCollector<'a, 'b> {
    fn collect(program: &Program<'a>, ctx: &'b TraverseCtx<'a>) -> FxHashSet<SymbolId> {
        let mut visitor = Self { ctx, bindings: FxHashSet::default() };
        visitor.visit_program(program);
        visitor.bindings
    }

    fn is_jsx_like_call(name: &str) -> bool {
        matches!(name, "createElement" | "jsx" | "jsxDEV" | "jsxs")
    }
}

impl<'a> Visit<'a> for UsedInJSXBindingsCollector<'a, '_> {
    fn visit_call_expression(&mut self, it: &CallExpression<'a>) {
        walk_call_expression(self, it);

        let is_jsx_call = match &it.callee {
            Expression::Identifier(ident) => Self::is_jsx_like_call(&ident.name),
            Expression::StaticMemberExpression(member) => {
                Self::is_jsx_like_call(&member.property.name)
            }
            _ => false,
        };

        if is_jsx_call
            && let Some(Argument::Identifier(ident)) = it.arguments.first()
            && let Some(symbol_id) =
                self.ctx.scoping().get_reference(ident.reference_id()).symbol_id()
        {
            self.bindings.insert(symbol_id);
        }
    }

    fn visit_jsx_opening_element(&mut self, it: &JSXOpeningElement<'_>) {
        if let Some(ident) = it.name.get_identifier()
            && let Some(symbol_id) =
                self.ctx.scoping().get_reference(ident.reference_id()).symbol_id()
        {
            self.bindings.insert(symbol_id);
        }
    }

    #[inline]
    fn visit_ts_type_annotation(&mut self, _it: &TSTypeAnnotation<'a>) {
        // Skip type annotations because it definitely doesn't have any JSX bindings
    }

    #[inline]
    fn visit_declaration(&mut self, it: &Declaration<'a>) {
        if matches!(
            it,
            Declaration::TSTypeAliasDeclaration(_) | Declaration::TSInterfaceDeclaration(_)
        ) {
            // Skip type-only declarations because it definitely doesn't have any JSX bindings
            return;
        }
        walk_declaration(self, it);
    }

    #[inline]
    fn visit_import_declaration(&mut self, _it: &ImportDeclaration<'a>) {
        // Skip import declarations because it definitely doesn't have any JSX bindings
    }

    #[inline]
    fn visit_export_all_declaration(&mut self, _it: &ExportAllDeclaration<'a>) {
        // Skip export all declarations because it definitely doesn't have any JSX bindings
    }
}
