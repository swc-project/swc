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

#[derive(Debug, Clone, Copy)]
pub(crate) struct CommentAttachment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
}

#[doc(hidden)]
#[derive(Default)]
pub struct CommentData {
    pub(crate) comments: Vec<Comment>,
    pub(crate) attachments: Vec<CommentAttachment>,
}

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

    /// Drop trivia scanned at or after a parser-directed lexer rewind.
    ///
    /// A slash initially tokenized as division may have caused following
    /// `/* ... */` bytes to be recorded as comments. If the parser then asks
    /// the lexer to reinterpret the slash as a regular expression, those
    /// entries belong to the regex body and must not survive the rewind.
    pub fn rewind_to(&mut self, pos: BytePos) {
        while self
            .comments
            .last()
            .is_some_and(|comment| comment.comment.span.lo >= pos)
        {
            self.comments.pop();
        }
        while self
            .pending_leading
            .last()
            .is_some_and(|comment| comment.span.lo >= pos)
        {
            self.pending_leading.pop();
        }
    }
}

impl CommentsBuffer {
    #[inline(always)]
    pub fn push_comment(&mut self, comment: BufferedComment) {
        self.insert_comment(comment);
    }

    #[inline(always)]
    pub fn push_pending(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    #[inline(always)]
    pub fn has_pending(&self) -> bool {
        !self.pending_leading.is_empty()
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
                self.insert_comment(comment);
                return;
            }
            _ => {}
        }

        let pending = std::mem::take(&mut self.pending_leading);
        for comment in pending {
            let comment = BufferedComment { kind, pos, comment };
            self.insert_comment(comment);
        }
    }

    #[inline]
    fn insert_comment(&mut self, comment: BufferedComment) {
        let lo = comment.comment.span.lo;
        if self
            .comments
            .last()
            .map(|last| last.comment.span.lo <= lo)
            .unwrap_or(true)
        {
            self.comments.push(comment);
            return;
        }

        // Pending leading comments can be finalized after a later trailing
        // line comment. Keep the common append path above branch-only and pay
        // for insertion only for this uncommon attachment ordering.
        let index = self
            .comments
            .partition_point(|existing| existing.comment.span.lo <= lo);
        self.comments.insert(index, comment);
    }

    #[inline(always)]
    pub fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.drain(..)
    }

    pub fn take_comment_data(&mut self) -> CommentData {
        debug_assert!(self.pending_leading.is_empty());
        debug_assert!(
            self.comments
                .windows(2)
                .all(|comments| comments[0].comment.span.lo <= comments[1].comment.span.lo),
            "comments are not in source order: {:?}",
            self.comments
                .iter()
                .map(|comment| comment.comment.span)
                .collect::<Vec<_>>()
        );
        let mut comments = Vec::with_capacity(self.comments.len());
        let mut attachments = Vec::with_capacity(self.comments.len());
        for comment in self.comments.drain(..) {
            comments.push(comment.comment);
            attachments.push(CommentAttachment {
                kind: comment.kind,
                pos: comment.pos,
            });
        }
        CommentData {
            comments,
            attachments,
        }
    }
}
