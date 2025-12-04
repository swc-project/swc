//! ES2015: Arrow Functions
//!
//! This plugin transforms arrow functions to ES5 function expressions.
//!
//! > This plugin is included in `preset-env`, in ES2015
//!
//! ## Example
//!
//! Input:
//! ```js
//! var a = () => {};
//! var a = (b) => b;
//!
//! const double = [1,2,3].map((num) => num * 2);
//! console.log(double); // [2,4,6]
//!
//! var bob = {
//!   _name: "Bob",
//!   _friends: ["Sally", "Tom"],
//!   printFriends() {
//!     this._friends.forEach(f =>
//!       console.log(this._name + " knows " + f));
//!   }
//! };
//! ```
//!
//! Output:
//! ```js
//! var a = function () {};
//! var a = function (b) {
//!   return b;
//! };
//!
//! const double = [1, 2, 3].map(function (num) {
//!   return num * 2;
//! });
//! console.log(double); // [2,4,6]
//!
//! var bob = {
//!   _name: "Bob",
//!   _friends: ["Sally", "Tom"],
//!   printFriends() {
//!     var _this = this;
//!
//!     this._friends.forEach(function (f) {
//!       return console.log(_this._name + " knows " + f);
//!     });
//!   }
//! };
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-arrow-functions](https://babel.dev/docs/babel-plugin-transform-arrow-functions).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/main/packages/babel-plugin-transform-arrow-functions>
//! * Arrow functions specification: <https://tc39.es/ecma262/#sec-arrow-function-definitions>

use swc_common::{util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{utils, TraverseCtx};

pub fn hook(unresolved_mark: Mark) -> impl VisitMutHook<TraverseCtx> {
    ArrowFunctionsPass {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        this_var: None,
        arguments_var: None,
        in_subclass: false,
        cur_stmt_address: None,
        scope_stack: Vec::new(),
        injected_in_current_scope: false,
        arrow_depth: 0,
    }
}

struct ArrowFunctionsPass {
    unresolved_ctxt: SyntaxContext,
    this_var: Option<Ident>,
    arguments_var: Option<Ident>,
    in_subclass: bool,
    cur_stmt_address: Option<*const Stmt>,
    /// Stack to save state when entering nested scopes
    scope_stack: Vec<ScopeState>,
    /// Whether we've already injected bindings for the current scope
    injected_in_current_scope: bool,
    /// Track depth of arrow functions that need this/arguments replacement
    arrow_depth: usize,
}

#[derive(Clone)]
struct ScopeState {
    this_var: Option<Ident>,
    arguments_var: Option<Ident>,
    in_subclass: bool,
    injected: bool,
}

impl VisitMutHook<TraverseCtx> for ArrowFunctionsPass {
    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.cur_stmt_address = Some(stmt as *const Stmt);
    }

    fn exit_stmt(&mut self, _stmt: &mut Stmt, ctx: &mut TraverseCtx) {
        // Inject this/arguments declarations if needed (only once per scope)
        if let Some(stmt_addr) = self.cur_stmt_address {
            if !self.injected_in_current_scope
                && (self.this_var.is_some() || self.arguments_var.is_some())
            {
                let mut decls = Vec::new();

                if let Some(this_id) = &self.this_var {
                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent {
                            id: this_id.clone(),
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                        definite: false,
                    });
                }

                if let Some(args_id) = &self.arguments_var {
                    decls.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent {
                            id: args_id.clone(),
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::Ident(Ident {
                            span: DUMMY_SP,
                            ctxt: self.unresolved_ctxt,
                            sym: "arguments".into(),
                            optional: false,
                        }))),
                        definite: false,
                    });
                }

                if !decls.is_empty() {
                    ctx.statement_injector.insert_before(
                        stmt_addr,
                        Stmt::Decl(Decl::Var(Box::new(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls,
                            ..Default::default()
                        }))),
                    );
                    self.injected_in_current_scope = true;
                }
            }
        }

        self.cur_stmt_address = None;
    }

    fn enter_arrow_expr(&mut self, arrow: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        // Check if arrow uses `this` or `arguments` BEFORE visiting children
        let uses_this = self.expr_uses_this(&arrow.body);
        let uses_arguments = self.expr_uses_arguments(&arrow.body);

        // If arrow uses `this`, ensure we have a saved identifier
        if uses_this && self.this_var.is_none() {
            self.this_var = Some(utils::create_private_ident("_this"));
        }

        // If arrow uses `arguments`, ensure we have a saved identifier
        if uses_arguments && self.arguments_var.is_none() {
            self.arguments_var = Some(utils::create_private_ident("_arguments"));
        }

        // Track that we're inside an arrow function that needs this/arguments
        // replacement We'll decrement this in exit_expr after transforming the
        // arrow
        if uses_this || uses_arguments {
            self.arrow_depth += 1;
        }
    }

    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // Only replace this/arguments when we're inside an arrow function that needs it
        if self.arrow_depth == 0 {
            return;
        }

        // Replace `this` with the saved identifier
        if let Expr::This(_) = expr {
            if let Some(this_id) = &self.this_var {
                *expr = Expr::Ident(this_id.clone());
            }
        }

        // Replace `arguments` with the saved identifier
        if let Expr::Ident(ident) = expr {
            if ident.sym == "arguments"
                && (ident.ctxt == self.unresolved_ctxt || ident.ctxt == SyntaxContext::empty())
            {
                if let Some(args_id) = &self.arguments_var {
                    *expr = Expr::Ident(args_id.clone());
                }
            }
        }
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // Transform arrow functions after children have been visited
        if let Expr::Arrow(arrow) = expr {
            // Transform the arrow to a regular function
            *expr = self.transform_arrow(arrow);

            // Decrement depth if we're exiting an arrow that was being tracked
            // Note: We can't check the arrow body here because we've already replaced
            // `this` with `_this` during traversal. Instead, we rely on the fact that
            // if arrow_depth > 0, we must be exiting an arrow that incremented it.
            if self.arrow_depth > 0 {
                self.arrow_depth -= 1;
            }
        }
    }

    fn enter_class(&mut self, c: &mut Class, _ctx: &mut TraverseCtx) {
        if c.super_class.is_some() {
            self.in_subclass = true;
        }
    }

    fn exit_class(&mut self, c: &mut Class, _ctx: &mut TraverseCtx) {
        if c.super_class.is_some() {
            self.in_subclass = false;
        }
    }

    fn enter_function(&mut self, _f: &mut Function, _ctx: &mut TraverseCtx) {
        // Functions create a new scope for `this` and `arguments`
        // Save current state and reset for the new function scope
        self.scope_stack.push(ScopeState {
            this_var: self.this_var.take(),
            arguments_var: self.arguments_var.take(),
            in_subclass: self.in_subclass,
            injected: self.injected_in_current_scope,
        });
        self.in_subclass = false;
        self.injected_in_current_scope = false;
    }

    fn exit_function(&mut self, _f: &mut Function, _ctx: &mut TraverseCtx) {
        // Restore previous scope state
        if let Some(state) = self.scope_stack.pop() {
            self.this_var = state.this_var;
            self.arguments_var = state.arguments_var;
            self.in_subclass = state.in_subclass;
            self.injected_in_current_scope = state.injected;
        }
    }
}

impl ArrowFunctionsPass {
    /// Transform an arrow function to a regular function expression
    fn transform_arrow(&mut self, arrow: &mut ArrowExpr) -> Expr {
        let ArrowExpr {
            span,
            params,
            body,
            is_async,
            is_generator,
            ..
        } = arrow;

        // Note: `this` and `arguments` detection is done in `enter_arrow_expr`
        // before children are visited, so we don't need to check again here.

        // Convert parameters
        let fn_params: Vec<Param> = params
            .take()
            .into_iter()
            .map(|pat| Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat,
            })
            .collect();

        // Convert body
        let fn_body = match &mut **body {
            BlockStmtOrExpr::BlockStmt(block) => block.take(),
            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                span: expr.span(),
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(expr.take()),
                })],
                ctxt: Default::default(),
            },
            #[cfg(swc_ast_unknown)]
            _ => {
                unreachable!("BlockStmtOrExpr only has BlockStmt and Expr variants")
            }
        };

        Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(Function {
                params: fn_params,
                decorators: Vec::new(),
                span: *span,
                ctxt: Default::default(),
                body: Some(fn_body),
                is_generator: *is_generator,
                is_async: *is_async,
                type_params: None,
                return_type: None,
            }),
        })
    }

    /// Check if an expression uses `this`
    fn expr_uses_this(&self, body: &BlockStmtOrExpr) -> bool {
        match body {
            BlockStmtOrExpr::BlockStmt(block) => self.stmts_use_this(&block.stmts),
            BlockStmtOrExpr::Expr(expr) => Self::check_expr_for_this(expr),
            #[cfg(swc_ast_unknown)]
            _ => false,
        }
    }

    /// Check if statements use `this`
    fn stmts_use_this(&self, stmts: &[Stmt]) -> bool {
        stmts.iter().any(|stmt| self.stmt_uses_this(stmt))
    }

    /// Check if a statement uses `this`
    fn stmt_uses_this(&self, stmt: &Stmt) -> bool {
        match stmt {
            Stmt::Expr(ExprStmt { expr, .. }) => Self::check_expr_for_this(expr),
            Stmt::Return(ReturnStmt {
                arg: Some(expr), ..
            }) => Self::check_expr_for_this(expr),
            Stmt::If(IfStmt {
                test, cons, alt, ..
            }) => {
                Self::check_expr_for_this(test)
                    || self.stmt_uses_this(cons)
                    || alt.as_ref().is_some_and(|s| self.stmt_uses_this(s))
            }
            Stmt::Block(BlockStmt { stmts, .. }) => self.stmts_use_this(stmts),
            _ => false,
        }
    }

    /// Check if an expression uses `this` (recursively)
    fn check_expr_for_this(expr: &Expr) -> bool {
        match expr {
            Expr::This(_) => true,
            Expr::Member(MemberExpr { obj, prop, .. }) => {
                Self::check_expr_for_this(obj)
                    || match prop {
                        MemberProp::Computed(ComputedPropName { expr, .. }) => {
                            Self::check_expr_for_this(expr)
                        }
                        _ => false,
                    }
            }
            Expr::Call(CallExpr { callee, args, .. }) => {
                if let Callee::Expr(e) = callee {
                    if Self::check_expr_for_this(e) {
                        return true;
                    }
                }
                args.iter().any(|arg| Self::check_expr_for_this(&arg.expr))
            }
            Expr::Bin(BinExpr { left, right, .. }) => {
                Self::check_expr_for_this(left) || Self::check_expr_for_this(right)
            }
            Expr::Unary(UnaryExpr { arg, .. }) => Self::check_expr_for_this(arg),
            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => {
                Self::check_expr_for_this(test)
                    || Self::check_expr_for_this(cons)
                    || Self::check_expr_for_this(alt)
            }
            Expr::Seq(SeqExpr { exprs, .. }) => exprs.iter().any(|e| Self::check_expr_for_this(e)),
            Expr::Assign(AssignExpr { left, right, .. }) => {
                let left_has_this = match left {
                    AssignTarget::Simple(SimpleAssignTarget::Member(m)) => {
                        Self::check_expr_for_this(&m.obj)
                    }
                    _ => false,
                };
                left_has_this || Self::check_expr_for_this(right)
            }
            Expr::Array(ArrayLit { elems, .. }) => elems.iter().any(|elem| {
                elem.as_ref()
                    .is_some_and(|e| Self::check_expr_for_this(&e.expr))
            }),
            Expr::Object(ObjectLit { props, .. }) => props.iter().any(|prop| match prop {
                PropOrSpread::Prop(p) => match &**p {
                    Prop::KeyValue(KeyValueProp { value, .. }) => Self::check_expr_for_this(value),
                    Prop::Method(MethodProp {
                        key: PropName::Computed(ComputedPropName { expr, .. }),
                        ..
                    }) => Self::check_expr_for_this(expr),
                    _ => false,
                },
                PropOrSpread::Spread(SpreadElement { expr, .. }) => Self::check_expr_for_this(expr),
                #[cfg(swc_ast_unknown)]
                _ => false,
            }),
            // Arrow functions create their own scope, don't recurse into them
            Expr::Arrow(_) => false,
            // Regular functions create their own scope, don't recurse into them
            Expr::Fn(_) => false,
            _ => false,
        }
    }

    /// Check if an expression uses `arguments`
    fn expr_uses_arguments(&self, body: &BlockStmtOrExpr) -> bool {
        match body {
            BlockStmtOrExpr::BlockStmt(block) => self.stmts_use_arguments(&block.stmts),
            BlockStmtOrExpr::Expr(expr) => self.check_expr_for_arguments(expr),
            #[cfg(swc_ast_unknown)]
            _ => false,
        }
    }

    /// Check if statements use `arguments`
    fn stmts_use_arguments(&self, stmts: &[Stmt]) -> bool {
        stmts.iter().any(|stmt| self.stmt_uses_arguments(stmt))
    }

    /// Check if a statement uses `arguments`
    fn stmt_uses_arguments(&self, stmt: &Stmt) -> bool {
        match stmt {
            Stmt::Expr(ExprStmt { expr, .. }) => self.check_expr_for_arguments(expr),
            Stmt::Return(ReturnStmt {
                arg: Some(expr), ..
            }) => self.check_expr_for_arguments(expr),
            Stmt::If(IfStmt {
                test, cons, alt, ..
            }) => {
                self.check_expr_for_arguments(test)
                    || self.stmt_uses_arguments(cons)
                    || alt.as_ref().is_some_and(|s| self.stmt_uses_arguments(s))
            }
            Stmt::Block(BlockStmt { stmts, .. }) => self.stmts_use_arguments(stmts),
            _ => false,
        }
    }

    /// Check if an expression uses `arguments` (recursively)
    fn check_expr_for_arguments(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Ident(Ident { sym, ctxt, .. })
                if sym == "arguments"
                    && (*ctxt == self.unresolved_ctxt || *ctxt == SyntaxContext::empty()) =>
            {
                true
            }
            Expr::Member(MemberExpr { obj, prop, .. }) => {
                self.check_expr_for_arguments(obj)
                    || match prop {
                        MemberProp::Computed(ComputedPropName { expr, .. }) => {
                            self.check_expr_for_arguments(expr)
                        }
                        _ => false,
                    }
            }
            Expr::Call(CallExpr { callee, args, .. }) => {
                if let Callee::Expr(e) = callee {
                    if self.check_expr_for_arguments(e) {
                        return true;
                    }
                }
                args.iter()
                    .any(|arg| self.check_expr_for_arguments(&arg.expr))
            }
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.check_expr_for_arguments(left) || self.check_expr_for_arguments(right)
            }
            Expr::Unary(UnaryExpr { arg, .. }) => self.check_expr_for_arguments(arg),
            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => {
                self.check_expr_for_arguments(test)
                    || self.check_expr_for_arguments(cons)
                    || self.check_expr_for_arguments(alt)
            }
            Expr::Seq(SeqExpr { exprs, .. }) => {
                exprs.iter().any(|e| self.check_expr_for_arguments(e))
            }
            Expr::Assign(AssignExpr { left, right, .. }) => {
                let left_has_arguments = match left {
                    AssignTarget::Simple(SimpleAssignTarget::Member(m)) => {
                        self.check_expr_for_arguments(&m.obj)
                    }
                    _ => false,
                };
                left_has_arguments || self.check_expr_for_arguments(right)
            }
            Expr::Array(ArrayLit { elems, .. }) => elems.iter().any(|elem| {
                elem.as_ref()
                    .is_some_and(|e| self.check_expr_for_arguments(&e.expr))
            }),
            Expr::Object(ObjectLit { props, .. }) => props.iter().any(|prop| match prop {
                PropOrSpread::Prop(p) => match &**p {
                    Prop::KeyValue(KeyValueProp { value, .. }) => {
                        self.check_expr_for_arguments(value)
                    }
                    Prop::Method(MethodProp {
                        key: PropName::Computed(ComputedPropName { expr, .. }),
                        ..
                    }) => self.check_expr_for_arguments(expr),
                    _ => false,
                },
                PropOrSpread::Spread(SpreadElement { expr, .. }) => {
                    self.check_expr_for_arguments(expr)
                }
                #[cfg(swc_ast_unknown)]
                _ => false,
            }),
            // Arrow functions create their own scope, don't recurse into them
            Expr::Arrow(_) => false,
            // Regular functions create their own scope, don't recurse into them
            Expr::Fn(_) => false,
            _ => false,
        }
    }
}
