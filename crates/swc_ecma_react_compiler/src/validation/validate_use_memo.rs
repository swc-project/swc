use std::collections::{HashMap, HashSet};

use swc_common::Spanned;
use swc_ecma_ast::{
    ArrowExpr, AssignExpr, AssignTarget, BlockStmt, CallExpr, Callee, Expr, FnExpr, Pat, Stmt,
    UpdateExpr, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
};

pub fn validate_use_memo(
    hir: &HirFunction,
    validate_no_void_use_memo: bool,
) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let parent_bindings = collect_local_bindings(hir);
    let function_like_bindings = collect_function_like_bindings(body);

    struct Finder {
        parent_bindings: HashSet<String>,
        function_like_bindings: HashMap<String, FunctionLike>,
        validate_no_void_use_memo: bool,
        errors: Vec<CompilerErrorDetail>,
    }

    impl Finder {
        fn push_error(
            &mut self,
            category: ErrorCategory,
            span: swc_common::Span,
            reason: &'static str,
            description: &'static str,
        ) {
            let mut detail = CompilerErrorDetail::error(category, reason);
            detail.description = Some(description.into());
            detail.loc = Some(span);
            self.errors.push(detail);
        }

        fn check_use_memo_call(&mut self, call: &CallExpr) {
            if !is_use_memo_call(call) || call.args.is_empty() {
                return;
            }

            let callback_like =
                resolve_callback_like(&call.args[0].expr, &self.function_like_bindings);
            let Some(callback_like) = callback_like else {
                return;
            };

            if callback_like.params_len() > 0 {
                let span = callback_like
                    .first_param_span()
                    .unwrap_or(callback_like.span());
                self.push_error(
                    ErrorCategory::UseMemo,
                    span,
                    "useMemo() callbacks may not accept parameters",
                    "useMemo() callbacks are called by React to cache calculations across \
                     re-renders. They should not take parameters. Instead, directly reference the \
                     props, state, or local variables needed for the computation",
                );
            }

            let is_async_or_generator = callback_like.is_async() || callback_like.is_generator();
            if is_async_or_generator {
                self.push_error(
                    ErrorCategory::UseMemo,
                    callback_like.span(),
                    "useMemo() callbacks may not be async or generator functions",
                    "useMemo() callbacks are called once and must synchronously return a value",
                );
            }

            if assigns_outer_context(&callback_like, &self.parent_bindings) {
                self.push_error(
                    ErrorCategory::UseMemo,
                    callback_like.span(),
                    "useMemo() callbacks may not reassign variables declared outside of the \
                     callback",
                    "useMemo() callbacks must be pure functions and cannot reassign variables \
                     defined outside of the callback function",
                );
            }

            if self.validate_no_void_use_memo
                && !is_async_or_generator
                && !has_non_void_return(&callback_like)
            {
                self.push_error(
                    ErrorCategory::VoidUseMemo,
                    callback_like.span(),
                    "useMemo() callbacks must return a value",
                    "This useMemo() callback doesn't return a value. useMemo() is for computing \
                     and caching values, not for arbitrary side effects",
                );
            }
        }
    }

    impl Visit for Finder {
        fn visit_stmt(&mut self, stmt: &Stmt) {
            if self.validate_no_void_use_memo {
                if let Stmt::Expr(expr_stmt) = stmt {
                    if let Expr::Call(call) = &*expr_stmt.expr {
                        if is_use_memo_call(call) {
                            self.push_error(
                                ErrorCategory::VoidUseMemo,
                                call.span,
                                "useMemo() result is unused",
                                "This useMemo() value is unused. useMemo() is for computing and \
                                 caching values, not for arbitrary side effects",
                            );
                        }
                    }
                }
            }
            stmt.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &CallExpr) {
            self.check_use_memo_call(call);
            call.visit_children_with(self);
        }
    }

    let mut finder = Finder {
        parent_bindings,
        function_like_bindings,
        validate_no_void_use_memo,
        errors: Vec::new(),
    };
    body.visit_with(&mut finder);

    if finder.errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError {
            details: finder.errors,
        })
    }
}

#[derive(Clone)]
enum FunctionLike {
    Function(swc_ecma_ast::Function),
    Arrow(ArrowExpr),
}

impl FunctionLike {
    fn span(&self) -> swc_common::Span {
        match self {
            Self::Function(function) => function.span,
            Self::Arrow(arrow) => arrow.span,
        }
    }

    fn params_len(&self) -> usize {
        match self {
            Self::Function(function) => function.params.len(),
            Self::Arrow(arrow) => arrow.params.len(),
        }
    }

    fn first_param_span(&self) -> Option<swc_common::Span> {
        match self {
            Self::Function(function) => function.params.first().map(|param| param.span),
            Self::Arrow(arrow) => arrow.params.first().map(Spanned::span),
        }
    }

    fn is_async(&self) -> bool {
        match self {
            Self::Function(function) => function.is_async,
            Self::Arrow(arrow) => arrow.is_async,
        }
    }

    fn is_generator(&self) -> bool {
        match self {
            Self::Function(function) => function.is_generator,
            Self::Arrow(arrow) => arrow.is_generator,
        }
    }
}

fn resolve_callback_like(
    expr: &Expr,
    function_like_bindings: &HashMap<String, FunctionLike>,
) -> Option<FunctionLike> {
    match expr {
        Expr::Fn(FnExpr { function, .. }) => Some(FunctionLike::Function(*function.clone())),
        Expr::Arrow(arrow) => Some(FunctionLike::Arrow(arrow.clone())),
        Expr::Ident(ident) => function_like_bindings.get(ident.sym.as_ref()).cloned(),
        _ => None,
    }
}

fn is_use_memo_call(call: &CallExpr) -> bool {
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };

    match &**callee {
        Expr::Ident(ident) => ident.sym == "useMemo",
        Expr::Member(member) => match &member.prop {
            swc_ecma_ast::MemberProp::Ident(prop) => prop.sym == "useMemo",
            _ => false,
        },
        _ => false,
    }
}

fn collect_function_like_bindings(body: &BlockStmt) -> HashMap<String, FunctionLike> {
    let mut out = HashMap::new();
    for stmt in &body.stmts {
        if let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt {
            for decl in &var_decl.decls {
                let Pat::Ident(binding) = &decl.name else {
                    continue;
                };
                let Some(init) = &decl.init else {
                    continue;
                };
                match &**init {
                    Expr::Fn(fn_expr) => {
                        out.insert(
                            binding.id.sym.to_string(),
                            FunctionLike::Function(*fn_expr.function.clone()),
                        );
                    }
                    Expr::Arrow(arrow) => {
                        out.insert(
                            binding.id.sym.to_string(),
                            FunctionLike::Arrow(arrow.clone()),
                        );
                    }
                    _ => {}
                }
            }
        }
    }
    out
}

fn has_non_void_return(function_like: &FunctionLike) -> bool {
    struct ReturnFinder {
        has_non_void_return: bool,
    }

    impl Visit for ReturnFinder {
        fn visit_return_stmt(&mut self, stmt: &swc_ecma_ast::ReturnStmt) {
            if stmt.arg.is_some() {
                self.has_non_void_return = true;
            }
        }

        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Do not traverse nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Do not traverse nested functions.
        }
    }

    match function_like {
        FunctionLike::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::Expr(_) => true,
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                let mut finder = ReturnFinder {
                    has_non_void_return: false,
                };
                block.visit_with(&mut finder);
                finder.has_non_void_return
            }
        },
        FunctionLike::Function(function) => {
            let Some(body) = function.body.as_ref() else {
                return false;
            };
            let mut finder = ReturnFinder {
                has_non_void_return: false,
            };
            body.visit_with(&mut finder);
            finder.has_non_void_return
        }
    }
}

fn assigns_outer_context(function_like: &FunctionLike, parent_bindings: &HashSet<String>) -> bool {
    let mut local_bindings = HashSet::new();
    match function_like {
        FunctionLike::Function(function) => {
            for param in &function.params {
                collect_pat_bindings(&param.pat, &mut local_bindings);
            }
            if let Some(body) = &function.body {
                for stmt in &body.stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
            }
        }
        FunctionLike::Arrow(arrow) => {
            for param in &arrow.params {
                collect_pat_bindings(param, &mut local_bindings);
            }
            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) = &*arrow.body {
                for stmt in &body.stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
            }
        }
    }

    struct AssignFinder<'a> {
        parent_bindings: &'a HashSet<String>,
        local_bindings: &'a HashSet<String>,
        assigns_outer: bool,
    }

    impl Visit for AssignFinder<'_> {
        fn visit_assign_expr(&mut self, expr: &AssignExpr) {
            if let Some(name) = assign_target_ident_name(&expr.left) {
                if self.parent_bindings.contains(name) && !self.local_bindings.contains(name) {
                    self.assigns_outer = true;
                }
            }
            expr.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, expr: &UpdateExpr) {
            if let Expr::Ident(ident) = &*expr.arg {
                let name = ident.sym.as_ref();
                if self.parent_bindings.contains(name) && !self.local_bindings.contains(name) {
                    self.assigns_outer = true;
                }
            }
            expr.visit_children_with(self);
        }

        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Do not traverse nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Do not traverse nested functions.
        }
    }

    let mut finder = AssignFinder {
        parent_bindings,
        local_bindings: &local_bindings,
        assigns_outer: false,
    };
    match function_like {
        FunctionLike::Function(function) => {
            if let Some(body) = &function.body {
                body.visit_with(&mut finder);
            }
        }
        FunctionLike::Arrow(arrow) => {
            arrow.visit_with(&mut finder);
        }
    }
    finder.assigns_outer
}

fn assign_target_ident_name(target: &AssignTarget) -> Option<&str> {
    match target {
        AssignTarget::Simple(simple) => match simple {
            swc_ecma_ast::SimpleAssignTarget::Ident(binding) => Some(binding.id.sym.as_ref()),
            _ => None,
        },
        AssignTarget::Pat(_) => None,
    }
}

fn collect_local_bindings(hir: &HirFunction) -> HashSet<String> {
    let mut out = HashSet::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut out);
    }
    if let Some(body) = &hir.function.body {
        for stmt in &body.stmts {
            collect_stmt_bindings(stmt, &mut out);
        }
    }
    out
}

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) => {
            for decl in &var_decl.decls {
                collect_var_decl_bindings(decl, out);
            }
        }
        Stmt::Decl(swc_ecma_ast::Decl::Fn(fn_decl)) => {
            out.insert(fn_decl.ident.sym.to_string());
        }
        Stmt::Decl(swc_ecma_ast::Decl::Class(class_decl)) => {
            out.insert(class_decl.ident.sym.to_string());
        }
        _ => {}
    }
}

fn collect_var_decl_bindings(decl: &VarDeclarator, out: &mut HashSet<String>) {
    collect_pat_bindings(&decl.name, out);
}

fn collect_pat_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pat_bindings(elem, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.id.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_pat_bindings(&key_value.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pat_bindings(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_pat_bindings(&assign.left, out),
        Pat::Rest(rest) => collect_pat_bindings(&rest.arg, out),
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}
