use swc_common::{Fold, Span, SyntaxContext};

pub struct HygieneRemover;

impl Fold<Span> for HygieneRemover {
    fn fold(&mut self, s: Span) -> Span {
        s.with_ctxt(SyntaxContext::empty())
    }
}
