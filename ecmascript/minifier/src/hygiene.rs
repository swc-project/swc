use swc_common::Mark;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;

/// Makes all nodes except identifiers unique in aspect of span hygiene.
pub(crate) fn unique_marker() -> impl VisitMut {
    UniqueMarker
}

struct UniqueMarker;

impl VisitMut for UniqueMarker {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_span(&mut self, span: &mut Span) {
        debug_assert_eq!(
            span.ctxt,
            SyntaxContext::empty(),
            "unique_marker: Expected empty syntax context"
        );

        span.ctxt = span.ctxt.apply_mark(Mark::fresh(Mark::root()));
    }
}
