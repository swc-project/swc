#[derive(Debug, Clone, PartialEq)]
pub enum Error {
    ParsingFailed(crate::parser::Error),
}

impl From<crate::parser::Error> for Error {
    fn from(err: crate::parser::Error) -> Self {
        Error::ParsingFailed(err)
    }
}
