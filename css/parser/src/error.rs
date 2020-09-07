use swc_common::{Span, Spanned};

#[derive(Debug, Clone)]
pub struct Error {
    pub(crate) inner: Box<(Span, ErrorKind)>,
}

impl Spanned for Error {
    #[cold]
    fn span(&self) -> Span {
        self.inner.0
    }
}

impl Error {
    #[cold]
    pub fn into_kind(self) -> ErrorKind {
        self.inner.1
    }
}

#[derive(Debug, Clone)]
#[non_exhaustive]
pub enum ErrorKind {}
