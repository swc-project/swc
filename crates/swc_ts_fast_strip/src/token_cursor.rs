//! Bounded token lookups using the parser's original source positions.

use swc_common::{BytePos, Span};
use swc_ecma_parser::unstable::{Token, TokenAndSpan};

#[derive(Clone, Copy)]
pub(crate) struct TokenCursor<'a> {
    source: &'a str,
    source_start: BytePos,
    tokens: &'a [TokenAndSpan],
}

#[cfg(test)]
mod tests;

impl<'a> TokenCursor<'a> {
    pub(crate) fn new(source: &'a str, source_start: BytePos, tokens: &'a [TokenAndSpan]) -> Self {
        Self {
            source,
            source_start,
            tokens,
        }
    }

    pub(crate) fn first_in_range(self, start: BytePos, end: BytePos) -> Option<&'a TokenAndSpan> {
        self.tokens[self.index_containing_or_after(start)..]
            .iter()
            .take_while(|t| t.span.lo < end)
            .find(|t| t.span.lo >= start && t.span.hi <= end)
    }

    pub(crate) fn last_in_range(self, start: BytePos, end: BytePos) -> Option<&'a TokenAndSpan> {
        let end_index = self.tokens.partition_point(|t| t.span.lo < end);
        self.tokens[..end_index]
            .iter()
            .rev()
            .take_while(|t| t.span.hi > start)
            .find(|t| t.span.lo >= start && t.span.hi <= end)
    }

    pub(crate) fn previous_before(self, position: BytePos) -> Option<&'a TokenAndSpan> {
        self.index_containing_or_after(position)
            .checked_sub(1)
            .map(|i| &self.tokens[i])
    }

    pub(crate) fn at_or_after(self, position: BytePos) -> Option<&'a TokenAndSpan> {
        self.tokens.get(self.index_containing_or_after(position))
    }

    pub(crate) fn find_forward(
        self,
        start: BytePos,
        end: BytePos,
        tag: Token,
    ) -> Option<&'a TokenAndSpan> {
        self.tokens[self.index_containing_or_after(start)..]
            .iter()
            .take_while(|t| t.span.lo < end)
            .find(|t| t.span.lo >= start && t.span.hi <= end && t.token == tag)
    }

    pub(crate) fn find_backward(
        self,
        start: BytePos,
        end: BytePos,
        tag: Token,
    ) -> Option<&'a TokenAndSpan> {
        let end_index = self.tokens.partition_point(|t| t.span.lo < end);
        self.tokens[..end_index]
            .iter()
            .rev()
            .take_while(|t| t.span.hi > start)
            .find(|t| t.span.lo >= start && t.span.hi <= end && t.token == tag)
    }

    pub(crate) fn has_line_terminator(self, start: BytePos, end: BytePos) -> bool {
        self.source[(start - self.source_start).0 as usize..(end - self.source_start).0 as usize]
            .contains(['\n', '\r', '\u{2028}', '\u{2029}'])
    }

    pub(crate) fn leading_character_span(self, start: BytePos) -> Option<Span> {
        let character = self
            .source
            .get((start - self.source_start).0 as usize..)?
            .chars()
            .next()?;
        Some(Span::new(
            start,
            start + BytePos(character.len_utf8() as u32),
        ))
    }

    pub(crate) fn trailing_character_span(self, end: BytePos) -> Option<Span> {
        let character = self
            .source
            .get(..(end - self.source_start).0 as usize)?
            .chars()
            .next_back()?;
        Some(Span::new(end - BytePos(character.len_utf8() as u32), end))
    }

    fn index_containing_or_after(self, position: BytePos) -> usize {
        self.tokens.partition_point(|t| t.span.hi <= position)
    }
}
