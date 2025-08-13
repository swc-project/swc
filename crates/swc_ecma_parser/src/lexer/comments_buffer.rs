use swc_common::{comments::Comment, BytePos};
use swc_ecma_lexer::common::lexer::comments_buffer::{
    BufferedComment, BufferedCommentKind, CommentsBufferTrait,
};

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
    #[inline]
    fn push_comment(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    #[inline]
    fn push_pending(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    #[inline]
    fn pending_to_comment(&mut self, kind: BufferedCommentKind, pos: BytePos) {
        for comment in self.pending_leading.drain(..) {
            let comment = BufferedComment { kind, pos, comment };
            self.comments.push(comment);
        }
    }

    #[inline]
    fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.drain(..)
    }
}
