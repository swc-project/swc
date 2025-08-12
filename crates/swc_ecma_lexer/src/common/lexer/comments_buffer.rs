use swc_common::{comments::Comment, BytePos};

#[derive(Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Clone)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Clone)]
pub struct CommentsBuffer {
    comments: Vec<BufferedComment>,
    pending_leading: Vec<Comment>,
}

impl Default for CommentsBuffer {
    fn default() -> Self {
        Self::new()
    }
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self {
            comments: Vec::new(),
            pending_leading: Vec::new(),
        }
    }

    pub fn push(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    pub fn pending_leading_to_comments<F: Fn(Comment) -> BufferedComment>(&mut self, f: F) {
        for comment in self.pending_leading.drain(..) {
            self.comments.push(f(comment));
        }
    }

    pub fn comments_to_pending_leading<F: Fn(Comment) -> BufferedComment>(&mut self, f: F) {
        for comment in self.pending_leading.drain(..) {
            self.comments.push(f(comment));
        }
    }

    pub fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.drain(..)
    }

    pub fn take_pending_leading(&mut self) -> impl Iterator<Item = Comment> + '_ {
        self.pending_leading.drain(..)
    }
}
