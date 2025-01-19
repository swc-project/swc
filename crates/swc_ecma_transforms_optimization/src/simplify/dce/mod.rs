use std::{borrow::Cow, sync::Arc};

use indexmap::IndexSet;
use petgraph::{algo::tarjan_scc, Direction::Incoming};
use rustc_hash::FxHashSet;
use swc_atoms::{atom, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet, ARandomState},
    pass::{CompilerPass, Repeated},
    util::take::Take,
    Mark, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    helpers::{Helpers, HELPERS},
    perf::{cpu_count, ParVisitMut, Parallel},
};
use swc_ecma_utils::{
    collect_decls, find_pat_ids, ExprCtx, ExprExt, IsEmpty, ModuleItemLike, StmtLike, Value::Known,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_fast_graph::digraph::FastDiGraphMap;
use tracing::{debug, span, Level};

use crate::debug_assert_valid;

/// Note: This becomes parallel if `concurrent` feature is enabled.
pub fn dce(
    config: Config,
    unresolved_mark: Mark,
) -> impl Pass + VisitMut + Repeated + CompilerPass {
    visit_mut_pass(TreeShaker {
        expr_ctx: ExprCtx {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            is_unresolved_ref_safe: false,
            in_strict: false,
        },
        config,
        changed: false,
        pass: 0,
        in_fn: false,
        in_block_stmt: false,
        var_decl_kind: None,
        data: Default::default(),
        bindings: Default::default(),
    })
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this [Mark] is applied to a function expression, it's treated as a
    /// separate module.
    ///
    /// **Note**: This is hack to make operation parallel while allowing invalid
    /// module produced by the `swc_bundler`.
    pub module_mark: Option<Mark>,

    /// If true, top-level items will be removed if they are not used.
    ///
    /// Defaults to `true`.
    pub top_level: bool,

    /// Declarations with a symbol in this set will be preserved.
    pub top_retain: Vec<JsWord>,

    /// If false, imports with side effects will be removed.
    pub preserve_imports_with_side_effects: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            module_mark: Default::default(),
            top_level: true,
            top_retain: Default::default(),
            preserve_imports_with_side_effects: true,
        }
    }
}

struct TreeShaker {
    expr_ctx: ExprCtx,

    config: Config,
    changed: bool,
    pass: u16,

    in_fn: bool,
    in_block_stmt: bool,
    var_decl_kind: Option<VarDeclKind>,

    data: Arc<Data>,

    bindings: Arc<AHashSet<Id>>,
}

impl CompilerPass for TreeShaker {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("tree-shaker")
    }
}

#[derive(Default)]
struct Data {
    used_names: AHashMap<Id, VarInfo>,

    /// Variable usage graph
    ///
    /// We use `u32` because [FastDiGraphMap] stores types as `(N, 1 bit)` so if
    /// we use u32 it fits into the cache line of cpu.
    graph: FastDiGraphMap<u32, VarInfo>,
    /// Entrypoints.
    entries: FxHashSet<u32>,

    graph_ix: IndexSet<Id, ARandomState>,
}

impl Data {
    fn node(&mut self, id: &Id) -> u32 {
        self.graph_ix.get_index_of(id).unwrap_or_else(|| {
            let ix = self.graph_ix.len();
            self.graph_ix.insert_full(id.clone());
            ix
        }) as _
    }

    /// Add an edge to dependency graph
    fn add_dep_edge(&mut self, from: &Id, to: &Id, assign: bool) {
        let from = self.node(from);
        let to = self.node(to);

        match self.graph.edge_weight_mut(from, to) {
            Some(info) => {
                if assign {
                    info.assign += 1;
                } else {
                    info.usage += 1;
                }
            }
            None => {
                self.graph.add_edge(
                    from,
                    to,
                    VarInfo {
                        usage: u32::from(!assign),
                        assign: u32::from(assign),
                    },
                );
            }
        };
    }

    /// Traverse the graph and subtract usages from `used_names`.
    fn subtract_cycles(&mut self) {
        let cycles = tarjan_scc(&self.graph);

        'c: for cycle in cycles {
            if cycle.len() == 1 {
                continue;
            }

            // We have to exclude cycle from remove list if an outer node refences an item
            // of cycle.
            for &node in &cycle {
                // It's referenced by an outer node.
                if self.entries.contains(&node) {
                    continue 'c;
                }

                if self.graph.neighbors_directed(node, Incoming).any(|node| {
                    // Node in cycle does not matter
                    !cycle.contains(&node)
                }) {
                    continue 'c;
                }
            }

            for &i in &cycle {
                for &j in &cycle {
                    if i == j {
                        continue;
                    }

                    let id = self.graph_ix.get_index(j as _);
                    let id = match id {
                        Some(id) => id,
                        None => continue,
                    };

                    if let Some(w) = self.graph.edge_weight(i, j) {
                        let e = self.used_names.entry(id.clone()).or_default();
                        e.usage -= w.usage;
                        e.assign -= w.assign;
                    }
                }
            }
        }
    }
}

#[derive(Debug, Default)]
struct VarInfo {
    /// This does not include self-references in a function.
    pub usage: u32,
    /// This does not include self-references in a function.
    pub assign: u32,
}

struct Analyzer<'a> {
    #[allow(dead_code)]
    config: &'a Config,
    in_var_decl: bool,
    scope: Scope<'a>,
    data: &'a mut Data,
    cur_class_id: Option<Id>,
    cur_fn_id: Option<Id>,
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    kind: ScopeKind,

    bindings_affected_by_eval: AHashSet<Id>,
    found_direct_eval: bool,

    found_arguemnts: bool,
    bindings_affected_by_arguements: Vec<Id>,

    /// Used to construct a graph.
    ///
    /// This includes all bindings to current node.
    ast_path: Vec<Id>,
}

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
enum ScopeKind {
    Fn,
    ArrowFn,
}

impl Default for ScopeKind {
    fn default() -> Self {
        Self::Fn
    }
}

impl Analyzer<'_> {
    fn with_ast_path<F>(&mut self, ids: Vec<Id>, op: F)
    where
        F: for<'aa> FnOnce(&mut Analyzer<'aa>),
    {
        let prev_len = self.scope.ast_path.len();

        self.scope.ast_path.extend(ids);

        op(self);

        self.scope.ast_path.truncate(prev_len);
    }

    fn with_scope<F>(&mut self, kind: ScopeKind, op: F)
    where
        F: for<'aa> FnOnce(&mut Analyzer<'aa>),
    {
        let child_scope = {
            let child = Scope {
                parent: Some(&self.scope),
                ..Default::default()
            };

            let mut v = Analyzer {
                scope: child,
                data: self.data,
                cur_fn_id: self.cur_fn_id.clone(),
                cur_class_id: self.cur_class_id.clone(),
                ..*self
            };

            op(&mut v);

            Scope {
                parent: None,
                ..v.scope
            }
        };

        // If we found eval, mark all declarations in scope and upper as used
        if child_scope.found_direct_eval {
            for id in child_scope.bindings_affected_by_eval {
                self.data.used_names.entry(id).or_default().usage += 1;
            }

            self.scope.found_direct_eval = true;
        }

        if child_scope.found_arguemnts {
            // Parameters

            for id in child_scope.bindings_affected_by_arguements {
                self.data.used_names.entry(id).or_default().usage += 1;
            }

            if !matches!(kind, ScopeKind::Fn) {
                self.scope.found_arguemnts = true;
            }
        }
    }

    /// Mark `id` as used
    fn add(&mut self, id: Id, assign: bool) {
        if id.0 == atom!("arguments") {
            self.scope.found_arguemnts = true;
        }

        if let Some(f) = &self.cur_fn_id {
            if id == *f {
                return;
            }
        }
        if let Some(f) = &self.cur_class_id {
            if id == *f {
                return;
            }
        }

        if self.scope.is_ast_path_empty() {
            // Add references from top level items into graph
            let idx = self.data.node(&id);
            self.data.entries.insert(idx);
        } else {
            let mut scope = Some(&self.scope);

            while let Some(s) = scope {
                for component in &s.ast_path {
                    self.data.add_dep_edge(component, &id, assign);
                }

                if s.kind == ScopeKind::Fn && !s.ast_path.is_empty() {
                    break;
                }

                scope = s.parent;
            }
        }

        if assign {
            self.data.used_names.entry(id).or_default().assign += 1;
        } else {
            self.data.used_names.entry(id).or_default().usage += 1;
        }
    }
}

impl Visit for Analyzer<'_> {
    noop_visit_type!();

    fn visit_callee(&mut self, n: &Callee) {
        n.visit_children_with(self);

        if let Callee::Expr(e) = n {
            if e.is_ident_ref_to("eval") {
                self.scope.found_direct_eval = true;
            }
        }
    }

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        n.visit_children_with(self);

        self.add(n.key.to_id(), true);
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.with_ast_path(vec![n.ident.to_id()], |v| {
            let old = v.cur_class_id.take();
            v.cur_class_id = Some(n.ident.to_id());
            n.visit_children_with(v);
            v.cur_class_id = old;

            if !n.class.decorators.is_empty() {
                v.add(n.ident.to_id(), false);
            }
        })
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        n.visit_children_with(self);

        if !n.class.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        if let ModuleExportName::Ident(orig) = &n.orig {
            self.add(orig.to_id(), false);
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        let name = match &n.decl {
            Decl::Class(c) => vec![c.ident.to_id()],
            Decl::Fn(f) => vec![f.ident.to_id()],
            Decl::Var(v) => v
                .decls
                .iter()
                .flat_map(|d| find_pat_ids(d).into_iter())
                .collect(),
            _ => Vec::new(),
        };
        for ident in name {
            self.add(ident, false);
        }

        n.visit_children_with(self)
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_in_var_decl = self.in_var_decl;

        self.in_var_decl = false;
        e.visit_children_with(self);

        if let Expr::Ident(i) = e {
            self.add(i.to_id(), false);
        }

        self.in_var_decl = old_in_var_decl;
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        match n.op {
            op!("=") => {
                if let Some(i) = n.left.as_ident() {
                    self.add(i.to_id(), true);
                    n.right.visit_with(self);
                } else {
                    n.visit_children_with(self);
                }
            }
            _ => {
                if let Some(i) = n.left.as_ident() {
                    self.add(i.to_id(), false);
                    self.add(i.to_id(), true);
                    n.right.visit_with(self);
                } else {
                    n.visit_children_with(self);
                }
            }
        }
    }

    fn visit_jsx_element_name(&mut self, e: &JSXElementName) {
        e.visit_children_with(self);

        if let JSXElementName::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_jsx_object(&mut self, e: &JSXObject) {
        e.visit_children_with(self);

        if let JSXObject::Ident(i) = e {
            self.add(i.to_id(), false);
        }
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.with_scope(ScopeKind::ArrowFn, |v| {
            n.visit_children_with(v);

            if v.scope.found_direct_eval {
                v.scope.bindings_affected_by_eval = collect_decls(n);
            }
        })
    }

    fn visit_function(&mut self, n: &Function) {
        self.with_scope(ScopeKind::Fn, |v| {
            n.visit_children_with(v);

            if v.scope.found_direct_eval {
                v.scope.bindings_affected_by_eval = collect_decls(n);
            }

            if v.scope.found_arguemnts {
                v.scope.bindings_affected_by_arguements = find_pat_ids(&n.params);
            }
        })
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.with_ast_path(vec![n.ident.to_id()], |v| {
            let old = v.cur_fn_id.take();
            v.cur_fn_id = Some(n.ident.to_id());
            n.visit_children_with(v);
            v.cur_fn_id = old;

            if !n.function.decorators.is_empty() {
                v.add(n.ident.to_id(), false);
            }
        })
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        n.visit_children_with(self);

        if !n.function.decorators.is_empty() {
            if let Some(i) = &n.ident {
                self.add(i.to_id(), false);
            }
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if !self.in_var_decl {
            if let Pat::Ident(i) = p {
                self.add(i.to_id(), true);
            }
        }
    }

    fn visit_prop(&mut self, p: &Prop) {
        p.visit_children_with(self);

        if let Prop::Shorthand(i) = p {
            self.add(i.to_id(), false);
        }
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        let old = self.in_var_decl;

        self.in_var_decl = true;
        n.name.visit_with(self);

        self.in_var_decl = false;
        n.init.visit_with(self);

        self.in_var_decl = old;
    }
}

impl Repeated for TreeShaker {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        self.pass += 1;
        self.changed = false;
        self.data = Default::default();
    }
}

impl Parallel for TreeShaker {
    fn create(&self) -> Self {
        Self {
            expr_ctx: self.expr_ctx.clone(),
            data: self.data.clone(),
            config: self.config.clone(),
            bindings: self.bindings.clone(),
            ..*self
        }
    }

    fn merge(&mut self, other: Self) {
        self.changed |= other.changed;
    }
}

impl TreeShaker {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + ModuleItemLike + VisitMutWith<Self> + Send + Sync,
        Vec<T>: VisitMutWith<Self>,
    {
        if let Some(Stmt::Expr(ExprStmt { expr, .. })) = stmts.first().and_then(|s| s.as_stmt()) {
            if let Expr::Lit(Lit::Str(v)) = &**expr {
                if &*v.value == "use asm" {
                    return;
                }
            }
        }

        self.visit_mut_par(cpu_count() * 8, stmts);

        stmts.retain(|s| match s.as_stmt() {
            Some(Stmt::Empty(..)) => false,
            Some(Stmt::Block(s)) if s.is_empty() => {
                debug!("Dropping an empty block statement");
                false
            }
            _ => true,
        });
    }

    fn can_drop_binding(&self, name: Id, is_var: bool) -> bool {
        if !self.config.top_level {
            if is_var {
                if !self.in_fn {
                    return false;
                }
            } else if !self.in_block_stmt {
                return false;
            }
        }

        if self.config.top_retain.contains(&name.0) {
            return false;
        }

        match self.data.used_names.get(&name) {
            Some(v) => v.usage == 0 && v.assign == 0,
            None => true,
        }
    }

    fn can_drop_assignment_to(&self, name: Id, is_var: bool) -> bool {
        if !self.config.top_level {
            if is_var {
                if !self.in_fn {
                    return false;
                }
            } else if !self.in_block_stmt {
                return false;
            }

            // Abort if the variable is declared on top level scope.
            let ix = self.data.graph_ix.get_index_of(&name);
            if let Some(ix) = ix {
                if self.data.entries.contains(&(ix as u32)) {
                    return false;
                }
            }
        }

        if self.config.top_retain.contains(&name.0) {
            return false;
        }

        self.bindings.contains(&name)
            && self
                .data
                .used_names
                .get(&name)
                .map(|v| v.usage == 0)
                .unwrap_or_default()
    }

    /// Drops RHS from `null && foo`
    fn optimize_bin_expr(&mut self, n: &mut Expr) {
        let Expr::Bin(b) = n else {
            return;
        };

        if b.op == op!("&&") && b.left.as_pure_bool(&self.expr_ctx) == Known(false) {
            *n = *b.left.take();
            self.changed = true;
            return;
        }

        if b.op == op!("||") && b.left.as_pure_bool(&self.expr_ctx) == Known(true) {
            *n = *b.left.take();
            self.changed = true;
        }
    }
}

impl VisitMut for TreeShaker {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        n.visit_mut_children_with(self);

        if let Some(id) = n.left.as_ident() {
            // TODO: `var`
            if self.can_drop_assignment_to(id.to_id(), false)
                && !n.right.may_have_side_effects(&self.expr_ctx)
            {
                self.changed = true;
                debug!("Dropping an assignment to `{}` because it's not used", id);

                n.left.take();
            }
        }
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        let old_in_block_stmt = self.in_block_stmt;
        self.in_block_stmt = true;
        n.visit_mut_children_with(self);
        self.in_block_stmt = old_in_block_stmt;
    }

    fn visit_mut_class_members(&mut self, members: &mut Vec<ClassMember>) {
        self.visit_mut_par(cpu_count() * 8, members);
    }

    fn visit_mut_decl(&mut self, n: &mut Decl) {
        n.visit_mut_children_with(self);

        match n {
            Decl::Fn(f) => {
                if self.can_drop_binding(f.ident.to_id(), true) {
                    debug!("Dropping function `{}` as it's not used", f.ident);
                    self.changed = true;

                    n.take();
                }
            }
            Decl::Class(c) => {
                if self.can_drop_binding(c.ident.to_id(), false)
                    && c.class
                        .super_class
                        .as_deref()
                        .map_or(true, |e| !e.may_have_side_effects(&self.expr_ctx))
                    && c.class.body.iter().all(|m| match m {
                        ClassMember::Method(m) => !matches!(m.key, PropName::Computed(..)),
                        ClassMember::ClassProp(m) => {
                            !matches!(m.key, PropName::Computed(..))
                                && !m
                                    .value
                                    .as_deref()
                                    .map_or(false, |e| e.may_have_side_effects(&self.expr_ctx))
                        }
                        ClassMember::AutoAccessor(m) => {
                            !matches!(m.key, Key::Public(PropName::Computed(..)))
                                && !m
                                    .value
                                    .as_deref()
                                    .map_or(false, |e| e.may_have_side_effects(&self.expr_ctx))
                        }

                        ClassMember::PrivateProp(m) => !m
                            .value
                            .as_deref()
                            .map_or(false, |e| e.may_have_side_effects(&self.expr_ctx)),

                        ClassMember::StaticBlock(_) => false,

                        ClassMember::TsIndexSignature(_)
                        | ClassMember::Empty(_)
                        | ClassMember::Constructor(_)
                        | ClassMember::PrivateMethod(_) => true,
                    })
                {
                    debug!("Dropping class `{}` as it's not used", c.ident);
                    self.changed = true;

                    n.take();
                }
            }
            _ => {}
        }
    }

    fn visit_mut_export_decl(&mut self, n: &mut ExportDecl) {
        match &mut n.decl {
            Decl::Var(v) => {
                for decl in v.decls.iter_mut() {
                    decl.init.visit_mut_with(self);
                }
            }
            _ => {
                // Bypass visit_mut_decl
                n.decl.visit_mut_children_with(self);
            }
        }
    }

    /// Noop.
    fn visit_mut_export_default_decl(&mut self, _: &mut ExportDefaultDecl) {}

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        self.optimize_bin_expr(n);

        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) = n
        {
            //
            if args.is_empty() {
                match &mut **callee {
                    Expr::Fn(FnExpr {
                        ident: None,
                        function: f,
                    }) if matches!(
                        &**f,
                        Function {
                            is_async: false,
                            is_generator: false,
                            body: Some(..),
                            ..
                        }
                    ) =>
                    {
                        if f.params.is_empty() && f.body.as_ref().unwrap().stmts.len() == 1 {
                            if let Stmt::Return(ReturnStmt { arg: Some(arg), .. }) =
                                &mut f.body.as_mut().unwrap().stmts[0]
                            {
                                if let Expr::Object(ObjectLit { props, .. }) = &**arg {
                                    if props.iter().all(|p| match p {
                                        PropOrSpread::Spread(_) => false,
                                        PropOrSpread::Prop(p) => match &**p {
                                            Prop::Shorthand(_) => true,
                                            Prop::KeyValue(p) => p.value.is_ident(),
                                            _ => false,
                                        },
                                    }) {
                                        self.changed = true;
                                        debug!("Dropping a wrapped esm");
                                        *n = *arg.take();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    _ => (),
                }
            }
        }

        if let Expr::Assign(a) = n {
            if match &a.left {
                AssignTarget::Simple(l) => l.is_invalid(),
                AssignTarget::Pat(l) => l.is_invalid(),
            } {
                *n = *a.right.take();
            }
        }

        if !n.is_invalid() {
            debug_assert_valid(n);
        }
    }

    fn visit_mut_expr_or_spreads(&mut self, n: &mut Vec<ExprOrSpread>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_exprs(&mut self, n: &mut Vec<Box<Expr>>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_for_head(&mut self, n: &mut ForHead) {
        match n {
            ForHead::VarDecl(..) | ForHead::UsingDecl(..) => {}
            ForHead::Pat(v) => {
                v.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let old_in_fn = self.in_fn;
        self.in_fn = true;
        n.visit_mut_children_with(self);
        self.in_fn = old_in_fn;
    }

    fn visit_mut_import_specifiers(&mut self, ss: &mut Vec<ImportSpecifier>) {
        ss.retain(|s| {
            let local = match s {
                ImportSpecifier::Named(l) => &l.local,
                ImportSpecifier::Default(l) => &l.local,
                ImportSpecifier::Namespace(l) => &l.local,
            };

            if self.can_drop_binding(local.to_id(), false) {
                debug!(
                    "Dropping import specifier `{}` because it's not used",
                    local
                );
                self.changed = true;
                return false;
            }

            true
        });
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        debug_assert_valid(m);

        let _tracing = span!(Level::ERROR, "tree-shaker", pass = self.pass).entered();

        if self.bindings.is_empty() {
            self.bindings = Arc::new(collect_decls(&*m))
        }

        let mut data = Default::default();

        {
            let mut analyzer = Analyzer {
                config: &self.config,
                in_var_decl: false,
                scope: Default::default(),
                data: &mut data,
                cur_class_id: Default::default(),
                cur_fn_id: Default::default(),
            };
            m.visit_with(&mut analyzer);
        }
        data.subtract_cycles();
        self.data = Arc::new(data);

        HELPERS.set(&Helpers::new(true), || {
            m.visit_mut_children_with(self);
        })
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                let is_for_side_effect = i.specifiers.is_empty();

                i.visit_mut_with(self);

                if !self.config.preserve_imports_with_side_effects
                    && !is_for_side_effect
                    && i.specifiers.is_empty()
                {
                    debug!("Dropping an import because it's not used");
                    self.changed = true;
                    *n = EmptyStmt { span: DUMMY_SP }.into();
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
        debug_assert_valid(n);
    }

    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_opt_vec_expr_or_spreads(&mut self, n: &mut Vec<Option<ExprOrSpread>>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_prop_or_spreads(&mut self, n: &mut Vec<PropOrSpread>) {
        self.visit_mut_par(cpu_count() * 8, n);
    }

    fn visit_mut_script(&mut self, m: &mut Script) {
        let _tracing = span!(Level::ERROR, "tree-shaker", pass = self.pass).entered();

        if self.bindings.is_empty() {
            self.bindings = Arc::new(collect_decls(&*m))
        }

        let mut data = Default::default();

        {
            let mut analyzer = Analyzer {
                config: &self.config,
                in_var_decl: false,
                scope: Default::default(),
                data: &mut data,
                cur_class_id: Default::default(),
                cur_fn_id: Default::default(),
            };
            m.visit_with(&mut analyzer);
        }
        data.subtract_cycles();
        self.data = Arc::new(data);

        HELPERS.set(&Helpers::new(true), || {
            m.visit_mut_children_with(self);
        })
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        if let Stmt::Decl(Decl::Var(v)) = s {
            if v.decls.is_empty() {
                s.take();
                return;
            }
        }

        debug_assert_valid(s);

        if let Stmt::Decl(Decl::Var(v)) = s {
            let span = v.span;
            let cnt = v.decls.len();

            // If all name is droppable, do so.
            if cnt != 0
                && v.decls.iter().all(|vd| match &vd.name {
                    Pat::Ident(i) => self.can_drop_binding(i.to_id(), v.kind == VarDeclKind::Var),
                    _ => false,
                })
            {
                let exprs = v
                    .decls
                    .take()
                    .into_iter()
                    .filter_map(|v| v.init)
                    .collect::<Vec<_>>();

                debug!(
                    count = cnt,
                    "Dropping names of variables as they are not used",
                );
                self.changed = true;

                if exprs.is_empty() {
                    *s = EmptyStmt { span: DUMMY_SP }.into();
                    return;
                } else {
                    *s = ExprStmt {
                        span,
                        expr: Expr::from_exprs(exprs),
                    }
                    .into();
                }
            }
        }

        if let Stmt::Decl(Decl::Var(v)) = s {
            if v.decls.is_empty() {
                *s = EmptyStmt { span: DUMMY_SP }.into();
            }
        }

        debug_assert_valid(s);
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s);
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        if matches!(n.op, op!("delete")) {
            return;
        }
        n.visit_mut_children_with(self);
    }

    #[cfg_attr(feature = "debug", tracing::instrument(skip_all))]
    fn visit_mut_using_decl(&mut self, n: &mut UsingDecl) {
        for decl in n.decls.iter_mut() {
            decl.init.visit_mut_with(self);
        }
    }

    fn visit_mut_var_decl(&mut self, n: &mut VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(n.kind);
        n.visit_mut_children_with(self);
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_mut_var_decl_or_expr(&mut self, n: &mut VarDeclOrExpr) {
        match n {
            VarDeclOrExpr::VarDecl(..) => {}
            VarDeclOrExpr::Expr(v) => {
                v.visit_mut_with(self);
            }
        }
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        v.visit_mut_children_with(self);

        if let Pat::Ident(i) = &v.name {
            let can_drop = if let Some(init) = &v.init {
                !init.may_have_side_effects(&self.expr_ctx)
            } else {
                true
            };

            if can_drop
                && self.can_drop_binding(i.to_id(), self.var_decl_kind == Some(VarDeclKind::Var))
            {
                self.changed = true;
                debug!("Dropping {} because it's not used", i);
                v.name.take();
            }
        }
    }

    fn visit_mut_var_declarators(&mut self, n: &mut Vec<VarDeclarator>) {
        self.visit_mut_par(cpu_count() * 8, n);

        n.retain(|v| {
            if v.name.is_invalid() {
                return false;
            }

            true
        });
    }

    fn visit_mut_with_stmt(&mut self, n: &mut WithStmt) {
        n.obj.visit_mut_with(self);
    }
}

impl Scope<'_> {
    /// Returns true if it's not in a function or class.
    fn is_ast_path_empty(&self) -> bool {
        if !self.ast_path.is_empty() {
            return false;
        }
        match &self.parent {
            Some(p) => p.is_ast_path_empty(),
            None => true,
        }
    }
}
