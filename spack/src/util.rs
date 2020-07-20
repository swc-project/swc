use swc_common::{Span, SyntaxContext};
use swc_ecma_visit::Fold;

pub struct HygieneRemover;

impl Fold for HygieneRemover {
    fn fold_span(&mut self, s: Span) -> Span {
        s.with_ctxt(SyntaxContext::empty())
    }
}
