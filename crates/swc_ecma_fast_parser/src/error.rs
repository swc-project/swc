//! Error types for the ECMAScript/TypeScript parser

use std::fmt;

use swc_common::Span;

/// Result type for parser operations
pub type Result<T> = std::result::Result<T, Error>;

/// Parser error
#[derive(Debug)]
pub struct Error {
    /// Type of error
    pub kind: ErrorKind,

    /// Source span where the error occurred
    pub span: Span,
}

/// Types of parser errors
#[derive(Debug)]
pub enum ErrorKind {
    /// Unexpected token encountered
    UnexpectedToken {
        expected: Option<&'static str>,
        got: String,
    },

    /// Unexpected end of file
    UnexpectedEof { expected: Option<&'static str> },

    /// Invalid numeric literal
    InvalidNumber { reason: &'static str },

    /// Invalid string literal (unterminated, invalid escape sequence, etc.)
    InvalidString { reason: &'static str },

    /// Invalid regular expression
    InvalidRegExp { reason: &'static str },

    /// Invalid template literal
    InvalidTemplate { reason: &'static str },

    /// Invalid identifier
    InvalidIdentifier { reason: &'static str },

    /// Invalid assignment target
    InvalidAssignmentTarget,

    /// Invalid destructuring pattern
    InvalidDestructuringPattern,

    /// Invalid use of await (outside async function)
    InvalidAwait,

    /// Invalid use of yield (outside generator function)
    InvalidYield,

    /// Invalid use of super
    InvalidSuper,

    /// Invalid use of new.target
    InvalidNewTarget,

    /// Invalid use of import.meta
    InvalidImportMeta,

    /// Unexpected keyword in this position
    UnexpectedKeyword { keyword: &'static str },

    /// Unexpected reserved word
    UnexpectedReservedWord { word: String },

    /// Duplicate binding
    DuplicateBinding { name: String },

    /// General parser error
    General { message: String },

    /// Unterminated string literal
    UnterminatedString,

    /// Invalid hex escape sequence in string
    InvalidHexEscape,

    /// Invalid unicode escape sequence in string
    InvalidUnicodeEscape,

    /// Invalid BigInt literal
    InvalidBigInt,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.kind {
            ErrorKind::UnexpectedToken { expected, got } => {
                if let Some(expected) = expected {
                    write!(f, "Expected {}, got {}", expected, got)
                } else {
                    write!(f, "Unexpected token {}", got)
                }
            }
            ErrorKind::UnexpectedEof { expected } => {
                if let Some(expected) = expected {
                    write!(f, "Unexpected end of file, expected {}", expected)
                } else {
                    write!(f, "Unexpected end of file")
                }
            }
            ErrorKind::InvalidNumber { reason } => {
                write!(f, "Invalid numeric literal: {}", reason)
            }
            ErrorKind::InvalidString { reason } => {
                write!(f, "Invalid string literal: {}", reason)
            }
            ErrorKind::InvalidRegExp { reason } => {
                write!(f, "Invalid regular expression: {}", reason)
            }
            ErrorKind::InvalidTemplate { reason } => {
                write!(f, "Invalid template literal: {}", reason)
            }
            ErrorKind::InvalidIdentifier { reason } => {
                write!(f, "Invalid identifier: {}", reason)
            }
            ErrorKind::InvalidAssignmentTarget => {
                write!(f, "Invalid assignment target")
            }
            ErrorKind::InvalidDestructuringPattern => {
                write!(f, "Invalid destructuring pattern")
            }
            ErrorKind::InvalidAwait => {
                write!(f, "await is only valid in async functions")
            }
            ErrorKind::InvalidYield => {
                write!(f, "yield is only valid in generator functions")
            }
            ErrorKind::InvalidSuper => {
                write!(f, "Invalid use of super")
            }
            ErrorKind::InvalidNewTarget => {
                write!(f, "new.target can only be used in functions")
            }
            ErrorKind::InvalidImportMeta => {
                write!(f, "import.meta can only be used in modules")
            }
            ErrorKind::UnexpectedKeyword { keyword } => {
                write!(f, "Unexpected keyword '{}'", keyword)
            }
            ErrorKind::UnexpectedReservedWord { word } => {
                write!(f, "Unexpected reserved word '{}'", word)
            }
            ErrorKind::DuplicateBinding { name } => {
                write!(f, "Duplicate binding '{}'", name)
            }
            ErrorKind::General { message } => {
                write!(f, "{}", message)
            }
            ErrorKind::UnterminatedString => {
                write!(f, "Unterminated string literal")
            }
            ErrorKind::InvalidHexEscape => {
                write!(f, "Invalid hexadecimal escape sequence")
            }
            ErrorKind::InvalidUnicodeEscape => {
                write!(f, "Invalid unicode escape sequence")
            }
            ErrorKind::InvalidBigInt => {
                write!(f, "Invalid BigInt literal")
            }
        }
    }
}

impl std::error::Error for Error {}
