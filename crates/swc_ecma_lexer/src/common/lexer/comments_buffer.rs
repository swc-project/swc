use swc_common::{comments::Comment, BytePos};

#[derive(Debug, Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Debug, Clone)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Default, Clone)]
pub struct CommentsBuffer {
    comments: Vec<BufferedComment>,
    pending_leading: Vec<Comment>,
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn push_comment(&mut self, comment: BufferedComment) {
        if let Some(last_comment) = self.comments.last() {
            if last_comment.comment.span.lo >= comment.comment.span.lo {
                // If the last comment starts after the new comment,
                // we should not add it again.
                return;
            }
        }
        self.comments.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        if let Some(last_comment) = self.pending_leading.last() {
            if last_comment.span.lo >= comment.span.lo {
                // If the last comment starts after the new comment,
                // we should not add it again.
                return;
            }
        }
        self.pending_leading.push(comment);
    }

    pub fn pending_leading_to_comments<F: Fn(Comment) -> BufferedComment>(&mut self, f: F) {
        for comment in self.pending_leading.drain(..) {
            let comment = f(comment);
            self.comments.push(comment);
        }
    }

    pub fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.drain(..)
    }
}
