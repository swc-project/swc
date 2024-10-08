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
use tracing::warn;

use super::{
    comments_buffer::BufferedComment, input::Input, whitespace::SkipWhitespace, Char, LexResult,
    Lexer,
};
use crate::{
    error::{Error, SyntaxError},
    lexer::comments_buffer::BufferedCommentKind,
    Tokens,
};

impl Lexer<'_> {
    pub(super) fn span(&self, start: BytePos) -> Span {
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
    pub(super) fn bump(&mut self) {
        unsafe {
            // Safety: Actually this is not safe but this is an internal method.
            self.input.bump()
        }
    }

    #[inline(always)]
    pub(super) fn is(&mut self, c: u8) -> bool {
        self.input.is_byte(c)
    }

    #[inline(always)]
    pub(super) fn is_str(&self, s: &str) -> bool {
        self.input.is_str(s)
    }

    #[inline(always)]
    pub(super) fn eat(&mut self, c: u8) -> bool {
        self.input.eat_byte(c)
    }

    #[inline(always)]
    pub(super) fn cur(&mut self) -> Option<char> {
        self.input.cur()
    }

    #[inline(always)]
    pub(super) fn peek(&mut self) -> Option<char> {
        self.input.peek()
    }

    #[inline(always)]
    pub(super) fn peek_ahead(&mut self) -> Option<char> {
        self.input.peek_ahead()
    }

    #[inline(always)]
    pub(super) fn cur_pos(&mut self) -> BytePos {
        self.input.cur_pos()
    }

    #[inline(always)]
    pub(super) fn last_pos(&self) -> BytePos {
        self.input.last_pos()
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
    pub(super) fn skip_space<const LEX_COMMENTS: bool>(&mut self) {
        loop {
            let (offset, newline) = {
                let mut skip = SkipWhitespace {
                    input: self.input.as_str(),
                    newline: false,
                    offset: 0,
                };

                skip.scan();

                (skip.offset, skip.newline)
            };

            self.input.bump_bytes(offset as usize);
            if newline {
                self.state.had_line_break = true;
            }

            if LEX_COMMENTS && self.input.is_byte(b'/') {
                if self.peek() == Some('/') {
                    self.skip_line_comment(2);
                    continue;
                } else if self.peek() == Some('*') {
                    self.skip_block_comment();
                    continue;
                }
            }

            break;
        }
    }

    #[inline(never)]
    pub(super) fn skip_line_comment(&mut self, start_skip: usize) {
        let start = self.cur_pos();
        self.input.bump_bytes(start_skip);
        let slice_start = self.cur_pos();

        // foo // comment for foo
        // bar
        //
        // foo
        // // comment for bar
        // bar
        //
        let is_for_next = self.state.had_line_break || !self.state.can_have_trailing_line_comment();

        let idx = self
            .input
            .as_str()
            .find(['\r', '\n', '\u{2028}', '\u{2029}'])
            .map_or(self.input.as_str().len(), |v| {
                self.state.had_line_break = true;
                v
            });

        self.input.bump_bytes(idx);
        let end = self.cur_pos();

        if let Some(comments) = self.comments_buffer.as_mut() {
            let s = unsafe {
                // Safety: We know that the start and the end are valid
                self.input.slice(slice_start, end)
            };
            let cmt = Comment {
                kind: CommentKind::Line,
                span: Span::new(start, end),
                text: self.atoms.atom(s),
            };

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

        unsafe {
            // Safety: We got end from self.input
            self.input.reset_to(end);
        }
    }

    /// Expects current char to be '/' and next char to be '*'.
    #[inline(never)]
    pub(super) fn skip_block_comment(&mut self) {
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('/'));
        debug_assert_eq!(self.peek(), Some('*'));

        self.input.bump_bytes(2);

        // jsdoc
        let slice_start = self.cur_pos();
        let mut was_star = if self.input.is_byte(b'*') {
            self.bump();
            true
        } else {
            false
        };

        let mut is_for_next = self.state.had_line_break || !self.state.can_have_trailing_comment();

        while let Some(c) = self.cur() {
            if was_star && c == '/' {
                debug_assert_eq!(self.cur(), Some('/'));
                self.bump(); // '/'

                let end = self.cur_pos();

                self.skip_space::<false>();

                if self.input.is_byte(b';') {
                    is_for_next = false;
                }

                self.store_comment(is_for_next, start, end, slice_start);

                return;
            }
            if c.is_line_terminator() {
                self.state.had_line_break = true;
            }

            was_star = c == '*';
            self.bump();
        }

        let end = self.input.end_pos();
        let span = Span::new(end, end);
        self.emit_error_span(span, SyntaxError::UnterminatedBlockComment)
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
