//! JSX runtime mode definitions.

/// JSX runtime transformation mode.
///
/// Determines which JSX transformation strategy to use:
/// - Classic: Uses React.createElement (or custom pragma)
/// - Automatic: Uses the new JSX transform with _jsx/_jsxs
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Runtime {
    /// Classic runtime using React.createElement()
    Classic,

    /// Automatic runtime using _jsx() and _jsxs()
    Automatic,
}

impl Default for Runtime {
    fn default() -> Self {
        Runtime::Automatic
    }
}
