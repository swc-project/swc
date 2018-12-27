//! Ported from [babylon/util/identifier.js][]
//!
//! Note: Currently this use xid instead of id because unicode_xid crate
//! exists.
//!
//!
//! [babylon/util/identifier.js]:https://github.com/babel/babel/blob/master/packages/babylon/src/util/identifier.js
use super::{input::Input, LexResult, Lexer};
use error::{ErrorToDiag, SyntaxError};
use swc_common::{BytePos, Span};
use unicode_xid::UnicodeXID;

pub(super) struct Raw(pub Option<String>);

impl Raw {
    #[inline]
    pub fn push_str(&mut self, s: &str) {
        match self.0 {
            Some(ref mut st) => st.push_str(s),
            _ => {}
        }
    }
    #[inline]
    pub fn push(&mut self, c: char) {
        match self.0 {
            Some(ref mut st) => st.push(c),
            _ => {}
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
        Span::new(start, end, Default::default())
    }

    pub(super) fn bump(&mut self) {
        self.input.bump()
    }

    pub(super) fn is(&mut self, c: char) -> bool {
        self.cur() == Some(c)
    }

    pub(super) fn eat(&mut self, c: char) -> bool {
        if self.is(c) {
            self.bump();
            true
        } else {
            false
        }
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
    pub(super) fn error(&mut self, start: BytePos, kind: SyntaxError) -> LexResult<!> {
        let span = self.span(start);
        self.error_span(span, kind)
    }

    #[cold]
    pub(super) fn error_span(&mut self, span: Span, kind: SyntaxError) -> LexResult<!> {
        let err = ErrorToDiag {
            handler: self.session.handler,
            span,
            error: kind,
        };
        Err(err)?
    }

    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    pub(super) fn skip_space(&mut self) -> LexResult<()> {
        let mut line_break = false;

        while let Some(c) = self.cur() {
            match c {
                // white spaces
                _ if c.is_ws() => {}

                // line breaks
                _ if c.is_line_break() => {
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

        while let Some(c) = self.cur() {
            self.bump();
            if c.is_line_break() {
                self.state.had_line_break = true;
            }
            match c {
                '\n' | '\r' | '\u{2028}' | '\u{2029}' => {
                    break;
                }
                _ => {}
            }
        }
        // TODO: push comment
    }

    /// Expects current char to be '/' and next char to be '*'.
    pub(super) fn skip_block_comment(&mut self) -> LexResult<()> {
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('/'));
        debug_assert_eq!(self.peek(), Some('*'));

        self.bump();
        self.bump();

        let mut was_star = false;

        while let Some(c) = self.cur() {
            if was_star && self.eat('/') {
                // TODO: push comment
                return Ok(());
            }
            if c.is_line_break() {
                self.state.had_line_break = true;
            }

            was_star = self.is('*');
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
    fn is_ident_start(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || UnicodeXID::is_xid_start(c)
    }

    /// Test whether a given character is part of an identifier.
    fn is_ident_part(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        // TODO: Use Unicode ID instead of XID.
        c == '$' || c == '_' || c == '\u{200c}' || c == '\u{200d}' || UnicodeXID::is_xid_continue(c)
    }

    /// See https://tc39.github.io/ecma262/#sec-line-terminators
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
    fn is_ws(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        match c {
            '\u{0009}' | '\u{000b}' | '\u{000c}' | '\u{0020}' | '\u{00a0}' | '\u{feff}' => true,

            '\u{1680}'
            | '\u{180e}'
            | '\u{2000}'...'\u{200a}'
            | '\u{202f}'
            | '\u{205f}'
            | '\u{3000}' => {
                // Any other Unicode “Space_Separator” code point
                true
            }
            _ => false,
        }
    }
}

impl CharExt for char {
    #[inline(always)]
    fn to_char(self) -> Option<char> {
        Some(self)
    }
}
