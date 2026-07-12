//! Packed lexer token.
//!
//! This layout is derived from OXC's `oxc_parser::lexer::Token` at commit
//! `b6d2a29e47358a288dbfb2a635550243511ec497`. SWC stores absolute byte
//! positions, and uses bitwise setters compatible with the workspace MSRV.

use std::{fmt, mem};

use swc_common::{BytePos, Span};

use crate::next::lexer::TokenKind as Kind;

const START_SHIFT: u32 = 0;
const END_SHIFT: u32 = 32;
const KIND_SHIFT: u32 = 64;
const LINE_BREAK_SHIFT: u32 = 72;
const ESCAPED_SHIFT: u32 = 73;

const U32_MASK: u128 = u32::MAX as u128;
const U8_MASK: u128 = u8::MAX as u128;

/// Token kind, absolute byte span, and lexer flags in one value.
#[derive(Clone, Copy, PartialEq, Eq)]
#[repr(transparent)]
pub struct PackedToken(u128);

impl PackedToken {
    /// Create a packed token.
    #[inline(always)]
    pub(crate) fn new(kind: Kind, span: Span, had_line_break: bool, escaped: bool) -> Self {
        debug_assert!(span.lo <= span.hi);
        let value = u128::from(span.lo.0)
            | (u128::from(span.hi.0) << END_SHIFT)
            | (u128::from(kind as u8) << KIND_SHIFT)
            | (u128::from(had_line_break) << LINE_BREAK_SHIFT)
            | (u128::from(escaped) << ESCAPED_SHIFT);
        Self(value)
    }

    /// Token category.
    #[inline(always)]
    pub fn kind(self) -> Kind {
        let kind = ((self.0 >> KIND_SHIFT) & U8_MASK) as u8;
        // SAFETY: `Kind` is `repr(u8)`, and `new` stores only an existing
        // `Kind` discriminant in these bits. No raw constructor is exposed.
        unsafe { mem::transmute::<u8, Kind>(kind) }
    }

    /// Absolute source span.
    #[inline(always)]
    pub fn span(self) -> Span {
        Span::new_with_checked(self.start(), self.end())
    }

    /// Absolute start position.
    #[inline(always)]
    pub fn start(self) -> BytePos {
        BytePos(((self.0 >> START_SHIFT) & U32_MASK) as u32)
    }

    /// Absolute end position.
    #[inline(always)]
    pub fn end(self) -> BytePos {
        BytePos(((self.0 >> END_SHIFT) & U32_MASK) as u32)
    }

    /// Whether a line terminator precedes this token.
    #[inline(always)]
    pub fn had_line_break(self) -> bool {
        ((self.0 >> LINE_BREAK_SHIFT) & 1) != 0
    }

    /// Whether the token contains an escape sequence.
    #[inline(always)]
    pub fn escaped(self) -> bool {
        ((self.0 >> ESCAPED_SHIFT) & 1) != 0
    }
}

impl fmt::Debug for PackedToken {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("PackedToken")
            .field("kind", &self.kind())
            .field("span", &self.span())
            .field("had_line_break", &self.had_line_break())
            .field("escaped", &self.escaped())
            .finish()
    }
}

const _: () = assert!(mem::size_of::<Kind>() == 1);
const _: () = assert!(mem::size_of::<PackedToken>() == 16);

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, Span};

    use super::PackedToken;
    use crate::next::lexer::TokenKind as Kind;

    #[test]
    fn round_trips_fields() {
        let span = Span::new_with_checked(BytePos(41), BytePos(57));
        let token = PackedToken::new(Kind::Ident, span, true, true);

        assert_eq!(token.kind(), Kind::Ident);
        assert_eq!(token.span(), span);
        assert_eq!(token.start(), BytePos(41));
        assert_eq!(token.end(), BytePos(57));
        assert!(token.had_line_break());
        assert!(token.escaped());
    }

    #[test]
    fn flags_do_not_overlap_span_or_kind() {
        let span = Span::new_with_checked(BytePos(1), BytePos(u32::MAX));
        let token = PackedToken::new(Kind::Eof, span, false, false);

        assert_eq!(token.kind(), Kind::Eof);
        assert_eq!(token.span(), span);
        assert!(!token.had_line_break());
        assert!(!token.escaped());
    }
}
