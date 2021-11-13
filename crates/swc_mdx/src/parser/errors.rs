use swc_common::{Span, Spanned};
use swc_ecma_parser::error::SyntaxError;

#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    inner: Box<(Span, ErrorKind)>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ErrorKind {
    JsxParsingError(SyntaxError),
}

impl From<swc_ecma_parser::error::Error> for Error {
    fn from(err: swc_ecma_parser::error::Error) -> Self {
        Self {
            inner: Box::new((err.span(), ErrorKind::JsxParsingError(err.into_kind()))),
        }
    }
}
