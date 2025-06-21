use std::iter::FusedIterator;

use arrayvec::ArrayVec;

/// Fast hex formatting for u16 without allocations
const HEX_CHARS: &[u8; 16] = b"0123456789abcdef";

#[inline]
fn hex_format_u16(mut value: u16, buf: &mut [u8; 4]) -> &[u8] {
    let mut i = 3;
    loop {
        buf[i] = HEX_CHARS[(value & 0xf) as usize];
        value >>= 4;
        if value == 0 || i == 0 {
            break &buf[i..];
        }
        i -= 1;
    }
}

#[inline]
fn hex_format_u32(mut value: u32, buf: &mut [u8; 8]) -> &[u8] {
    let mut i = 7;
    loop {
        buf[i] = HEX_CHARS[(value & 0xf) as usize];
        value >>= 4;
        if value == 0 || i == 0 {
            break &buf[i..];
        }
        i -= 1;
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub struct Char(u32);

impl From<char> for Char {
    fn from(c: char) -> Self {
        Char(c as u32)
    }
}

impl From<u32> for Char {
    fn from(c: u32) -> Self {
        Char(c)
    }
}

pub struct CharIter(ArrayVec<char, 12>);

/// Ported from https://github.com/web-infra-dev/oxc/blob/99a4816ce7b6132b2667257984f9d92ae3768f03/crates/oxc_parser/src/lexer/mod.rs#L1349-L1374
impl IntoIterator for Char {
    type IntoIter = CharIter;
    type Item = char;

    #[allow(unsafe_code)]
    fn into_iter(self) -> Self::IntoIter {
        //        // TODO: Check if this is correct
        //        fn to_char(v: u8) -> char {
        //            char::from_digit(v as _, 16).unwrap_or('0')
        //        }

        CharIter(match char::from_u32(self.0) {
            Some(c) => {
                let mut buf = ArrayVec::new();
                // Safety: we can make sure that `buf` has enough capacity
                unsafe {
                    buf.push_unchecked(c);
                }
                buf
            }
            None => {
                let mut buf = ArrayVec::new();

                let high = self.0 & 0xffff0000 >> 16;

                let low = self.0 & 0x0000ffff;

                // The second code unit of a surrogate pair is always in the range from 0xDC00
                // to 0xDFFF, and is called a low surrogate or a trail surrogate.
                if !(0xdc00..=0xdfff).contains(&low) {
                    // Safety: we can make sure that `buf` has enough capacity
                    unsafe {
                        buf.push_unchecked('\\');
                        buf.push_unchecked('u');
                        // Optimized hex formatting without allocations
                        let mut temp = [0u8; 4];
                        let high_hex = hex_format_u16(high as u16, &mut temp);
                        for &byte in high_hex {
                            buf.push_unchecked(byte as char);
                        }
                        buf.push_unchecked('\\');
                        buf.push_unchecked('u');
                        let low_hex = hex_format_u16(low as u16, &mut temp);
                        for &byte in low_hex {
                            buf.push_unchecked(byte as char);
                        }
                    }
                } else {
                    // `https://tc39.es/ecma262/#sec-utf16decodesurrogatepair`
                    let astral_code_point = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;

                    // Safety: we can make sure that `buf` has enough capacity
                    unsafe {
                        buf.push_unchecked('\\');
                        buf.push_unchecked('u');
                        // Optimized hex formatting without allocations
                        let mut temp = [0u8; 8];
                        let astral_hex = hex_format_u32(astral_code_point, &mut temp);
                        for &byte in astral_hex {
                            buf.push_unchecked(byte as char);
                        }
                    }
                }

                buf
            }
        })
    }
}

impl Iterator for CharIter {
    type Item = char;

    fn next(&mut self) -> Option<Self::Item> {
        if self.0.is_empty() {
            None
        } else {
            Some(self.0.remove(0))
        }
    }
}

impl FusedIterator for CharIter {}

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
        swc_ecma_ast::Ident::is_valid_start(c)
    }

    /// Test whether a given character is part of an identifier.
    #[inline]
    fn is_ident_part(self) -> bool {
        let c = match self.to_char() {
            Some(c) => c,
            None => return false,
        };
        swc_ecma_ast::Ident::is_valid_continue(c)
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
