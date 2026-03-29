use std::collections::{HashMap, HashSet};

use swc_common::Span;
use swc_ecma_ast::{
    ArrowExpr, BlockStmt, CallExpr, Callee, Expr, ExprOrSpread, Function, MemberExpr, MemberProp,
    OptChainBase, OptChainExpr, Pat, Stmt, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::hir::HirFunction;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum HookCallKind {
    Memo,
    Callback,
    Effect,
}

#[derive(Debug, Clone)]
pub enum ManualDeps {
    Absent,
    Parsed(Vec<Dependency>),
    Unsupported,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Dependency {
    pub root: String,
    pub path: Vec<String>,
    pub span: Span,
}

#[derive(Clone)]
pub enum FunctionLike {
    Function(Function),
    Arrow(ArrowExpr),
}

impl FunctionLike {
    pub fn as_expr(&self) -> Expr {
        match self {
            Self::Function(function) => Expr::Fn(swc_ecma_ast::FnExpr {
                ident: None,
                function: Box::new(function.clone()),
            }),
            Self::Arrow(arrow) => Expr::Arrow(arrow.clone()),
        }
    }
}

pub fn format_dependency(dep: &Dependency) -> String {
    if dep.path.is_empty() {
        dep.root.clone()
    } else {
        format!("{}.{}", dep.root, dep.path.join("."))
    }
}

pub fn dependency_prefix_match(prefix: &Dependency, full: &Dependency) -> bool {
    if prefix.root != full.root {
        return false;
    }
    if prefix.path.len() > full.path.len() {
        return false;
    }
    prefix
        .path
        .iter()
        .zip(full.path.iter())
        .all(|(lhs, rhs)| lhs == rhs)
}

pub fn is_probably_stable_dependency(dep: &Dependency, stable_bindings: &HashSet<String>) -> bool {
    if stable_bindings.contains(dep.root.as_str())
        && (dep.path.is_empty() || dep.path.iter().any(|segment| segment == "current"))
    {
        return true;
    }

    if dep.path.is_empty() {
        let root = dep.root.as_str();
        if root == "dispatch" {
            return true;
        }
        if let Some(stripped) = root.strip_prefix("set") {
            return stripped
                .chars()
                .next()
                .is_some_and(|ch| ch.is_ascii_uppercase());
        }
    }

    false
}

pub fn collect_stable_hook_bindings(body: &BlockStmt) -> HashSet<String> {
    let mut stable = HashSet::new();

    for stmt in &body.stmts {
        let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };

        for decl in &var_decl.decls {
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Call(call) = &**init else {
                continue;
            };

            if is_call_of(call, &["useRef", "useEffectEvent"]) {
                if let Pat::Ident(binding) = &decl.name {
                    stable.insert(binding.id.sym.to_string());
                }
                continue;
            }

            if is_call_of(call, &["useState", "useReducer", "useTransition"]) {
                let Pat::Array(array) = &decl.name else {
                    continue;
                };
                let Some(Some(second)) = array.elems.get(1) else {
                    continue;
                };
                let Pat::Ident(binding) = second else {
                    continue;
                };
                stable.insert(binding.id.sym.to_string());
            }
        }
    }

    stable
}

pub fn collect_top_level_bindings(hir: &HirFunction) -> HashSet<String> {
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

pub fn collect_function_like_bindings(body: &BlockStmt) -> HashMap<String, FunctionLike> {
    let mut out = HashMap::new();
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

pub fn resolve_callback_expr(
    callback: &Expr,
    function_like_bindings: &HashMap<String, FunctionLike>,
) -> Option<Expr> {
    match callback {
        Expr::Fn(_) | Expr::Arrow(_) => Some(callback.clone()),
        Expr::Ident(ident) => function_like_bindings
            .get(ident.sym.as_ref())
            .map(FunctionLike::as_expr),
        _ => None,
    }
}

pub fn hook_call_kind(call: &CallExpr) -> Option<HookCallKind> {
    let Callee::Expr(callee) = &call.callee else {
        return None;
    };
    hook_call_kind_from_expr(callee)
}

pub fn parse_manual_dependencies(
    arg: Option<&ExprOrSpread>,
    outer_bindings: &HashSet<String>,
) -> ManualDeps {
    let Some(arg) = arg else {
        return ManualDeps::Absent;
    };
    if arg.spread.is_some() {
        return ManualDeps::Unsupported;
    }
    let Expr::Array(array) = &*arg.expr else {
        return ManualDeps::Unsupported;
    };
    let mut deps = Vec::with_capacity(array.elems.len());
    for item in &array.elems {
        let Some(item) = item else {
            continue;
        };
        if item.spread.is_some() {
            return ManualDeps::Unsupported;
        }
        let Some(mut dep) = dependency_from_expr(&item.expr) else {
            return ManualDeps::Unsupported;
        };
        if !outer_bindings.contains(dep.root.as_str()) {
            // Keep globals stable; they'll be treated as extra if explicitly listed.
            dep.path.clear();
        }
        deps.push(dep);
    }
    ManualDeps::Parsed(deps)
}

pub fn collect_callback_dependencies(
    callback_expr: &Expr,
    outer_bindings: &HashSet<String>,
) -> Vec<Dependency> {
    let mut local_bindings = HashSet::new();
    match callback_expr {
        Expr::Fn(fn_expr) => {
            for param in &fn_expr.function.params {
                collect_pat_bindings(&param.pat, &mut local_bindings);
            }
            if let Some(body) = &fn_expr.function.body {
                for stmt in &body.stmts {
                    collect_stmt_bindings(stmt, &mut local_bindings);
                }
            }
        }
        Expr::Arrow(arrow) => {
            for param in &arrow.params {
                collect_pat_bindings(param, &mut local_bindings);
            }
            match &*arrow.body {
                swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) => {
                    for stmt in &block.stmts {
                        collect_stmt_bindings(stmt, &mut local_bindings);
                    }
                }
                swc_ecma_ast::BlockStmtOrExpr::Expr(_) => {}
            }
        }
        _ => return Vec::new(),
    }

    struct Collector<'a> {
        outer_bindings: &'a HashSet<String>,
        local_bindings: &'a HashSet<String>,
        deps: Vec<Dependency>,
    }

    impl Collector<'_> {
        fn maybe_push(&mut self, dep: Dependency) {
            if !self.outer_bindings.contains(dep.root.as_str()) {
                return;
            }
            if self.local_bindings.contains(dep.root.as_str()) {
                return;
            }
            if self
                .deps
                .iter()
                .any(|item| item.root == dep.root && item.path == dep.path)
            {
                return;
            }
            self.deps.push(dep);
        }
    }

    impl Visit for Collector<'_> {
        fn visit_call_expr(&mut self, call: &CallExpr) {
            if let Callee::Expr(callee) = &call.callee {
                if let Some((root, span)) = root_dependency_from_call_callee(callee) {
                    self.maybe_push(Dependency {
                        root,
                        path: Vec::new(),
                        span,
                    });
                }
            }

            for arg in &call.args {
                arg.visit_with(self);
            }
        }

        fn visit_opt_chain_expr(&mut self, chain: &OptChainExpr) {
            if let OptChainBase::Call(call) = &*chain.base {
                if let Some((root, span)) = root_dependency_from_call_callee(&call.callee) {
                    self.maybe_push(Dependency {
                        root,
                        path: Vec::new(),
                        span,
                    });
                }
                for arg in &call.args {
                    arg.visit_with(self);
                }
                return;
            }
            chain.visit_children_with(self);
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(mut dep) = dependency_from_expr(&Expr::Member(member.clone())) {
                if dep.path.last().is_some_and(|segment| segment == "current") {
                    dep.path.pop();
                }
                self.maybe_push(dep);
                return;
            }
            member.visit_children_with(self);
        }

        fn visit_ident(&mut self, ident: &swc_ecma_ast::Ident) {
            self.maybe_push(Dependency {
                root: ident.sym.to_string(),
                path: Vec::new(),
                span: ident.span,
            });
        }
    }

    let mut collector = Collector {
        outer_bindings,
        local_bindings: &local_bindings,
        deps: Vec::new(),
    };
    callback_expr.visit_with(&mut collector);
    collector.deps
}

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(decl) => match decl {
            swc_ecma_ast::Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    collect_var_declarator_bindings(decl, out);
                }
            }
            swc_ecma_ast::Decl::Fn(fn_decl) => {
                out.insert(fn_decl.ident.sym.to_string());
            }
            swc_ecma_ast::Decl::Class(class_decl) => {
                out.insert(class_decl.ident.sym.to_string());
            }
            _ => {}
        },
        Stmt::Block(block) => {
            for stmt in &block.stmts {
                collect_stmt_bindings(stmt, out);
            }
        }
        Stmt::If(if_stmt) => {
            collect_stmt_bindings(&if_stmt.cons, out);
            if let Some(alt) = &if_stmt.alt {
                collect_stmt_bindings(alt, out);
            }
        }
        Stmt::For(for_stmt) => {
            if let Some(init) = &for_stmt.init {
                match init {
                    swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                        for decl in &var_decl.decls {
                            collect_var_declarator_bindings(decl, out);
                        }
                    }
                    swc_ecma_ast::VarDeclOrExpr::Expr(_) => {}
                }
            }
            collect_stmt_bindings(&for_stmt.body, out);
        }
        Stmt::ForIn(for_in_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_in_stmt.left {
                for decl in &var_decl.decls {
                    collect_var_declarator_bindings(decl, out);
                }
            }
            collect_stmt_bindings(&for_in_stmt.body, out);
        }
        Stmt::ForOf(for_of_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_of_stmt.left {
                for decl in &var_decl.decls {
                    collect_var_declarator_bindings(decl, out);
                }
            }
            collect_stmt_bindings(&for_of_stmt.body, out);
        }
        Stmt::While(while_stmt) => {
            collect_stmt_bindings(&while_stmt.body, out);
        }
        Stmt::DoWhile(do_while_stmt) => {
            collect_stmt_bindings(&do_while_stmt.body, out);
        }
        Stmt::Switch(switch_stmt) => {
            for case in &switch_stmt.cases {
                for stmt in &case.cons {
                    collect_stmt_bindings(stmt, out);
                }
            }
        }
        Stmt::Try(try_stmt) => {
            for stmt in &try_stmt.block.stmts {
                collect_stmt_bindings(stmt, out);
            }
            if let Some(handler) = &try_stmt.handler {
                if let Some(param) = &handler.param {
                    collect_pat_bindings(param, out);
                }
                for stmt in &handler.body.stmts {
                    collect_stmt_bindings(stmt, out);
                }
            }
            if let Some(finalizer) = &try_stmt.finalizer {
                for stmt in &finalizer.stmts {
                    collect_stmt_bindings(stmt, out);
                }
            }
        }
        _ => {}
    }
}

fn collect_var_declarator_bindings(decl: &VarDeclarator, out: &mut HashSet<String>) {
    collect_pat_bindings(&decl.name, out);
}

fn collect_pat_bindings(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for element in array.elems.iter().flatten() {
                collect_pat_bindings(element, out);
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
        Pat::Assign(assign) => {
            collect_pat_bindings(&assign.left, out);
        }
        Pat::Rest(rest) => {
            collect_pat_bindings(&rest.arg, out);
        }
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

fn hook_call_kind_from_expr(callee: &Expr) -> Option<HookCallKind> {
    match callee {
        Expr::Ident(ident) => hook_kind_from_name(ident.sym.as_ref()),
        Expr::Member(member) => member_name(member).and_then(hook_kind_from_name),
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Call(call) => hook_call_kind_from_expr(&call.callee),
            OptChainBase::Member(member) => member_name(member).and_then(hook_kind_from_name),
        },
        _ => None,
    }
}

fn is_call_of(call: &CallExpr, names: &[&str]) -> bool {
    let Callee::Expr(callee) = &call.callee else {
        return false;
    };
    let Some(name) = callee_name(callee) else {
        return false;
    };
    names.contains(&name)
}

fn callee_name(callee: &Expr) -> Option<&str> {
    match callee {
        Expr::Ident(ident) => Some(ident.sym.as_ref()),
        Expr::Member(member) => member_name(member),
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Call(call) => callee_name(&call.callee),
            OptChainBase::Member(member) => member_name(member),
        },
        _ => None,
    }
}

fn hook_kind_from_name(name: &str) -> Option<HookCallKind> {
    match name {
        "useMemo" => Some(HookCallKind::Memo),
        "useCallback" => Some(HookCallKind::Callback),
        "useEffect" | "useLayoutEffect" | "useInsertionEffect" => Some(HookCallKind::Effect),
        _ => None,
    }
}

fn root_dependency_from_call_callee(callee: &Expr) -> Option<(String, Span)> {
    let (root, _, span) = parse_dependency_parts(callee)?;
    Some((root, span))
}

fn dependency_from_expr(expr: &Expr) -> Option<Dependency> {
    let (root, path, span) = parse_dependency_parts(expr)?;
    Some(Dependency { root, path, span })
}

fn parse_dependency_parts(expr: &Expr) -> Option<(String, Vec<String>, Span)> {
    match expr {
        Expr::Ident(ident) => Some((ident.sym.to_string(), Vec::new(), ident.span)),
        Expr::Paren(paren) => parse_dependency_parts(&paren.expr),
        Expr::Member(member) => {
            let (root, mut path, span) = parse_dependency_parts(&member.obj)?;
            let segment = member_prop_to_segment(&member.prop)?;
            path.push(segment);
            Some((root, path, span))
        }
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Member(member) => parse_dependency_parts(&Expr::Member(member.clone())),
            OptChainBase::Call(call) => parse_dependency_parts(&call.callee),
        },
        _ => None,
    }
}

fn member_name(member: &MemberExpr) -> Option<&str> {
    match &member.prop {
        MemberProp::Ident(prop) => Some(prop.sym.as_ref()),
        MemberProp::Computed(computed) => {
            let Expr::Lit(swc_ecma_ast::Lit::Str(value)) = &*computed.expr else {
                return None;
            };
            value.value.as_str()
        }
        MemberProp::PrivateName(_) => None,
    }
}

fn member_prop_to_segment(prop: &MemberProp) -> Option<String> {
    match prop {
        MemberProp::Ident(ident) => Some(ident.sym.to_string()),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Ident(ident) => Some(ident.sym.to_string()),
            Expr::Lit(swc_ecma_ast::Lit::Str(value)) => {
                Some(value.value.to_string_lossy().into_owned())
            }
            Expr::Lit(swc_ecma_ast::Lit::Num(value)) => Some(value.value.to_string()),
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
    }
}
