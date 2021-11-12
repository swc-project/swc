use swc_common::Span;

#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    inner: Box<(Span, ErrorKind)>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum ErrorKind {}
