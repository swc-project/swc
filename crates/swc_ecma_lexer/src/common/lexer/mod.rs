use std::borrow::Cow;

use char::CharExt;
use either::Either;
use num_bigint::BigInt as BigIntValue;
use num_traits::{Num as NumTrait, ToPrimitive};
use number::LazyBigInt;
use state::State;
use swc_atoms::Atom;
use swc_common::{
    input::{Input, StringInput},
    BytePos, Span,
};
use swc_ecma_ast::EsVersion;

use super::{context::Context, input::Tokens};
use crate::error::SyntaxError;

pub mod char;
pub mod comments_buffer;
pub mod number;
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

    fn skip_block_comment(&mut self);

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
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p)
}
