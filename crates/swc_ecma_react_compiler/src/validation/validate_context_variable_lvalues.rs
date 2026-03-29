use std::collections::{HashMap, HashSet};

use swc_common::Spanned;
use swc_ecma_ast::{
    op, AssignExpr, AssignTarget, Callee, Expr, MemberExpr, MemberProp, Pat, Stmt, UpdateExpr,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    hir::HirFunction,
    utils::is_hook_name,
};

const GLOBAL_REASSIGN_REASON: &str =
    "Cannot reassign variables declared outside of the component/hook";
const FROZEN_VALUE_REASON: &str = "This value cannot be modified";
const FROZEN_JSX_DESCRIPTION: &str = "Modifying a value used previously in JSX is not allowed. \
                                      Consider moving the modification before the JSX.";
const FROZEN_PROP_DESCRIPTION: &str = "Modifying component props or hook arguments is not \
                                       allowed. Consider using a local variable instead.";
const HOOK_RETURN_MUTATION_DESCRIPTION: &str = "Modifying a value returned from a hook is not \
                                                allowed. Consider moving the modification into \
                                                the hook where the value is constructed.";
const GLOBAL_MUTATION_DESCRIPTION: &str = "Modifying a variable defined outside a component or \
                                           hook is not allowed. Consider using an effect.";
const TODO_UPDATE_GLOBAL_REASON: &str =
    "Todo: (BuildHIR::lowerExpression) Support UpdateExpression where argument is a global";

pub fn validate_context_variable_lvalues(hir: &HirFunction) -> Result<(), CompilerError> {
    let Some(body) = hir.function.body.as_ref() else {
        return Ok(());
    };

    let mut params = HashSet::<String>::new();
    for param in &hir.function.params {
        collect_pat_bindings(&param.pat, &mut params);
    }
    let param_aliases = collect_param_aliases(body, &params);
    params.extend(param_aliases);

    let mut locals = params.clone();
    collect_block_bindings(body, &mut locals);
    let top_level_function_bindings = collect_top_level_function_bindings(body);
    let hook_return_bindings = collect_hook_return_bindings(body);

    let mut frozen_from_jsx = HashSet::<String>::new();
    let mut errors = Vec::<CompilerErrorDetail>::new();

    for stmt in &body.stmts {
        let mut mutations = Vec::<Mutation>::new();
        collect_stmt_mutations(stmt, &mut mutations);

        for mutation in &mutations {
            if params.contains(mutation.target.as_str()) {
                errors.push(modification_error(
                    mutation.span,
                    mutation.target.as_str(),
                    Some(FROZEN_PROP_DESCRIPTION),
                ));
                continue;
            }

            if hook_return_bindings.contains(mutation.target.as_str())
                && mutation.kind == MutationKind::Property
            {
                errors.push(modification_error(
                    mutation.span,
                    mutation.target.as_str(),
                    Some(HOOK_RETURN_MUTATION_DESCRIPTION),
                ));
                continue;
            }

            if frozen_from_jsx.contains(mutation.target.as_str()) {
                errors.push(modification_error(
                    mutation.span,
                    mutation.target.as_str(),
                    Some(FROZEN_JSX_DESCRIPTION),
                ));
                continue;
            }

            if !locals.contains(mutation.target.as_str()) && !is_known_global(&mutation.target) {
                match mutation.kind {
                    MutationKind::Direct => errors.push(global_reassign_error(mutation.span)),
                    MutationKind::Property => errors.push(modification_error(
                        mutation.span,
                        mutation.target.as_str(),
                        Some(GLOBAL_MUTATION_DESCRIPTION),
                    )),
                    MutationKind::GlobalUpdate => {
                        errors.push(global_update_todo_error(mutation.span))
                    }
                }
            }
        }

        let mut jsx_refs = HashSet::<String>::new();
        collect_jsx_refs(stmt, &mut jsx_refs);
        frozen_from_jsx.extend(jsx_refs);

        let mut render_invoked_names = HashSet::<String>::new();
        collect_render_invoked_function_names(stmt, &mut render_invoked_names);
        for name in render_invoked_names {
            let Some(function_like) = top_level_function_bindings.get(name.as_str()) else {
                continue;
            };
            let mut fn_mutations = Vec::<Mutation>::new();
            collect_function_like_mutations(function_like, &mut fn_mutations);
            for mutation in fn_mutations {
                if params.contains(mutation.target.as_str()) {
                    errors.push(modification_error(
                        mutation.span,
                        mutation.target.as_str(),
                        Some(FROZEN_PROP_DESCRIPTION),
                    ));
                    continue;
                }
                if !locals.contains(mutation.target.as_str()) && !is_known_global(&mutation.target)
                {
                    match mutation.kind {
                        MutationKind::Direct => errors.push(global_reassign_error(mutation.span)),
                        MutationKind::Property => errors.push(modification_error(
                            mutation.span,
                            mutation.target.as_str(),
                            Some(GLOBAL_MUTATION_DESCRIPTION),
                        )),
                        MutationKind::GlobalUpdate => {
                            errors.push(global_update_todo_error(mutation.span))
                        }
                    }
                }
            }
        }
    }

    collect_effect_callback_param_mutation_errors(body, &params, &mut errors);

    if errors.is_empty() {
        Ok(())
    } else {
        Err(CompilerError { details: errors })
    }
}

#[derive(Debug, Clone)]
struct Mutation {
    target: String,
    span: swc_common::Span,
    kind: MutationKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum MutationKind {
    Direct,
    Property,
    GlobalUpdate,
}

fn global_reassign_error(span: swc_common::Span) -> CompilerErrorDetail {
    let mut detail =
        CompilerErrorDetail::error(ErrorCategory::Immutability, GLOBAL_REASSIGN_REASON);
    detail.loc = Some(span);
    detail
}

fn global_update_todo_error(span: swc_common::Span) -> CompilerErrorDetail {
    let mut detail = CompilerErrorDetail::error(ErrorCategory::Todo, TODO_UPDATE_GLOBAL_REASON);
    detail.loc = Some(span);
    detail
}

fn modification_error(
    span: swc_common::Span,
    target: &str,
    description: Option<&str>,
) -> CompilerErrorDetail {
    let mut detail = CompilerErrorDetail::error(ErrorCategory::Immutability, FROZEN_VALUE_REASON);
    detail.description = description.map(str::to_string);
    detail.loc = Some(span);
    if is_ref_like_name(target) {
        detail.suggestions = Some(vec!["If this value is a Ref (value returned by \
                                        `useRef()`), rename the variable to end in \"Ref\"."
            .to_string()]);
    }
    detail
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

fn collect_block_bindings(block: &swc_ecma_ast::BlockStmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Function-local mutability should not be affected by declarations
            // inside nested functions.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Function-local mutability should not be affected by declarations
            // inside nested functions.
        }

        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pat_bindings(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &swc_ecma_ast::FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
            // No recursion needed: nested declaration body is skipped by
            // `visit_function`.
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }
    }

    block.visit_with(&mut Finder { out });
}

fn collect_stmt_mutations(stmt: &Stmt, out: &mut Vec<Mutation>) {
    struct Finder<'a> {
        out: &'a mut Vec<Mutation>,
    }

    impl Finder<'_> {
        fn push(&mut self, target: &str, span: swc_common::Span, kind: MutationKind) {
            self.out.push(Mutation {
                target: target.to_string(),
                span,
                kind,
            });
        }
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {
            // Skip nested functions. Mutations inside callbacks may or may not
            // execute during render; this pass only validates direct render
            // statements conservatively.
        }

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {
            // Skip nested arrows for the same reason as above.
        }

        fn visit_assign_expr(&mut self, assign: &AssignExpr) {
            match &assign.left {
                AssignTarget::Simple(simple) => match simple {
                    swc_ecma_ast::SimpleAssignTarget::Ident(binding) => {
                        self.push(binding.id.sym.as_ref(), assign.span, MutationKind::Direct);
                    }
                    swc_ecma_ast::SimpleAssignTarget::Member(member) => {
                        if let Some(name) = member_root_ident(member) {
                            self.push(name, assign.span, MutationKind::Property);
                        }
                    }
                    _ => {}
                },
                AssignTarget::Pat(pat) => {
                    collect_assign_pat_targets(pat, self.out, assign.span);
                }
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &UpdateExpr) {
            match &*update.arg {
                Expr::Ident(ident) => {
                    self.push(ident.sym.as_ref(), update.span, MutationKind::GlobalUpdate);
                }
                Expr::Member(member) => {
                    if let Some(name) = member_root_ident(member) {
                        self.push(name, update.span, MutationKind::Property);
                    }
                }
                _ => {}
            }
            update.visit_children_with(self);
        }

        fn visit_unary_expr(&mut self, unary: &swc_ecma_ast::UnaryExpr) {
            if unary.op == op!("delete") {
                if let Expr::Member(member) = &*unary.arg {
                    if let Some(name) = member_root_ident(member) {
                        self.push(name, unary.span, MutationKind::Property);
                    }
                }
            }
            unary.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            if let Some(name) = mutating_method_target(call) {
                self.push(name, call.span, MutationKind::Property);
            }
            call.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Finder { out });
}

fn collect_assign_pat_targets(
    pat: &swc_ecma_ast::AssignTargetPat,
    out: &mut Vec<Mutation>,
    span: swc_common::Span,
) {
    match pat {
        swc_ecma_ast::AssignTargetPat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_mutation_targets_from_pat(elem, out, span);
            }
        }
        swc_ecma_ast::AssignTargetPat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.push(Mutation {
                            target: assign.key.id.sym.to_string(),
                            span,
                            kind: MutationKind::Direct,
                        });
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_mutation_targets_from_pat(&key_value.value, out, span);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_mutation_targets_from_pat(&rest.arg, out, span);
                    }
                }
            }
        }
        swc_ecma_ast::AssignTargetPat::Invalid(_) => {}
    }
}

fn collect_mutation_targets_from_pat(pat: &Pat, out: &mut Vec<Mutation>, span: swc_common::Span) {
    match pat {
        Pat::Ident(binding) => out.push(Mutation {
            target: binding.id.sym.to_string(),
            span,
            kind: MutationKind::Direct,
        }),
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_mutation_targets_from_pat(elem, out, span);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => out.push(Mutation {
                        target: assign.key.id.sym.to_string(),
                        span,
                        kind: MutationKind::Direct,
                    }),
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_mutation_targets_from_pat(&key_value.value, out, span);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_mutation_targets_from_pat(&rest.arg, out, span);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_mutation_targets_from_pat(&assign.left, out, span),
        Pat::Rest(rest) => collect_mutation_targets_from_pat(&rest.arg, out, span),
        Pat::Expr(expr) => match &**expr {
            Expr::Ident(ident) => out.push(Mutation {
                target: ident.sym.to_string(),
                span,
                kind: MutationKind::Direct,
            }),
            Expr::Member(member) => {
                if let Some(name) = member_root_ident(member) {
                    out.push(Mutation {
                        target: name.to_string(),
                        span,
                        kind: MutationKind::Property,
                    });
                }
            }
            _ => {}
        },
        Pat::Invalid(_) => {}
    }
}

fn member_root_ident(member: &MemberExpr) -> Option<&str> {
    match &*member.obj {
        Expr::Ident(ident) => Some(ident.sym.as_ref()),
        Expr::Member(inner) => member_root_ident(inner),
        _ => None,
    }
}

fn mutating_method_target(call: &swc_ecma_ast::CallExpr) -> Option<&str> {
    let Callee::Expr(callee) = &call.callee else {
        return None;
    };
    let Expr::Member(member) = &**callee else {
        return None;
    };
    let method = match &member.prop {
        MemberProp::Ident(ident) => ident.sym.as_ref(),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Lit(swc_ecma_ast::Lit::Str(value)) => value.value.as_str()?,
            _ => return None,
        },
        MemberProp::PrivateName(_) => return None,
    };

    if !matches!(
        method,
        "add"
            | "clear"
            | "copyWithin"
            | "delete"
            | "fill"
            | "pop"
            | "push"
            | "reverse"
            | "set"
            | "shift"
            | "sort"
            | "splice"
            | "unshift"
    ) {
        return None;
    }

    member_root_ident(member)
}

fn collect_jsx_refs(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
        in_jsx: bool,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_jsx_element(&mut self, element: &swc_ecma_ast::JSXElement) {
            let prev = self.in_jsx;
            self.in_jsx = true;
            element.visit_children_with(self);
            self.in_jsx = prev;
        }

        fn visit_jsx_fragment(&mut self, fragment: &swc_ecma_ast::JSXFragment) {
            let prev = self.in_jsx;
            self.in_jsx = true;
            fragment.visit_children_with(self);
            self.in_jsx = prev;
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.in_jsx {
                match expr {
                    Expr::Ident(ident) => {
                        self.out.insert(ident.sym.to_string());
                    }
                    Expr::Member(member) => {
                        if let Some(name) = member_root_ident(member) {
                            self.out.insert(name.to_string());
                        }
                    }
                    _ => {}
                }
            }
            expr.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Finder { out, in_jsx: false });
}

fn is_known_global(name: &str) -> bool {
    matches!(
        name,
        "globalThis"
            | "global"
            | "window"
            | "document"
            | "console"
            | "Math"
            | "Date"
            | "JSON"
            | "Number"
            | "String"
            | "Boolean"
            | "Object"
            | "Array"
            | "Map"
            | "Set"
            | "WeakMap"
            | "WeakSet"
            | "Promise"
            | "Symbol"
            | "Intl"
            | "Reflect"
            | "Proxy"
            | "RegExp"
            | "Error"
            | "TypeError"
            | "RangeError"
            | "URL"
            | "URLSearchParams"
            | "NaN"
            | "Infinity"
            | "undefined"
    )
}

#[derive(Debug, Clone)]
enum FunctionLike {
    Function(swc_ecma_ast::Function),
    Arrow(swc_ecma_ast::ArrowExpr),
}

fn collect_top_level_function_bindings(
    body: &swc_ecma_ast::BlockStmt,
) -> HashMap<String, FunctionLike> {
    let mut out = HashMap::<String, FunctionLike>::new();

    for stmt in &body.stmts {
        let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };

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

    out
}

fn collect_hook_return_bindings(body: &swc_ecma_ast::BlockStmt) -> HashSet<String> {
    let mut out = HashSet::<String>::new();

    for stmt in &body.stmts {
        let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };

        for decl in &var_decl.decls {
            let Pat::Ident(binding) = &decl.name else {
                continue;
            };
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Call(call) = &**init else {
                continue;
            };
            let Callee::Expr(callee) = &call.callee else {
                continue;
            };

            let hook_name = match &**callee {
                Expr::Ident(ident) => Some(ident.sym.as_ref()),
                Expr::Member(member) => match &member.prop {
                    MemberProp::Ident(prop) => Some(prop.sym.as_ref()),
                    _ => None,
                },
                _ => None,
            };

            if hook_name.is_some_and(|name| is_hook_name(name) && name != "useRef") {
                out.insert(binding.id.sym.to_string());
            }
        }
    }

    out
}

fn collect_param_aliases(
    body: &swc_ecma_ast::BlockStmt,
    params: &HashSet<String>,
) -> HashSet<String> {
    let mut out = HashSet::<String>::new();

    for stmt in &body.stmts {
        let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };
        if !matches!(var_decl.kind, swc_ecma_ast::VarDeclKind::Const) {
            continue;
        }
        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            if !init_aliases_param(init, params) {
                continue;
            }
            collect_pat_bindings(&decl.name, &mut out);
        }
    }

    out
}

fn init_aliases_param(init: &Expr, params: &HashSet<String>) -> bool {
    match init {
        Expr::Ident(ident) => params.contains(ident.sym.as_ref()),
        Expr::Cond(cond) => match &*cond.alt {
            Expr::Ident(ident) => params.contains(ident.sym.as_ref()),
            _ => false,
        },
        _ => false,
    }
}

fn collect_function_like_mutations(function_like: &FunctionLike, out: &mut Vec<Mutation>) {
    match function_like {
        FunctionLike::Function(function) => {
            let Some(body) = function.body.as_ref() else {
                return;
            };
            for stmt in &body.stmts {
                collect_stmt_mutations(stmt, out);
            }
        }
        FunctionLike::Arrow(arrow) => match &*arrow.body {
            swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) => {
                for stmt in &body.stmts {
                    collect_stmt_mutations(stmt, out);
                }
            }
            swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
                let stmt = Stmt::Expr(swc_ecma_ast::ExprStmt {
                    span: expr.span(),
                    expr: expr.clone(),
                });
                collect_stmt_mutations(&stmt, out);
            }
        },
    }
}

fn collect_render_invoked_function_names(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Finder<'a> {
        out: &'a mut HashSet<String>,
        jsx_attr_depth: usize,
        jsx_child_expr_depth: usize,
    }

    impl Visit for Finder<'_> {
        fn visit_function(&mut self, _: &swc_ecma_ast::Function) {}

        fn visit_arrow_expr(&mut self, _: &swc_ecma_ast::ArrowExpr) {}

        fn visit_jsx_opening_element(&mut self, opening: &swc_ecma_ast::JSXOpeningElement) {
            if let swc_ecma_ast::JSXElementName::Ident(ident) = &opening.name {
                self.out.insert(ident.sym.to_string());
            }
            opening.visit_children_with(self);
        }

        fn visit_jsx_attr(&mut self, attr: &swc_ecma_ast::JSXAttr) {
            self.jsx_attr_depth += 1;
            attr.visit_children_with(self);
            self.jsx_attr_depth -= 1;
        }

        fn visit_jsx_expr_container(&mut self, expr: &swc_ecma_ast::JSXExprContainer) {
            if self.jsx_attr_depth == 0 {
                self.jsx_child_expr_depth += 1;
                expr.visit_children_with(self);
                self.jsx_child_expr_depth -= 1;
                return;
            }
            expr.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            if self.jsx_child_expr_depth > 0 {
                self.out.insert(ident.sym.to_string());
            }
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if self.jsx_child_expr_depth > 0 {
                if let Some(root) = member_root_ident(member) {
                    self.out.insert(root.to_string());
                }
            }
            member.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Finder {
        out,
        jsx_attr_depth: 0,
        jsx_child_expr_depth: 0,
    });
}

fn collect_effect_callback_param_mutation_errors(
    body: &swc_ecma_ast::BlockStmt,
    params: &HashSet<String>,
    errors: &mut Vec<CompilerErrorDetail>,
) {
    struct Finder<'a> {
        params: &'a HashSet<String>,
        errors: &'a mut Vec<CompilerErrorDetail>,
    }

    impl Finder<'_> {
        fn inspect_effect_callback_arg(&mut self, arg: &Expr) {
            let mut mutations = Vec::<Mutation>::new();
            match arg {
                Expr::Fn(fn_expr) => {
                    if let Some(body) = fn_expr.function.body.as_ref() {
                        for stmt in &body.stmts {
                            collect_stmt_mutations(stmt, &mut mutations);
                        }
                    }
                }
                Expr::Arrow(arrow) => match &*arrow.body {
                    swc_ecma_ast::BlockStmtOrExpr::BlockStmt(body) => {
                        for stmt in &body.stmts {
                            collect_stmt_mutations(stmt, &mut mutations);
                        }
                    }
                    swc_ecma_ast::BlockStmtOrExpr::Expr(expr) => {
                        let stmt = Stmt::Expr(swc_ecma_ast::ExprStmt {
                            span: expr.span(),
                            expr: expr.clone(),
                        });
                        collect_stmt_mutations(&stmt, &mut mutations);
                    }
                },
                _ => return,
            }

            for mutation in mutations {
                if self.params.contains(mutation.target.as_str()) {
                    self.errors.push(modification_error(
                        mutation.span,
                        mutation.target.as_str(),
                        Some(FROZEN_PROP_DESCRIPTION),
                    ));
                }
            }
        }
    }

    impl Visit for Finder<'_> {
        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            let Callee::Expr(callee) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let effect_like = match &**callee {
                Expr::Ident(ident) => matches!(
                    ident.sym.as_ref(),
                    "useEffect" | "useLayoutEffect" | "useInsertionEffect"
                ),
                Expr::Member(member) => match &member.prop {
                    MemberProp::Ident(ident) => matches!(
                        ident.sym.as_ref(),
                        "useEffect" | "useLayoutEffect" | "useInsertionEffect"
                    ),
                    _ => false,
                },
                _ => false,
            };

            if effect_like {
                if let Some(first) = call.args.first() {
                    if first.spread.is_none() {
                        self.inspect_effect_callback_arg(&first.expr);
                    }
                }
            }

            call.visit_children_with(self);
        }
    }

    body.visit_with(&mut Finder { params, errors });
}

fn is_ref_like_name(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    lower == "ref" || lower.ends_with("ref")
}
