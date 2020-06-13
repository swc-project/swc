use swc_common::{Fold, Span, SyntaxContext, Visit, VisitWith};
use swc_ecma_ast::Ident;

pub(crate) struct HygieneVisualizer;

impl Fold<Ident> for HygieneVisualizer {
    fn fold(&mut self, node: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", node.sym, node.span.ctxt()).into(),
            ..node
        }
    }
}

pub(crate) struct AssertClean;

impl Visit<Span> for AssertClean {
    fn visit(&mut self, s: &Span) {
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
