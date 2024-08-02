use oxc_ast::{Comment, CommentKind, Trivias};
use swc_common::{BytePos, Span};

#[derive(Debug, Default)]
pub struct TriviaBuilder {
    // NOTE(lucab): This is a set of unique comments. Duplicated
    // comments could be generated in case of rewind; they are
    // filtered out at insertion time.
    comments: Vec<Comment>,
    irregular_whitespaces: Vec<Span>,
}

impl TriviaBuilder {
    pub fn build(self) -> Trivias {
        Trivias::new(self.comments.into_boxed_slice(), self.irregular_whitespaces)
    }

    pub fn add_single_line_comment(&mut self, start: BytePos, end: BytePos) {
        // skip leading `//`
        self.add_comment(Comment::new(
            start + BytePos(2),
            end,
            CommentKind::SingleLine,
        ));
    }

    pub fn add_multi_line_comment(&mut self, start: BytePos, end: BytePos) {
        // skip leading `/*` and trailing `*/`
        self.add_comment(Comment::new(
            start + BytePos(2),
            end - BytePos(2),
            CommentKind::MultiLine,
        ));
    }

    fn add_comment(&mut self, comment: Comment) {
        // The comments array is an ordered vec, only add the comment if its not added
        // before, to avoid situations where the parser needs to rewind and
        // tries to reinsert the comment.
        if let Some(last_comment) = self.comments.last() {
            if comment.span.lo <= last_comment.span.lo {
                return;
            }
        }
        self.comments.push(comment);
    }

    pub fn add_irregular_whitespace(&mut self, start: BytePos, end: BytePos) {
        self.irregular_whitespaces.push(Span::new(start, end));
    }
}
