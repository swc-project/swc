#[derive(Clone, Copy, Debug, Default)]
pub struct Options {
    /// Used to adjust `Span` positions to fit the global source code.
    pub pattern_span_offset: u32,
    /// Used to adjust `Span` positions to fit the global source code.
    pub flags_span_offset: u32,
}
