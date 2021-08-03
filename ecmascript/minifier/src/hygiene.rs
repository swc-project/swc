use crate::marks::Marks;
use swc_common::comments::Comments;
use swc_common::Mark;
use swc_common::Span;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// This pass analyzes the comment
///
/// - Makes all nodes except identifiers unique in aspect of span hygiene.
/// - Convert annottatinos into [Mark].
pub(crate) fn info_marker<'a>(
    comments: Option<&'a dyn Comments>,
    marks: Marks,
) -> impl 'a + VisitMut {
    InfoMarker { comments, marks }
}

struct InfoMarker<'a> {
    comments: Option<&'a dyn Comments>,
    marks: Marks,
}

impl InfoMarker<'_> {
    fn make_unique(&self, span: &mut Span) {
        debug_assert_eq!(
            span.ctxt,
            SyntaxContext::empty(),
            "Expected empty syntax context"
        );

        span.ctxt = span.ctxt.apply_mark(Mark::fresh(Mark::root()));
    }
}

impl VisitMut for InfoMarker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    fn visit_mut_lit(&mut self, _: &mut Lit) {}
}
