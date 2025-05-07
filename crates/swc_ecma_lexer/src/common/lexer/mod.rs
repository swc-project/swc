use std::borrow::Cow;

use char::{Char, CharExt};
use either::Either::{self, Left, Right};
use num_bigint::BigInt as BigIntValue;
use num_traits::{Num as NumTrait, ToPrimitive};
use number::LazyBigInt;
use smartstring::{LazyCompact, SmartString};
use state::State;
use swc_atoms::Atom;
use swc_common::{
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::{EsVersion, Ident};

use self::jsx::xhtml;
use super::{context::Context, input::Tokens};
use crate::{error::SyntaxError, token::BinOpToken};

pub mod char;
pub mod comments_buffer;
mod jsx;
pub mod number;
pub mod state;
pub mod token;
pub mod whitespace;

use token::TokenFactory;

pub type LexResult<T> = Result<T, crate::error::Error>;

pub trait Lexer<'a, TokenAndSpan>: Tokens<TokenAndSpan> + Sized {
    type State: self::state::State;
    type Token: token::TokenFactory<'a, TokenAndSpan, Self, Lexer = Self>;

    fn input(&self) -> &StringInput<'a>;
    fn input_mut(&mut self) -> &mut StringInput<'a>;
    fn state(&self) -> &Self::State;
    fn state_mut(&mut self) -> &mut Self::State;
    fn comments(&self) -> Option<&'a dyn swc_common::comments::Comments>;
    fn comments_buffer(&self) -> Option<&self::comments_buffer::CommentsBuffer>;
    fn comments_buffer_mut(&mut self) -> Option<&mut self::comments_buffer::CommentsBuffer>;
    /// # Safety
    ///
    /// We know that the start and the end are valid
    unsafe fn input_slice(&mut self, start: BytePos, end: BytePos) -> &'a str;
    fn input_uncons_while(&mut self, f: impl FnMut(char) -> bool) -> &'a str;
    fn atom<'b>(&self, s: impl Into<Cow<'b, str>>) -> swc_atoms::Atom;
    fn push_error(&self, error: crate::error::Error);
    fn buf(&self) -> std::rc::Rc<std::cell::RefCell<String>>;
    // TODO: invest why there has regression if implement this by trait
    fn skip_block_comment(&mut self);

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
                self.state_mut().set_had_line_break(true);
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
    ) -> LexResult<Ret>
    where
        F: FnMut(Ret, u8, u32) -> LexResult<(Ret, bool)>,
        Ret: Copy + Default,
    {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_int should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );

        if cfg!(feature = "debug") {
            tracing::trace!("read_digits(radix = {}), cur = {:?}", RADIX, self.cur());
        }

        let start = self.cur_pos();
        let mut total: Ret = Default::default();
        let mut prev = None;

        while let Some(c) = self.cur() {
            if allow_num_separator && c == '_' {
                let is_allowed = |c: Option<char>| {
                    if c.is_none() {
                        return false;
                    }

                    let c = c.unwrap();

                    c.is_digit(RADIX as _)
                };
                let is_forbidden = |c: Option<char>| {
                    if c.is_none() {
                        return true;
                    }

                    if RADIX == 16 {
                        matches!(c.unwrap(), '.' | 'X' | '_' | 'x')
                    } else {
                        matches!(c.unwrap(), '.' | 'B' | 'E' | 'O' | '_' | 'b' | 'e' | 'o')
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
    fn read_number_no_dot<const RADIX: u8>(&mut self) -> LexResult<f64> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );
        let start = self.cur_pos();

        let mut read_any = false;

        let res = self.read_digits::<_, f64, RADIX>(
            |total, radix, v| {
                read_any = true;

                Ok((f64::mul_add(total, radix as f64, v as f64), true))
            },
            true,
        );

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix: RADIX })?;
        }
        res
    }

    /// This can read long integers like
    /// "13612536612375123612312312312312312312312".
    ///
    /// - Returned `bool` is `true` is there was `8` or `9`.
    fn read_number_no_dot_as_str<const RADIX: u8>(
        &mut self,
    ) -> LexResult<(f64, LazyBigInt<RADIX>, bool)> {
        debug_assert!(
            RADIX == 2 || RADIX == 8 || RADIX == 10 || RADIX == 16,
            "radix for read_number_no_dot should be one of 2, 8, 10, 16, but got {}",
            RADIX
        );
        let start = self.cur_pos();

        let mut non_octal = false;
        let mut read_any = false;

        self.read_digits::<_, f64, RADIX>(
            |total, radix, v| {
                read_any = true;

                if v == 8 || v == 9 {
                    non_octal = true;
                }

                Ok((f64::mul_add(total, radix as f64, v as f64), true))
            },
            true,
        )?;

        if !read_any {
            self.error(start, SyntaxError::ExpectedDigit { radix: RADIX })?;
        }

        let end = self.cur_pos();
        let raw = unsafe {
            // Safety: We got both start and end position from `self.input`
            self.input_slice(start, end)
        };
        // Remove number separator from number
        let raw_number_str = raw.replace('_', "");
        let parsed_float = BigIntValue::from_str_radix(&raw_number_str, RADIX as u32)
            .expect("failed to parse float using BigInt")
            .to_f64()
            .expect("failed to parse float using BigInt");
        Ok((parsed_float, LazyBigInt::new(raw_number_str), non_octal))
    }

    /// Read an integer in the given radix. Return `None` if zero digits
    /// were read, the integer value otherwise.
    /// When `len` is not zero, this
    /// will return `None` unless the integer has exactly `len` digits.
    fn read_int<const RADIX: u8>(&mut self, len: u8) -> LexResult<Option<f64>> {
        let mut count = 0u16;
        let v = self.read_digits::<_, Option<f64>, RADIX>(
            |opt: Option<f64>, radix, val| {
                count += 1;
                let total = opt.unwrap_or_default() * radix as f64 + val as f64;

                Ok((Some(total), count != len as u16))
            },
            true,
        )?;
        if len != 0 && count != len as u16 {
            Ok(None)
        } else {
            Ok(v)
        }
    }

    /// Reads an integer, octal integer, or floating-point number
    fn read_number(
        &mut self,
        starts_with_dot: bool,
    ) -> LexResult<Either<(f64, Atom), (Box<BigIntValue>, Atom)>> {
        debug_assert!(self.cur().is_some());

        if starts_with_dot {
            debug_assert_eq!(
                self.cur(),
                Some('.'),
                "read_number(starts_with_dot = true) expects current char to be '.'"
            );
        }

        let start = self.cur_pos();

        let val = if starts_with_dot {
            // first char is '.'
            0f64
        } else {
            let starts_with_zero = self.cur().unwrap() == '0';

            // Use read_number_no_dot to support long numbers.
            let (val, s, not_octal) = self.read_number_no_dot_as_str::<10>()?;

            if self.eat(b'n') {
                let end = self.cur_pos();
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input_slice(start, end)
                };

                return Ok(Either::Right((Box::new(s.into_value()), self.atom(raw))));
            }

            if starts_with_zero {
                // TODO: I guess it would be okay if I don't use -ffast-math
                // (or something like that), but needs review.
                if val == 0.0f64 {
                    // If only one zero is used, it's decimal.
                    // And if multiple zero is used, it's octal.
                    //
                    // e.g. `0` is decimal (so it can be part of float)
                    //
                    // e.g. `000` is octal
                    if start.0 != self.last_pos().0 - 1 {
                        // `-1` is utf 8 length of `0`

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
                } else {
                    // strict mode hates non-zero decimals starting with zero.
                    // e.g. 08.1 is strict mode violation but 0.1 is valid float.

                    if val.fract() == 0.0 {
                        let val_str = &s.value;

                        // if it contains '8' or '9', it's decimal.
                        if not_octal {
                            // Continue parsing
                            self.emit_strict_mode_error(start, SyntaxError::LegacyDecimal);
                        } else {
                            // It's Legacy octal, and we should reinterpret value.
                            let val = BigIntValue::from_str_radix(val_str, 8)
                                .unwrap_or_else(|err| {
                                    panic!(
                                        "failed to parse {} using `from_str_radix`: {:?}",
                                        val_str, err
                                    )
                                })
                                .to_f64()
                                .unwrap_or_else(|| {
                                    panic!("failed to parse {} into float using BigInt", val_str)
                                });

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
                }
            }

            val
        };

        // At this point, number cannot be an octal literal.

        let mut val: f64 = val;

        //  `0.a`, `08.a`, `102.a` are invalid.
        //
        // `.1.a`, `.1e-4.a` are valid,
        if self.cur() == Some('.') {
            self.bump();

            if starts_with_dot {
                debug_assert!(self.cur().is_some());
                debug_assert!(self.cur().unwrap().is_ascii_digit());
            }

            // Read numbers after dot
            self.read_int::<10>(0)?;

            val = {
                let end = self.cur_pos();
                let raw = unsafe {
                    // Safety: We got both start and end position from `self.input`
                    self.input_slice(start, end)
                };

                // Remove number separator from number
                if raw.contains('_') {
                    Cow::Owned(raw.replace('_', ""))
                } else {
                    Cow::Borrowed(raw)
                }
                .parse()
                .expect("failed to parse float using rust's impl")
            };
        }

        // Handle 'e' and 'E'
        //
        // .5e1 = 5
        // 1e2 = 100
        // 1e+2 = 100
        // 1e-2 = 0.01
        match self.cur() {
            Some('e') | Some('E') => {
                self.bump();

                let next = match self.cur() {
                    Some(next) => next,
                    None => {
                        let pos = self.cur_pos();
                        self.error(pos, SyntaxError::NumLitTerminatedWithExp)?
                    }
                };

                let positive = if next == '+' || next == '-' {
                    self.bump(); // remove '+', '-'

                    next == '+'
                } else {
                    true
                };

                let exp = self.read_number_no_dot::<10>()?;

                val = if exp == f64::INFINITY {
                    if positive && val != 0.0 {
                        f64::INFINITY
                    } else {
                        0.0
                    }
                } else {
                    let end = self.cur_pos();
                    let raw = unsafe {
                        // Safety: We got both start and end position from `self.input`
                        self.input_slice(start, end)
                    };

                    if raw.contains('_') {
                        Cow::Owned(raw.replace('_', ""))
                    } else {
                        Cow::Borrowed(raw)
                    }
                    .parse()
                    .expect("failed to parse float literal")
                }
            }
            _ => {}
        }

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
                        let span = Span::new(start, start);
                        crate::error::Error::new(span, SyntaxError::InvalidUnicodeEscape)
                    })?;

                Ok((Some(total), count != len))
            },
            true,
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
            "radix should be one of 2, 8, 16, but got {}",
            RADIX
        );
        debug_assert_eq!(self.cur(), Some('0'));

        let start = self.cur_pos();

        self.bump();

        match self.input().cur() {
            Some(..) => {
                self.bump();
            }
            _ => {
                unreachable!();
            }
        }

        let (val, s, _) = self.read_number_no_dot_as_str::<RADIX>()?;

        if self.eat(b'n') {
            let end = self.cur_pos();
            let raw = unsafe {
                // Safety: We got both start and end position from `self.input`
                self.input_slice(start, end)
            };

            return Ok(Either::Right((Box::new(s.into_value()), self.atom(raw))));
        }

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

            // move the pending to the leading or trailing
            for c in comments_buffer.take_pending_leading() {
                // if the file had no tokens and no shebang, then treat any
                // comments in the leading comments buffer as leading.
                // Otherwise treat them as trailing.
                if last == start_pos {
                    comments_buffer.push(self::comments_buffer::BufferedComment {
                        kind: self::comments_buffer::BufferedCommentKind::Leading,
                        pos: last,
                        comment: c,
                    });
                } else {
                    comments_buffer.push(self::comments_buffer::BufferedComment {
                        kind: self::comments_buffer::BufferedCommentKind::Trailing,
                        pos: last,
                        comment: c,
                    });
                }
            }

            // now fill the user's passed in comments
            for comment in comments_buffer.take_comments() {
                match comment.kind {
                    self::comments_buffer::BufferedCommentKind::Leading => {
                        comments.add_leading(comment.pos, comment.comment);
                    }
                    self::comments_buffer::BufferedCommentKind::Trailing => {
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

        let c = self.input().cur();
        debug_assert_eq!(c, Some('&'));
        unsafe {
            // Safety: cur() was Some('&')
            self.input_mut().bump();
        }

        let start_pos = self.input().cur_pos();

        for _ in 0..10 {
            let c = match self.input().cur() {
                Some(c) => c,
                None => break,
            };
            unsafe {
                // Safety: cur() was Some(c)
                self.input_mut().bump();
            }

            if c == ';' {
                if let Some(stripped) = s.strip_prefix('#') {
                    if stripped.starts_with('x') {
                        if is_hex(&s[2..]) {
                            let value = from_code(&s[2..], 16)?;

                            return Ok((value, format!("&{};", s)));
                        }
                    } else if is_dec(stripped) {
                        let value = from_code(stripped, 10)?;

                        return Ok((value, format!("&{};", s)));
                    }
                } else if let Some(entity) = xhtml(&s) {
                    return Ok((entity, format!("&{};", s)));
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
        unsafe {
            // Safety: cur() was Some(ch)
            self.input_mut().bump();
        }

        let out = if ch == '\r' && self.input().cur() == Some('\n') {
            unsafe {
                // Safety: cur() was Some('\n')
                self.input_mut().bump();
            }
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        let cur_pos = self.input().cur_pos();
        self.state_mut().add_current_line(1);
        self.state_mut().set_line_start(cur_pos);
        Ok(out)
    }

    fn read_jsx_str(&mut self, quote: char) -> LexResult<Self::Token> {
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
                    let start = self.state().start();
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
                unsafe {
                    // Safety: cur() was Some(ch)
                    self.input_mut().bump();
                }
            }
        }

        let value = if out.is_empty() {
            // Fast path: We don't need to allocate

            let cur_pos = self.input().cur_pos();
            let value = unsafe {
                // Safety: We already checked for the range
                self.input_slice(chunk_start, cur_pos)
            };
            self.atom(value)
        } else {
            let cur_pos = self.input().cur_pos();
            let value = unsafe {
                // Safety: We already checked for the range
                self.input_slice(chunk_start, cur_pos)
            };
            out.push_str(value);
            self.atom(out)
        };

        // it might be at the end of the file when
        // the string literal is unterminated
        if self.input().peek_ahead().is_some() {
            unsafe {
                // Safety: We called peek_ahead() which means cur() was Some
                self.input_mut().bump();
            }
        }

        let end = self.input().cur_pos();
        let raw = unsafe {
            // Safety: Both of `start` and `end` are generated from `cur_pos()`
            self.input_slice(start, end)
        };
        let raw = self.atom(raw);
        Ok(Self::Token::str(value, raw, self))
    }

    /// Utility method to reuse buffer.
    fn with_buf<F, Ret>(&mut self, op: F) -> LexResult<Ret>
    where
        F: FnOnce(&mut Self, &mut String) -> LexResult<Ret>,
    {
        let b = self.buf();
        let mut buf = b.borrow_mut();
        buf.clear();
        op(self, &mut buf)
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
        unsafe {
            // Safety: cur() is Some('#')
            self.input_mut().bump();
            // Safety: cur() is Some('!')
            self.input_mut().bump();
        }
        let s = self.input_uncons_while(|c| !c.is_line_terminator());
        Ok(Some(self.atom(s)))
    }

    fn read_tmpl_token(&mut self, start_of_tpl: BytePos) -> LexResult<Self::Token> {
        let start = self.cur_pos();

        let mut cooked = Ok(String::new());
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

        while let Some(c) = self.cur() {
            if c == '`' || (c == '$' && self.peek() == Some('{')) {
                if start == self.cur_pos() && self.state().last_was_tpl_element() {
                    if c == '$' {
                        self.bump();
                        self.bump();
                        return Ok(Self::Token::DOLLAR_LBRACE);
                    } else {
                        self.bump();
                        return Ok(Self::Token::BACKQUOTE);
                    }
                }

                // If we don't have any escape
                let cooked = if cooked_slice_start == raw_slice_start {
                    let last_pos = self.cur_pos();
                    let s = unsafe {
                        // Safety: Both of start and last_pos are valid position because we got them
                        // from `self.input`
                        self.input_slice(cooked_slice_start, last_pos)
                    };

                    Ok(self.atom(s))
                } else {
                    consume_cooked!();

                    cooked.map(|s| self.atom(s))
                };

                // TODO: Handle error
                let end = self.input().cur_pos();
                let raw = unsafe {
                    // Safety: Both of start and last_pos are valid position because we got them
                    // from `self.input`
                    self.input_slice(raw_slice_start, end)
                };
                let raw = self.atom(raw);
                return Ok(Self::Token::template(cooked, raw, self));
            }

            if c == '\\' {
                consume_cooked!();

                match self.read_escaped_char(true) {
                    Ok(Some(chars)) => {
                        if let Ok(ref mut cooked) = cooked {
                            for c in chars {
                                cooked.extend(c);
                            }
                        }
                    }
                    Ok(None) => {}
                    Err(error) => {
                        cooked = Err(error);
                    }
                }

                cooked_slice_start = self.cur_pos();
            } else if c.is_line_terminator() {
                self.state_mut().set_had_line_break(true);

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
                    cooked.push(c);
                }
                cooked_slice_start = self.cur_pos();
            } else {
                self.bump();
            }
        }

        self.error(start_of_tpl, SyntaxError::UnterminatedTpl)?
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

        macro_rules! push_c_and_ret {
            ($c:expr) => {{
                $c
            }};
        }

        let c = match c {
            '\\' => push_c_and_ret!('\\'),
            'n' => push_c_and_ret!('\n'),
            'r' => push_c_and_ret!('\r'),
            't' => push_c_and_ret!('\t'),
            'b' => push_c_and_ret!('\u{0008}'),
            'v' => push_c_and_ret!('\u{000b}'),
            'f' => push_c_and_ret!('\u{000c}'),
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
    fn read_regexp(&mut self, start: BytePos) -> LexResult<Self::Token> {
        unsafe {
            // Safety: start is valid position, and cur() is Some('/')
            self.input_mut().reset_to(start);
        }

        debug_assert_eq!(self.cur(), Some('/'));

        let start = self.cur_pos();

        self.bump();

        let (mut escaped, mut in_class) = (false, false);

        let content = self.with_buf(|l, buf| {
            while let Some(c) = l.cur() {
                // This is ported from babel.
                // Seems like regexp literal cannot contain linebreak.
                if c.is_line_terminator() {
                    let span = l.span(start);

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

                l.bump();
                buf.push(c);
            }

            Ok(l.atom(&**buf))
        })?;

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
                Some(c) if c.is_ident_start() => {
                    self.read_word_as_str_with(|l, s, _, _| l.atom(s)).map(Some)
                }
                _ => Ok(None),
            }
        }?
        .map(|(value, _)| value)
        .unwrap_or_default();

        Ok(Self::Token::regexp(content, flags, self))
    }

    /// This method is optimized for texts without escape sequences.
    ///
    /// `convert(text, has_escape, can_be_keyword)`
    fn read_word_as_str_with<F, Ret>(&mut self, convert: F) -> LexResult<(Ret, bool)>
    where
        F: FnOnce(&mut Self, &str, bool, bool) -> Ret,
    {
        debug_assert!(self.cur().is_some());
        let mut first = true;
        let mut can_be_keyword = true;
        let mut slice_start = self.cur_pos();
        let mut has_escape = false;

        self.with_buf(|l, buf| {
            loop {
                if let Some(c) = l.input().cur_as_ascii() {
                    // Performance optimization
                    if can_be_keyword && (c.is_ascii_uppercase() || c.is_ascii_digit()) {
                        can_be_keyword = false;
                    }

                    if Ident::is_valid_ascii_continue(c) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_ascii_start(c) {
                        l.bump();
                        first = false;
                        continue;
                    }

                    // unicode escape
                    if c == b'\\' {
                        first = false;
                        has_escape = true;
                        let start = l.cur_pos();
                        l.bump();

                        if !l.is(b'u') {
                            l.error_span(pos_span(start), SyntaxError::ExpectedUnicodeEscape)?
                        }

                        {
                            let end = l.input().cur_pos();
                            let s = unsafe {
                                // Safety: start and end are valid position because we got them from
                                // `self.input`
                                l.input_slice(slice_start, start)
                            };
                            buf.push_str(s);
                            unsafe {
                                // Safety: We got end from `self.input`
                                l.input_mut().reset_to(end);
                            }
                        }

                        let chars = l.read_unicode_escape()?;

                        if let Some(c) = chars.first() {
                            let valid = if first {
                                c.is_ident_start()
                            } else {
                                c.is_ident_part()
                            };

                            if !valid {
                                l.emit_error(start, SyntaxError::InvalidIdentChar);
                            }
                        }

                        for c in chars {
                            buf.extend(c);
                        }

                        slice_start = l.cur_pos();
                        continue;
                    }

                    // ASCII but not a valid identifier
                    break;
                } else if let Some(c) = l.input().cur() {
                    if Ident::is_valid_non_ascii_continue(c) {
                        l.bump();
                        continue;
                    } else if first && Ident::is_valid_non_ascii_start(c) {
                        l.bump();
                        first = false;
                        continue;
                    }
                }

                break;
            }

            let end = l.cur_pos();
            let s = unsafe {
                // Safety: slice_start and end are valid position because we got them from
                // `self.input`
                l.input_slice(slice_start, end)
            };
            let value = if !has_escape {
                // Fast path: raw slice is enough if there's no escape.
                convert(l, s, has_escape, can_be_keyword)
            } else {
                buf.push_str(s);
                convert(l, buf, has_escape, can_be_keyword)
            };

            Ok((value, has_escape))
        })
    }

    /// `#`
    fn read_token_number_sign(&mut self) -> LexResult<Option<Self::Token>> {
        debug_assert!(self.cur().is_some());

        unsafe {
            // Safety: cur() is Some('#')
            self.input_mut().bump(); // '#'
        }

        // `#` can also be a part of shebangs, however they should have been
        // handled by `read_shebang()`
        debug_assert!(
            !self.input().is_at_start() || self.cur() != Some('!'),
            "#! should have already been handled by read_shebang()"
        );
        Ok(Some(Self::Token::HASH))
    }

    /// Read a token given `.`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_dot(&mut self) -> LexResult<Self::Token> {
        // Check for eof
        let next = match self.input().peek() {
            Some(next) => next,
            None => {
                unsafe {
                    // Safety: cur() is Some(',')
                    self.input_mut().bump();
                }
                return Ok(Self::Token::DOT);
            }
        };
        if next.is_ascii_digit() {
            return self.read_number(true).map(|v| match v {
                Left((value, raw)) => Self::Token::num(value, raw, self),
                Right((value, raw)) => Self::Token::bigint(value, raw, self),
            });
        }

        unsafe {
            // Safety: cur() is Some
            // 1st `.`
            self.input_mut().bump();
        }

        if next == '.' && self.input().peek() == Some('.') {
            unsafe {
                // Safety: peek() was Some

                self.input_mut().bump(); // 2nd `.`
                self.input_mut().bump(); // 3rd `.`
            }

            return Ok(Self::Token::DOTDOTDOT);
        }

        Ok(Self::Token::DOT)
    }

    /// Read a token given `?`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_question_mark(&mut self) -> LexResult<Self::Token> {
        match self.input().peek() {
            Some('?') => {
                unsafe {
                    // Safety: peek() was some
                    self.input_mut().bump();
                    self.input_mut().bump();
                }
                if self.input().cur() == Some('=') {
                    unsafe {
                        // Safety: cur() was some
                        self.input_mut().bump();
                    }
                    return Ok(Self::Token::NULLISH_ASSIGN);
                }
                Ok(Self::Token::NULLISH_COALESCING)
            }
            _ => {
                unsafe {
                    // Safety: peek() is callable only if cur() is Some
                    self.input_mut().bump();
                }
                Ok(Self::Token::QUESTION)
            }
        }
    }

    /// Read a token given `:`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_colon(&mut self) -> LexResult<Self::Token> {
        unsafe {
            // Safety: cur() is Some(':')
            self.input_mut().bump();
        }
        Ok(Self::Token::COLON)
    }

    /// Read a token given `0`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_zero(&mut self) -> LexResult<Self::Token> {
        let next = self.input().peek();

        let bigint = match next {
            Some('x') | Some('X') => self.read_radix_number::<16>(),
            Some('o') | Some('O') => self.read_radix_number::<8>(),
            Some('b') | Some('B') => self.read_radix_number::<2>(),
            _ => {
                return self.read_number(false).map(|v| match v {
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
        let had_line_break_before_last = self.had_line_break_before_last();
        let start = self.cur_pos();

        unsafe {
            // Safety: cur() is Some(c as char)
            self.input_mut().bump();
        }
        let token = if C == b'&' {
            BinOpToken::BitAnd
        } else {
            BinOpToken::BitOr
        };

        // '|=', '&='
        if self.input_mut().eat_byte(b'=') {
            return Ok(match token {
                BinOpToken::BitAnd => Self::Token::BIT_AND_EQ,
                BinOpToken::BitOr => Self::Token::BIT_OR_EQ,
                _ => unreachable!(),
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

                return Ok(match token {
                    BinOpToken::BitAnd => Self::Token::LOGICAL_AND_EQ,
                    BinOpToken::BitOr => Self::Token::LOGICAL_OR_EQ,
                    _ => unreachable!(),
                });
            }

            // |||||||
            //   ^
            if had_line_break_before_last && token == BinOpToken::BitOr && self.is_str("||||| ") {
                let span = fixed_len_span(start, 7);
                self.emit_error_span(span, SyntaxError::TS1185);
                self.skip_line_comment(5);
                self.skip_space::<true>();
                return self.error_span(span, SyntaxError::TS1185);
            }

            return Ok(match token {
                BinOpToken::BitAnd => Self::Token::LOGICAL_AND,
                BinOpToken::BitOr => Self::Token::LOGICAL_OR,
                _ => unreachable!(),
            });
        }

        Ok(if token == BinOpToken::BitAnd {
            Self::Token::BIT_AND
        } else {
            Self::Token::BIT_OR
        })
    }

    /// Read a token given `*` or `%`.
    ///
    /// This is extracted as a method to reduce size of `read_token`.
    #[inline(never)]
    fn read_token_mul_mod<const C: u8>(&mut self) -> LexResult<Self::Token> {
        let is_mul = C == b'*';
        unsafe {
            // Safety: cur() is Some(c)
            self.input_mut().bump();
        }
        let mut token = if is_mul {
            BinOpToken::Mul
        } else {
            BinOpToken::Mod
        };

        // check for **
        if is_mul && self.input_mut().eat_byte(b'*') {
            token = BinOpToken::Exp
        }

        Ok(if self.input_mut().eat_byte(b'=') {
            match token {
                BinOpToken::Mul => Self::Token::MUL_EQ,
                BinOpToken::Mod => Self::Token::MOD_EQ,
                BinOpToken::Exp => Self::Token::EXP_EQ,
                _ => unreachable!(),
            }
        } else {
            match token {
                BinOpToken::Mul => Self::Token::MUL,
                BinOpToken::Mod => Self::Token::MOD,
                BinOpToken::Exp => Self::Token::EXP,
                _ => unreachable!(),
            }
        })
    }

    #[inline(never)]
    fn read_slash(&mut self) -> LexResult<Option<Self::Token>> {
        debug_assert_eq!(self.cur(), Some('/'));
        // Divide operator
        self.bump();
        Ok(Some(if self.eat(b'=') {
            Self::Token::DIV_EQ
        } else {
            Self::Token::DIV
        }))
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_ident_unknown(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur().is_some());

        let (word, _) = self.read_word_as_str_with(|l, s, _, _| {
            let atom = l.atom(s);
            Self::Token::unknown_ident(atom, l)
        })?;

        Ok(word)
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> LexResult<Self::Token> {
        debug_assert!(self.cur() == Some('\'') || self.cur() == Some('"'));
        let start = self.cur_pos();
        let quote = self.cur().unwrap() as u8;

        self.bump(); // '"'

        let mut has_escape = false;
        let mut slice_start = self.input().cur_pos();

        self.with_buf(|l, buf| {
            loop {
                if let Some(c) = l.input().cur_as_ascii() {
                    if c == quote {
                        let value_end = l.cur_pos();

                        let value = if !has_escape {
                            let s = unsafe {
                                // Safety: slice_start and value_end are valid position because we
                                // got them from `self.input`
                                l.input_slice(slice_start, value_end)
                            };

                            l.atom(s)
                        } else {
                            let s = unsafe {
                                // Safety: slice_start and value_end are valid position because we
                                // got them from `self.input`
                                l.input_slice(slice_start, value_end)
                            };
                            buf.push_str(s);

                            l.atom(&**buf)
                        };

                        unsafe {
                            // Safety: cur is quote
                            l.input_mut().bump();
                        }

                        let end = l.cur_pos();
                        let raw = unsafe {
                            // Safety: start and end are valid position because we got them from
                            // `self.input`
                            l.input_slice(start, end)
                        };
                        let raw = l.atom(raw);
                        return Ok(Self::Token::str(value, raw, l));
                    }

                    if c == b'\\' {
                        has_escape = true;

                        {
                            let end = l.cur_pos();
                            let s = unsafe {
                                // Safety: start and end are valid position because we got them from
                                // `self.input`
                                l.input_slice(slice_start, end)
                            };
                            buf.push_str(s);
                        }

                        if let Some(chars) = l.read_escaped_char(false)? {
                            for c in chars {
                                buf.extend(c);
                            }
                        }

                        slice_start = l.cur_pos();
                        continue;
                    }

                    if (c as char).is_line_break() {
                        break;
                    }

                    unsafe {
                        // Safety: cur is a ascii character
                        l.input_mut().bump();
                    }
                    continue;
                }

                match l.input().cur() {
                    Some(c) => {
                        if c.is_line_break() {
                            break;
                        }
                        unsafe {
                            // Safety: cur is Some(c)
                            l.input_mut().bump();
                        }
                    }
                    None => break,
                }
            }

            {
                let end = l.cur_pos();
                let s = unsafe {
                    // Safety: start and end are valid position because we got them from
                    // `self.input`
                    l.input_slice(slice_start, end)
                };
                buf.push_str(s);
            }

            l.emit_error(start, SyntaxError::UnterminatedStrLit);

            let end = l.cur_pos();

            let raw = unsafe {
                // Safety: start and end are valid position because we got them from
                // `self.input`
                l.input_slice(start, end)
            };
            Ok(Self::Token::str(l.atom(&**buf), l.atom(raw), l))
        })
    }

    /// This can be used if there's no keyword starting with the first
    /// character.
    fn read_word_with(
        &mut self,
        convert: &dyn Fn(&str) -> Option<Self::Token>,
    ) -> LexResult<Option<Self::Token>> {
        debug_assert!(self.cur().is_some());

        let start = self.cur_pos();
        let (word, has_escape) = self.read_word_as_str_with(|l, s, _, can_be_known| {
            if can_be_known {
                if let Some(word) = convert(s) {
                    return word;
                }
            }
            let atom = l.atom(s);
            Self::Token::unknown_ident(atom, l)
        })?;

        // Note: ctx is store in lexer because of this error.
        // 'await' and 'yield' may have semantic of reserved word, which means lexer
        // should know context or parser should handle this error. Our approach to this
        // problem is former one.

        if has_escape && word.is_reserved(self.ctx()) {
            let word = word.into_atom(self).unwrap();
            self.error(start, SyntaxError::EscapeInReservedWord { word })?
        } else {
            Ok(Some(word))
        }
    }
}

pub fn pos_span(p: BytePos) -> Span {
    Span::new(p, p)
}

pub fn fixed_len_span(p: BytePos, len: u32) -> Span {
    Span::new(p, p + BytePos(len))
}
