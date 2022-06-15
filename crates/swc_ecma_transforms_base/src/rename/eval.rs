use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

pub(crate) fn contains_eval<N>(node: &N, include_with: bool) -> bool
where
    N: VisitWith<EvalFinder>,
{
    let mut v = EvalFinder {
        found: false,
        include_with,
    };

    node.visit_with(&mut v);
    v.found
}

pub(crate) struct EvalFinder {
    found: bool,
    include_with: bool,
}

impl Visit for EvalFinder {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_export_default_specifier(&mut self, _: &ExportDefaultSpecifier) {}

    fn visit_export_named_specifier(&mut self, _: &ExportNamedSpecifier) {}

    fn visit_export_namespace_specifier(&mut self, _: &ExportNamespaceSpecifier) {}

    fn visit_ident(&mut self, i: &Ident) {
        if i.sym == js_word!("eval") {
            self.found = true;
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

    fn visit_with_stmt(&mut self, s: &WithStmt) {
        if self.include_with {
            self.found = true;
        } else {
            s.visit_children_with(self);
        }
    }
}
