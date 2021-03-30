use swc_common::comments::Comment;
use swc_common::comments::Comments;
use swc_common::comments::CommentsExt;
use swc_common::Span;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;

struct CommentCollector<C> {
    comments: C,
    found: bool,
}

impl<C> CommentCollector<C> where C: Comments {}

impl<C> Visit for CommentCollector<C>
where
    C: Comments,
{
    fn visit_span(&mut self, n: &Span, _: &dyn Node) {
        self.comments.with_leading(n.lo, |comments| {
            // Check for comments
        });

        self.comments.with_trailing(n.lo, |comments| {
            // Check for comments
        });
    }
}
