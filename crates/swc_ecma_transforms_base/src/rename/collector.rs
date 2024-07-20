use std::hash::Hash;

use rustc_hash::FxHashSet;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, stack_size::maybe_grow_default};
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

pub(super) struct IdCollector {
    pub ids: FxHashSet<Id>,
}

impl Visit for IdCollector {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_export_default_specifier(&mut self, _: &ExportDefaultSpecifier) {}

    fn visit_export_named_specifier(&mut self, _: &ExportNamedSpecifier) {}

    fn visit_export_namespace_specifier(&mut self, _: &ExportNamespaceSpecifier) {}

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        maybe_grow_default(|| n.visit_children_with(self));
    }

    fn visit_ident(&mut self, id: &Ident) {
        if id.ctxt != SyntaxContext::empty() {
            self.ids.insert(id.to_id());
        }
    }

    fn visit_named_export(&mut self, e: &NamedExport) {
        if e.src.is_some() {
            return;
        }

        e.visit_children_with(self);
    }

    fn visit_prop_name(&mut self, p: &PropName) {
        if let PropName::Computed(n) = p {
            n.visit_with(self);
        }
    }
}

pub(super) struct CustomBindingCollector<I>
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
}

impl<I> Visit for CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        let old = self.is_pat_decl;

        for p in &n.params {
            self.is_pat_decl = true;
            p.visit_with(self);
        }

        n.body.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_assign_pat_prop(&mut self, node: &AssignPatProp) {
        node.value.visit_with(self);

        if self.is_pat_decl {
            self.add(&Ident::from(&node.key));
        }
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        n.visit_children_with(self);

        if self.is_pat_decl {
            self.add(&Ident::from(n))
        }
    }

    fn visit_catch_clause(&mut self, node: &CatchClause) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.param.visit_with(self);

        self.is_pat_decl = false;
        node.body.visit_with(self);
        self.is_pat_decl = old;
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        node.visit_children_with(self);

        if let Some(id) = &node.ident {
            self.add(id);
        }
    }

    fn visit_expr(&mut self, node: &Expr) {
        let old = self.is_pat_decl;
        self.is_pat_decl = false;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_bin_expr(&mut self, node: &BinExpr) {
        maybe_grow_default(|| node.visit_children_with(self));
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        node.visit_children_with(self);

        self.add(&node.ident);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        node.visit_children_with(self);

        if let Some(id) = &node.ident {
            self.add(id);
        }
    }

    fn visit_import_default_specifier(&mut self, node: &ImportDefaultSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_named_specifier(&mut self, node: &ImportNamedSpecifier) {
        self.add(&node.local);
    }

    fn visit_import_star_as_specifier(&mut self, node: &ImportStarAsSpecifier) {
        self.add(&node.local);
    }

    fn visit_param(&mut self, node: &Param) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.visit_children_with(self);
        self.is_pat_decl = old;
    }

    fn visit_ts_param_prop(&mut self, p: &TsParamProp) {
        let old = self.is_pat_decl;

        self.is_pat_decl = true;
        p.visit_children_with(self);

        self.is_pat_decl = old;
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator) {
        let old = self.is_pat_decl;
        self.is_pat_decl = true;
        node.name.visit_with(self);

        self.is_pat_decl = false;
        node.init.visit_with(self);
        self.is_pat_decl = old;
    }
}

/// Returns `(bindings, preserved)`.
pub(super) fn collect_decls<I, N>(
    n: &N,
    top_level_mark_for_eval: Option<Mark>,
) -> (FxHashSet<I>, FxHashSet<I>)
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<CustomBindingCollector<I>>,
{
    let mut v = CustomBindingCollector {
        bindings: Default::default(),
        preserved: Default::default(),
        is_pat_decl: false,
        top_level_for_eval: top_level_mark_for_eval.map(|m| SyntaxContext::empty().apply_mark(m)),
    };
    n.visit_with(&mut v);
    (v.bindings, v.preserved)
}
