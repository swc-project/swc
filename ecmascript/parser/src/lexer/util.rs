//! Ported from [babylon/util/identifier.js][]
//!
//! Note: Currently this use xid instead of id because unicode_xid crate
//! exists.
//!
//!
//! [babylon/util/identifier.js]:https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
use super::{input::Input, Char, LexResult, Lexer};
use crate::{
    error::{Error, SyntaxError},
    Tokens,
};
use std::char;
use swc_common::{
    comments::{Comment, CommentKind},
    BytePos, Span, SyntaxContext,
};
use unicode_xid::UnicodeXID;

/// Collector for raw string.
///
/// Methods of this struct is noop if the value is [None].
pub(super) struct Raw(pub Option<String>);

impl Raw {
    #[inline]
    pub fn push_str(&mut self, s: &str) {
        if let Some(ref mut st) = self.0 {
            st.push_str(s)
        }
    }
    #[inline]
    pub fn push(&mut self, c: char) {
        if let Some(ref mut st) = self.0 {
            st.push(c)
        }
    }
}

// pub const BACKSPACE: char = 8 as char;
// pub const SHIFT_OUT: char = 14 as char;
// pub const OGHAM_SPACE_MARK: char = '\u{1680}'; // ' '
// pub const LINE_FEED: char = '\n';
// pub const LINE_SEPARATOR: char = '\u{2028}';
// pub const PARAGRAPH_SEPARATOR: char = '\u{2029}';

impl<'a, I: Input> Lexer<'a, I> {
    pub(super) fn span(&self, start: BytePos) -> Span {
        let end = self.last_pos();
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        Span {
            lo: start,
            hi: end,
            ctxt: SyntaxContext::empty(),
        }
    }

    pub(super) fn bump(&mut self) {
        self.input.bump()
    }

    pub(super) fn is(&mut self, c: u8) -> bool {
        self.input.is_byte(c)
    }

    pub(super) fn eat(&mut self, c: u8) -> bool {
        self.input.eat_byte(c)
    }

    pub(super) fn cur(&mut self) -> Option<char> {
        self.input.cur()
    }
    pub(super) fn peek(&mut self) -> Option<char> {
        self.input.peek()
    }
    pub(super) fn peek_ahead(&mut self) -> Option<char> {
        self.input.peek_ahead()
    }

    pub(super) fn cur_pos(&mut self) -> BytePos {
        self.input.cur_pos()
    }
    pub(super) fn last_pos(&self) -> BytePos {
        self.input.last_pos()
    }

    /// Shorthand for `let span = self.span(start); self.error_span(span)`
    #[cold]
    #[inline(never)]
    pub(super) fn error<T>(&mut self, start: BytePos, kind: SyntaxError) -> LexResult<T> {
        let span = self.span(start);
        self.error_span(Span::new(span.lo, span.hi, span.ctxt), kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn error_span<T>(&mut self, span: Span, kind: SyntaxError) -> LexResult<T> {
        Err(Error {
            error: Box::new((span, kind)),
        })
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_error_span(Span::new(span.lo, span.hi, span.ctxt), kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error_span(&mut self, span: Span, kind: SyntaxError) {
        let err = Error {
            error: Box::new((span, kind)),
        };
        self.errors.borrow_mut().push(err);
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_strict_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_strict_mode_error_span(Span::new(span.lo, span.hi, span.ctxt), kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_strict_mode_error_span(&mut self, span: Span, kind: SyntaxError) {
        if self.ctx.strict {
            self.emit_error_span(span, kind);
            return;
        }

        let err = Error {
            error: Box::new((span, kind)),
        };

        self.add_module_mode_error(err);
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_module_mode_error(&mut self, start: BytePos, kind: SyntaxError) {
        let span = self.span(start);
        self.emit_module_mode_error_span(Span::new(span.lo, span.hi, span.ctxt), kind)
    }

    /// Some codes are valid in a strict mode script  but invalid in module
    /// code.
    #[cold]
    #[inline(never)]
    pub(super) fn emit_module_mode_error_span(&mut self, span: Span, kind: SyntaxError) {
        let err = Error {
            error: Box::new((span, kind)),
        };

        self.add_module_mode_error(err);
    }

    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    pub(super) fn skip_space(&mut self) -> LexResult<()> {
        while let Some(c) = self.cur() {
            match c {
                // white spaces
                '\u{0009}' | '\u{000b}' | '\u{000c}' | '\u{0020}' | '\u{00a0}' | '\u{feff}' => {}
                // line breaks
                '\r' | '\n' | '\u{2028}' | '\u{2029}' => {
                    self.state.had_line_break = true;
                }

                '/' => {
                    if self.peek() == Some('/') {
                        self.skip_line_comment(2);
                        continue;
                    } else if self.peek() == Some('*') {
                        self.skip_block_comment()?;
                        continue;
                    }
                    break;
                }

                _ if c.is_whitespace() => {}

                _ => break,
            }

            self.bump();
        }

        Ok(())
    }

    pub(super) fn skip_line_comment(&mut self, start_skip: usize) {
        let start = self.cur_pos();
        for _ in 0..start_skip {
            self.bump();
        }
        let slice_start = self.cur_pos();

        // foo // comment for foo
        // bar
        //
        // foo
        // // comment for bar
        // bar
        //
        let is_for_next = self.state.had_line_break;
        let mut end = self.cur_pos();

        while let Some(c) = self.cur() {
            self.bump();
            if c.is_line_break() {
                self.state.had_line_break = true;
            }
            match c {
                '\n' | '\r' | '\u{2028}' | '\u{2029}' => {
                    break;
                }
                _ => {
                    end = self.cur_pos();
                }
            }
        }

        if let Some(ref comments) = self.comments {
            let s = self.input.slice(slice_start, end);
            let cmt = Comment {
                kind: CommentKind::Line,
                span: Span::new(start, end, SyntaxContext::empty()),
                text: s.into(),
            };

            if start >= *self.last_comment_pos.borrow() {
                *self.last_comment_pos.borrow_mut() = end;

                if is_for_next {
                    if let Some(buf) = &self.leading_comments_buffer {
                        buf.borrow_mut().push(cmt);
                    }
                } else {
                    comments.add_trailing(self.state.prev_hi, cmt);
                }
            }
        }

        self.input.reset_to(end);
    }

    /// Expects current char to be '/' and next char to be '*'.
    pub(super) fn skip_block_comment(&mut self) -> LexResult<()> {
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('/'));
        debug_assert_eq!(self.peek(), Some('*'));

        self.bump();
        self.bump();

        // jsdoc
        let slice_start = self.cur_pos();
        let mut was_star = if self.cur() == Some('*') {
            self.bump();
            true
        } else {
            false
        };

        let is_for_next = self.state.had_line_break || !self.state.can_have_trailing_comment();

        while let Some(c) = self.cur() {
            if was_star && c == '/' {
                debug_assert_eq!(self.cur(), Some('/'));
                self.bump(); // '/'

                let end = self.cur_pos();
                if let Some(ref comments) = self.comments {
                    let src = self.input.slice(slice_start, end);
                    let s = &src[..src.len() - 2];
                    let cmt = Comment {
                        kind: CommentKind::Block,
                        span: Span::new(start, end, SyntaxContext::empty()),
                        text: s.into(),
                    };

                    let _ = self.input.peek();
                    if start >= *self.last_comment_pos.borrow() {
                        *self.last_comment_pos.borrow_mut() = end;

                        if is_for_next {
                            if let Some(buf) = &self.leading_comments_buffer {
                                buf.borrow_mut().push(cmt);
                            }
                        } else {
                            comments.add_trailing(self.state.prev_hi, cmt);
                        }
                    }
                }
                return Ok(());
            }
            if c.is_line_break() {
                self.state.had_line_break = true;
            }

            was_star = c == '*';
            self.bump();
        }

        self.error(start, SyntaxError::UnterminatedBlockComment)?
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
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || c.is_ascii_alphabetic() || {
            if c.is_ascii() {
                false
            } else {
                UnicodeXID::is_xid_start(c)
            }
        }
    }

    /// Test whether a given character is part of an identifier.
    #[inline]
    fn is_ident_part(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || c == '\u{200c}' || c == '\u{200d}' || c.is_ascii_alphanumeric() || {
            if c.is_ascii() {
                false
            } else {
                UnicodeXID::is_xid_continue(c)
            }
        }
    }

    /// See https://tc39.github.io/ecma262/#sec-line-terminators
    #[inline]
    fn is_line_break(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        match c {
            '\r' | '\n' | '\u{2028}' | '\u{2029}' => true,
            _ => false,
        }
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
                if self.is_line_break() {
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
