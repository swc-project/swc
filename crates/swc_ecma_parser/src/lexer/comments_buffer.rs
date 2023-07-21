use std::{iter::Rev, vec::IntoIter};

use swc_common::{comments::Comment, BytePos};

use super::util::SinglyLinkedList;

#[derive(Clone)]
pub(crate) struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Clone)]
pub(crate) enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Clone)]
pub(crate) struct CommentsBuffer {
    comments: SinglyLinkedList<BufferedComment>,
    pending_leading: SinglyLinkedList<Comment>,
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self {
            comments: Default::default(),
            pending_leading: Default::default(),
        }
    }

    pub fn push(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    pub fn take_comments(&mut self) -> Rev<IntoIter<BufferedComment>> {
        self.comments.take_all()
    }

    pub fn take_pending_leading(&mut self) -> Rev<IntoIter<Comment>> {
        self.pending_leading.take_all()
    }
}
