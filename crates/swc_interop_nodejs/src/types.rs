use std::fmt::Debug;

use napi::{bindgen_prelude::FromNapiValue, Env, JsUnknown};
use serde::{de::DeserializeOwned, Serialize};

pub trait JsInput: 'static + Send + Debug {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown>;
}

impl JsInput for String {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        Ok(env.create_string(&self)?.into_unknown())
    }
}

impl JsInput for Vec<String> {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        let mut arr = env.create_array_with_length(self.len())?;

        for (idx, s) in self.into_iter().enumerate() {
            arr.set_element(idx as _, s.into_js(env)?)?;
        }

        Ok(arr.into_unknown())
    }
}

impl JsInput for Vec<u8> {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        Ok(env.create_buffer_with_data(self)?.into_unknown())
    }
}

impl<A, B> JsInput for (A, B)
where
    A: JsInput,
    B: JsInput,
{
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        let mut arr = env.create_array(2)?;
        arr.set(0, self.0.into_js(env)?)?;
        arr.set(1, self.1.into_js(env)?)?;

        Ok(arr.coerce_to_object()?.into_unknown())
    }
}

/// Seems like Vec<u8> is buggy
pub trait JsOutput: 'static + FromNapiValue + Send + Debug {}

impl JsOutput for String {}

impl JsOutput for bool {}

/// Note: This type stringifies the output json string, because it's faster.
#[derive(Debug, Default)]
pub struct AsJsonString<T>(pub T)
where
    T: 'static + Send + Debug;

impl<T> FromNapiValue for AsJsonString<T>
where
    T: 'static + Send + Debug + DeserializeOwned,
{
    unsafe fn from_napi_value(
        env_raw: napi::sys::napi_env,
        napi_val: napi::sys::napi_value,
    ) -> napi::Result<Self> {
        let env = Env::from_raw(env_raw);
        let json: String = env.from_js_value(JsUnknown::from_napi_value(env_raw, napi_val)?)?;
        let t = serde_json::from_str(&json)?;
        Ok(Self(t))
    }
}

impl<T> JsOutput for AsJsonString<T> where T: 'static + Send + Debug + DeserializeOwned {}

impl<T> JsInput for AsJsonString<T>
where
    T: 'static + Send + Debug + Serialize,
{
    fn into_js(self, env: &napi::Env) -> napi::Result<napi::JsUnknown> {
        let json = serde_json::to_string(&self.0)?;
        Ok(env.create_string(json.as_str())?.into_unknown())
    }
}
