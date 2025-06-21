use std::{iter::Rev, vec::IntoIter};

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
            comments: Vec::with_capacity(32),
            pending_leading: Vec::with_capacity(16),
        }
    }

    pub fn push(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    pub fn take_comments(&mut self) -> Rev<IntoIter<BufferedComment>> {
        std::mem::take(&mut self.comments).into_iter().rev()
    }

    pub fn take_pending_leading(&mut self) -> Rev<IntoIter<Comment>> {
        std::mem::take(&mut self.pending_leading).into_iter().rev()
    }
}
