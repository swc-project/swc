use std::hash::Hash;

use rustc_hash::FxHashSet;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, stack_size::maybe_grow_default};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

struct IdCollector {
    ids: FxHashSet<Id>,
    stopped: bool,
}

impl IdCollector {
    fn handle_ident(&mut self, n: &Ident) {
        if !self.stopped && n.ctxt != SyntaxContext::empty() {
            self.ids.insert(n.to_id());
        }
    }
}

struct CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    bindings: FxHashSet<I>,
    preserved: FxHashSet<I>,
    is_pat_decl: bool,

    /// [None] if there's no `eval`.
    pub top_level_for_eval: Option<SyntaxContext>,
}

impl<I> CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    fn add(&mut self, i: &Ident) {
        if let Some(top_level_ctxt) = self.top_level_for_eval {
            if i.ctxt == top_level_ctxt {
                self.preserved.insert(I::from_ident(i));
                return;
            }
        }

        self.bindings.insert(I::from_ident(i));
    }

    fn handle_assign_pat_prop(&mut self, node: &AssignPatProp) {
        if self.is_pat_decl {
            self.add(&Ident::from(&node.key));
        }
    }

    fn handle_binding_ident(&mut self, node: &BindingIdent) {
        if self.is_pat_decl {
            self.add(&Ident::from(node));
        }
    }

    fn handle_class_expr(&mut self, node: &ClassExpr) {
        if let Some(id) = &node.ident {
            self.add(id);
        }
    }

    fn handle_fn_expr(&mut self, node: &FnExpr) {
        if let Some(id) = &node.ident {
            self.add(id);
        }
    }
}

pub(super) struct Collector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    id_collector: IdCollector,
    decl_collector: CustomBindingCollector<I>,
}

impl<I> Visit for Collector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = true;

        node.visit_children_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.visit_children_with(self);

        self.decl_collector.handle_assign_pat_prop(node);
    }

    fn visit_binding_ident(&mut self, node: &BindingIdent) {
        node.visit_children_with(self);

        self.decl_collector.handle_binding_ident(node);
    }

    fn visit_bin_expr(&mut self, node: &BinExpr) {
        maybe_grow_default(|| node.visit_children_with(self));
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = true;

        node.param.visit_with(self);

        self.decl_collector.is_pat_decl = false;

        node.body.visit_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        node.visit_children_with(self);

        self.decl_collector.add(&node.ident);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        node.visit_children_with(self);

        self.decl_collector.handle_class_expr(node);
    }

    fn visit_expr(&mut self, node: &Expr) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = false;

        node.visit_children_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        node.visit_children_with(self);

        self.decl_collector.add(&node.ident);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        node.visit_children_with(self);

        self.decl_collector.handle_fn_expr(node);
    }

    fn visit_import_default_specifier(&mut self, node: &ImportDefaultSpecifier) {
        node.visit_children_with(self);

        self.decl_collector.add(&node.local);
    }

    fn visit_import_named_specifier(&mut self, node: &ImportNamedSpecifier) {
        node.visit_children_with(self);

        self.decl_collector.add(&node.local);
    }

    fn visit_import_star_as_specifier(&mut self, node: &ImportStarAsSpecifier) {
        node.visit_children_with(self);

        self.decl_collector.add(&node.local);
    }

    fn visit_param(&mut self, node: &Param) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = true;

        node.visit_children_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_ts_param_prop(&mut self, p: &TsParamProp) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = true;

        p.visit_children_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator) {
        let old_decl_collector_is_pat_decl = self.decl_collector.is_pat_decl;
        self.decl_collector.is_pat_decl = true;

        node.name.visit_with(self);

        self.decl_collector.is_pat_decl = false;

        node.init.visit_with(self);

        self.decl_collector.is_pat_decl = old_decl_collector_is_pat_decl;
    }

    fn visit_super_prop(&mut self, node: &SuperProp) {
        let old_id_collector_stopped = self.id_collector.stopped;
        if node.is_ident() {
            self.id_collector.stopped = true;
        }

        node.visit_children_with(self);

        if node.is_ident() {
            self.id_collector.stopped = old_id_collector_stopped;
        }
    }

    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier) {
        let old_id_collector_stopped = self.id_collector.stopped;
        self.id_collector.stopped = true;

        n.visit_children_with(self);

        self.id_collector.stopped = old_id_collector_stopped;
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        let old_id_collector_stopped = self.id_collector.stopped;
        self.id_collector.stopped = true;

        n.visit_children_with(self);

        self.id_collector.stopped = old_id_collector_stopped;
    }

    fn visit_export_namespace_specifier(&mut self, n: &ExportNamespaceSpecifier) {
        let old_id_collector_stopped = self.id_collector.stopped;
        self.id_collector.stopped = true;

        n.visit_children_with(self);

        self.id_collector.stopped = old_id_collector_stopped;
    }

    fn visit_ident(&mut self, id: &Ident) {
        self.id_collector.handle_ident(id);
    }

    fn visit_named_export(&mut self, e: &NamedExport) {
        let old_id_collector_stopped = self.id_collector.stopped;
        if e.src.is_some() {
            self.id_collector.stopped = true;
        }

        e.visit_children_with(self);

        if e.src.is_some() {
            self.id_collector.stopped = old_id_collector_stopped;
        }
    }
}

pub(super) fn collect<I, N>(
    n: &N,
    top_level_mark_for_eval: Option<Mark>,
) -> (FxHashSet<Id>, FxHashSet<I>, FxHashSet<I>)
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<Collector<I>>,
{
    let id_collector = IdCollector {
        ids: Default::default(),
        stopped: false,
    };
    let decl_collector = CustomBindingCollector {
        bindings: Default::default(),
        preserved: Default::default(),
        is_pat_decl: false,
        top_level_for_eval: top_level_mark_for_eval.map(|m| SyntaxContext::empty().apply_mark(m)),
    };

    let mut v = Collector {
        id_collector,
        decl_collector,
    };

    n.visit_with(&mut v);

    (
        v.id_collector.ids,
        v.decl_collector.bindings,
        v.decl_collector.preserved,
    )
}
