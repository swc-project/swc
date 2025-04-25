use state::State;
use swc_common::{
    input::{Input, StringInput},
    BytePos, Span,
};

use super::{context::Context, input::Tokens};
use crate::error::SyntaxError;

pub mod char;
pub mod comments_buffer;
pub mod state;
pub mod whitespace;

pub type LexResult<T> = Result<T, crate::error::Error>;

pub trait Lexer<'a, TokenAndSpan>: Tokens<TokenAndSpan> {
    type State: self::state::State;

    fn input(&self) -> &StringInput<'a>;
    fn input_mut(&mut self) -> &mut StringInput<'a>;
    fn state(&self) -> &Self::State;
    fn state_mut(&mut self) -> &mut Self::State;
    fn comments_buffer(&self) -> Option<&self::comments_buffer::CommentsBuffer>;
    fn comments_buffer_mut(&mut self) -> Option<&mut self::comments_buffer::CommentsBuffer>;
    /// # Safety
    ///
    /// We know that the start and the end are valid
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str;
    fn atom(&self, s: &'a str) -> swc_atoms::Atom;
    fn push_error(&self, error: crate::error::Error);

    fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        Span { lo: start, hi: end }
    }

    #[inline(always)]
    fn bump(&mut self) {
        unsafe {
            // Safety: Actually this is not safe but this is an internal method.
            self.input_mut().bump()
        }
    }

    #[inline(always)]
    fn is(&self, c: u8) -> bool {
        self.input().is_byte(c)
    }

    #[inline(always)]
    fn is_str(&self, s: &str) -> bool {
        self.input().is_str(s)
    }

    #[inline(always)]
    fn eat(&mut self, c: u8) -> bool {
        self.input_mut().eat_byte(c)
    }

    #[inline(always)]
    fn cur(&self) -> Option<char> {
        self.input().cur()
    }

    #[inline(always)]
    fn peek(&self) -> Option<char> {
        self.input().peek()
    }

    #[inline(always)]
    fn peek_ahead(&self) -> Option<char> {
        self.input().peek_ahead()
    }

    #[inline(always)]
    fn cur_pos(&self) -> BytePos {
        self.input().cur_pos()
    }

    #[inline(always)]
    fn last_pos(&self) -> BytePos {
        self.input().last_pos()
    }

    /// Shorthand for `let span = self.span(start); self.error_span(span)`
    #[cold]
    #[inline(never)]
    fn error<T>(&self, start: BytePos, kind: SyntaxError) -> LexResult<T> {
        let span = self.span(start);
        self.error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    fn error_span<T>(&self, span: Span, kind: SyntaxError) -> LexResult<T> {
        Err(crate::error::Error::new(span, kind))
    }

    #[cold]
    #[inline(never)]
    fn emit_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    fn emit_error_span(&mut self, span: Span, kind: SyntaxError) {
        if self.ctx().contains(Context::IgnoreError) {
            return;
        }
        tracing::warn!("Lexer error at {:?}", span);
        let err = crate::error::Error::new(span, kind);
        self.push_error(err);
    }

    #[cold]
    #[inline(never)]
    fn emit_strict_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        if self.ctx().contains(Context::Strict) {
            self.emit_error_span(span, kind);
        } else {
            let err = crate::error::Error::new(span, kind);
            self.add_module_mode_error(err);
        }
    }

    #[cold]
    #[inline(never)]
    fn emit_module_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        let err = crate::error::Error::new(span, kind);
        self.add_module_mode_error(err);
    }

    #[inline(never)]
    fn skip_line_comment(&mut self, start_skip: usize) {
        let start = self.cur_pos();
        self.input_mut().bump_bytes(start_skip);
        let slice_start = self.cur_pos();

        // foo // comment for foo
        // bar
        //
        // foo
        // // comment for bar
        // bar
        //
        let is_for_next =
            self.state().had_line_break() || !self.state().can_have_trailing_line_comment();

        // Optimization: Performance improvement with byte-based termination character
        // search
        let input_str = self.input().as_str();
        let bytes = input_str.as_bytes();
        let mut idx = 0;
        let len = bytes.len();

        // Direct search for line termination characters (ASCII case optimization)
        while idx < len {
            let b = *unsafe { bytes.get_unchecked(idx) };
            if b == b'\r' || b == b'\n' {
                self.state_mut().set_had_line_break(true);
                break;
            } else if b > 127 {
                // non-ASCII case: Check for Unicode line termination characters
                let s = unsafe { input_str.get_unchecked(idx..) };
                if let Some(first_char) = s.chars().next() {
                    if first_char == '\u{2028}' || first_char == '\u{2029}' {
                        self.state_mut().set_had_line_break(true);
                        break;
                    }
                    idx += first_char.len_utf8() - 1; // -1은 아래 증가분 고려
                }
            }
            idx += 1;
        }

        self.input_mut().bump_bytes(idx);
        let end = self.cur_pos();

        // Create and process slice only if comments need to be stored
        if self.comments_buffer().is_some() {
            let s = unsafe {
                // Safety: We know that the start and the end are valid
                self.input_slice(slice_start, end)
            };
            let cmt = swc_common::comments::Comment {
                kind: swc_common::comments::CommentKind::Line,
                span: Span::new(start, end),
                text: self.atom(s),
            };

            if is_for_next {
                let comments = self.comments_buffer_mut().unwrap();
                comments.push_pending_leading(cmt);
            } else {
                let pos = self.state().prev_hi();
                let comments = self.comments_buffer_mut().unwrap();
                comments.push(self::comments_buffer::BufferedComment {
                    kind: self::comments_buffer::BufferedCommentKind::Trailing,
                    pos,
                    comment: cmt,
                });
            }
        }

        unsafe {
            // Safety: We got end from self.input
            self.input_mut().reset_to(end);
        }
    }
}
