use swc_common::{comments::Comments, BytePos, Span};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

/// Preserves comments that would otherwise be dropped.
///
/// If during compilation an ast node associated with
/// a comment is dropped, the comment will not appear in the final emitted
/// output. This can create problems in the JavaScript ecosystem, particularly
/// around instanbul coverage and other tooling that relies on comment
/// directives.
///
/// This transformer shifts orphaned comments to the next closest ast-node.

pub fn dropped_comments_preserver(comments: Option<&dyn Comments>) -> impl '_ + Fold + VisitMut {
    as_folder(DroppedCommentsPreserver {
        comments,
        comment_position: 0,
        is_first_span: true,
    })
}

struct DroppedCommentsPreserver<'a> {
    comments: Option<&'a dyn Comments>,
    comment_position: u32,
    is_first_span: bool,
}

impl VisitMut for DroppedCommentsPreserver<'_> {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, span: &mut Span) {
        if span.is_dummy() || self.is_first_span {
            self.is_first_span = false;
            return;
        }

        let mut leading_comments = Vec::new();
        let mut trailing_comments = Vec::new();

        for idx in (self.comment_position..=span.lo.0).map(BytePos) {
            leading_comments.extend(self.comments.take_leading(idx).unwrap_or_default());
            trailing_comments.extend(self.comments.take_trailing(idx).unwrap_or_default());

            self.comment_position += 1;
        }

        self.comments
            .add_leading_comments(span.lo, leading_comments);
        self.comments
            .add_trailing_comments(span.hi, trailing_comments);

        span.visit_mut_children_with(self)
    }
}
