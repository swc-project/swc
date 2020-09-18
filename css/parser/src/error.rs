use swc_common::{Span, Spanned};

#[derive(Debug, Clone)]
pub struct Error {
    pub(crate) inner: Box<(Span, SyntaxError)>,
}

impl Spanned for Error {
    #[cold]
    fn span(&self) -> Span {
        self.inner.0
    }
}

impl Error {
    #[cold]
    pub fn into_kind(self) -> SyntaxError {
        self.inner.1
    }
}

#[derive(Debug, Clone)]
#[non_exhaustive]
pub enum SyntaxError {
    Eof,
    ExpectedWord { got: String },
    ExpectedStr { got: String },
    Expected { expected: String, got: String },
    ExpectedOneOf { expected: String, got: String },
}
