use swc_common::comments::Comment;
use swc_ecma_lexer::common::lexer::comments_buffer::{BufferedComment, CommentsBufferTrait};

#[derive(Default, Clone)]
pub struct CommentsBuffer {
    comments: Vec<BufferedComment>,
    pending_leading: Vec<Comment>,
}

#[derive(Debug, Default)]
pub struct CommentsBufferCheckpoint {
    comments_pos: usize,
    pending_leading: usize,
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn checkpoint_save(&self) -> CommentsBufferCheckpoint {
        CommentsBufferCheckpoint {
            comments_pos: self.comments.len(),
            pending_leading: self.pending_leading.len(),
        }
    }

    pub fn checkpoint_load(&mut self, checkpoint: CommentsBufferCheckpoint) {
        self.comments.truncate(checkpoint.comments_pos);
        self.pending_leading.truncate(checkpoint.pending_leading);
    }
}

impl CommentsBufferTrait for CommentsBuffer {
    fn push_comment(&mut self, comment: BufferedComment) {
        if let Some(last_comment) = self.comments.last() {
            if last_comment.comment.span.lo >= comment.comment.span.lo {
                // If the last comment starts after the new comment,
                // we should not add it again.
                return;
            }
        }
        self.comments.push(comment);
    }

    fn push_pending_leading(&mut self, comment: Comment) {
        if let Some(last_comment) = self.pending_leading.last() {
            if last_comment.span.lo >= comment.span.lo {
                // If the last comment starts after the new comment,
                // we should not add it again.
                return;
            }
        }
        self.pending_leading.push(comment);
    }

    fn pending_leading_to_comments<F: Fn(Comment) -> BufferedComment>(&mut self, f: F) {
        for comment in self.pending_leading.drain(..) {
            let comment = f(comment);
            self.comments.push(comment);
        }
    }

    fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.drain(..)
    }
}
