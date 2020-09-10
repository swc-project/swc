//! Ported from [babylon/util/identifier.js][]
//!
//! Note: Currently this use xid instead of id because unicode_xid crate
//! exists.
//!
//!
//! [babylon/util/identifier.js]:https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
use super::{Char, LexResult, Lexer};
use crate::error::{Error, SyntaxError};
use std::{char, str::Chars};
use swc_common::{
    comments::{Comment, CommentKind},
    BytePos, Span,
};
use swc_ecma_raw_lexer::InternalToken;
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

impl<'a> Lexer<'a> {
    pub fn with_chars<F, Ret>(&mut self, op: F) -> Ret
    where
        F: FnOnce(&mut Lexer, &mut Chars) -> Ret,
    {
        let mut input = self.input.clone();
        let remaining: &str = input.remainder();
        let mut chars = remaining.chars().clone();

        let ret = op(self, &mut chars);

        let diff = remaining.len() - chars.as_str().len();

        input.bump_bytes(diff);
        self.input = input;

        ret
    }

    /// Shorthand for `let span = self.span(start); self.error_span(span)`
    #[cold]
    #[inline(never)]
    pub(super) fn error<T>(&mut self, start: BytePos, kind: SyntaxError) -> LexResult<T> {
        let span = Span::new(start, self.input.span().hi, Default::default());
        self.error_span(span, kind)
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
    pub(super) fn emit_error_bpos(&mut self, start: BytePos, kind: SyntaxError) {
        let span = Span::new(start, self.input.span().hi, Default::default());
        self.emit_error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error(&mut self, kind: SyntaxError) {
        let span = self.input.span();
        self.emit_error_span(span, kind)
    }

    #[cold]
    #[inline(never)]
    pub(super) fn emit_error_span(&mut self, span: Span, kind: SyntaxError) {
        let err = Error {
            error: Box::new((span, kind)),
        };
        self.errors.borrow_mut().push(err);
    }

    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    pub(super) fn skip_space(&mut self) -> LexResult<()> {
        while let Some(c) = self.input.cur() {
            match c {
                // white spaces
                InternalToken::Whitespace => {}
                // line breaks
                InternalToken::NewLine => {
                    self.state.had_line_break = true;
                }

                InternalToken::LineComment => {
                    self.skip_line_comment();
                }
                InternalToken::BlockComment => {
                    self.skip_block_comment()?;
                }

                _ => break,
            }

            self.input.advance();
        }

        Ok(())
    }

    /// Calller should remove `//` before calling this
    pub(super) fn skip_line_comment(&mut self) {
        let start = self.input.cur_pos();

        // foo // comment for foo
        // bar
        //
        // foo
        // // comment for bar
        // bar
        //
        let is_for_next = self.state.had_line_break;

        if let Some(ref comments) = self.comments {
            let s = self.input.slice();
            let cmt = Comment {
                kind: CommentKind::Line,
                span: self.input.span(),
                text: s.into(),
            };

            if start >= *self.last_comment_pos.borrow() {
                *self.last_comment_pos.borrow_mut() = cmt.span.hi;

                if is_for_next {
                    if let Some(buf) = &self.leading_comments_buffer {
                        buf.borrow_mut().push(cmt);
                    }
                } else {
                    comments.add_trailing(self.state.prev_hi, cmt);
                }
            }
        }
    }

    /// Expects current char to be '/' and next char to be '*'.
    pub(super) fn skip_block_comment(&mut self) -> LexResult<()> {
        let start = self.input.cur_pos();

        debug_assert_eq!(self.input.cur(), Some(InternalToken::BlockComment));

        let is_for_next = self.state.had_line_break || !self.state.can_have_trailing_comment();

        if let Some(ref comments) = self.comments {
            let s = self.input.slice();
            let s = &s[..s.len() - 2];
            let cmt = Comment {
                kind: CommentKind::Block,
                span: self.input.span(),
                text: s.into(),
            };

            let _ = self.input.peek();
            if start >= *self.last_comment_pos.borrow() {
                *self.last_comment_pos.borrow_mut() = cmt.span.hi;

                if is_for_next {
                    if let Some(buf) = &self.leading_comments_buffer {
                        buf.borrow_mut().push(cmt);
                    }
                } else {
                    comments.add_trailing(self.state.prev_hi, cmt);
                }
            }
        }
        self.input.advance();
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
