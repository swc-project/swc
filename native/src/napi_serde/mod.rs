//! Serde for napi.
//!
//! THis will be extracted as a standalone crate in future.

use crate::util::MapErr;
use anyhow::Context;
use napi::{Env, JsObject};
use ser::Ser;
use serde::{de::DeserializeOwned, Serialize};
use std::{fmt, fmt::Display};

mod de;
mod ser;

pub fn serialize<T>(env: &Env, node: &T) -> napi::Result<napi::JsUnknown>
where
    T: Serialize,
{
    let s = Ser { env };
    let v = node
        .serialize(s)
        .map_err(|err| err.0)
        .context("serialization failed")
        .convert_err()?;
}

pub fn deserialize<T>(env: &Env, v: &JsObject) -> napi::Result<T>
where
    T: DeserializeOwned,
{
}

#[derive(Debug)]
pub(crate) struct Error(anyhow::Error);

impl Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        Display::fmt(&self.0, f)
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
        self.0.source()
    }
}

impl From<anyhow::Error> for Error {
    fn from(e: anyhow::Error) -> Self {
        Self(e)
    }
}
