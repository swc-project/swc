use napi::{Env, JsObject};
use serde::{de::DeserializeOwned, Serialize, Serializer};

struct Ser<'env> {
    env: &'env Env,
}

impl Serializer for Ser<'_> {}

pub fn serialize<T>(env: &Env, node: &T) -> napi::Result<napi::JsObject>
where
    T: Serialize,
{
    let s = Ser { env };
    node.serialize(s)
}

pub fn deserialize<T>(env: &Env, v: &JsObject) -> napi::Result<T>
where
    T: DeserializeOwned,
{
}
