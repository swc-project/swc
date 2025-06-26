use swc_common::{BytePos, Span};

pub struct SpanFactory {
    span_offset: u32,
}

impl SpanFactory {
    pub fn new(span_offset: u32) -> Self {
        Self { span_offset }
    }

    /// Add base offset to `Span`.
    /// Span { start: 4, end: 12 } => Span { start: 4 + N, end: 12 + N }
    pub fn create(&self, start: u32, end: u32) -> Span {
        Self::span_from_u32(start + self.span_offset, end + self.span_offset)
    }

    pub fn span_from_u32(start: u32, end: u32) -> Span {
        Span::new(BytePos(start), BytePos(end))
    }
}
