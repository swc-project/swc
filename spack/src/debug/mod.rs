use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::Ident;
use swc_ecma_visit::{Fold, Node, Visit, VisitWith};

pub(crate) struct HygieneVisualizer;

impl Fold for HygieneVisualizer {
    fn fold_ident(&mut self, node: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", node.sym, node.span.ctxt()).into(),
            ..node
        }
    }
}

pub(crate) struct AssertClean;

impl Visit for AssertClean {
    fn visit_span(&mut self, s: &Span, _: &dyn Node) {
        debug_assert_eq!(
            s.ctxt(),
            SyntaxContext::empty(),
            "Hygiene info should be clean at this moment"
        );
    }
}

pub(crate) fn assert_clean<T: VisitWith<AssertClean>>(m: &T) {
    m.visit_with(&mut AssertClean)
}
