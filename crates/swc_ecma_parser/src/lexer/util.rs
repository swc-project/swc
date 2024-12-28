//! Ported from [babylon/util/identifier.js][]
//!
//!
//! [babylon/util/identifier.js]:https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
use std::char;

use swc_common::{
    comments::{Comment, CommentKind},
    BytePos, Span,
};
use swc_ecma_ast::Ident;
use swc_ecma_raw_lexer::RawToken;
use tracing::warn;

use super::{comments_buffer::BufferedComment, Char, LexResult, Lexer};
use crate::{
    error::{Error, SyntaxError},
    lexer::comments_buffer::BufferedCommentKind,
    Tokens,
};

impl Lexer<'_> {
    pub(super) fn span(&self, start: BytePos) -> Span {
        let end = self.input.cur_pos();
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
    pub(super) fn bump(&mut self) {
        unsafe {
            // Safety: Actually this is not safe but this is an internal method.
            self.input.bump(1)
        }
    }

    /// Shorthand for `let span = self.span(start); self.error_span(span)`
    #[cold]
    #[inline(never)]
    pub(super) fn error<T>(&mut self, start: BytePos, kind: SyntaxError) -> LexResult<T> {
        let span = self.span(start);
        self.error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn error_span<T>(&mut self, span: Span, kind: SyntaxError) -> LexResult<T> {
        Err(Error::new(span, kind))
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error_span(&mut self, span: Span, kind: SyntaxError) {
        if self.ctx.ignore_error {
            return;
        }

        warn!("Lexer error at {:?}", span);
        let err = Error::new(span, kind);
        self.errors.borrow_mut().push(err);
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_strict_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_strict_mode_error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_strict_mode_error_span(&mut self, span: Span, kind: SyntaxError) {
        if self.ctx.strict {
            self.emit_error_span(span, kind);
            return;
        }

        let err = Error::new(span, kind);

        self.add_module_mode_error(err);
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_module_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_module_mode_error_span(span, kind)
    }

    /// Some codes are valid in a strict mode script  but invalid in module
    /// code.
    #[cold]
    #[inline(never)]
    pub(super) fn emit_module_mode_error_span(&mut self, span: Span, kind: SyntaxError) {
        let err = Error::new(span, kind);

        self.add_module_mode_error(err);
    }

    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    #[inline(never)]
    pub(super) fn skip_space<const LEX_COMMENTS: bool>(&mut self) -> LexResult<()> {
        match self.input.cur()? {
            Some(RawToken::Whitespace | RawToken::NewLine) => {
                self.input.next().transpose()?;
            }

            Some(
                RawToken::LineComment
                | RawToken::BlockComment
                | RawToken::LegacyCommentOpen
                | RawToken::LegacyCommentClose,
            ) if LEX_COMMENTS => {
                self.input.next().transpose()?;
            }

            _ => {}
        }

        Ok(())
    }

    #[inline(never)]
    fn store_comment(
        &mut self,
        is_for_next: bool,
        start: BytePos,
        end: BytePos,
        slice_start: BytePos,
    ) {
        if let Some(comments) = self.comments_buffer.as_mut() {
            let src = unsafe {
                // Safety: We got slice_start and end from self.input so those are valid.
                self.input.slice(slice_start, end)
            };
            let s = &src[..src.len() - 2];
            let cmt = Comment {
                kind: CommentKind::Block,
                span: Span::new(start, end),
                text: self.atoms.atom(s),
            };

            let _ = self.input.peek();
            if is_for_next {
                comments.push_pending_leading(cmt);
            } else {
                comments.push(BufferedComment {
                    kind: BufferedCommentKind::Trailing,
                    pos: self.state.prev_hi,
                    comment: cmt,
                });
            }
        }
    }
}

/// Implemented for `char`.
pub trait CharExt: Copy {
    fn to_char(self) -> Option<char>;

    /// Test whether a given character code starts an identifier.
    ///
    /// https://tc39.github.io/ecma262/#prod-IdentifierStart
    #[inline]
    fn is_ident_start(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        Ident::is_valid_start(c)
    }

    /// Test whether a given character is part of an identifier.
    #[inline]
    fn is_ident_part(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        Ident::is_valid_continue(c)
    }

    /// See https://tc39.github.io/ecma262/#sec-line-terminators
    #[inline]
    fn is_line_terminator(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        matches!(c, '\r' | '\n' | '\u{2028}' | '\u{2029}')
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    #[inline]
    fn is_line_break(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        matches!(c, '\r' | '\n')
    }

    /// See https://tc39.github.io/ecma262/#sec-white-space
    #[inline]
    fn is_ws(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        match c {
            '\u{0009}' | '\u{000b}' | '\u{000c}' | '\u{0020}' | '\u{00a0}' | '\u{feff}' => true,
            _ => {
                if self.is_line_terminator() {
                    // NOTE: Line terminator is not whitespace.
                    false
                } else {
                    c.is_whitespace()
                }
            }
        }
    }
}

impl CharExt for Char {
    #[inline(always)]
    fn to_char(self) -> Option<char> {
        char::from_u32(self.0)
    }
}

impl CharExt for char {
    #[inline(always)]
    fn to_char(self) -> Option<char> {
        Some(self)
    }
}
