/// ParseSyntaxError is a custom error type that represents a syntax error in
/// swc parse
///
/// We will return this error if swc parser occur syntax error, but we will
/// ignore this error in rust side, because we will return this error in js
/// side.
#[derive(Debug)]
pub struct ParseSyntaxError;

impl std::fmt::Display for ParseSyntaxError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Syntax Error")
    }
}

impl std::error::Error for ParseSyntaxError {}
