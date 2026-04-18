use swc_common::Span;

use super::input::{Buffer, Tokens};
use crate::lexer::{NextTokenAndSpan, TokenAndSpan};

/// Snapshot of the parser cursor state used by speculative TS parses.
#[derive(Clone)]
pub(crate) struct CursorCheckpoint<I: Tokens> {
    lexer: I::Checkpoint,
    prev_span: Span,
    cur: TokenAndSpan,
    next: Option<NextTokenAndSpan>,
}

impl<I: Tokens> Buffer<I> {
    #[inline(always)]
    pub(crate) fn checkpoint_save(&self) -> CursorCheckpoint<I> {
        CursorCheckpoint {
            lexer: self.iter.checkpoint_save(),
            prev_span: self.prev_span,
            cur: self.cur,
            next: self.next,
        }
    }

    #[inline(always)]
    pub(crate) fn checkpoint_load(&mut self, checkpoint: CursorCheckpoint<I>) {
        self.iter.checkpoint_load(checkpoint.lexer);
        self.prev_span = checkpoint.prev_span;
        self.cur = checkpoint.cur;
        self.next = checkpoint.next;
    }
}

pub(crate) type Cursor<I> = Buffer<I>;
