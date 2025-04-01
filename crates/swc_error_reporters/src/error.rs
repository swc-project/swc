/// This module defines the error types used in the SWC error reporters.
/// if swc parser occur syntax error, we will return this error.
/// We will ignore this error in rust side, then we will return this error in js
/// side.
#[derive(Debug)]
pub struct ParseSyntaxError;

impl std::fmt::Display for ParseSyntaxError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Syntax Error")
    }
}

impl std::error::Error for ParseSyntaxError {}
