use std::fmt::Debug;

use napi::{bindgen_prelude::FromNapiValue, Env, JsUnknown};
use serde::{de::DeserializeOwned, Serialize};

use crate::js_hook::{JsInput, JsOutput};

/// Note: This type stringifies the output json string, because it's faster.
#[derive(Debug, Default)]
pub struct AsJson<T>(pub T)
where
    T: 'static + Send + Debug;

impl<T> FromNapiValue for AsJson<T>
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

impl<T> JsOutput for AsJson<T> where T: 'static + Send + Debug + DeserializeOwned {}

impl<T> JsInput for AsJson<T>
where
    T: 'static + Send + Debug + Serialize,
{
    fn into_js(self, env: &napi::Env) -> napi::Result<napi::JsUnknown> {
        let json = serde_json::to_string(&self.0)?;
        Ok(env.create_string(json.as_str())?.into_unknown())
    }
}
