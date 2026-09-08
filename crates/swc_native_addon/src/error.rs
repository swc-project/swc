use std::{fmt, io};

/// Stable categories used by the carrier's JavaScript errors.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ErrorKind {
    Format,
    Integrity,
    Compression,
    Cache,
    Configuration,
    Load,
}

impl ErrorKind {
    pub fn code(self) -> &'static str {
        match self {
            Self::Format => "ERR_SWC_NATIVE_FORMAT",
            Self::Integrity => "ERR_SWC_NATIVE_INTEGRITY",
            Self::Compression => "ERR_SWC_NATIVE_COMPRESSION",
            Self::Cache => "ERR_SWC_NATIVE_CACHE",
            Self::Configuration => "ERR_SWC_NATIVE_CONFIGURATION",
            Self::Load => "ERR_SWC_NATIVE_LOAD",
        }
    }
}

#[derive(Debug)]
pub struct Error {
    pub kind: ErrorKind,
    message: String,
}

impl Error {
    pub fn new(kind: ErrorKind, message: impl Into<String>) -> Self {
        Self {
            kind,
            message: message.into(),
        }
    }

    pub fn io(kind: ErrorKind, operation: &str, error: io::Error) -> Self {
        Self::new(kind, format!("{operation}: {error}"))
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.message.fmt(f)
    }
}

impl std::error::Error for Error {}

pub type Result<T> = std::result::Result<T, Error>;
