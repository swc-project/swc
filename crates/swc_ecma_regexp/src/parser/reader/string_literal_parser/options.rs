#[derive(Clone, Copy, Debug, Default)]
pub struct Options {
    /// Used to adjust `Span` positions to fit the global source code.
    pub span_offset: u32,
    /// In JavaScript, internal representation of strings is UTF-16.
    /// But for our usage in Rust, it is more convenient to work with UTF-32(char) unit if desired.
    pub combine_surrogate_pair: bool,
    /// If `true`, parser will emit error when legacy octal escape sequences are found.
    pub strict_mode: bool,
}
