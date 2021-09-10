use anyhow::{Context, Error};
use napi::{CallContext, JsBuffer, Status};
use serde::de::DeserializeOwned;
use std::any::type_name;

pub trait MapErr<T>: Into<Result<T, anyhow::Error>> {
    fn convert_err(self) -> napi::Result<T> {
        self.into()
            .map_err(|err| napi::Error::new(Status::GenericFailure, format!("{:?}", err)))
    }
}

impl<T> MapErr<T> for Result<T, anyhow::Error> {}

pub trait CtxtExt {
    /// Currently this uses JsBuffer
    fn get_deserialized<T>(&self, index: usize) -> napi::Result<T>
    where
        T: DeserializeOwned;
}

impl CtxtExt for CallContext<'_> {
    fn get_deserialized<T>(&self, index: usize) -> napi::Result<T>
    where
        T: DeserializeOwned,
    {
        let buffer = self.get::<JsBuffer>(index)?.into_value()?;
        let mut deserializer = serde_json::Deserializer::from_slice(&buffer);
        deserializer.disable_recursion_limit();

        let v = T::deserialize(&mut deserializer)
            .with_context(|| {
                format!(
                    "Failed to deserialize argument at `{}` as {}\nJSON: {}",
                    index,
                    type_name::<T>(),
                    String::from_utf8_lossy(&buffer)
                )
            })
            .convert_err()?;

        Ok(v)
    }
}

pub(crate) fn deserialize_json<T>(json: &str) -> Result<T, Error>
where
    T: DeserializeOwned,
{
    let mut deserializer = serde_json::Deserializer::from_str(&json);
    deserializer.disable_recursion_limit();

    let val = T::deserialize(&mut deserializer);

    val.with_context(|| {
        format!(
            "Failed to deserialize {} from json string (`{}`)",
            type_name::<T>(),
            json
        )
    })
}
