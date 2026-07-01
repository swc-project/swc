use swc_common::{comments::Comment, BytePos};

#[derive(Debug, Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Debug, Clone, Copy)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Default, Clone)]
pub struct CommentsBuffer {
    comments: Vec<BufferedComment>,
    pending_leading: Vec<Comment>,
    leading_count: usize,
    trailing_count: usize,
}

#[derive(Debug, Default)]
pub struct CommentsBufferCheckpoint {
    comments_pos: usize,
    pending_leading: usize,
    leading_count: usize,
    trailing_count: usize,
}

impl CommentsBuffer {
    pub fn with_capacity(comments: usize) -> Self {
        Self {
            comments: Vec::with_capacity(comments),
            pending_leading: Vec::with_capacity(4),
            leading_count: 0,
            trailing_count: 0,
        }
    }

    pub fn checkpoint_save(&self) -> CommentsBufferCheckpoint {
        CommentsBufferCheckpoint {
            comments_pos: self.comments.len(),
            pending_leading: self.pending_leading.len(),
            leading_count: self.leading_count,
            trailing_count: self.trailing_count,
        }
    }

    pub fn checkpoint_load(&mut self, checkpoint: CommentsBufferCheckpoint) {
        self.comments.truncate(checkpoint.comments_pos);
        self.pending_leading.truncate(checkpoint.pending_leading);
        self.leading_count = checkpoint.leading_count;
        self.trailing_count = checkpoint.trailing_count;
    }
}

impl CommentsBuffer {
    #[inline(always)]
    pub fn push_comment(&mut self, comment: BufferedComment) {
        self.increment_count(comment.kind, 1);
        self.comments.push(comment);
    }

    #[inline(always)]
    pub fn push_pending(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    #[inline(always)]
    pub fn pending_to_comment(&mut self, kind: BufferedCommentKind, pos: BytePos) {
        // Most tokens have no pending comments; avoid creating an empty drain on
        // this lexer hot path.
        match self.pending_leading.len() {
            0 => return,
            1 => {
                let comment = self.pending_leading.pop().unwrap();
                let comment = BufferedComment { kind, pos, comment };
                self.increment_count(kind, 1);
                self.comments.push(comment);
                return;
            }
            len => {
                self.increment_count(kind, len);
            }
        }

        for comment in self.pending_leading.drain(..) {
            let comment = BufferedComment { kind, pos, comment };
            self.comments.push(comment);
        }
    }

    #[inline(always)]
    pub fn comment_counts(&self) -> (usize, usize) {
        (self.leading_count, self.trailing_count)
    }

    #[inline(always)]
    pub fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.leading_count = 0;
        self.trailing_count = 0;
        self.comments.drain(..)
    }

    #[inline(always)]
    fn increment_count(&mut self, kind: BufferedCommentKind, count: usize) {
        match kind {
            BufferedCommentKind::Leading => self.leading_count += count,
            BufferedCommentKind::Trailing => self.trailing_count += count,
        }
    }
}
