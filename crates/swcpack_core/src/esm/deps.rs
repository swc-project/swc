use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub(crate) fn collect_deps(m: &Module) -> Vec<JsWord> {
    let mut v = DepCollector {
        deps: Default::default(),
    };
    m.visit_with(&mut v);

    v.deps
}

struct DepCollector {
    deps: Vec<JsWord>,
}

/// TODO: export from
/// TODO: dynamic import
impl Visit for DepCollector {
    noop_visit_type!();

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        self.deps.push(n.src.value.clone());
    }
}
