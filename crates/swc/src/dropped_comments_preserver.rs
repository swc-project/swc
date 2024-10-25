use swc_common::{
    comments::{Comment, Comments, SingleThreadedComments},
    BytePos, Span, DUMMY_SP,
};
use swc_ecma_ast::{Module, Pass, Script};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

/// Preserves comments that would otherwise be dropped.
///
/// If during compilation an ast node associated with
/// a comment is dropped, the comment will not appear in the final emitted
/// output. This can create problems in the JavaScript ecosystem, particularly
/// around istanbul coverage and other tooling that relies on comment
/// directives.
///
/// This transformer shifts orphaned comments to the next closest known span
/// while making a best-effort to preserve the "general orientation" of
/// comments.
pub fn dropped_comments_preserver(comments: Option<SingleThreadedComments>) -> impl Pass {
    visit_mut_pass(DroppedCommentsPreserver {
        comments,
        is_first_span: true,
        known_spans: Vec::new(),
    })
}

struct DroppedCommentsPreserver {
    comments: Option<SingleThreadedComments>,
    is_first_span: bool,
    known_spans: Vec<Span>,
}

type CommentEntries = Vec<(BytePos, Vec<Comment>)>;

impl VisitMut for DroppedCommentsPreserver {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);
        self.known_spans
            .sort_by(|span_a, span_b| span_a.lo.cmp(&span_b.lo));
        self.shift_comments_to_known_spans();
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        script.visit_mut_children_with(self);
        self.known_spans
            .sort_by(|span_a, span_b| span_a.lo.cmp(&span_b.lo));
        self.shift_comments_to_known_spans();
    }

    fn visit_mut_span(&mut self, span: &mut Span) {
        if span.is_dummy() || self.is_first_span {
            self.is_first_span = false;
            return;
        }

        self.known_spans.push(*span);
        span.visit_mut_children_with(self)
    }
}

impl DroppedCommentsPreserver {
    fn shift_comments_to_known_spans(&self) {
        if let Some(comments) = &self.comments {
            let trailing_comments = self.shift_leading_comments(comments);

            self.shift_trailing_comments(trailing_comments);
        }
    }

    /// We'll be shifting all comments to known span positions, so drain the
    /// current comments first to limit the amount of look ups needed into
    /// the hashmaps.
    ///
    /// This way, we only need to take the comments once, and then add them back
    /// once.
    fn collect_existing_comments(&self, comments: &SingleThreadedComments) -> CommentEntries {
        let (mut leading_comments, mut trailing_comments) = comments.borrow_all_mut();
        let mut existing_comments: CommentEntries = leading_comments
            .drain()
            .chain(trailing_comments.drain())
            .collect();

        existing_comments.sort_by(|(bp_a, _), (bp_b, _)| bp_a.cmp(bp_b));

        existing_comments
    }

    /// Shift all comments to known leading positions.
    /// This prevents trailing comments from ending up associated with
    /// nodes that will not emit trailing comments, while
    /// preserving any comments that might show up after all code positions.
    ///
    /// This maintains the highest fidelity between existing comment positions
    /// of pre and post compiled code.
    fn shift_leading_comments(&self, comments: &SingleThreadedComments) -> CommentEntries {
        let mut existing_comments = self.collect_existing_comments(comments);

        existing_comments.sort_by(|(bp_a, _), (bp_b, _)| bp_a.cmp(bp_b));

        for span in self.known_spans.iter() {
            let cut_point = existing_comments.partition_point(|(bp, _)| *bp <= span.lo);
            let collected_comments = existing_comments
                .drain(..cut_point)
                .flat_map(|(_, c)| c)
                .collect::<Vec<Comment>>();
            self.comments
                .add_leading_comments(span.lo, collected_comments)
        }

        existing_comments
    }

    /// These comments trail all known span lo byte positions.
    /// Therefore, by shifting them to trail the highest known hi position, we
    /// ensure that any remaining trailing comments are emitted in a
    /// similar location
    fn shift_trailing_comments(&self, remaining_comment_entries: CommentEntries) {
        let last_trailing = self
            .known_spans
            .iter()
            .max_by_key(|span| span.hi)
            .cloned()
            .unwrap_or(DUMMY_SP);

        self.comments.add_trailing_comments(
            last_trailing.hi,
            remaining_comment_entries
                .into_iter()
                .flat_map(|(_, c)| c)
                .collect(),
        );
    }
}
