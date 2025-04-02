/// OnlyDiagnosticsError represents a syntax error detected during the SWC
/// parsing phase.
///
/// Although a syntax error is reported by the SWC parser, this error is handled
/// on the JavaScript side. The Rust side will ignore it during processing.
#[derive(Debug)]
pub struct OnlyDiagnosticsError;

impl std::fmt::Display for OnlyDiagnosticsError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Syntax Error")
    }
}

impl std::error::Error for OnlyDiagnosticsError {}
