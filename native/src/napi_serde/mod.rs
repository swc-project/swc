//! Serde for napi.
//!
//! THis will be extracted as a standalone crate in future.

pub use self::{de::deserialize, ser::serialize};
use napi::{Env, JsObject, Status};
use serde::{de::DeserializeOwned, Serialize};
use std::{fmt, fmt::Display};

mod de;
mod ser;

#[derive(Debug)]
pub(crate) enum Error {
    Normal(anyhow::Error),
    Napi(napi::Error),
}

impl Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Error::Normal(v) => Display::fmt(v, f),
            Error::Napi(v) => Display::fmt(&v.reason, f),
        }
    }
}

impl serde::ser::Error for Error {
    fn custom<T: Display>(msg: T) -> Self {
        anyhow::Error::msg(msg.to_string()).into()
    }
}

impl serde::de::Error for Error {
    fn custom<T: Display>(msg: T) -> Self {
        anyhow::Error::msg(msg.to_string()).into()
    }
}

impl std::error::Error for Error {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            Error::Normal(v) => v.source(),
            Error::Napi(_) => None,
        }
    }
}

impl From<anyhow::Error> for Error {
    fn from(e: anyhow::Error) -> Self {
        Self::Normal(e)
    }
}

impl From<napi::Error> for Error {
    fn from(e: napi::Error) -> Self {
        Self::Napi(e)
    }
}
