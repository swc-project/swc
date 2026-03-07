/// Output format strategy.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum OutputFormat {
    /// Canonical output with stable token formatting.
    Canonical,
}

/// Configuration for emission.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct CodegenConfig {
    /// Output format mode.
    pub format: OutputFormat,
}

impl Default for CodegenConfig {
    #[inline]
    fn default() -> Self {
        Self {
            format: OutputFormat::Canonical,
        }
    }
}
