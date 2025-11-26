use std::borrow::Cow;

use char::CharExt;
use either::Either::{self, Left, Right};
use num_bigint::BigInt as BigIntValue;
use smartstring::{LazyCompact, SmartString};
use state::State;
use swc_atoms::{
    wtf8::{CodePoint, Wtf8, Wtf8Buf},
    Atom,
};
use swc_common::{
    comments::{Comment, CommentKind},
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::{EsVersion, Ident};

use self::jsx::xhtml;
use super::{context::Context, input::Tokens};
use crate::{
    common::lexer::{
        comments_buffer::{BufferedComment, BufferedCommentKind, CommentsBufferTrait},
        number::{parse_integer, LazyInteger},
    },
    error::SyntaxError,
    lexer::TokenFlags,
};

pub mod char;
pub mod comments_buffer;
mod jsx;
pub mod number;
mod search;
pub mod state;
pub mod token;
pub mod whitespace;

use token::TokenFactory;

// Byte-search utilities
use self::search::SafeByteMatchTable;
use crate::{byte_search, safe_byte_match_table};

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

static TEMPLATE_LITERAL_TABLE: SafeByteMatchTable =
    safe_byte_match_table!(|b| matches!(b, b'$' | b'`' | b'\\' | b'\r'));

/// Converts UTF-16 surrogate pair to Unicode code point.
/// `https://tc39.es/ecma262/#sec-utf16decodesurrogatepair`
#[inline]
const fn pair_to_code_point(high: u32, low: u32) -> u32 {
    (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000
}

/// A Unicode escape sequence.
///
/// `\u Hex4Digits`, `\u Hex4Digits \u Hex4Digits`, or `\u{ HexDigits }`.
#[derive(Debug)]
pub enum UnicodeEscape {
    // `\u Hex4Digits` or `\u{ HexDigits }`, which forms a valid Unicode code point.
    // Char cannot be in range 0xD800..=0xDFFF.
    CodePoint(char),
    // `\u Hex4Digits \u Hex4Digits`, which forms a valid Unicode astral code point.
    // Char is in the range 0x10000..=0x10FFFF.
    SurrogatePair(char),
    // `\u Hex4Digits` or `\u{ HexDigits }`, which forms an invalid Unicode code point.
    // Code unit is in the range 0xD800..=0xDFFF.
    LoneSurrogate(u32),
}

impl From<UnicodeEscape> for CodePoint {
    fn from(value: UnicodeEscape) -> Self {
        match value {
            UnicodeEscape::CodePoint(c) | UnicodeEscape::SurrogatePair(c) => {
                CodePoint::from_char(c)
            }
            UnicodeEscape::LoneSurrogate(u) => unsafe { CodePoint::from_u32_unchecked(u) },
        }
    }
}

pub type LexResult<T> = swc_ecma_parser::lexer::LexResult<T>;

fn remove_underscore(s: &str, has_underscore: bool) -> Cow<'_, str> {
    if has_underscore {
        debug_assert!(s.contains('_'));
        s.chars().filter(|&c| c != '_').collect::<String>().into()
    } else {
        debug_assert!(!s.contains('_'));
        Cow::Borrowed(s)
    }
}

pub trait Lexer<'a, TokenAndSpan>: Tokens<TokenAndSpan> + Sized {
    type State: self::state::State;
    type Token: token::TokenFactory<'a, TokenAndSpan, Self, Lexer = Self>;
    type CommentsBuffer: CommentsBufferTrait;

    fn input(&self) -> &StringInput<'a>;
    fn input_mut(&mut self) -> &mut StringInput<'a>;
    fn state(&self) -> &Self::State;
    fn state_mut(&mut self) -> &mut Self::State;
    fn comments(&self) -> Option<&'a dyn swc_common::comments::Comments>;
    fn comments_buffer(&self) -> Option<&Self::CommentsBuffer>;
    fn comments_buffer_mut(&mut self) -> Option<&mut Self::CommentsBuffer>;
    /// # Safety
    ///
    /// We know that the start and the end are valid
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str;
    fn input_uncons_while(&mut self, f: impl FnMut(char) -> bool) -> &'a str;
    fn atom<'b>(&self, s: impl Into<Cow<'b, str>>) -> swc_atoms::Atom;
    fn wtf8_atom<'b>(&self, s: impl Into<Cow<'b, Wtf8>>) -> swc_atoms::Wtf8Atom;
    fn push_error(&mut self, error: crate::error::Error);

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
    fn cur(&self) -> Option<u8> {
        self.input().cur()
    }

    #[inline(always)]
    fn peek(&self) -> Option<u8> {
        self.input().peek()
    }

    #[inline(always)]
    fn peek_ahead(&self) -> Option<u8> {
        self.input().peek_ahead()
    }

    #[inline(always)]
    fn cur_as_char(&self) -> Option<char> {
        self.input().cur_as_char()
    }

    #[inline(always)]
    fn bump(&mut self) {
        let c = self.cur_as_char().unwrap();
        unsafe {
            self.input_mut().bump_bytes(c.len_utf8());
        }
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
        unsafe {
            self.input_mut().bump_bytes(start_skip);
        }
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
                self.input_slice(slice_start, end)
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

        debug_assert_eq!(self.cur(), Some(b'/'));
        debug_assert_eq!(self.peek(), Some(b'*'));

        // Consume initial "/*"
        unsafe {
            self.input_mut().bump_bytes(2);
        }

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
                    if self.peek() == Some(b'/') {
                        // Consume "*/"
                        unsafe {
                            self.input_mut().bump_bytes(2);
                        }

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
                    if self.peek() == Some(b'\n') {
                        self.bump();
                    }
                }
                _ => {
                    // Unicode line terminator (LS/PS) or other character
                    if let Some('\u{2028}' | '\u{2029}') = self.cur_as_char() {
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

            unsafe {
                self.input_mut().bump_bytes(offset as usize);
            }
            if newline {
                self.state_mut().mark_had_line_break();
            }

            if LEX_COMMENTS && self.input().is_byte(b'/') {
                if let Some(c) = self.peek() {
                    if c == b'/' {
                        self.skip_line_comment(2);
                        continue;
                    } else if c == b'*' {
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
            if c == b'_' {
                *has_underscore = true;
                if allow_num_separator {
                    let is_allowed = |c: Option<u8>| {
                        let Some(c) = c else {
                            return false;
                        };
                        (c as char).is_digit(RADIX as _)
                    };
                    let is_forbidden = |c: Option<u8>| {
                        let Some(c) = c else {
                            return false;
                        };

                        if RADIX == 16 {
                            matches!(c, b'.' | b'X' | b'_' | b'x')
                        } else {
                            matches!(c, b'.' | b'B' | b'E' | b'O' | b'_' | b'b' | b'e' | b'o')
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
                    // Safety: cur() returns Some(c) where c is a valid char
                    self.bump();

                    continue;
                }
            }

            // e.g. (val for a) = 10  where radix = 16
            let val = if let Some(val) = (c as char).to_digit(RADIX as _) {
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
                self.cur().is_some_and(|c| c == b'.'),
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
            debug_assert!(!START_WITH_ZERO || self.cur().unwrap() == b'0');

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
                let end = self.cur_pos();
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input_slice(start, end)
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
                        let end = self.cur_pos();
                        let raw = unsafe {
                            // Safety: We got both start and end position from `self.input`
                            self.input_slice(start, end)
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
                    let end = self.cur_pos();
                    let raw = unsafe {
                        // Safety: We got both start and end position from `self.input`
                        self.input_slice(start, end)
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

        let has_dot = self.cur() == Some(b'.');
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

        let has_e = self.cur().is_some_and(|c| c == b'e' || c == b'E');
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

            if next == b'+' || next == b'-' {
                self.bump(); // remove '+', '-'
            }

            let lazy_integer = self.read_number_no_dot_as_str::<10>()?;
            has_underscore |= lazy_integer.has_underscore;
        }

        let val = if has_dot || has_e {
            let end = self.cur_pos();
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice(start, end)
            };

            let raw = remove_underscore(raw, has_underscore);
            raw.parse().expect("failed to parse float literal")
        } else {
            let s = unsafe { self.input_slice(lazy_integer.start, lazy_integer.end) };
            let s = remove_underscore(s, has_underscore);
            parse_integer::<10>(&s)
        };

        self.ensure_not_ident()?;

        let end = self.cur_pos();
        let raw_str = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice(start, end)
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

        debug_assert_eq!(self.cur(), Some(b'0'));
        self.bump();

        debug_assert!(self
            .cur()
            .is_some_and(|c| matches!(c, b'b' | b'B' | b'o' | b'O' | b'x' | b'X')));
        self.bump();

        let lazy_integer = self.read_number_no_dot_as_str::<RADIX>()?;
        let has_underscore = lazy_integer.has_underscore;

        let s = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice(lazy_integer.start, lazy_integer.end)
        };
        if self.eat(b'n') {
            let end = self.cur_pos();
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice(start, end)
            };

            let bigint_value = num_bigint::BigInt::parse_bytes(s.as_bytes(), RADIX as _).unwrap();
            return Ok(Either::Right((Box::new(bigint_value), self.atom(raw))));
        }
        let s = remove_underscore(s, has_underscore);
        let val = parse_integer::<RADIX>(&s);

        self.ensure_not_ident()?;

        let end = self.cur_pos();
        let raw = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice(start, end)
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

    /// Read a JSX identifier (valid tag or attribute name).
    ///
    /// Optimized version since JSX identifiers can"t contain
    /// escape characters and so can be read as single slice.
    /// Also assumes that first character was already checked
    /// by isIdentifierStart in readToken.
    fn read_jsx_word(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.syntax().jsx());
        debug_assert!(self.input().cur().is_some_and(|c| c.is_ident_start()));

        let mut first = true;
        let slice = self.input_uncons_while(|c| {
            if first {
                first = false;
                c.is_ident_start()
            } else {
                c.is_ident_part() || c == '-'
            }
        });

        Ok(Self::Token::jsx_name(slice, self))
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

        debug_assert!(self.input().cur().is_some_and(|c| c == b'&'));
        self.bump();

        let start_pos = self.input().cur_pos();

        for _ in 0..10 {
            let c = match self.input().cur() {
                Some(c) => c as char,
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
        let ch = self.input().cur().unwrap() as char;
        self.bump();

        let out = if ch == '\r' && self.input().cur() == Some(b'\n') {
            self.bump(); // `\n`
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        Ok(out)
    }

    fn read_jsx_str(&mut self, quote: char) -> LexResult<Self::Token> {
        debug_assert!(self.syntax().jsx());
        let start = self.input().cur_pos();
        // Safety: cur() was Some(quote)
        self.bump(); // `quote`
        let mut out = String::new();
        let mut chunk_start = self.input().cur_pos();
        loop {
            let ch = match self.input().cur() {
                Some(c) => c as char,
                None => {
                    self.emit_error(start, SyntaxError::UnterminatedStrLit);
                    break;
                }
            };
            let cur_pos = self.input().cur_pos();
            if ch == '\\' {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice(chunk_start, cur_pos)
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
                    self.input_slice(chunk_start, cur_pos)
                };

                out.push_str(value);

                let jsx_entity = self.read_jsx_entity()?;

                out.push(jsx_entity.0);

                chunk_start = self.input().cur_pos();
            } else if ch.is_line_terminator() {
                let value = unsafe {
                    // Safety: We already checked for the range
                    self.input_slice(chunk_start, cur_pos)
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
                // Safety: cur() was Some(ch)
                self.bump();
            }
        }
        let cur_pos = self.input().cur_pos();
        let s = unsafe {
            // Safety: We already checked for the range
            self.input_slice(chunk_start, cur_pos)
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

        let end = self.input().cur_pos();
        let raw = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input_slice(start, end)
        };
        let raw = self.atom(raw);
        Ok(Self::Token::str(value.into(), raw, self))
    }

    // Modified based on <https://github.com/oxc-project/oxc/blob/f0e1510b44efdb1b0d9a09f950181b0e4c435abe/crates/oxc_parser/src/lexer/unicode.rs#L237>
    /// Unicode code unit (`\uXXXX`).
    ///
    /// The opening `\u` must already have been consumed before calling this
    /// method.
    ///
    /// See background info on surrogate pairs:
    ///   * `https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae`
    ///   * `https://mathiasbynens.be/notes/javascript-identifiers-es6`
    fn read_unicode_code_unit(&mut self) -> LexResult<Option<UnicodeEscape>> {
        const MIN_HIGH: u32 = 0xd800;
        const MAX_HIGH: u32 = 0xdbff;
        const MIN_LOW: u32 = 0xdc00;
        const MAX_LOW: u32 = 0xdfff;

        let Some(high) = self.read_int_u32::<16>(4)? else {
            return Ok(None);
        };
        if let Some(ch) = char::from_u32(high) {
            return Ok(Some(UnicodeEscape::CodePoint(ch)));
        }

        // The first code unit of a surrogate pair is always in the range from 0xD800 to
        // 0xDBFF, and is called a high surrogate or a lead surrogate.
        // Note: `high` must be >= `MIN_HIGH`, otherwise `char::from_u32` would have
        // returned `Some`, and already exited.
        debug_assert!(high >= MIN_HIGH);
        let is_pair = high <= MAX_HIGH
            && self.input().cur() == Some(b'\\')
            && self.input().peek() == Some(b'u');
        if !is_pair {
            return Ok(Some(UnicodeEscape::LoneSurrogate(high)));
        }

        let before_second = self.input().cur_pos();

        // Bump `\u`
        unsafe {
            self.input_mut().bump_bytes(2);
        }

        let Some(low) = self.read_int_u32::<16>(4)? else {
            return Ok(None);
        };

        // The second code unit of a surrogate pair is always in the range from 0xDC00
        // to 0xDFFF, and is called a low surrogate or a trail surrogate.
        // If this isn't a valid pair, rewind to before the 2nd, and return the first
        // only. The 2nd could be the first part of a valid pair.
        if !(MIN_LOW..=MAX_LOW).contains(&low) {
            unsafe {
                // Safety: state is valid position because we got it from cur_pos()
                self.input_mut().reset_to(before_second);
            }
            return Ok(Some(UnicodeEscape::LoneSurrogate(high)));
        }

        let code_point = pair_to_code_point(high, low);
        // SAFETY: `high` and `low` have been checked to be in ranges which always yield
        // a `code_point` which is a valid `char`
        let ch = unsafe { char::from_u32_unchecked(code_point) };
        Ok(Some(UnicodeEscape::SurrogatePair(ch)))
    }

    fn read_unicode_escape(&mut self) -> LexResult<UnicodeEscape> {
        debug_assert_eq!(self.cur(), Some(b'u'));

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
                if is_curly && !self.eat(b'}') {
                    self.error(state, SyntaxError::InvalidUnicodeEscape)?
                }

                Ok(UnicodeEscape::CodePoint(c))
            }
            _ => {
                unsafe {
                    // Safety: state is valid position because we got it from cur_pos()
                    self.input_mut().reset_to(state);
                }

                let Some(value) = self.read_unicode_code_unit()? else {
                    self.error(
                        state,
                        SyntaxError::BadCharacterEscapeSequence {
                            expected: if is_curly {
                                "1-6 hex characters"
                            } else {
                                "4 hex characters"
                            },
                        },
                    )?
                };

                if is_curly && !self.eat(b'}') {
                    self.error(state, SyntaxError::InvalidUnicodeEscape)?
                }

                Ok(value)
            }
        }
    }

    #[cold]
    fn read_shebang(&mut self) -> LexResult<Option<Atom>> {
        if self.input().cur() != Some(b'#') || self.input().peek() != Some(b'!') {
            return Ok(None);
        }
        self.bump(); // `#`
        self.bump(); // `!`
        let s = self.input_uncons_while(|c| !c.is_line_terminator());
        Ok(Some(self.atom(s)))
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Self::Token> {
        let start = self.cur_pos();

        let mut cooked = Ok(Wtf8Buf::new());
        let mut cooked_slice_start = start;
        let raw_slice_start = start;

        macro_rules! consume_cooked {
            () => {{
                if let Ok(cooked) = &mut cooked {
                    let last_pos = self.cur_pos();
                    cooked.push_str(unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input_slice(cooked_slice_start, last_pos)
                    });
                }
            }};
        }

        // Handle edge case for immediate template end
        if start == self.cur_pos() && self.state().last_was_tpl_element() {
            if let Some(c) = self.cur() {
                if c == b'$' && self.peek() == Some(b'{') {
                    self.bump(); // '$'
                    self.bump(); // '{'
                    return Ok(Self::Token::DOLLAR_LBRACE);
                } else if c == b'`' {
                    self.bump(); // '`'
                    return Ok(Self::Token::BACKQUOTE);
                }
            }
        }

        // Fast path: use byte_search to scan for template literal terminators
        loop {
            let matched_byte = byte_search! {
                lexer: self,
                table: TEMPLATE_LITERAL_TABLE,
                handle_eof: {
                    // EOF reached - unterminated template
                    self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
                }
            };

            match matched_byte {
                b'$' => {
                    // Check if this is ${
                    if self.peek() == Some(b'{') {
                        // Found template substitution
                        let cooked = if cooked_slice_start == raw_slice_start {
                            let last_pos = self.cur_pos();
                            let s = unsafe {
                                // Safety: Both of start and last_pos are valid position because we
                                // got them from `self.input`
                                self.input_slice(cooked_slice_start, last_pos)
                            };
                            Ok(self.wtf8_atom(Wtf8::from_str(s)))
                        } else {
                            consume_cooked!();
                            cooked.map(|s| self.wtf8_atom(&*s))
                        };

                        let end = self.input().cur_pos();
                        let raw = unsafe {
                            // Safety: Both of start and last_pos are valid position because we got
                            // them from `self.input`
                            self.input_slice(raw_slice_start, end)
                        };
                        let raw = self.atom(raw);
                        return Ok(Self::Token::template(cooked, raw, self));
                    } else {
                        // Just a regular $ character, continue scanning
                        self.bump();
                        continue;
                    }
                }
                b'`' => {
                    // Found template end
                    let cooked = if cooked_slice_start == raw_slice_start {
                        let last_pos = self.cur_pos();
                        let s = unsafe { self.input_slice(cooked_slice_start, last_pos) };
                        Ok(self.wtf8_atom(Wtf8::from_str(s)))
                    } else {
                        consume_cooked!();
                        cooked.map(|s| self.wtf8_atom(&*s))
                    };

                    let end = self.input().cur_pos();
                    let raw = unsafe { self.input_slice(raw_slice_start, end) };
                    let raw = self.atom(raw);
                    return Ok(Self::Token::template(cooked, raw, self));
                }
                b'\r' => {
                    // Handle carriage return line terminator
                    self.state_mut().mark_had_line_break();
                    consume_cooked!();

                    // Handle carriage return - consume \r and optionally \n, normalize to \n
                    self.bump(); // '\r'
                    if self.peek() == Some(b'\n') {
                        self.bump(); // '\n'
                    }

                    if let Ok(ref mut cooked) = cooked {
                        cooked.push_char('\n');
                    }
                    cooked_slice_start = self.cur_pos();
                }
                b'\\' => {
                    // Handle escape sequence - fall back to slow path for this part
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
                }
                _ => unreachable!(),
            }
        }
    }

    /// Read an escaped character for string literal.
    ///
    /// In template literal, we should preserve raw string.
    fn read_escaped_char(&mut self, in_template: bool) -> LexResult<Option<CodePoint>> {
        debug_assert_eq!(self.cur(), Some(b'\\'));

        let start = self.cur_pos();

        self.bump(); // '\'

        let c = match self.cur() {
            Some(c) => c as char,
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
                    Some(val) => return Ok(CodePoint::from_u32(val)),
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
                Ok(value) => {
                    return Ok(Some(value.into()));
                }
                Err(err) => self.error(start, err.into_kind())?,
            },

            // octal escape sequences
            '0'..='7' => {
                self.bump();

                let first_c = if c == '0' {
                    match self.cur() {
                        Some(next) if (next as char).is_digit(8) => c,
                        // \0 is not an octal literal nor decimal literal.
                        _ => return Ok(Some(CodePoint::from_char('\u{0000}'))),
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

                        match cur.and_then(|c| (c as char).to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(CodePoint::from_u32(value as u32)),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };

                                self.bump();
                            }
                            _ => return Ok(CodePoint::from_u32(value as u32)),
                        }
                    }};
                }

                one!(false);
                one!(true);

                return Ok(CodePoint::from_u32(value as u32));
            }
            _ => c,
        };

        // Safety: cur() is Some(c) if this method is called.
        self.bump();

        Ok(CodePoint::from_u32(c as u32))
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self, start: BytePos) -> LexResult<Self::Token> {
        unsafe {
            // Safety: start is valid position, and cur() is Some('/')
            self.input_mut().reset_to(start);
        }

        debug_assert_eq!(self.cur(), Some(b'/'));

        let start = self.cur_pos();

        self.bump(); // bump '/'

        let slice_start = self.cur_pos();

        let (mut escaped, mut in_class) = (false, false);

        while let Some(c) = self.cur() {
            let c = c as char;
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
            let end = self.cur_pos();
            let s = unsafe { self.input_slice(slice_start, end) };
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

        Ok(Self::Token::regexp(content, flags, self))
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
                        let end = self.cur_pos();
                        let s = unsafe {
                            // Safety: slice_start and end are valid position because we got them from
                            // `self.input`
                            self.input_slice(slice_start, end)
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
                    let end = self.cur_pos();
                    let s = unsafe {
                        // Safety: slice_start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice(slice_start, end)
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

                    let value = self.read_unicode_escape()?;

                    match value {
                        UnicodeEscape::CodePoint(ch) => {
                            let valid = if first {
                                ch.is_ident_start()
                            } else {
                                ch.is_ident_part()
                            };
                            if !valid {
                                self.emit_error(start, SyntaxError::InvalidIdentChar);
                            }
                            buf.push(ch);
                        }
                        UnicodeEscape::SurrogatePair(ch) => {
                            buf.push(ch);
                            self.emit_error(start, SyntaxError::InvalidIdentChar);
                        }
                        UnicodeEscape::LoneSurrogate(code_point) => {
                            buf.push_str(format!("\\u{code_point:04X}").as_str());
                            self.emit_error(start, SyntaxError::InvalidIdentChar);
                        }
                    };

                    slice_start = self.cur_pos();
                    continue;
                }

                // ASCII but not a valid identifier
                break;
            } else if let Some(c) = self.input().cur_as_char() {
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

        let end = self.cur_pos();
        let s = unsafe {
            // Safety: slice_start and end are valid position because we got them from
            // `self.input`
            self.input_slice(slice_start, end)
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
    fn read_token_number_sign(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some_and(|c| c == b'#'));

        self.bump(); // '#'

        // `#` can also be a part of shebangs, however they should have been
        // handled by `read_shebang()`
        debug_assert!(
            !self.input().is_at_start() || self.cur() != Some(b'!'),
            "#! should have already been handled by read_shebang()"
        );
        Ok(Self::Token::HASH)
    }

    /// Read a token given `.`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_dot(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some_and(|c| c == b'.'));
        // Check for eof
        let next = match self.input().peek() {
            Some(next) => next,
            None => {
                self.bump(); // '.'
                return Ok(Self::Token::DOT);
            }
        };
        if next.is_ascii_digit() {
            return self.read_number::<true, false>().map(|v| match v {
                Left((value, raw)) => Self::Token::num(value, raw, self),
                Right(_) => unreachable!("read_number should not return bigint for leading dot"),
            });
        }

        self.bump(); // 1st `.`

        if next == b'.' && self.input().peek() == Some(b'.') {
            self.bump(); // 2nd `.`
            self.bump(); // 3rd `.`

            return Ok(Self::Token::DOTDOTDOT);
        }

        Ok(Self::Token::DOT)
    }

    /// Read a token given `?`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_question_mark(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some_and(|c| c == b'?'));
        self.bump();
        if self.input_mut().eat_byte(b'?') {
            if self.input_mut().eat_byte(b'=') {
                Ok(Self::Token::NULLISH_ASSIGN)
            } else {
                Ok(Self::Token::NULLISH_COALESCING)
            }
        } else {
            Ok(Self::Token::QUESTION)
        }
    }

    /// Read a token given `:`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_colon(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some_and(|c| c == b':'));
        self.bump(); // ':'
        Ok(Self::Token::COLON)
    }

    /// Read a token given `0`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_zero(&mut self) -> LexResult<Self::Token> {
        debug_assert_eq!(self.cur(), Some(b'0'));
        let next = self.input().peek();

        let bigint = match next {
            Some(b'x') | Some(b'X') => self.read_radix_number::<16>(),
            Some(b'o') | Some(b'O') => self.read_radix_number::<8>(),
            Some(b'b') | Some(b'B') => self.read_radix_number::<2>(),
            _ => {
                return self.read_number::<false, true>().map(|v| match v {
                    Left((value, raw)) => Self::Token::num(value, raw, self),
                    Right((value, raw)) => Self::Token::bigint(value, raw, self),
                });
            }
        };

        bigint.map(|v| match v {
            Left((value, raw)) => Self::Token::num(value, raw, self),
            Right((value, raw)) => Self::Token::bigint(value, raw, self),
        })
    }

    /// Read a token given `|` or `&`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_logical<const C: u8>(&mut self) -> LexResult<Self::Token> {
        debug_assert!(C == b'|' || C == b'&');
        let is_bit_and = C == b'&';
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        // Safety: cur() is Some(c as char)
        self.bump();
        let token = if is_bit_and {
            Self::Token::BIT_AND
        } else {
            Self::Token::BIT_OR
        };

        // '|=', '&='
        if self.input_mut().eat_byte(b'=') {
            return Ok(if is_bit_and {
                Self::Token::BIT_AND_EQ
            } else {
                debug_assert!(token.is_bit_or());
                Self::Token::BIT_OR_EQ
            });
        }

        // '||', '&&'
        if self.input().cur() == Some(C) {
            // Safety: cur() is Some(c)
            self.bump();

            if self.input().cur() == Some(b'=') {
                // Safety: cur() is Some('=')
                self.bump();

                return Ok(if is_bit_and {
                    Self::Token::LOGICAL_AND_EQ
                } else {
                    debug_assert!(token.is_bit_or());
                    Self::Token::LOGICAL_OR_EQ
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
                Self::Token::LOGICAL_AND
            } else {
                debug_assert!(token.is_bit_or());
                Self::Token::LOGICAL_OR
            });
        }

        Ok(token)
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_mul_mod(&mut self, is_mul: bool) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some_and(|c| c == b'*' || c == b'%'));
        self.bump();
        let token = if is_mul {
            if self.input_mut().eat_byte(b'*') {
                // `**`
                Self::Token::EXP
            } else {
                Self::Token::MUL
            }
        } else {
            Self::Token::MOD
        };

        Ok(if self.input_mut().eat_byte(b'=') {
            if token.is_star() {
                Self::Token::MUL_EQ
            } else if token.is_mod() {
                Self::Token::MOD_EQ
            } else {
                debug_assert!(token.is_exp());
                Self::Token::EXP_EQ
            }
        } else {
            token
        })
    }

    #[inline(never)]
    fn read_slash(&mut self) -> LexResult<Self::Token> {
        debug_assert_eq!(self.cur(), Some(b'/'));
        self.bump(); // '/'
        Ok(if self.eat(b'=') {
            Self::Token::DIV_EQ
        } else {
            Self::Token::DIV
        })
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_ident_unknown(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some());

        let (s, has_escape) = self.read_word_as_str_with()?;
        let atom = self.atom(s);
        let word = Self::Token::unknown_ident(atom, self);

        if has_escape {
            self.update_token_flags(|flags| *flags |= TokenFlags::UNICODE);
        }

        Ok(word)
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    // TODO: merge `read_str_lit` and `read_jsx_str`
    fn read_str_lit(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur() == Some(b'\'') || self.cur() == Some(b'"'));
        let start = self.cur_pos();
        let quote = self.cur().unwrap();

        self.bump(); // '"' or '\''

        let mut slice_start = self.input().cur_pos();

        let mut buf: Option<Wtf8Buf> = None;

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
                    let value_end = self.cur_pos();
                    let s = unsafe {
                            // Safety: slice_start and value_end are valid position because we
                            // got them from `self.input`
                        self.input_slice(slice_start, value_end)
                    };

                    self.emit_error(start, SyntaxError::UnterminatedStrLit);

                    let end = self.cur_pos();
                    let raw = unsafe { self.input_slice(start, end) };
                    return Ok(Self::Token::str(self.wtf8_atom(Wtf8::from_str(s)), self.atom(raw), self));
                },
            };
            // dbg!(char::from_u32(fast_path_result as u32));

            match fast_path_result {
                b'"' | b'\'' if fast_path_result == quote => {
                    let value_end = self.cur_pos();

                    let value = if let Some(buf) = buf.as_mut() {
                        // `buf` only exist when there has escape.
                        debug_assert!(unsafe { self.input_slice(start, value_end).contains('\\') });
                        let s = unsafe {
                            // Safety: slice_start and value_end are valid position because we
                            // got them from `self.input`
                            self.input_slice(slice_start, value_end)
                        };
                        buf.push_str(s);
                        self.wtf8_atom(&**buf)
                    } else {
                        let s = unsafe { self.input_slice(slice_start, value_end) };
                        self.wtf8_atom(Wtf8::from_str(s))
                    };

                    // Safety: cur is quote
                    self.bump();

                    let end = self.cur_pos();
                    let raw = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice(start, end)
                    };
                    let raw = self.atom(raw);
                    return Ok(Self::Token::str(value, raw, self));
                }
                b'\\' => {
                    let end = self.cur_pos();
                    let s = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice(slice_start, end)
                    };

                    if buf.is_none() {
                        buf = Some(Wtf8Buf::from_str(s));
                    } else {
                        buf.as_mut().unwrap().push_str(s);
                    }

                    if let Some(escaped) = self.read_escaped_char(false)? {
                        buf.as_mut().unwrap().push(escaped);
                    }

                    slice_start = self.cur_pos();
                    continue;
                }
                b'\n' | b'\r' => {
                    let end = self.cur_pos();
                    let s = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice(slice_start, end)
                    };

                    self.emit_error(start, SyntaxError::UnterminatedStrLit);

                    let end = self.cur_pos();

                    let raw = unsafe {
                        // Safety: start and end are valid position because we got them from
                        // `self.input`
                        self.input_slice(start, end)
                    };
                    return Ok(Self::Token::str(
                        self.wtf8_atom(Wtf8::from_str(s)),
                        self.atom(raw),
                        self,
                    ));
                }
                _ => self.bump(),
            }
        }
    }

    fn read_keyword_with(
        &mut self,
        convert: &dyn Fn(&str) -> Option<Self::Token>,
    ) -> LexResult<Self::Token> {
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
            Ok(Self::Token::unknown_ident(atom, self))
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
                let end = self.cur_pos();
                let s = unsafe {
                    // Safety: slice_start and end are valid position because we got them from
                    // `self.input`
                    self.input_slice(slice_start, end)
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
            let end = self.cur_pos();
            let s = unsafe {
                // Safety: slice_start and end are valid position because we got them from
                // `self.input`
                self.input_slice(slice_start, end)
            };

            Ok((Cow::Borrowed(s), false))
        }
    }
}

pub fn pos_span(p: BytePos) -> Span {
    Span::new_with_checked(p, p)
}

pub fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new_with_checked(p, p + BytePos(len))
}
