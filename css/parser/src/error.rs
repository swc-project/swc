use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span,
};

/// Size is same as a size of a pointer.
#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    inner: Box<(Span, ErrorKind)>,
}

impl Error {
    pub fn kind(&self) -> &ErrorKind {
        &self.inner.1
    }

    pub fn into_inner(self) -> Box<(Span, ErrorKind)> {
        self.inner
    }

    pub fn new(span: Span, kind: ErrorKind) -> Self {
        Error {
            inner: Box::new((span, kind)),
        }
    }

    pub fn to_diagnostics<'a>(&self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        let msg = format!("{:?}", self.inner.1);
        handler.struct_span_err(self.inner.0, &msg)
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum ErrorKind {
    Eof,
    Expected(&'static str),
    ExpectedButGot(&'static str, String),
    ExpectedSelectorText,
    UnterminatedBlockComment,
    InvalidTypeSelector,
    InvalidSelector,
    ExpectedIdentOrStrForAttrSelectorOp,
}
