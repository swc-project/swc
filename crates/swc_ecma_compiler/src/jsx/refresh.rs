//! React Fast Refresh
//!
//! Transform React functional components to integrate Fast Refresh.
//!
//! ## References
//!
//! * <https://github.com/facebook/react/issues/16604#issuecomment-528663101>
//! * <https://github.com/facebook/react/blob/v18.3.1/packages/react-refresh/src/ReactFreshBabelPlugin.js>

use std::{collections::hash_map::Entry, str};

use base64::{
    encoded_len as base64_encoded_len,
    prelude::{Engine, BASE64_STANDARD},
};
use rustc_hash::{FxHashMap, FxHashSet};
use sha1::{Digest, Sha1};
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{Visit, VisitWith};

use super::options::ReactRefreshOptions;
use crate::context::{TransformCtx, TraverseCtx};

/// Parse a string into a `RefreshIdentifierResolver` and convert it into an
/// `Expr`
#[derive(Debug, Clone)]
enum RefreshIdentifierResolver {
    /// Simple Ident (e.g. `$RefreshReg$`)
    Identifier(String),
    /// MemberExpression (object, property) (e.g. `window.$RefreshReg$`)
    Member((String, String)),
    /// Used for `import.meta` expression (e.g. `import.meta.$RefreshReg$`)
    ImportMeta(String),
}

impl RefreshIdentifierResolver {
    /// Parses a string into a RefreshIdentifierResolver
    pub fn parse(input: &str) -> Self {
        let mut parts = input.split('.');

        let first_part = parts.next().unwrap();
        let Some(second_part) = parts.next() else {
            // Handle simple identifier reference
            return Self::Identifier(input.to_string());
        };

        if first_part == "import" {
            // Handle `import.meta.$RefreshReg$` expression
            if let Some(property) = parts.next() {
                return Self::ImportMeta(property.to_string());
            }
            return Self::ImportMeta(second_part.to_string());
        }

        // Handle `window.$RefreshReg$` member expression
        Self::Member((first_part.to_string(), second_part.to_string()))
    }

    /// Converts the RefreshIdentifierResolver into an Expr
    pub fn to_expression(&self) -> Box<Expr> {
        match self {
            Self::Identifier(name) => Box::new(Expr::Ident(quote_ident!(
                SyntaxContext::empty(),
                name.as_str()
            ))),
            Self::Member((object, property)) => {
                let obj = Box::new(Expr::Ident(quote_ident!(
                    SyntaxContext::empty(),
                    object.as_str()
                )));
                let prop = IdentName {
                    span: DUMMY_SP,
                    sym: property.as_str().into(),
                };
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj,
                    prop: MemberProp::Ident(prop),
                }))
            }
            Self::ImportMeta(property) => {
                let meta = Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::ImportMeta,
                }));
                let prop = IdentName {
                    span: DUMMY_SP,
                    sym: property.as_str().into(),
                };
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: meta,
                    prop: MemberProp::Ident(prop),
                }))
            }
        }
    }
}

/// React Fast Refresh
///
/// Transform React functional components to integrate Fast Refresh.
pub struct ReactRefresh<'a> {
    refresh_reg: RefreshIdentifierResolver,
    refresh_sig: RefreshIdentifierResolver,
    emit_full_signatures: bool,
    ctx: &'a TransformCtx,
    // States
    registrations: Vec<(String, String)>,
    /// Used to wrap call expression with signature.
    /// (eg: hoc(() => {}) -> _s1(hoc(_s1(() => {}))))
    last_signature: Option<(String, Vec<ExprOrSpread>)>,
    // (function_scope_id, key)
    function_signature_keys: FxHashMap<usize, String>,
    non_builtin_hooks_callee: FxHashMap<usize, Vec<Option<Box<Expr>>>>,
    /// Used to determine which bindings are used in JSX calls.
    used_in_jsx_bindings: FxHashSet<Id>,
    /// Counter for generating unique signature variable names
    signature_counter: usize,
    /// Counter for generating unique registration variable names
    registration_counter: usize,
    /// Current scope depth for tracking function scopes
    scope_depth: usize,
}

impl<'a> ReactRefresh<'a> {
    pub fn new(options: &ReactRefreshOptions, ctx: &'a TransformCtx) -> Self {
        Self {
            refresh_reg: RefreshIdentifierResolver::parse(&options.refresh_reg),
            refresh_sig: RefreshIdentifierResolver::parse(&options.refresh_sig),
            emit_full_signatures: options.emit_full_signatures,
            registrations: Vec::default(),
            ctx,
            last_signature: None,
            function_signature_keys: FxHashMap::default(),
            non_builtin_hooks_callee: FxHashMap::default(),
            used_in_jsx_bindings: FxHashSet::default(),
            signature_counter: 0,
            registration_counter: 0,
            scope_depth: 0,
        }
    }

    fn next_signature_name(&mut self) -> String {
        self.signature_counter += 1;
        format!("_s{}", self.signature_counter)
    }

    fn next_registration_name(&mut self) -> String {
        self.registration_counter += 1;
        format!("_c{}", self.registration_counter)
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for ReactRefresh<'a> {
    fn enter_program(&mut self, program: &mut Program, _ctx: &mut TraverseCtx<'a>) {
        // Collect bindings used in JSX
        self.used_in_jsx_bindings = UsedInJSXBindingsCollector::collect(program);

        // Process statements - only for Module, not Script
        if let Program::Module(module) = program {
            let mut new_statements = Vec::with_capacity(module.body.len() * 2);
            for mut statement in module.body.drain(..).collect::<Vec<_>>() {
                let next_statement = self.process_statement(&mut statement);
                new_statements.push(statement);
                if let Some(assignment_expression) = next_statement {
                    new_statements.push(assignment_expression);
                }
            }
            module.body = new_statements;
        }
    }

    fn exit_program(&mut self, program: &mut Program, _ctx: &mut TraverseCtx<'a>) {
        if self.registrations.is_empty() {
            return;
        }

        let mut variable_declarators = Vec::with_capacity(self.registrations.len());
        let mut calls = Vec::with_capacity(self.registrations.len());

        for (binding_name, persistent_id) in &self.registrations {
            variable_declarators.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: quote_ident!(SyntaxContext::empty(), binding_name.as_str()),
                    type_ann: None,
                }),
                init: None,
                definite: false,
            });

            let callee = self.refresh_reg.to_expression();
            let args = vec![
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Ident(quote_ident!(
                        SyntaxContext::empty(),
                        binding_name.as_str()
                    ))),
                },
                ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: persistent_id.as_str().into(),
                        raw: None,
                    }))),
                },
            ];
            calls.push(
                CallExpr {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    callee: Callee::Expr(callee),
                    args,
                    type_args: None,
                }
                .into_stmt(),
            );
        }

        let var_decl = VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Var,
            declare: false,
            decls: variable_declarators,
        };

        if let Program::Module(module) = program {
            module
                .body
                .extend(std::iter::once(ModuleItem::Stmt(Stmt::Decl(Decl::Var(
                    Box::new(var_decl),
                )))));
            module.body.extend(calls.into_iter().map(ModuleItem::Stmt));
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx<'a>) {
        let signature = match expr {
            Expr::Fn(func_expr) => {
                self.create_signature_call_expression_for_fn(&mut func_expr.function)
            }
            Expr::Arrow(arrow) => {
                let call_fn = self.create_signature_call_expression_for_arrow(arrow);

                // If the signature is found, we will transform arrow to block
                if call_fn.is_some() {
                    Self::transform_arrow_function_to_block(arrow);
                }
                call_fn
            }
            // hoc(_c = function() { })
            Expr::Assign(_) => return,
            // hoc1(hoc2(...))
            Expr::Call(_) => self.last_signature.take(),
            _ => None,
        };

        let Some((binding_identifier, mut arguments)) = signature else {
            return;
        };

        if !matches!(expr, Expr::Call(_)) {
            // Try to get binding from parent VariableDeclarator - would need
            // parent tracking For now, we'll handle this case in a
            // simplified manner
        }

        let mut found_call_expression = false;
        // In SWC, we don't have ancestor tracking in the same way as oxc
        // We'll use a simplified approach for now
        if matches!(expr, Expr::Call(_)) {
            found_call_expression = true;
        }

        if found_call_expression {
            self.last_signature = Some((binding_identifier.clone(), arguments.clone()));
        }

        arguments.insert(
            0,
            ExprOrSpread {
                spread: None,
                expr: Box::new(std::mem::replace(
                    expr,
                    Expr::Invalid(Invalid { span: DUMMY_SP }),
                )),
            },
        );

        *expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!(
                SyntaxContext::empty(),
                binding_identifier.as_str()
            )))),
            args: arguments,
            type_args: None,
        });
    }

    fn exit_function(&mut self, func: &mut Function, _ctx: &mut TraverseCtx<'a>) {
        // Note: In the full implementation, we would insert a statement after the
        // function declaration using statement_injector.
        // For now, this is left as a no-op since statement_injector needs to be ported.
        // The signature will be handled in the function body itself.
        if func.body.is_none() {
            return;
        }

        let _signature = self.create_signature_call_expression_for_fn(func);
        // TODO: Insert signature call after function declaration when
        // statement_injector is ported
    }

    fn enter_call_expr(&mut self, call_expr: &mut CallExpr, _ctx: &mut TraverseCtx<'a>) {
        let current_scope_id = self.scope_depth;

        let hook_name = match &call_expr.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => ident.sym.as_ref(),
                Expr::Member(member) => {
                    if let MemberProp::Ident(prop) = &member.prop {
                        prop.sym.as_ref()
                    } else {
                        return;
                    }
                }
                _ => return,
            },
            _ => return,
        };

        if !is_use_hook_name(hook_name) {
            return;
        }

        if !is_builtin_hook(hook_name) {
            // Track custom hooks
            let binding_expr = match &call_expr.callee {
                Callee::Expr(expr) => match &**expr {
                    Expr::Ident(ident) => Some(Box::new(Expr::Ident(ident.clone()))),
                    Expr::Member(member) => Some(Box::new(Expr::Member(member.clone()))),
                    _ => None,
                },
                _ => None,
            };

            self.non_builtin_hooks_callee
                .entry(current_scope_id)
                .or_default()
                .push(binding_expr);
        }

        let declarator_id = ""; // Would need parent tracking to get this properly

        let args = &call_expr.args;
        let (args_key, mut key_len) = if hook_name == "useState" && !args.is_empty() {
            let args_key = ""; // Would need source text to get this
            (args_key, args_key.len() + 4)
        } else if hook_name == "useReducer" && args.len() > 1 {
            let args_key = ""; // Would need source text to get this
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

        string.push_str(hook_name);
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
impl<'a> ReactRefresh<'a> {
    fn create_registration(&mut self, persistent_id: String) -> String {
        let binding = self.next_registration_name();
        self.registrations.push((binding.clone(), persistent_id));
        binding
    }

    /// Similar to the `findInnerComponents` function in `react-refresh/babel`.
    fn replace_inner_components(
        &mut self,
        inferred_name: &str,
        expr: &mut Expr,
        is_variable_declarator: bool,
    ) -> bool {
        match expr {
            Expr::Ident(ident) => {
                // For case like:
                // export const Something = hoc(Foo)
                // we don't want to wrap Foo inside the call.
                // Instead we assume it's registered at definition.
                return is_componentish_name(&ident.sym);
            }
            Expr::Fn(_) => {}
            Expr::Arrow(arrow) => {
                // Don't transform `() => () => {}`
                if let BlockStmtOrExpr::Expr(inner_expr) = arrow.body.as_ref() {
                    if matches!(inner_expr.as_ref(), Expr::Arrow(_)) {
                        return false;
                    }
                }
            }
            Expr::Call(call_expr) => {
                let allowed_callee = matches!(
                    &call_expr.callee,
                    Callee::Expr(expr) if matches!(
                        &**expr,
                        Expr::Ident(_) | Expr::Member(_)
                    )
                );

                if allowed_callee {
                    let Some(ExprOrSpread {
                        expr: argument_expr,
                        ..
                    }) = call_expr.args.first_mut()
                    else {
                        return false;
                    };

                    let callee_name = match &call_expr.callee {
                        Callee::Expr(expr) => match &**expr {
                            Expr::Ident(ident) => ident.sym.as_ref(),
                            _ => "",
                        },
                        _ => "",
                    };

                    let found_inside = self.replace_inner_components(
                        &format!("{}${}", inferred_name, callee_name),
                        argument_expr,
                        false,
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
            let binding = self.create_registration(inferred_name.to_string());
            let old_expr = std::mem::replace(expr, Expr::Invalid(Invalid { span: DUMMY_SP }));
            *expr = Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                    id: quote_ident!(SyntaxContext::empty(), binding.as_str()),
                    type_ann: None,
                })),
                right: Box::new(old_expr),
            });
        }

        true
    }

    /// _c = id.name;
    fn create_assignment_expression(&mut self, id: &Ident) -> Stmt {
        let left = self.create_registration(id.sym.to_string());
        let right = Box::new(Expr::Ident(id.clone()));
        let expr = AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                id: quote_ident!(SyntaxContext::empty(), left.as_str()),
                type_ann: None,
            })),
            right,
        };
        expr.into_stmt()
    }

    fn create_signature_call_expression_for_fn(
        &mut self,
        func: &mut Function,
    ) -> Option<(String, Vec<ExprOrSpread>)> {
        let scope_id = self.scope_depth;
        self.create_signature_call_expression(scope_id, func.body.as_mut()?)
    }

    fn create_signature_call_expression_for_arrow(
        &mut self,
        arrow: &mut ArrowExpr,
    ) -> Option<(String, Vec<ExprOrSpread>)> {
        let scope_id = self.scope_depth;
        let body = match arrow.body.as_mut() {
            BlockStmtOrExpr::BlockStmt(block) => Some(block),
            _ => None,
        };
        self.create_signature_call_expression(scope_id, body?)
    }

    fn create_signature_call_expression(
        &mut self,
        scope_id: usize,
        body: &mut BlockStmt,
    ) -> Option<(String, Vec<ExprOrSpread>)> {
        let key = self.function_signature_keys.remove(&scope_id)?;

        let key_str = if self.emit_full_signatures {
            key
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

            let mut encoded = vec![0u8; ENCODED_LEN];
            let encoded_bytes = BASE64_STANDARD.encode_slice(hash, &mut encoded).unwrap();
            debug_assert_eq!(encoded_bytes, ENCODED_LEN);

            String::from_utf8(encoded).unwrap()
        };

        let callee_list = self
            .non_builtin_hooks_callee
            .remove(&scope_id)
            .unwrap_or_default();
        let custom_hooks_in_scope: Vec<Option<ExprOrSpread>> = callee_list
            .into_iter()
            .map(|e| e.map(|expr| ExprOrSpread { spread: None, expr }))
            .collect();

        let force_reset = custom_hooks_in_scope.iter().any(|e| e.is_none());

        let mut arguments = vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: key_str.into(),
                raw: None,
            }))),
        }];

        if force_reset || !custom_hooks_in_scope.is_empty() {
            arguments.push(ExprOrSpread {
                spread: None,
                expr: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: force_reset,
                }))),
            });
        }

        if !custom_hooks_in_scope.is_empty() {
            // function () { return custom_hooks_in_scope }
            let elements: Vec<Option<ExprOrSpread>> = custom_hooks_in_scope;
            let function = Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Box::new(Function {
                    params: vec![],
                    decorators: vec![],
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        ctxt: SyntaxContext::empty(),
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Array(ArrayLit {
                                span: DUMMY_SP,
                                elems: elements,
                            }))),
                        })],
                    }),
                    is_generator: false,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }),
            }));
            arguments.push(ExprOrSpread {
                spread: None,
                expr: function,
            });
        }

        // _s = refresh_sig();
        let binding = self.next_signature_name();
        let init = CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(self.refresh_sig.to_expression()),
            args: vec![],
            type_args: None,
        };

        let var_decl = VarDecl {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(BindingIdent {
                    id: quote_ident!(SyntaxContext::empty(), binding.as_str()),
                    type_ann: None,
                }),
                init: Some(Box::new(Expr::Call(init))),
                definite: false,
            }],
        };

        // Insert var declaration at the top of the function
        // TODO: Use var_declarations store when it's ported to SWC
        body.stmts
            .insert(0, Stmt::Decl(Decl::Var(Box::new(var_decl))));

        // _s();
        let call_expression = CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(Expr::Ident(quote_ident!(
                SyntaxContext::empty(),
                binding.as_str()
            )))),
            args: vec![],
            type_args: None,
        }
        .into_stmt();

        body.stmts.insert(1, call_expression);

        // Following is the signature call expression, will be generated in call site.
        // _s(App, signature_key, false, function() { return [] });
        //                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ custom hooks only
        Some((binding, arguments))
    }

    fn process_statement(&mut self, statement: &mut ModuleItem) -> Option<ModuleItem> {
        match statement {
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(variable))) => {
                self.handle_variable_declaration(variable)
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(func))) => self.handle_function_declaration(func),
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                match &mut export_decl.decl {
                    Decl::Fn(func) => self.handle_function_declaration(func),
                    Decl::Var(variable) => self.handle_variable_declaration(variable),
                    _ => None,
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(stmt_decl)) => {
                match &mut stmt_decl.decl {
                    DefaultDecl::Fn(func_expr) => {
                        if let Some(id) = &func_expr.ident {
                            // Skip TypeScript-only function declarations
                            if !is_componentish_name(&id.sym) {
                                return None;
                            }
                            return Some(ModuleItem::Stmt(self.create_assignment_expression(id)));
                        }
                        None
                    }
                    _ => None,
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(expr_decl)) => {
                let expression = &mut expr_decl.expr;
                if !matches!(**expression, Expr::Call(_)) {
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
                self.replace_inner_components("%default%", expression, false);

                None
            }
            _ => None,
        }
    }

    fn handle_function_declaration(&mut self, func: &FnDecl) -> Option<ModuleItem> {
        let id = &func.ident;

        // Skip TypeScript-only function declarations
        if !is_componentish_name(&id.sym) {
            return None;
        }

        Some(ModuleItem::Stmt(self.create_assignment_expression(id)))
    }

    fn handle_variable_declaration(&mut self, decl: &mut VarDecl) -> Option<ModuleItem> {
        if decl.decls.len() != 1 {
            return None;
        }

        let declarator = decl.decls.first_mut()?;
        let init = declarator.init.as_mut()?;
        let id = match &declarator.name {
            Pat::Ident(ident) => &ident.id,
            _ => return None,
        };

        if !is_componentish_name(&id.sym) {
            return None;
        }

        match &**init {
            // Likely component definitions.
            Expr::Arrow(arrow) => {
                // () => () => {}
                if let BlockStmtOrExpr::Expr(expr) = arrow.body.as_ref() {
                    if matches!(expr.as_ref(), Expr::Arrow(_)) {
                        return None;
                    }
                }
            }
            Expr::Fn(_)
            // Maybe something like styled.div`...`
            | Expr::Tpl(_) => {
                // Special case when a variable would get an inferred name:
                // let Foo = () => {}
                // let Foo = function() {}
                // let Foo = styled.div``;
                // We'll register it on next line so that
                // we don't mess up the inferred 'Foo' function name.
                // (eg: with @babel/plugin-transform-react-display-name or
                // babel-plugin-styled-components)
            }
            Expr::Call(call_expr) => {
                let is_import_expression = match &call_expr.callee {
                    Callee::Import(_) => true,
                    Callee::Expr(expr) => match &**expr {
                        Expr::Ident(ident) => ident.sym.starts_with("require"),
                        _ => false,
                    },
                    _ => false,
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
        let found_inside = self.replace_inner_components(&id.sym, init, true);

        let id_in_jsx = self.used_in_jsx_bindings.contains(&id.to_id());

        if !found_inside && !id_in_jsx {
            return None;
        }

        Some(ModuleItem::Stmt(self.create_assignment_expression(id)))
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
    fn transform_arrow_function_to_block(arrow: &mut ArrowExpr) {
        if let BlockStmtOrExpr::Expr(expr) = arrow.body.as_mut() {
            let expr = std::mem::replace(expr.as_mut(), Expr::Invalid(Invalid { span: DUMMY_SP }));
            *arrow.body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty(),
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(expr)),
                })],
            });
        }
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
struct UsedInJSXBindingsCollector {
    bindings: FxHashSet<Id>,
}

impl UsedInJSXBindingsCollector {
    fn collect(program: &Program) -> FxHashSet<Id> {
        let mut visitor = Self {
            bindings: FxHashSet::default(),
        };
        program.visit_with(&mut visitor);
        visitor.bindings
    }

    fn is_jsx_like_call(name: &str) -> bool {
        matches!(name, "createElement" | "jsx" | "jsxDEV" | "jsxs")
    }
}

impl Visit for UsedInJSXBindingsCollector {
    fn visit_call_expr(&mut self, call_expr: &CallExpr) {
        call_expr.visit_children_with(self);

        let is_jsx_call = match &call_expr.callee {
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(ident) => Self::is_jsx_like_call(&ident.sym),
                Expr::Member(member) => {
                    if let MemberProp::Ident(prop) = &member.prop {
                        Self::is_jsx_like_call(&prop.sym)
                    } else {
                        false
                    }
                }
                _ => false,
            },
            _ => false,
        };

        if is_jsx_call {
            if let Some(ExprOrSpread { expr, .. }) = call_expr.args.first() {
                if let Expr::Ident(ident) = &**expr {
                    self.bindings.insert(ident.to_id());
                }
            }
        }
    }

    fn visit_jsx_opening_element(&mut self, elem: &JSXOpeningElement) {
        elem.visit_children_with(self);

        if let JSXElementName::Ident(ident) = &elem.name {
            self.bindings.insert(ident.to_id());
        }
    }

    fn visit_ts_type_ann(&mut self, _node: &TsTypeAnn) {
        // Skip type annotations because they definitely don't have any JSX
        // bindings
    }

    fn visit_decl(&mut self, decl: &Decl) {
        if matches!(decl, Decl::TsTypeAlias(_) | Decl::TsInterface(_)) {
            // Skip type-only declarations because they definitely don't have any JSX
            // bindings
            return;
        }
        decl.visit_children_with(self);
    }

    fn visit_module_decl(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(_) | ModuleDecl::ExportAll(_) => {
                // Skip import/export all declarations because they definitely
                // don't have any JSX bindings
            }
            _ => decl.visit_children_with(self),
        }
    }
}
