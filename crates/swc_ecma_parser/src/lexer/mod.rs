//! ECMAScript lexer.

use std::{borrow::Cow, char, iter::FusedIterator, rc::Rc};

use swc_atoms::{
    wtf8::{Wtf8, Wtf8Buf},
    AtomStoreCell,
};
use either::Either::{self, Left, Right};
use smartstring::{LazyCompact, SmartString};
use swc_atoms::{Atom, AtomStoreCell};
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::{EsVersion, Ident};

use self::table::{ByteHandler, BYTE_HANDLERS};
use crate::{
    byte_search,
    error::{Error, SyntaxError},
    input::Tokens,
    lexer::{
        char_ext::{Char, CharExt},
        comments_buffer::{BufferedComment, BufferedCommentKind, CommentsBuffer},
        jsx::xhtml,
        number::{parse_integer, LazyInteger},
        search::SafeByteMatchTable,
        state::State,
    },
    safe_byte_match_table,
    syntax::SyntaxFlags,
    BigIntValue, Context, Syntax,
};

#[cfg(feature = "unstable")]
pub(crate) mod capturing;
mod char_ext;
mod comments_buffer;
mod jsx;
mod number;
pub(crate) mod search;
mod state;
mod table;
pub(crate) mod token;
mod whitespace;

pub(crate) use state::TokenFlags;
pub(crate) use token::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue};

// ===== Byte match tables for comment scanning =====
// Irregular line breaks - '\u{2028}' (LS) and '\u{2029}' (PS)
const LS_OR_PS_FIRST: u8 = 0xe2;
const LS_BYTES_2_AND_3: [u8; 2] = [0x80, 0xa8];
const PS_BYTES_2_AND_3: [u8; 2] = [0x80, 0xa9];

static LINE_BREAK_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'\n' | b'\r' | LS_OR_PS_FIRST));

static BLOCK_COMMENT_SCAN_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| { matches!(b, b'*' | b'\n' | b'\r' | LS_OR_PS_FIRST) });

static DOUBLE_QUOTE_STRING_END_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'"' | b'\n' | b'\\' | b'\r'));
static SINGLE_QUOTE_STRING_END_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'\'' | b'\n' | b'\\' | b'\r'));

static NOT_ASCII_ID_CONTINUE_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| !(b.is_ascii_alphanumeric() || b == b'_' || b == b'$'));

pub type LexResult<T> = Result<T, crate::error::Error>;

fn remove_underscore(s: &str, has_underscore: bool) -> Cow<'_, str> {
    if has_underscore {
        debug_assert!(s.contains('_'));
        s.chars().filter(|&c| c != '_').collect::<String>().into()
    } else {
        debug_assert!(!s.contains('_'));
        Cow::Borrowed(s)
    }
}

#[derive(Clone)]
pub struct Lexer<'a> {
    comments: Option<&'a dyn Comments>,
    /// [Some] if comment comment parsing is enabled. Otherwise [None]
    comments_buffer: Option<CommentsBuffer>,

    pub ctx: Context,
    input: StringInput<'a>,
    start_pos: BytePos,

    state: State,
    token_flags: TokenFlags,
    pub(crate) syntax: SyntaxFlags,
    pub(crate) target: EsVersion,

    errors: Vec<Error>,
    module_errors: Vec<Error>,

    atoms: Rc<AtomStoreCell>,
}

impl FusedIterator for Lexer<'_> {}

impl<'a> Lexer<'a> {
    #[inline(always)]
    fn input(&self) -> &StringInput<'a> {
        &self.input
    }

    #[inline(always)]
    fn input_mut(&mut self) -> &mut StringInput<'a> {
        &mut self.input
    }

    #[inline(always)]
    fn push_error(&mut self, error: Error) {
        self.errors.push(error);
    }

    #[inline(always)]
    fn state(&self) -> &State {
        &self.state
    }

    #[inline(always)]
    fn state_mut(&mut self) -> &mut State {
        &mut self.state
    }

    #[inline(always)]
    fn comments(&self) -> Option<&'a dyn swc_common::comments::Comments> {
        self.comments
    }

    #[inline(always)]
    fn comments_buffer(&self) -> Option<&CommentsBuffer> {
        self.comments_buffer.as_ref()
    }

    #[inline(always)]
    fn comments_buffer_mut(&mut self) -> Option<&mut CommentsBuffer> {
        self.comments_buffer.as_mut()
    }

    #[inline(always)]
    unsafe fn input_slice_to_cur(&mut self, start: BytePos) -> &'a str {
        self.input.slice_to_cur(start)
    }

    #[inline(always)]
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str {
        self.input.slice(start, end)
    }

    #[inline(always)]
    fn input_uncons_while(&mut self, f: impl FnMut(char) -> bool) -> &'a str {
        self.input_mut().uncons_while(f)
    }

    #[inline(always)]
    fn atom<'b>(&self, s: impl Into<std::borrow::Cow<'b, str>>) -> swc_atoms::Atom {
        self.atoms.atom(s)
    }

    #[inline(always)]
    fn wtf8_atom<'b>(&self, s: impl Into<std::borrow::Cow<'b, Wtf8>>) -> swc_atoms::Wtf8Atom {
        self.atoms.wtf8_atom(s)
    }
}

impl<'a> Lexer<'a> {
    pub fn new(
        syntax: Syntax,
        target: EsVersion,
        input: StringInput<'a>,
        comments: Option<&'a dyn Comments>,
    ) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            comments,
            comments_buffer: comments.is_some().then(CommentsBuffer::new),
            ctx: Default::default(),
            input,
            start_pos,
            state: State::new(start_pos),
            syntax: syntax.into_flags(),
            target,
            errors: Default::default(),
            module_errors: Default::default(),
            atoms: Default::default(),
            token_flags: TokenFlags::empty(),
        }
    }

    /// babel: `getTokenFromCode`
    fn read_token(&mut self) -> LexResult<Token> {
        self.token_flags = TokenFlags::empty();
        let byte = match self.input.as_str().as_bytes().first() {
            Some(&v) => v,
            None => return Ok(Token::Eof),
        };

        let handler = unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) };
        handler(self)
    }

    fn read_token_plus_minus<const C: u8>(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c), if this method is called.
            self.input.bump();
        }

        // '++', '--'
        Ok(if self.input.cur() == Some(C as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }

            // Handle -->
            if self.state.had_line_break && C == b'-' && self.eat(b'>') {
                self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);
                self.skip_line_comment(0);
                self.skip_space::<true>();
                return self.read_token();
            }

            if C == b'+' {
                Token::PlusPlus
            } else {
                Token::MinusMinus
            }
        } else if self.input.eat_byte(b'=') {
            if C == b'+' {
                Token::PlusEq
            } else {
                Token::MinusEq
            }
        } else if C == b'+' {
            Token::Plus
        } else {
            Token::Minus
        })
    }

    fn read_token_bang_or_eq<const C: u8>(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();
        let had_line_break_before_last = self.had_line_break_before_last();

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input.bump();
        }

        Ok(if self.input.eat_byte(b'=') {
            // "=="

            if self.input.eat_byte(b'=') {
                if C == b'!' {
                    Token::NotEqEq
                } else {
                    // =======
                    //    ^
                    if had_line_break_before_last && self.is_str("====") {
                        self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
                        self.skip_line_comment(4);
                        self.skip_space::<true>();
                        return self.read_token();
                    }

                    Token::EqEqEq
                }
            } else if C == b'!' {
                Token::NotEq
            } else {
                Token::EqEq
            }
        } else if C == b'=' && self.input.eat_byte(b'>') {
            // "=>"

            Token::Arrow
        } else if C == b'!' {
            Token::Bang
        } else {
            Token::Eq
        })
    }
}

impl Lexer<'_> {
    fn read_token_lt_gt<const C: u8>(&mut self) -> LexResult<Token> {
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();
        self.bump();

        if self.syntax.typescript()
            && self.ctx.contains(Context::InType)
            && !self.ctx.contains(Context::ShouldNotLexLtOrGtAsType)
        {
            if C == b'<' {
                return Ok(Token::Lt);
            } else if C == b'>' {
                return Ok(Token::Gt);
            }
        }

        // XML style comment. `<!--`
        if C == b'<' && self.is(b'!') && self.peek() == Some('-') && self.peek_ahead() == Some('-')
        {
            self.skip_line_comment(3);
            self.skip_space::<true>();
            self.emit_module_mode_error(start, SyntaxError::LegacyCommentInModule);

            return self.read_token();
        }

        let mut op = if C == b'<' { Token::Lt } else { Token::Gt };

        // '<<', '>>'
        if self.cur() == Some(C as char) {
            self.bump();
            op = if C == b'<' {
                Token::LShift
            } else {
                Token::RShift
            };

            //'>>>'
            if C == b'>' && self.cur() == Some(C as char) {
                self.bump();
                op = Token::ZeroFillRShift;
            }
        }

        let token = if self.eat(b'=') {
            match op {
                Token::Lt => Token::LtEq,
                Token::Gt => Token::GtEq,
                Token::LShift => Token::LShiftEq,
                Token::RShift => Token::RShiftEq,
                Token::ZeroFillRShift => Token::ZeroFillRShiftEq,
                _ => unreachable!(),
            }
        } else {
            op
        };

        // All conflict markers consist of the same character repeated seven times.
        // If it is a <<<<<<< or >>>>>>> marker then it is also followed by a space.
        // <<<<<<<
        //   ^
        // >>>>>>>
        //    ^
        if had_line_break_before_last
            && match op {
                Token::LShift if self.is_str("<<<<< ") => true,
                Token::ZeroFillRShift if self.is_str(">>>> ") => true,
                _ => false,
            }
        {
            self.emit_error_span(fixed_len_span(start, 7), SyntaxError::TS1185);
            self.skip_line_comment(5);
            self.skip_space::<true>();
            return self.read_token();
        }

        Ok(token)
    }

    fn read_token_back_quote(&mut self) -> LexResult<Token> {
        let start = self.cur_pos();
        self.scan_template_token(start, true)
    }

    fn scan_template_token(
        &mut self,
        start: BytePos,
        started_with_backtick: bool,
    ) -> LexResult<Token> {
        debug_assert!(self.cur() == Some(if started_with_backtick { '`' } else { '}' }));
        let mut cooked = Ok(Wtf8Buf::with_capacity(8));
        self.bump(); // `}` or `\``
        let mut cooked_slice_start = self.cur_pos();
        let raw_slice_start = cooked_slice_start;
        let raw_atom = |this: &mut Self| {
            let last_pos = this.cur_pos();
            let s = unsafe { this.input.slice(raw_slice_start, last_pos) };
            this.atoms.atom(s)
        };
        macro_rules! consume_cooked {
            () => {{
                if let Ok(cooked) = &mut cooked {
                    let last_pos = self.cur_pos();
                    cooked.push_str(unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input.slice(cooked_slice_start, last_pos)
                    });
                }
            }};
        }

        while let Some(c) = self.cur() {
            if c == '`' {
                consume_cooked!();
                let cooked = cooked.map(|cooked| self.atoms.wtf8_atom(&*cooked));
                let raw = raw_atom(self);
                self.bump();
                return Ok(if started_with_backtick {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::NoSubstitutionTemplateLiteral
                } else {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateTail
                });
            } else if c == '$' && self.input.peek() == Some('{') {
                consume_cooked!();
                let cooked = cooked.map(|cooked| self.atoms.wtf8_atom(&*cooked));
                let raw = raw_atom(self);
                self.input.bump_bytes(2);
                return Ok(if started_with_backtick {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateHead
                } else {
                    self.set_token_value(Some(TokenValue::Template { raw, cooked }));
                    Token::TemplateMiddle
                });
            } else if c == '\\' {
                consume_cooked!();

                match self.read_escaped_char(true) {
                    Ok(Some(escaped)) => {
                        if let Ok(ref mut cooked) = cooked {
                            cooked.push(escaped);
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        cooked = Err(error);
                    }
                }

                cooked_slice_start = self.cur_pos();
            } else if c.is_line_terminator() {
                consume_cooked!();

                let c = if c == '\r' && self.peek() == Some('\n') {
                    self.bump(); // '\r'
                    '\n'
                } else {
                    match c {
                        '\n' => '\n',
                        '\r' => '\n',
                        '\u{2028}' => '\u{2028}',
                        '\u{2029}' => '\u{2029}',
                        _ => unreachable!(),
                    }
                };

                self.bump();

                if let Ok(ref mut cooked) = cooked {
                    cooked.push_char(c);
                }
                cooked_slice_start = self.cur_pos();
            } else {
                self.bump();
            }
        }

        self.error(start, SyntaxError::UnterminatedTpl)?
    }
}

impl<'a> Lexer<'a> {
    #[inline(always)]
    #[allow(clippy::misnamed_getters)]
    fn had_line_break_before_last(&self) -> bool {
        self.state().had_line_break()
    }

    #[inline(always)]
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
        // Position after the initial `//` (or similar)
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

        // Fast search for line-terminator
        byte_search! {
            lexer: self,
            table: LINE_BREAK_TABLE,
            continue_if: (matched_byte, pos_offset) {
                if matched_byte != LS_OR_PS_FIRST {
                    // '\r' or '\n' - definitely a line terminator
                    false
                } else {
                    // 0xE2 - could be LS/PS or some other Unicode character
                    // Check the next 2 bytes to see if it's really LS/PS
                    let current_slice = self.input().as_str();
                    let byte_pos = pos_offset;
                    if byte_pos + 2 < current_slice.len() {
                        let bytes = current_slice.as_bytes();
                        let next2 = [bytes[byte_pos + 1], bytes[byte_pos + 2]];
                        if next2 == LS_BYTES_2_AND_3 || next2 == PS_BYTES_2_AND_3 {
                            // It's a real line terminator
                            false
                        } else {
                            // Some other Unicode character starting with 0xE2
                            true
                        }
                    } else {
                        // Not enough bytes for full LS/PS sequence
                        true
                    }
                }
            },
            handle_eof: {
                // Reached EOF – entire remainder is comment
                let end = self.input().end_pos();

                if self.comments_buffer().is_some() {
                    let s = unsafe { self.input_slice(slice_start, end) };
                    let cmt = swc_common::comments::Comment {
                        kind: swc_common::comments::CommentKind::Line,
                        span: Span::new_with_checked(start, end),
                        text: self.atom(s),
                    };

                    if is_for_next {
                        self.comments_buffer_mut().unwrap().push_pending(cmt);
                    } else {
                        let pos = self.state().prev_hi();
                        self.comments_buffer_mut().unwrap().push_comment(BufferedComment {
                            kind: BufferedCommentKind::Trailing,
                            pos,
                            comment: cmt,
                        });
                    }
                }

                return;
            }
        };

        // Current position is at the line terminator
        let end = self.cur_pos();

        // Create and process slice only if comments need to be stored
        if self.comments_buffer().is_some() {
            let s = unsafe {
                // Safety: We know that the start and the end are valid
                self.input_slice_to_cur(slice_start)
            };
            let cmt = swc_common::comments::Comment {
                kind: swc_common::comments::CommentKind::Line,
                span: Span::new_with_checked(start, end),
                text: self.atom(s),
            };

            if is_for_next {
                self.comments_buffer_mut().unwrap().push_pending(cmt);
            } else {
                let pos = self.state().prev_hi();
                self.comments_buffer_mut()
                    .unwrap()
                    .push_comment(BufferedComment {
                        kind: BufferedCommentKind::Trailing,
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

    /// Expects current char to be '/' and next char to be '*'.
    fn skip_block_comment(&mut self) {
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('/'));
        debug_assert_eq!(self.peek(), Some('*'));

        // Consume initial "/*"
        self.input_mut().bump_bytes(2);

        // jsdoc
        let slice_start = self.cur_pos();

        let had_line_break_before_last = self.had_line_break_before_last();
        let mut should_mark_had_line_break = false;

        loop {
            let matched_byte = byte_search! {
                lexer: self,
                table: BLOCK_COMMENT_SCAN_TABLE,
                continue_if: (matched_byte, pos_offset) {
                    if matched_byte == LS_OR_PS_FIRST {
                        // 0xE2 - could be LS/PS or some other Unicode character
                        let current_slice = self.input().as_str();
                        let byte_pos = pos_offset;
                        if byte_pos + 2 < current_slice.len() {
                            let bytes = current_slice.as_bytes();
                            let next2 = [bytes[byte_pos + 1], bytes[byte_pos + 2]];
                            if next2 == LS_BYTES_2_AND_3 || next2 == PS_BYTES_2_AND_3 {
                                // It's a real line terminator - don't continue
                                false
                            } else {
                                // Some other Unicode character starting with 0xE2
                                true
                            }
                        } else {
                            // Not enough bytes for full LS/PS sequence
                            true
                        }
                    } else {
                        // '*', '\r', or '\n' - don't continue
                        false
                    }
                },
                handle_eof: {
                    if should_mark_had_line_break {
                        self.state_mut().mark_had_line_break();
                    }
                    let end_pos = self.input().end_pos();
                    let span = Span::new_with_checked(end_pos, end_pos);
                    self.emit_error_span(span, SyntaxError::UnterminatedBlockComment);
                    return;
                }
            };

            match matched_byte {
                b'*' => {
                    if self.peek() == Some('/') {
                        // Consume "*/"
                        self.input_mut().bump_bytes(2);

                        if should_mark_had_line_break {
                            self.state_mut().mark_had_line_break();
                        }

                        let end = self.cur_pos();

                        // Decide trailing / leading
                        let mut is_for_next =
                            had_line_break_before_last || !self.state().can_have_trailing_comment();

                        // If next char is ';' without newline, treat as trailing
                        if !had_line_break_before_last && self.input().is_byte(b';') {
                            is_for_next = false;
                        }

                        if self.comments_buffer().is_some() {
                            let src = unsafe {
                                // Safety: We got slice_start and end from self.input so those are
                                // valid.
                                self.input_mut().slice(slice_start, end)
                            };
                            let s = &src[..src.len() - 2];
                            let cmt = Comment {
                                kind: CommentKind::Block,
                                span: Span::new_with_checked(start, end),
                                text: self.atom(s),
                            };

                            if is_for_next {
                                self.comments_buffer_mut().unwrap().push_pending(cmt);
                            } else {
                                let pos = self.state().prev_hi();
                                self.comments_buffer_mut()
                                    .unwrap()
                                    .push_comment(BufferedComment {
                                        kind: BufferedCommentKind::Trailing,
                                        pos,
                                        comment: cmt,
                                    });
                            }
                        }

                        return;
                    } else {
                        // Just a lone '*', consume it and continue.
                        self.bump();
                    }
                }
                b'\n' => {
                    should_mark_had_line_break = true;
                    self.bump();
                }
                b'\r' => {
                    should_mark_had_line_break = true;
                    self.bump();
                    if self.peek() == Some('\n') {
                        self.bump();
                    }
                }
                _ => {
                    // Unicode line terminator (LS/PS) or other character
                    if let Some('\u{2028}' | '\u{2029}') = self.cur() {
                        should_mark_had_line_break = true;
                    }
                    self.bump();
                }
            }
        }
    }

    /// Skip comments or whitespaces.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    #[inline(never)]
    fn skip_space<const LEX_COMMENTS: bool>(&mut self) {
        loop {
            let (offset, newline) = {
                let mut skip = self::whitespace::SkipWhitespace {
                    input: self.input().as_str(),
                    newline: false,
                    offset: 0,
                };

                skip.scan();

                (skip.offset, skip.newline)
            };

            self.input_mut().bump_bytes(offset as usize);
            if newline {
                self.state_mut().mark_had_line_break();
            }

            if LEX_COMMENTS && self.input().is_byte(b'/') {
                if let Some(c) = self.peek() {
                    if c == '/' {
                        self.skip_line_comment(2);
                        continue;
                    } else if c == '*' {
                        self.skip_block_comment();
                        continue;
                    }
                }
            }

            break;
        }
    }

    /// Ensure that ident cannot directly follow numbers.
    fn ensure_not_ident(&mut self) -> LexResult<()> {
        match self.cur() {
            Some(c) if c.is_ident_start() => {
                let span = pos_span(self.cur_pos());
                self.error_span(span, SyntaxError::IdentAfterNum)?
            }
            _ => Ok(()),
        }
    }

    fn make_legacy_octal(&mut self, start: BytePos, val: f64) -> LexResult<f64> {
        self.ensure_not_ident()?;
        if self.syntax().typescript() && self.target() >= EsVersion::Es5 {
            self.emit_error(start, SyntaxError::TS1085);
        }
        self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);
        Ok(val)
    }

    /// `op`- |total, radix, value| -> (total * radix + value, continue)
    fn read_digits<F, Ret, const RADIX: u8>(
        &mut self,
        mut op: F,
        allow_num_separator: bool,
        has_underscore: &mut bool,
    ) -> LexResult<Ret>
    where
        F: FnMut(Ret, u8, u32) -> LexResult<(Ret, bool)>,
        Ret: Copy + Default,
    {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {RADIX}"
        );

        if cfg!(feature = "debug") {
            tracing::trace!("read_digits(radix = {}), cur = {:?}", RADIX, self.cur());
        }

        let start = self.cur_pos();
        let mut total: Ret = Default::default();
        let mut prev = None;

        while let Some(c) = self.cur() {
            if c == '_' {
                *has_underscore = true;
                if allow_num_separator {
                    let is_allowed = |c: Option<char>| {
                        let Some(c) = c else {
                            return false;
                        };
                        c.is_digit(RADIX as _)
                    };
                    let is_forbidden = |c: Option<char>| {
                        let Some(c) = c else {
                            return false;
                        };

                        if RADIX == 16 {
                            matches!(c, '.' | 'X' | '_' | 'x')
                        } else {
                            matches!(c, '.' | 'B' | 'E' | 'O' | '_' | 'b' | 'e' | 'o')
                        }
                    };

                    let next = self.input().peek();

                    if !is_allowed(next) || is_forbidden(prev) || is_forbidden(next) {
                        self.emit_error(
                            start,
                            SyntaxError::NumericSeparatorIsAllowedOnlyBetweenTwoDigits,
                        );
                    }

                    // Ignore this _ character
                    unsafe {
                        // Safety: cur() returns Some(c) where c is a valid char
                        self.input_mut().bump();
                    }

                    continue;
                }
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = c.to_digit(RADIX as _) {
                val
            } else {
                return Ok(total);
            };

            self.bump();

            let (t, cont) = op(total, RADIX, val)?;

            total = t;

            if !cont {
                return Ok(total);
            }

            prev = Some(c);
        }

        Ok(total)
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    ///
    /// - Returned `bool` is `true` is there was `8` or `9`.
    fn read_number_no_dot_as_str<const RADIX: u8>(&mut self) -> LexResult<LazyInteger> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {RADIX}"
        );
        let start = self.cur_pos();

        let mut not_octal = false;
        let mut read_any = false;
        let mut has_underscore = false;

        self.read_digits::<_, (), RADIX>(
            |_, _, v| {
                read_any = true;

                if v == 8 || v == 9 {
                    not_octal = true;
                }

                Ok(((), true))
            },
            true,
            &mut has_underscore,
        )?;

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix: RADIX })?;
        }

        Ok(LazyInteger {
            start,
            end: self.cur_pos(),
            not_octal,
            has_underscore,
        })
    }

    /// Reads an integer, octal integer, or floating-point number
    fn read_number<const START_WITH_DOT: bool, const START_WITH_ZERO: bool>(
        &mut self,
    ) -> LexResult<Either<(f64, Atom), (Box<BigIntValue>, Atom)>> {
        debug_assert!(!(START_WITH_DOT && START_WITH_ZERO));
        debug_assert!(self.cur().is_some());

        let start = self.cur_pos();
        let mut has_underscore = false;

        let lazy_integer = if START_WITH_DOT {
            // first char is '.'
            debug_assert!(
                self.cur().is_some_and(|c| c == '.'),
                "read_number<START_WITH_DOT = true> expects current char to be '.'"
            );
            LazyInteger {
                start,
                end: start,
                not_octal: true,
                has_underscore: false,
            }
        } else {
            debug_assert!(!START_WITH_DOT);
            debug_assert!(!START_WITH_ZERO || self.cur().unwrap() == '0');

            // Use read_number_no_dot to support long numbers.
            let lazy_integer = self.read_number_no_dot_as_str::<10>()?;
            let s = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice(lazy_integer.start, lazy_integer.end)
            };

            // legacy octal number is not allowed in bigint.
            if (!START_WITH_ZERO || lazy_integer.end - lazy_integer.start == BytePos(1))
                && self.eat(b'n')
            {
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input_slice_to_cur(start)
                };
                let bigint_value = num_bigint::BigInt::parse_bytes(s.as_bytes(), 10).unwrap();
                return Ok(Either::Right((Box::new(bigint_value), self.atom(raw))));
            }

            if START_WITH_ZERO {
                // TODO: I guess it would be okay if I don't use -ffast-math
                // (or something like that), but needs review.
                if s.as_bytes().iter().all(|&c| c == b'0') {
                    // If only one zero is used, it's decimal.
                    // And if multiple zero is used, it's octal.
                    //
                    // e.g. `0` is decimal (so it can be part of float)
                    //
                    // e.g. `000` is octal
                    if start.0 != self.last_pos().0 - 1 {
                        let raw = unsafe {
                            // Safety: We got both start and end position from `self.input`
                            self.input_slice_to_cur(start)
                        };
                        let raw = self.atom(raw);
                        return self
                            .make_legacy_octal(start, 0f64)
                            .map(|value| Either::Left((value, raw)));
                    }
                } else if lazy_integer.not_octal {
                    // if it contains '8' or '9', it's decimal.
                    self.emit_strict_mode_error(start, SyntaxError::LegacyDecimal);
                } else {
                    // It's Legacy octal, and we should reinterpret value.
                    let s = remove_underscore(s, lazy_integer.has_underscore);
                    let val = parse_integer::<8>(&s);
                    let raw = unsafe {
                        // Safety: We got both start and end position from `self.input`
                        self.input_slice_to_cur(start)
                    };
                    let raw = self.atom(raw);
                    return self
                        .make_legacy_octal(start, val)
                        .map(|value| Either::Left((value, raw)));
                }
            }

            lazy_integer
        };

        has_underscore |= lazy_integer.has_underscore;
        // At this point, number cannot be an octal literal.

        let has_dot = self.cur() == Some('.');
        //  `0.a`, `08.a`, `102.a` are invalid.
        //
        // `.1.a`, `.1e-4.a` are valid,
        if has_dot {
            self.bump();

            // equal: if START_WITH_DOT { debug_assert!(xxxx) }
            debug_assert!(!START_WITH_DOT || self.cur().is_some_and(|cur| cur.is_ascii_digit()));

            // Read numbers after dot
            self.read_digits::<_, (), 10>(|_, _, _| Ok(((), true)), true, &mut has_underscore)?;
        }

        let has_e = self.cur().is_some_and(|c| c == 'e' || c == 'E');
        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        if has_e {
            self.bump(); // `e`/`E`

            let next = match self.cur() {
                Some(next) => next,
                None => {
                    let pos = self.cur_pos();
                    self.error(pos, SyntaxError::NumLitTerminatedWithExp)?
                }
            };

            if next == '+' || next == '-' {
                self.bump(); // remove '+', '-'
            }

            let lazy_integer = self.read_number_no_dot_as_str::<10>()?;
            has_underscore |= lazy_integer.has_underscore;
        }

        let val = if has_dot || has_e {
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice_to_cur(start)
            };

            let raw = remove_underscore(raw, has_underscore);
            raw.parse().expect("failed to parse float literal")
        } else {
            let s = unsafe { self.input_slice(lazy_integer.start, lazy_integer.end) };
            let s = remove_underscore(s, has_underscore);
            parse_integer::<10>(&s)
        };

        self.ensure_not_ident()?;

        let raw_str = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice_to_cur(start)
        };
        Ok(Either::Left((val, raw_str.into())))
    }

    fn read_int_u32<const RADIX: u8>(&mut self, len: u8) -> LexResult<Option<u32>> {
        let start = self.state().start();

        let mut count = 0;
        let v = self.read_digits::<_, Option<u32>, RADIX>(
            |opt: Option<u32>, radix, val| {
                count += 1;

                let total = opt
                    .unwrap_or_default()
                    .checked_mul(radix as u32)
                    .and_then(|v| v.checked_add(val))
                    .ok_or_else(|| {
                        let span = Span::new_with_checked(start, start);
                        crate::error::Error::new(span, SyntaxError::InvalidUnicodeEscape)
                    })?;

                Ok((Some(total), count != len))
            },
            true,
            &mut false,
        )?;
        if len != 0 && count != len {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    /// Returns `Left(value)` or `Right(BigInt)`
    fn read_radix_number<const RADIX: u8>(
        &mut self,
    ) -> LexResult<Either<(f64, Atom), (Box<BigIntValue>, Atom)>> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 16,
            "radix should be one of 2, 8, 16, but got {RADIX}"
        );
        let start = self.cur_pos();

        debug_assert_eq!(self.cur(), Some('0'));
        self.bump();

        debug_assert!(self
            .cur()
            .is_some_and(|c| matches!(c, 'b' | 'B' | 'o' | 'O' | 'x' | 'X')));
        self.bump();

        let lazy_integer = self.read_number_no_dot_as_str::<RADIX>()?;
        let has_underscore = lazy_integer.has_underscore;

        let s = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice(lazy_integer.start, lazy_integer.end)
        };
        if self.eat(b'n') {
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice_to_cur(start)
            };

            let bigint_value = num_bigint::BigInt::parse_bytes(s.as_bytes(), RADIX as _).unwrap();
            return Ok(Either::Right((Box::new(bigint_value), self.atom(raw))));
        }
        let s = remove_underscore(s, has_underscore);
        let val = parse_integer::<RADIX>(&s);

        self.ensure_not_ident()?;

        let raw = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice_to_cur(start)
        };

        Ok(Either::Left((val, self.atom(raw))))
    }

    /// Consume pending comments.
    ///
    /// This is called when the input is exhausted.
    #[cold]
    #[inline(never)]
    fn consume_pending_comments(&mut self) {
        if let Some(comments) = self.comments() {
            let last = self.state().prev_hi();
            let start_pos = self.start_pos();
            let comments_buffer = self.comments_buffer_mut().unwrap();

            // if the file had no tokens and no shebang, then treat any
            // comments in the leading comments buffer as leading.
            // Otherwise treat them as trailing.
            let kind = if last == start_pos {
                BufferedCommentKind::Leading
            } else {
                BufferedCommentKind::Trailing
            };
            // move the pending to the leading or trailing
            comments_buffer.pending_to_comment(kind, last);

            // now fill the user's passed in comments
            for comment in comments_buffer.take_comments() {
                match comment.kind {
                    BufferedCommentKind::Leading => {
                        comments.add_leading(comment.pos, comment.comment);
                    }
                    BufferedCommentKind::Trailing => {
                        comments.add_trailing(comment.pos, comment.comment);
                    }
                }
            }
        }
    }

    fn read_jsx_entity(&mut self) -> LexResult<(char, String)> {
        debug_assert!(self.syntax().jsx());

        fn from_code(s: &str, radix: u32) -> LexResult<char> {
            // TODO(kdy1): unwrap -> Err
            let c = char::from_u32(
                u32::from_str_radix(s, radix).expect("failed to parse string as number"),
            )
            .expect("failed to parse number as char");

            Ok(c)
        }

        fn is_hex(s: &str) -> bool {
            s.chars().all(|c| c.is_ascii_hexdigit())
        }

        fn is_dec(s: &str) -> bool {
            s.chars().all(|c| c.is_ascii_digit())
        }

        let mut s = SmartString::<LazyCompact>::default();

        debug_assert!(self.input().cur().is_some_and(|c| c == '&'));
        self.bump();

        let start_pos = self.input().cur_pos();

        for _ in 0..10 {
            let c = match self.input().cur() {
                Some(c) => c,
                None => break,
            };
            self.bump();

            if c == ';' {
                if let Some(stripped) = s.strip_prefix('#') {
                    if stripped.starts_with('x') {
                        if is_hex(&s[2..]) {
                            let value = from_code(&s[2..], 16)?;

                            return Ok((value, format!("&{s};")));
                        }
                    } else if is_dec(stripped) {
                        let value = from_code(stripped, 10)?;

                        return Ok((value, format!("&{s};")));
                    }
                } else if let Some(entity) = xhtml(&s) {
                    return Ok((entity, format!("&{s};")));
                }

                break;
            }

            s.push(c)
        }

        unsafe {
            // Safety: start_pos is a valid position because we got it from self.input
            self.input_mut().reset_to(start_pos);
        }

        Ok(('&', "&".to_string()))
    }

    fn read_jsx_new_line(&mut self, normalize_crlf: bool) -> LexResult<Either<&'static str, char>> {
        debug_assert!(self.syntax().jsx());
        let ch = self.input().cur().unwrap();
        self.bump();

        let out = if ch == '\r' && self.input().cur() == Some('\n') {
            self.bump(); // `\n`
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        Ok(out)
    }

    fn read_jsx_str(&mut self, quote: char) -> LexResult<Token> {
        debug_assert!(self.syntax().jsx());
        let start = self.input().cur_pos();
        unsafe {
            // Safety: cur() was Some(quote)
            self.input_mut().bump(); // `quote`
        }
        let mut out = String::new();
        let mut chunk_start = self.input().cur_pos();
        loop {
            let ch = match self.input().cur() {
                Some(c) => c,
                None => {
                    self.emit_error(start, SyntaxError::UnterminatedStrLit);
                    break;
                }
            };
            let cur_pos = self.input().cur_pos();
            if ch == '\\' {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice_to_cur(chunk_start)
                };

                out.push_str(value);
                out.push('\\');

                self.bump();

                chunk_start = self.input().cur_pos();

                continue;
            }

            if ch == quote {
                break;
            }

            if ch == '&' {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice_to_cur(chunk_start)
                };

                out.push_str(value);

                let jsx_entity = self.read_jsx_entity()?;

                out.push(jsx_entity.0);

                chunk_start = self.input().cur_pos();
            } else if ch.is_line_terminator() {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice_to_cur(chunk_start)
                };

                out.push_str(value);

                match self.read_jsx_new_line(false)? {
                    Either::Left(s) => {
                        out.push_str(s);
                    }
                    Either::Right(c) => {
                        out.push(c);
                    }
                }

                chunk_start = cur_pos + BytePos(ch.len_utf8() as _);
            } else {
                unsafe {
                    // Safety: cur() was Some(ch)
                    self.input_mut().bump();
                }
            }
        }
        let s = unsafe {
            // Safety: We already checked for the range
            self.input_slice_to_cur(chunk_start)
        };
        let value = if out.is_empty() {
            // Fast path: We don't need to allocate
            self.atom(s)
        } else {
            out.push_str(s);
            self.atom(out)
        };

        // it might be at the end of the file when
        // the string literal is unterminated
        if self.input().peek_ahead().is_some() {
            self.bump();
        }

        let raw = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input_slice_to_cur(start)
        };
        let raw = self.atom(raw);
        Ok(Token::str(value, raw, self))
    }

    fn read_unicode_escape(&mut self) -> LexResult<Vec<Char>> {
        debug_assert_eq!(self.cur(), Some('u'));

        let mut chars = Vec::with_capacity(4);
        let mut is_curly = false;

        self.bump(); // 'u'

        if self.eat(b'{') {
            is_curly = true;
        }

        let state = self.input().cur_pos();
        let c = match self.read_int_u32::<16>(if is_curly { 0 } else { 4 }) {
            Ok(Some(val)) => {
                if 0x0010_ffff >= val {
                    char::from_u32(val)
                } else {
                    let start = self.cur_pos();

                    self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: if is_curly {
                                "1-6 hex characters in the range 0 to 10FFFF."
                            } else {
                                "4 hex characters"
                            },
                        },
                    )?
                }
            }
            _ => {
                let start = self.cur_pos();

                self.error(
                    start,
                    SyntaxError::BadCharacterEscapeSequence {
                        expected: if is_curly {
                            "1-6 hex characters"
                        } else {
                            "4 hex characters"
                        },
                    },
                )?
            }
        };

        match c {
            Some(c) => {
                chars.push(c.into());
            }
            _ => {
                unsafe {
                    // Safety: state is valid position because we got it from cur_pos()
                    self.input_mut().reset_to(state);
                }

                chars.push(Char::from('\\'));
                chars.push(Char::from('u'));

                if is_curly {
                    chars.push(Char::from('{'));

                    for _ in 0..6 {
                        if let Some(c) = self.input().cur() {
                            if c == '}' {
                                break;
                            }

                            self.bump();

                            chars.push(Char::from(c));
                        } else {
                            break;
                        }
                    }

                    chars.push(Char::from('}'));
                } else {
                    for _ in 0..4 {
                        if let Some(c) = self.input().cur() {
                            self.bump();

                            chars.push(Char::from(c));
                        }
                    }
                }
            }
        }

        if is_curly && !self.eat(b'}') {
            self.error(state, SyntaxError::InvalidUnicodeEscape)?
        }

        Ok(chars)
    }

    #[cold]
    fn read_shebang(&mut self) -> LexResult<Option<Atom>> {
        if self.input().cur() != Some('#') || self.input().peek() != Some('!') {
            return Ok(None);
        }
        self.bump(); // `#`
        self.bump(); // `!`
        let s = self.input_uncons_while(|c| !c.is_line_terminator());
        Ok(Some(self.atom(s)))
    }

    /// Read an escaped character for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(&mut self, in_template: bool) -> LexResult<Option<Vec<Char>>> {
        debug_assert_eq!(self.cur(), Some('\\'));

        let start = self.cur_pos();

        self.bump(); // '\'

        let c = match self.cur() {
            Some(c) => c,
            None => self.error_span(pos_span(start), SyntaxError::InvalidStrEscape)?,
        };

        let c = match c {
            '\\' => '\\',
            'n' => '\n',
            'r' => '\r',
            't' => '\t',
            'b' => '\u{0008}',
            'v' => '\u{000b}',
            'f' => '\u{000c}',
            '\r' => {
                self.bump(); // remove '\r'

                self.eat(b'\n');

                return Ok(None);
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                self.bump();

                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                self.bump(); // 'x'

                match self.read_int_u32::<16>(2)? {
                    Some(val) => return Ok(Some(vec![Char::from(val)])),
                    None => self.error(
                        start,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: "2 hex characters",
                        },
                    )?,
                }
            }

            // read unicode escape sequences
            'u' => match self.read_unicode_escape() {
                Ok(chars) => return Ok(Some(chars)),
                Err(err) => self.error(start, err.into_kind())?,
            },

            // octal escape sequences
            '0'..='7' => {
                self.bump();

                let first_c = if c == '0' {
                    match self.cur() {
                        Some(next) if next.is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some(vec!['\u{0000}'.into()])),
                    }
                } else {
                    c
                };

                // TODO: Show template instead of strict mode
                if in_template {
                    self.error(start, SyntaxError::LegacyOctal)?
                }

                self.emit_strict_mode_error(start, SyntaxError::LegacyOctal);

                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;

                macro_rules! one {
                    ($check:expr) => {{
                        let cur = self.cur();

                        match cur.and_then(|c| c.to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(Some(vec![Char::from(value as char)])),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };

                                self.bump();
                            }
                            _ => return Ok(Some(vec![Char::from(value as u32)])),
                        }
                    }};
                }

                one!(false);
                one!(true);

                return Ok(Some(vec![Char::from(value as char)]));
            }
            _ => c,
        };

        unsafe {
            // Safety: cur() is Some(c) if this method is called.
            self.input_mut().bump();
        }

        Ok(Some(vec![c.into()]))
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self, start: BytePos) -> LexResult<Token> {
        unsafe {
            // Safety: start is valid position, and cur() is Some('/')
            self.input_mut().reset_to(start);
        }

        debug_assert_eq!(self.cur(), Some('/'));

        let start = self.cur_pos();

        self.bump(); // bump '/'

        let slice_start = self.cur_pos();

        let (mut escaped, mut in_class) = (false, false);

        while let Some(c) = self.cur() {
            // This is ported from babel.
            // Seems like regexp literal cannot contain linebreak.
            if c.is_line_terminator() {
                let span = self.span(start);

                return Err(crate::error::Error::new(
                    span,
                    SyntaxError::UnterminatedRegExp,
                ));
            }

            if escaped {
                escaped = false;
            } else {
                match c {
                    '[' => in_class = true,
                    ']' if in_class => in_class = false,
                    // Terminates content part of regex literal
                    '/' if !in_class => break,
                    _ => {}
                }

                escaped = c == '\\';
            }

            self.bump();
        }

        let content = {
            let s = unsafe { self.input_slice_to_cur(slice_start) };
            self.atom(s)
        };

        // input is terminated without following `/`
        if !self.is(b'/') {
            let span = self.span(start);

            return Err(crate::error::Error::new(
                span,
                SyntaxError::UnterminatedRegExp,
            ));
        }

        self.bump(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        // let flags_start = self.cur_pos();
        let flags = {
            match self.cur() {
                Some(c) if c.is_ident_start() => self
                    .read_word_as_str_with()
                    .map(|(s, _)| Some(self.atom(s))),
                _ => Ok(None),
            }
        }?
        .unwrap_or_default();

        Ok(Token::regexp(content, flags, self))
    }

    /// This method is optimized for texts without escape sequences.
    fn read_word_as_str_with(&mut self) -> LexResult<(Cow<'a, str>, bool)> {
        debug_assert!(self.cur().is_some());
        let slice_start = self.cur_pos();

        // Fast path: try to scan ASCII identifier using byte_search
        if let Some(c) = self.input().cur_as_ascii() {
            if Ident::is_valid_ascii_start(c) {
                // Advance past first byte
                self.bump();

                // Use byte_search to quickly scan to end of ASCII identifier
                let next_byte = byte_search! {
                    lexer: self,
                    table: NOT_ASCII_ID_CONTINUE_TABLE,
                    handle_eof: {
                        // Reached EOF, entire remainder is identifier
                        let s = unsafe {
                            // Safety: slice_start and end are valid position because we got them from
                            // `self.input`
                            self.input_slice_to_cur(slice_start)
                        };

                        return Ok((Cow::Borrowed(s), false));
                    },
                };

                // Check if we hit end of identifier or need to fall back to slow path
                if !next_byte.is_ascii() {
                    // Hit Unicode character, fall back to slow path from current position
                    return self.read_word_as_str_with_slow_path(slice_start);
                } else if next_byte == b'\\' {
                    // Hit escape sequence, fall back to slow path from current position
                    return self.read_word_as_str_with_slow_path(slice_start);
                } else {
                    // Hit end of identifier (non-continue ASCII char)
                    let s = unsafe {
                        // Safety: slice_start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice_to_cur(slice_start)
                    };

                    return Ok((Cow::Borrowed(s), false));
                }
            }
        }

        // Fall back to slow path for non-ASCII start or complex cases
        self.read_word_as_str_with_slow_path(slice_start)
    }

    /// Slow path for identifier parsing that handles Unicode and escapes
    #[cold]
    fn read_word_as_str_with_slow_path(
        &mut self,
        mut slice_start: BytePos,
    ) -> LexResult<(Cow<'a, str>, bool)> {
        let mut first = true;
        let mut has_escape = false;

        let mut buf = String::with_capacity(16);
        loop {
            if let Some(c) = self.input().cur_as_ascii() {
                if Ident::is_valid_ascii_continue(c) {
                    self.bump();
                    continue;
                } else if first && Ident::is_valid_ascii_start(c) {
                    self.bump();
                    first = false;
                    continue;
                }

                // unicode escape
                if c == b'\\' {
                    first = false;
                    has_escape = true;
                    let start = self.cur_pos();
                    self.bump();

                    if !self.is(b'u') {
                        self.error_span(pos_span(start), SyntaxError::ExpectedUnicodeEscape)?
                    }

                    {
                        let end = self.input().cur_pos();
                        let s = unsafe {
                            // Safety: start and end are valid position because we got them from
                            // `self.input`
                            self.input_slice(slice_start, start)
                        };
                        buf.push_str(s);
                        unsafe {
                            // Safety: We got end from `self.input`
                            self.input_mut().reset_to(end);
                        }
                    }

                    let chars = self.read_unicode_escape()?;

                    if let Some(c) = chars.first() {
                        let valid = if first {
                            c.is_ident_start()
                        } else {
                            c.is_ident_part()
                        };

                        if !valid {
                            self.emit_error(start, SyntaxError::InvalidIdentChar);
                        }
                    }

                    for c in chars {
                        buf.extend(c);
                    }

                    slice_start = self.cur_pos();
                    continue;
                }

                // ASCII but not a valid identifier
                break;
            } else if let Some(c) = self.input().cur() {
                if Ident::is_valid_non_ascii_continue(c) {
                    self.bump();
                    continue;
                } else if first && Ident::is_valid_non_ascii_start(c) {
                    self.bump();
                    first = false;
                    continue;
                }
            }

            break;
        }

        let s = unsafe {
            // Safety: slice_start and end are valid position because we got them from
            // `self.input`
            self.input_slice_to_cur(slice_start)
        };
        let value = if !has_escape {
            // Fast path: raw slice is enough if there's no escape.
            Cow::Borrowed(s)
        } else {
            buf.push_str(s);
            Cow::Owned(buf)
        };

        Ok((value, has_escape))
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some_and(|c| c == '#'));

        self.bump(); // '#'

        // `#` can also be a part of shebangs, however they should have been
        // handled by `read_shebang()`
        debug_assert!(
            !self.input().is_at_start() || self.cur() != Some('!'),
            "#! should have already been handled by read_shebang()"
        );
        Ok(Token::Hash)
    }

    /// Read a token given `.`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_dot(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some_and(|c| c == '.'));
        // Check for eof
        let next = match self.input().peek() {
            Some(next) => next,
            None => {
                self.bump(); // '.'
                return Ok(Token::Dot);
            }
        };
        if next.is_ascii_digit() {
            return self.read_number::<true, false>().map(|v| match v {
                Left((value, raw)) => Token::num(value, raw, self),
                Right(_) => unreachable!("read_number should not return bigint for leading dot"),
            });
        }

        self.bump(); // 1st `.`

        if next == '.' && self.input().peek() == Some('.') {
            self.bump(); // 2nd `.`
            self.bump(); // 3rd `.`

            return Ok(Token::DotDotDot);
        }

        Ok(Token::Dot)
    }

    /// Read a token given `?`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_question_mark(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some_and(|c| c == '?'));
        self.bump();
        if self.input_mut().eat_byte(b'?') {
            if self.input_mut().eat_byte(b'=') {
                Ok(Token::NullishEq)
            } else {
                Ok(Token::NullishCoalescing)
            }
        } else {
            Ok(Token::QuestionMark)
        }
    }

    /// Read a token given `:`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_colon(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some_and(|c| c == ':'));
        self.bump(); // ':'
        Ok(Token::Colon)
    }

    /// Read a token given `0`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_zero(&mut self) -> LexResult<Token> {
        debug_assert_eq!(self.cur(), Some('0'));
        let next = self.input().peek();

        let bigint = match next {
            Some('x') | Some('X') => self.read_radix_number::<16>(),
            Some('o') | Some('O') => self.read_radix_number::<8>(),
            Some('b') | Some('B') => self.read_radix_number::<2>(),
            _ => {
                return self.read_number::<false, true>().map(|v| match v {
                    Left((value, raw)) => Token::num(value, raw, self),
                    Right((value, raw)) => Token::bigint(value, raw, self),
                });
            }
        };

        bigint.map(|v| match v {
            Left((value, raw)) => Token::num(value, raw, self),
            Right((value, raw)) => Token::bigint(value, raw, self),
        })
    }

    /// Read a token given `|` or `&`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_logical<const C: u8>(&mut self) -> LexResult<Token> {
        debug_assert!(C == b'|' || C == b'&');
        let is_bit_and = C == b'&';
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c as char)
            self.input_mut().bump();
        }
        let token = if is_bit_and {
            Token::Ampersand
        } else {
            Token::Pipe
        };

        // '|=', '&='
        if self.input_mut().eat_byte(b'=') {
            return Ok(if is_bit_and {
                Token::BitAndEq
            } else {
                debug_assert!(token == Token::Pipe);
                Token::BitOrEq
            });
        }

        // '||', '&&'
        if self.input().cur() == Some(C as char) {
            unsafe {
                // Safety: cur() is Some(c)
                self.input_mut().bump();
            }

            if self.input().cur() == Some('=') {
                unsafe {
                    // Safety: cur() is Some('=')
                    self.input_mut().bump();
                }

                return Ok(if is_bit_and {
                    Token::LogicalAndEq
                } else {
                    debug_assert!(token == Token::Pipe);
                    Token::LogicalOrEq
                });
            }

            // |||||||
            //   ^
            if had_line_break_before_last && !is_bit_and && self.is_str("||||| ") {
                let span = fixed_len_span(start, 7);
                self.emit_error_span(span, SyntaxError::TS1185);
                self.skip_line_comment(5);
                self.skip_space::<true>();
                return self.error_span(span, SyntaxError::TS1185);
            }

            return Ok(if is_bit_and {
                Token::LogicalAnd
            } else {
                debug_assert!(token == Token::Pipe);
                Token::LogicalOr
            });
        }

        Ok(token)
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    fn read_token_mul_mod(&mut self, is_mul: bool) -> LexResult<Token> {
        debug_assert!(self.cur().is_some_and(|c| c == '*' || c == '%'));
        self.bump();
        let token = if is_mul {
            if self.input_mut().eat_byte(b'*') {
                // `**`
                Token::Exp
            } else {
                Token::Asterisk
            }
        } else {
            Token::Percent
        };

        Ok(if self.input_mut().eat_byte(b'=') {
            if token == Token::Asterisk {
                Token::MulEq
            } else if token == Token::Percent {
                Token::ModEq
            } else {
                debug_assert!(token == Token::Exp);
                Token::ExpEq
            }
        } else {
            token
        })
    }

    fn read_slash(&mut self) -> LexResult<Token> {
        debug_assert_eq!(self.cur(), Some('/'));
        self.bump(); // '/'
        Ok(if self.eat(b'=') {
            Token::DivEq
        } else {
            Token::Slash
        })
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_ident_unknown(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur().is_some());

        let (s, has_escape) = self.read_word_as_str_with()?;
        let atom = self.atom(s);
        let word = Token::unknown_ident(atom, self);

        if has_escape {
            self.update_token_flags(|flags| *flags |= TokenFlags::UNICODE);
        }

        Ok(word)
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    // TODO: merge `read_str_lit` and `read_jsx_str`
    fn read_str_lit(&mut self) -> LexResult<Token> {
        debug_assert!(self.cur() == Some('\'') || self.cur() == Some('"'));
        let start = self.cur_pos();
        let quote = self.cur().unwrap() as u8;

        self.bump(); // '"' or '\''

        let mut slice_start = self.input().cur_pos();

        let mut buf: Option<String> = None;

        loop {
            let table = if quote == b'"' {
                &DOUBLE_QUOTE_STRING_END_TABLE
            } else {
                &SINGLE_QUOTE_STRING_END_TABLE
            };

            let fast_path_result = byte_search! {
                lexer: self,
                table: table,
                handle_eof: {
                    let s = unsafe {
                            // Safety: slice_start and value_end are valid position because we
                            // got them from `self.input`
                        self.input_slice_to_cur(slice_start)
                    };

                    self.emit_error(start, SyntaxError::UnterminatedStrLit);

                    let raw = unsafe { self.input_slice_to_cur(start) };
                    return Ok(Token::str(self.atom(s), self.atom(raw), self));
                },
            };

            match fast_path_result {
                b'"' | b'\'' if fast_path_result == quote => {
                    let value = if let Some(buf) = buf.as_mut() {
                        // `buf` only exist when there has escape.
                        debug_assert!(unsafe { self.input_slice_to_cur(start).contains('\\') });
                        let s = unsafe {
                            // Safety: slice_start and value_end are valid position because we
                            // got them from `self.input`
                            self.input_slice_to_cur(slice_start)
                        };
                        buf.push_str(s);
                        self.atom(&*buf)
                    } else {
                        let s = unsafe { self.input_slice_to_cur(slice_start) };
                        self.atom(s)
                    };

                    unsafe {
                        // Safety: cur is quote
                        self.input_mut().bump();
                    }

                    let raw = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice_to_cur(start)
                    };
                    let raw = self.atom(raw);
                    return Ok(Token::str(value, raw, self));
                }
                b'\\' => {
                    let s = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice_to_cur(slice_start)
                    };

                    if buf.is_none() {
                        buf = Some(s.to_string());
                    } else {
                        buf.as_mut().unwrap().push_str(s);
                    }

                    if let Some(chars) = self.read_escaped_char(false)? {
                        for c in chars {
                            buf.as_mut().unwrap().extend(c);
                        }
                    }

                    slice_start = self.cur_pos();
                    continue;
                }
                b'\n' | b'\r' => {
                    let s = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice_to_cur(slice_start)
                    };

                    self.emit_error(start, SyntaxError::UnterminatedStrLit);

                    let raw = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice_to_cur(start)
                    };
                    return Ok(Token::str(self.atom(s), self.atom(raw), self));
                }
                _ => self.bump(),
            }
        }
    }

    fn read_keyword_with(&mut self, convert: &dyn Fn(&str) -> Option<Token>) -> LexResult<Token> {
        debug_assert!(self.cur().is_some());

        let start = self.cur_pos();
        let (s, has_escape) = self.read_keyword_as_str_with()?;
        if let Some(word) = convert(s.as_ref()) {
            // Note: ctx is store in lexer because of this error.
            // 'await' and 'yield' may have semantic of reserved word, which means lexer
            // should know context or parser should handle this error. Our approach to this
            // problem is former one.
            if has_escape && word.is_reserved(self.ctx()) {
                self.error(
                    start,
                    SyntaxError::EscapeInReservedWord { word: Atom::new(s) },
                )
            } else {
                Ok(word)
            }
        } else {
            let atom = self.atom(s);
            Ok(Token::unknown_ident(atom, self))
        }
    }

    /// This is a performant version of [Lexer::read_word_as_str_with] for
    /// reading keywords. We should make sure the first byte is a valid
    /// ASCII.
    fn read_keyword_as_str_with(&mut self) -> LexResult<(Cow<'a, str>, bool)> {
        let slice_start = self.cur_pos();

        // Fast path: try to scan ASCII identifier using byte_search
        // Performance optimization: check if first char disqualifies as keyword
        // Advance past first byte
        self.bump();

        // Use byte_search to quickly scan to end of ASCII identifier
        let next_byte = byte_search! {
            lexer: self,
            table: NOT_ASCII_ID_CONTINUE_TABLE,
            handle_eof: {
                // Reached EOF, entire remainder is identifier
                let s = unsafe {
                    // Safety: slice_start and end are valid position because we got them from
                    // `self.input`
                    self.input_slice_to_cur(slice_start)
                };

                return Ok((Cow::Borrowed(s), false));
            },
        };

        // Check if we hit end of identifier or need to fall back to slow path
        if !next_byte.is_ascii() || next_byte == b'\\' {
            // Hit Unicode character or escape sequence, fall back to slow path from current
            // position
            self.read_word_as_str_with_slow_path(slice_start)
        } else {
            // Hit end of identifier (non-continue ASCII char)
            let s = unsafe {
                // Safety: slice_start and end are valid position because we got them from
                // `self.input`
                self.input_slice_to_cur(slice_start)
            };

            Ok((Cow::Borrowed(s), false))
        }
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new_with_checked(p, p)
}

fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new_with_checked(p, p + BytePos(len))
}
