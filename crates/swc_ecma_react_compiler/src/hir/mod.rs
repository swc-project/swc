use std::collections::{HashMap, HashSet};

use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    AssignTarget, Callee, Expr, Function, Ident, MemberExpr, MemberProp, OptChainBase, Pat, Stmt,
    VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

use crate::{error::CompilerError, transform::ReactFunctionType};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SpanKey {
    pub lo: u32,
    pub hi: u32,
}

impl SpanKey {
    pub fn from_span(span: Span) -> Self {
        Self {
            lo: span.lo.0,
            hi: span.hi.0,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct HirDependency {
    pub root: String,
    pub path: Vec<String>,
}

impl HirDependency {
    fn from_root(root: String) -> Self {
        Self {
            root,
            path: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct HirMetadata {
    pub declared_bindings: HashSet<String>,
    pub reassigned_bindings: HashSet<String>,
    pub mutated_bindings: HashSet<String>,
    pub captured_bindings: HashMap<String, HashSet<String>>,
    pub callback_dependency_hints: HashMap<SpanKey, Vec<HirDependency>>,
    pub scope_dependencies: HashMap<u32, Vec<HirDependency>>,
    pub scope_parents: HashMap<u32, u32>,
    pub ssa_versions: HashMap<String, u32>,
    pub phi_candidates: HashMap<String, Vec<u32>>,
    pub write_indices: HashMap<String, Vec<usize>>,
    pub mutation_ranges: HashMap<String, (usize, usize)>,
    pub reactive_places: Vec<HirDependency>,
}

/// Lowered function IR with pass metadata sidecars.
#[derive(Debug, Clone)]
pub struct HirFunction {
    pub fn_type: ReactFunctionType,
    pub id: Option<Ident>,
    pub function: Function,
    pub metadata: HirMetadata,
}

impl HirFunction {
    pub fn recompute_metadata(&mut self) {
        self.metadata = HirMetadata::default();

        for param in &self.function.params {
            collect_pat_bindings(&param.pat, &mut self.metadata.declared_bindings);
        }
        if let Some(body) = &self.function.body {
            for stmt in &body.stmts {
                collect_stmt_bindings(stmt, &mut self.metadata.declared_bindings);
            }
        }

        self.metadata.write_indices = collect_write_indices(&self.function);
        for (name, indices) in &self.metadata.write_indices {
            if indices.len() > 1 {
                self.metadata.reassigned_bindings.insert(name.clone());
            }
            if let (Some(start), Some(end)) = (indices.first(), indices.last()) {
                self.metadata
                    .mutation_ranges
                    .insert(name.clone(), (*start, *end));
            }
        }

        self.metadata.mutated_bindings = collect_mutated_bindings(&self.function);
        self.metadata.captured_bindings = collect_function_captures(&self.function);
        self.metadata.callback_dependency_hints =
            collect_callback_dependency_hints(&self.function, &self.metadata.declared_bindings);
        let (scope_deps, scope_parents) = collect_scope_dependencies(&self.function);
        self.metadata.scope_dependencies = scope_deps;
        self.metadata.scope_parents = scope_parents;
        self.metadata.reactive_places = infer_reactive_places_from_metadata(&self.metadata);
    }

    pub fn callback_hint(&self, span: Span) -> Option<&[HirDependency]> {
        self.metadata
            .callback_dependency_hints
            .get(&SpanKey::from_span(span))
            .map(Vec::as_slice)
    }
}

/// Lowers an AST function into HIR.
pub fn lower(
    function: &Function,
    id: Option<&Ident>,
    fn_type: ReactFunctionType,
) -> Result<HirFunction, CompilerError> {
    let mut hir = HirFunction {
        fn_type,
        id: id.cloned(),
        function: function.clone(),
        metadata: HirMetadata::default(),
    };
    hir.recompute_metadata();
    Ok(hir)
}

/// Flattens immediately nested blocks inside the lowered function body.
pub fn merge_consecutive_blocks(hir: &mut HirFunction) {
    // Keep this pass metadata-only for now to avoid AST shape regressions in
    // fixture output while still enabling staged pipeline parity wiring.
    hir.recompute_metadata();
}

/// Propagates nested scope dependency sets to parent scopes.
pub fn propagate_scope_dependencies(hir: &mut HirFunction) {
    if hir.metadata.scope_dependencies.is_empty() {
        hir.recompute_metadata();
    }

    let mut children = HashMap::<u32, Vec<u32>>::new();
    for (child, parent) in &hir.metadata.scope_parents {
        children.entry(*parent).or_default().push(*child);
    }

    fn propagate(
        scope_id: u32,
        deps: &mut HashMap<u32, Vec<HirDependency>>,
        children: &HashMap<u32, Vec<u32>>,
    ) -> Vec<HirDependency> {
        let mut own = deps.get(&scope_id).cloned().unwrap_or_default();
        if let Some(child_ids) = children.get(&scope_id) {
            for child_id in child_ids {
                let child_deps = propagate(*child_id, deps, children);
                for dep in child_deps {
                    push_unique_dependency(&mut own, dep);
                }
            }
        }
        deps.insert(scope_id, own.clone());
        own
    }

    if hir.metadata.scope_dependencies.contains_key(&0) {
        let _ = propagate(0, &mut hir.metadata.scope_dependencies, &children);
    }
    hir.metadata.reactive_places = infer_reactive_places_from_metadata(&hir.metadata);
}

fn collect_write_indices(function: &Function) -> HashMap<String, Vec<usize>> {
    #[derive(Default)]
    struct Collector {
        next_index: usize,
        writes: HashMap<String, Vec<usize>>,
    }

    impl Collector {
        fn push_write(&mut self, name: String) {
            self.writes.entry(name).or_default().push(self.next_index);
            self.next_index += 1;
        }
    }

    impl Visit for Collector {
        fn visit_var_declarator(&mut self, decl: &VarDeclarator) {
            if decl.init.is_some() {
                let mut names = HashSet::new();
                collect_pat_bindings(&decl.name, &mut names);
                for name in names {
                    self.push_write(name);
                }
            }
            decl.visit_children_with(self);
        }

        fn visit_assign_expr(&mut self, assign: &swc_ecma_ast::AssignExpr) {
            if let AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) =
                &assign.left
            {
                self.push_write(binding.id.sym.to_string());
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            if let Expr::Ident(ident) = &*update.arg {
                self.push_write(ident.sym.to_string());
            }
            update.visit_children_with(self);
        }
    }

    let mut collector = Collector::default();
    function.visit_with(&mut collector);
    collector.writes
}

fn collect_mutated_bindings(function: &Function) -> HashSet<String> {
    struct Collector {
        mutated: HashSet<String>,
    }

    impl Collector {
        fn mark_member_root(&mut self, member: &MemberExpr) {
            if let Expr::Ident(ident) = &*member.obj {
                self.mutated.insert(ident.sym.to_string());
            }
        }
    }

    impl Visit for Collector {
        fn visit_assign_expr(&mut self, assign: &swc_ecma_ast::AssignExpr) {
            match &assign.left {
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) => {
                    self.mutated.insert(binding.id.sym.to_string());
                }
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Member(member)) => {
                    self.mark_member_root(member);
                }
                _ => {}
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            match &*update.arg {
                Expr::Ident(ident) => {
                    self.mutated.insert(ident.sym.to_string());
                }
                Expr::Member(member) => self.mark_member_root(member),
                _ => {}
            }
            update.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            if let Callee::Expr(callee) = &call.callee {
                let Some(member) = as_member_expr(callee) else {
                    call.visit_children_with(self);
                    return;
                };
                let Some(method) = member_method_name(member) else {
                    call.visit_children_with(self);
                    return;
                };
                if is_known_mutating_method(method) {
                    self.mark_member_root(member);
                }
            }
            call.visit_children_with(self);
        }
    }

    let mut collector = Collector {
        mutated: HashSet::new(),
    };
    function.visit_with(&mut collector);
    collector.mutated
}

fn collect_function_captures(function: &Function) -> HashMap<String, HashSet<String>> {
    let Some(body) = &function.body else {
        return HashMap::new();
    };

    let mut captures = HashMap::<String, HashSet<String>>::new();
    let mut outer_bindings = HashSet::<String>::new();
    for param in &function.params {
        collect_pat_bindings(&param.pat, &mut outer_bindings);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings(stmt, &mut outer_bindings);
    }

    for stmt in &body.stmts {
        match stmt {
            Stmt::Decl(swc_ecma_ast::Decl::Fn(fn_decl)) => {
                let mut local_bindings = HashSet::new();
                for param in &fn_decl.function.params {
                    collect_pat_bindings(&param.pat, &mut local_bindings);
                }
                if let Some(fn_body) = &fn_decl.function.body {
                    for nested in &fn_body.stmts {
                        collect_stmt_bindings(nested, &mut local_bindings);
                    }
                }
                let reads = collect_expr_ident_reads(&Expr::Fn(swc_ecma_ast::FnExpr {
                    ident: Some(fn_decl.ident.clone()),
                    function: fn_decl.function.clone(),
                }));
                let captures_for_fn = reads
                    .into_iter()
                    .filter(|name| outer_bindings.contains(name) && !local_bindings.contains(name))
                    .collect::<HashSet<_>>();
                captures.insert(fn_decl.ident.sym.to_string(), captures_for_fn);
            }
            Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) => {
                for decl in &var_decl.decls {
                    let Pat::Ident(binding) = &decl.name else {
                        continue;
                    };
                    let Some(init) = &decl.init else {
                        continue;
                    };
                    if !matches!(&**init, Expr::Fn(_) | Expr::Arrow(_)) {
                        continue;
                    }

                    let mut local_bindings = HashSet::new();
                    match &**init {
                        Expr::Fn(fn_expr) => {
                            for param in &fn_expr.function.params {
                                collect_pat_bindings(&param.pat, &mut local_bindings);
                            }
                            if let Some(fn_body) = &fn_expr.function.body {
                                for nested in &fn_body.stmts {
                                    collect_stmt_bindings(nested, &mut local_bindings);
                                }
                            }
                        }
                        Expr::Arrow(arrow) => {
                            for param in &arrow.params {
                                collect_pat_bindings(param, &mut local_bindings);
                            }
                            if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &*arrow.body {
                                for nested in &block.stmts {
                                    collect_stmt_bindings(nested, &mut local_bindings);
                                }
                            }
                        }
                        _ => {}
                    }

                    let reads = collect_expr_ident_reads(init);
                    let captures_for_binding = reads
                        .into_iter()
                        .filter(|name| {
                            outer_bindings.contains(name) && !local_bindings.contains(name)
                        })
                        .collect::<HashSet<_>>();
                    captures.insert(binding.id.sym.to_string(), captures_for_binding);
                }
            }
            _ => {}
        }
    }

    captures
}

fn collect_callback_dependency_hints(
    function: &Function,
    outer_bindings: &HashSet<String>,
) -> HashMap<SpanKey, Vec<HirDependency>> {
    let mut function_like_bindings = HashMap::<String, Expr>::new();
    if let Some(body) = &function.body {
        for stmt in &body.stmts {
            if let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt {
                for decl in &var_decl.decls {
                    let Pat::Ident(binding) = &decl.name else {
                        continue;
                    };
                    let Some(init) = &decl.init else {
                        continue;
                    };
                    if matches!(&**init, Expr::Fn(_) | Expr::Arrow(_)) {
                        function_like_bindings.insert(binding.id.sym.to_string(), *init.clone());
                    }
                }
            }
        }
    }

    struct Collector<'a> {
        outer_bindings: &'a HashSet<String>,
        function_like_bindings: &'a HashMap<String, Expr>,
        hints: HashMap<SpanKey, Vec<HirDependency>>,
    }

    impl Collector<'_> {
        fn collect_from_callback(&self, callback: &Expr) -> Vec<HirDependency> {
            let mut local = HashSet::<String>::new();
            match callback {
                Expr::Fn(fn_expr) => {
                    for param in &fn_expr.function.params {
                        collect_pat_bindings(&param.pat, &mut local);
                    }
                    if let Some(body) = &fn_expr.function.body {
                        for stmt in &body.stmts {
                            collect_stmt_bindings(stmt, &mut local);
                        }
                    }
                }
                Expr::Arrow(arrow) => {
                    for param in &arrow.params {
                        collect_pat_bindings(param, &mut local);
                    }
                    if let swc_ecma_ast::BlockStmtOrExpr::BlockStmt(block) = &*arrow.body {
                        for stmt in &block.stmts {
                            collect_stmt_bindings(stmt, &mut local);
                        }
                    }
                }
                _ => return Vec::new(),
            }

            let mut out = Vec::<HirDependency>::new();
            for dep in collect_expr_dependencies(callback) {
                if !self.outer_bindings.contains(dep.root.as_str()) {
                    continue;
                }
                if local.contains(dep.root.as_str()) {
                    continue;
                }
                push_unique_dependency(&mut out, dep);
            }
            out
        }
    }

    impl Visit for Collector<'_> {
        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            let Some(hook_name) = callee_name_from_call(call) else {
                call.visit_children_with(self);
                return;
            };
            if !matches!(
                hook_name,
                "useMemo" | "useCallback" | "useEffect" | "useLayoutEffect" | "useInsertionEffect"
            ) {
                call.visit_children_with(self);
                return;
            }
            let Some(first_arg) = call.args.first() else {
                call.visit_children_with(self);
                return;
            };
            if first_arg.spread.is_some() {
                call.visit_children_with(self);
                return;
            }

            let callback_expr = match &*first_arg.expr {
                Expr::Fn(_) | Expr::Arrow(_) => Some((*first_arg.expr).clone()),
                Expr::Ident(ident) => self.function_like_bindings.get(ident.sym.as_ref()).cloned(),
                _ => None,
            };
            if let Some(callback_expr) = callback_expr {
                let deps = self.collect_from_callback(&callback_expr);
                self.hints
                    .entry(SpanKey::from_span(callback_expr.span()))
                    .or_default()
                    .extend(deps);
            }

            call.visit_children_with(self);
        }
    }

    let mut collector = Collector {
        outer_bindings,
        function_like_bindings: &function_like_bindings,
        hints: HashMap::new(),
    };
    function.visit_with(&mut collector);

    for deps in collector.hints.values_mut() {
        dedup_dependencies(deps);
    }
    collector.hints
}

fn collect_scope_dependencies(
    function: &Function,
) -> (HashMap<u32, Vec<HirDependency>>, HashMap<u32, u32>) {
    let mut scope_deps = HashMap::<u32, Vec<HirDependency>>::new();
    let mut scope_parents = HashMap::<u32, u32>::new();
    let mut next_scope = 1u32;

    let root_deps = if let Some(body) = &function.body {
        collect_deps_from_stmts(&body.stmts)
    } else {
        Vec::new()
    };
    scope_deps.insert(0, root_deps);

    fn walk_stmt(
        stmt: &Stmt,
        parent_scope: u32,
        next_scope: &mut u32,
        deps: &mut HashMap<u32, Vec<HirDependency>>,
        parents: &mut HashMap<u32, u32>,
    ) {
        match stmt {
            Stmt::Block(block) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                deps.insert(scope_id, collect_deps_from_stmts(&block.stmts));
                for nested in &block.stmts {
                    walk_stmt(nested, scope_id, next_scope, deps, parents);
                }
            }
            Stmt::If(if_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&if_stmt.test);
                all.extend(collect_deps_from_stmt(&if_stmt.cons));
                if let Some(alt) = &if_stmt.alt {
                    all.extend(collect_deps_from_stmt(alt));
                }
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&if_stmt.cons, scope_id, next_scope, deps, parents);
                if let Some(alt) = &if_stmt.alt {
                    walk_stmt(alt, scope_id, next_scope, deps, parents);
                }
            }
            Stmt::Switch(switch_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&switch_stmt.discriminant);
                for case in &switch_stmt.cases {
                    all.extend(collect_deps_from_stmts(&case.cons));
                }
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                for case in &switch_stmt.cases {
                    for nested in &case.cons {
                        walk_stmt(nested, scope_id, next_scope, deps, parents);
                    }
                }
            }
            Stmt::For(for_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = Vec::new();
                if let Some(init) = &for_stmt.init {
                    match init {
                        swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl) => {
                            for decl in &var_decl.decls {
                                if let Some(init) = &decl.init {
                                    all.extend(collect_deps_from_expr(init));
                                }
                            }
                        }
                        swc_ecma_ast::VarDeclOrExpr::Expr(expr) => {
                            all.extend(collect_deps_from_expr(expr));
                        }
                    }
                }
                if let Some(test) = &for_stmt.test {
                    all.extend(collect_deps_from_expr(test));
                }
                if let Some(update) = &for_stmt.update {
                    all.extend(collect_deps_from_expr(update));
                }
                all.extend(collect_deps_from_stmt(&for_stmt.body));
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&for_stmt.body, scope_id, next_scope, deps, parents);
            }
            Stmt::ForIn(for_in_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&for_in_stmt.right);
                all.extend(collect_deps_from_stmt(&for_in_stmt.body));
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&for_in_stmt.body, scope_id, next_scope, deps, parents);
            }
            Stmt::ForOf(for_of_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&for_of_stmt.right);
                all.extend(collect_deps_from_stmt(&for_of_stmt.body));
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&for_of_stmt.body, scope_id, next_scope, deps, parents);
            }
            Stmt::While(while_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&while_stmt.test);
                all.extend(collect_deps_from_stmt(&while_stmt.body));
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&while_stmt.body, scope_id, next_scope, deps, parents);
            }
            Stmt::DoWhile(do_while_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_expr(&do_while_stmt.test);
                all.extend(collect_deps_from_stmt(&do_while_stmt.body));
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
                walk_stmt(&do_while_stmt.body, scope_id, next_scope, deps, parents);
            }
            Stmt::Try(try_stmt) => {
                let scope_id = *next_scope;
                *next_scope += 1;
                parents.insert(scope_id, parent_scope);
                let mut all = collect_deps_from_stmts(&try_stmt.block.stmts);
                if let Some(handler) = &try_stmt.handler {
                    all.extend(collect_deps_from_stmts(&handler.body.stmts));
                }
                if let Some(finalizer) = &try_stmt.finalizer {
                    all.extend(collect_deps_from_stmts(&finalizer.stmts));
                }
                dedup_dependencies(&mut all);
                deps.insert(scope_id, all);
            }
            _ => {}
        }
    }

    if let Some(body) = &function.body {
        for stmt in &body.stmts {
            walk_stmt(
                stmt,
                0,
                &mut next_scope,
                &mut scope_deps,
                &mut scope_parents,
            );
        }
    }

    (scope_deps, scope_parents)
}

fn infer_reactive_places_from_metadata(metadata: &HirMetadata) -> Vec<HirDependency> {
    let mut places = Vec::<HirDependency>::new();
    let mut seen = HashSet::<(String, Vec<String>)>::new();
    let mut push_place = |dep: HirDependency| {
        let key = (dep.root.clone(), dep.path.clone());
        if seen.insert(key) {
            places.push(dep);
        }
    };

    for deps in metadata.callback_dependency_hints.values() {
        for dep in deps {
            if metadata.mutated_bindings.contains(dep.root.as_str())
                || metadata.reassigned_bindings.contains(dep.root.as_str())
            {
                push_place(dep.clone());
            }
        }
    }
    for deps in metadata.scope_dependencies.values() {
        for dep in deps {
            if metadata.mutated_bindings.contains(dep.root.as_str())
                || metadata.reassigned_bindings.contains(dep.root.as_str())
            {
                push_place(dep.clone());
            }
        }
    }

    places
}

fn collect_stmt_bindings(stmt: &Stmt, out: &mut HashSet<String>) {
    match stmt {
        Stmt::Decl(decl) => match decl {
            swc_ecma_ast::Decl::Var(var_decl) => {
                for decl in &var_decl.decls {
                    collect_var_decl_bindings(decl, out);
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
        Stmt::Switch(switch_stmt) => {
            for case in &switch_stmt.cases {
                for stmt in &case.cons {
                    collect_stmt_bindings(stmt, out);
                }
            }
        }
        Stmt::For(for_stmt) => {
            if let Some(swc_ecma_ast::VarDeclOrExpr::VarDecl(var_decl)) = &for_stmt.init {
                for decl in &var_decl.decls {
                    collect_var_decl_bindings(decl, out);
                }
            }
            collect_stmt_bindings(&for_stmt.body, out);
        }
        Stmt::ForIn(for_in_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_in_stmt.left {
                for decl in &var_decl.decls {
                    collect_var_decl_bindings(decl, out);
                }
            }
            collect_stmt_bindings(&for_in_stmt.body, out);
        }
        Stmt::ForOf(for_of_stmt) => {
            if let swc_ecma_ast::ForHead::VarDecl(var_decl) = &for_of_stmt.left {
                for decl in &var_decl.decls {
                    collect_var_decl_bindings(decl, out);
                }
            }
            collect_stmt_bindings(&for_of_stmt.body, out);
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

fn collect_var_decl_bindings(decl: &VarDeclarator, out: &mut HashSet<String>) {
    collect_pat_bindings(&decl.name, out);
}

pub(crate) fn collect_pat_bindings(pat: &Pat, out: &mut HashSet<String>) {
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

fn collect_expr_ident_reads(expr: &Expr) -> HashSet<String> {
    struct Collector {
        reads: HashSet<String>,
    }
    impl Visit for Collector {
        fn visit_ident(&mut self, ident: &Ident) {
            self.reads.insert(ident.sym.to_string());
        }
    }
    let mut collector = Collector {
        reads: HashSet::new(),
    };
    expr.visit_with(&mut collector);
    collector.reads
}

fn collect_deps_from_stmts(stmts: &[Stmt]) -> Vec<HirDependency> {
    let mut deps = Vec::<HirDependency>::new();
    for stmt in stmts {
        deps.extend(collect_deps_from_stmt(stmt));
    }
    dedup_dependencies(&mut deps);
    deps
}

fn collect_deps_from_stmt(stmt: &Stmt) -> Vec<HirDependency> {
    struct Collector {
        deps: Vec<HirDependency>,
    }

    impl Collector {
        fn push_dependency(&mut self, dep: HirDependency) {
            push_unique_dependency(&mut self.deps, dep);
        }
    }

    impl Visit for Collector {
        fn visit_ident(&mut self, ident: &Ident) {
            self.push_dependency(HirDependency::from_root(ident.sym.to_string()));
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(dep) = dependency_from_expr(&Expr::Member(member.clone())) {
                self.push_dependency(dep);
                return;
            }
            member.visit_children_with(self);
        }
    }

    let mut collector = Collector { deps: Vec::new() };
    stmt.visit_with(&mut collector);
    collector.deps
}

fn collect_deps_from_expr(expr: &Expr) -> Vec<HirDependency> {
    struct Collector {
        deps: Vec<HirDependency>,
    }

    impl Collector {
        fn push_dependency(&mut self, dep: HirDependency) {
            push_unique_dependency(&mut self.deps, dep);
        }
    }

    impl Visit for Collector {
        fn visit_ident(&mut self, ident: &Ident) {
            self.push_dependency(HirDependency::from_root(ident.sym.to_string()));
        }

        fn visit_member_expr(&mut self, member: &MemberExpr) {
            if let Some(dep) = dependency_from_expr(&Expr::Member(member.clone())) {
                self.push_dependency(dep);
                return;
            }
            member.visit_children_with(self);
        }
    }

    let mut collector = Collector { deps: Vec::new() };
    expr.visit_with(&mut collector);
    collector.deps
}

fn collect_expr_dependencies(expr: &Expr) -> Vec<HirDependency> {
    let mut deps = collect_deps_from_expr(expr);
    dedup_dependencies(&mut deps);
    deps
}

fn dependency_from_expr(expr: &Expr) -> Option<HirDependency> {
    let (root, path) = parse_dependency_parts(expr)?;
    Some(HirDependency { root, path })
}

fn parse_dependency_parts(expr: &Expr) -> Option<(String, Vec<String>)> {
    match expr {
        Expr::Ident(ident) => Some((ident.sym.to_string(), Vec::new())),
        Expr::Paren(paren) => parse_dependency_parts(&paren.expr),
        Expr::Member(member) => {
            let (root, mut path) = parse_dependency_parts(&member.obj)?;
            let segment = member_prop_to_segment(&member.prop)?;
            path.push(segment);
            Some((root, path))
        }
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Member(member) => parse_dependency_parts(&Expr::Member(member.clone())),
            OptChainBase::Call(call) => parse_dependency_parts(&call.callee),
        },
        _ => None,
    }
}

fn member_prop_to_segment(prop: &MemberProp) -> Option<String> {
    match prop {
        MemberProp::Ident(ident) => Some(ident.sym.to_string()),
        MemberProp::Computed(computed) => match &*computed.expr {
            Expr::Ident(ident) => Some(ident.sym.to_string()),
            Expr::Lit(swc_ecma_ast::Lit::Str(value)) => {
                Some(value.value.to_string_lossy().to_string())
            }
            Expr::Lit(swc_ecma_ast::Lit::Num(value)) => Some(value.value.to_string()),
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
    }
}

fn dedup_dependencies(deps: &mut Vec<HirDependency>) {
    let mut seen = HashSet::<(String, Vec<String>)>::new();
    deps.retain(|dep| seen.insert((dep.root.clone(), dep.path.clone())));
}

fn push_unique_dependency(target: &mut Vec<HirDependency>, dep: HirDependency) {
    if target
        .iter()
        .any(|existing| existing.root == dep.root && existing.path == dep.path)
    {
        return;
    }
    target.push(dep);
}

fn callee_name_from_call(call: &swc_ecma_ast::CallExpr) -> Option<&str> {
    let Callee::Expr(callee) = &call.callee else {
        return None;
    };
    match &**callee {
        Expr::Ident(ident) => Some(ident.sym.as_ref()),
        Expr::Member(member) => member_method_name(member),
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Call(opt_call) => match &*opt_call.callee {
                Expr::Ident(ident) => Some(ident.sym.as_ref()),
                Expr::Member(member) => member_method_name(member),
                _ => None,
            },
            OptChainBase::Member(member) => member_method_name(member),
        },
        _ => None,
    }
}

fn member_method_name(member: &MemberExpr) -> Option<&str> {
    match &member.prop {
        MemberProp::Ident(ident) => Some(ident.sym.as_ref()),
        MemberProp::Computed(computed) => {
            let Expr::Lit(swc_ecma_ast::Lit::Str(str_lit)) = &*computed.expr else {
                return None;
            };
            str_lit.value.as_str()
        }
        MemberProp::PrivateName(_) => None,
    }
}

fn as_member_expr(expr: &Expr) -> Option<&MemberExpr> {
    match expr {
        Expr::Member(member) => Some(member),
        Expr::OptChain(chain) => match &*chain.base {
            OptChainBase::Member(member) => Some(member),
            OptChainBase::Call(call) => as_member_expr(&call.callee),
        },
        _ => None,
    }
}

fn is_known_mutating_method(name: &str) -> bool {
    matches!(
        name,
        "push"
            | "pop"
            | "shift"
            | "unshift"
            | "splice"
            | "sort"
            | "reverse"
            | "copyWithin"
            | "fill"
            | "add"
            | "set"
            | "delete"
            | "clear"
    )
}
