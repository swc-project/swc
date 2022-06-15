use std::hash::Hash;

use rustc_hash::FxHashSet;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
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

    fn visit_ident(&mut self, id: &Ident) {
        if id.span.ctxt != SyntaxContext::empty() {
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
    is_pat_decl: bool,
}

impl<I> CustomBindingCollector<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
{
    fn add(&mut self, i: &Ident) {
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
            self.add(&node.key);
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

    fn visit_pat(&mut self, node: &Pat) {
        node.visit_children_with(self);

        if self.is_pat_decl {
            if let Pat::Ident(i) = node {
                self.add(&i.id)
            }
        }
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

pub(super) fn collect_decls<I, N>(n: &N) -> FxHashSet<I>
where
    I: IdentLike + Eq + Hash + Send + Sync,
    N: VisitWith<CustomBindingCollector<I>>,
{
    let mut v = CustomBindingCollector {
        bindings: Default::default(),
        is_pat_decl: false,
    };
    n.visit_with(&mut v);
    v.bindings
}
