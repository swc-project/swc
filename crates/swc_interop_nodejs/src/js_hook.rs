use std::{fmt::Debug, marker::PhantomData};

use napi::{
    bindgen_prelude::{FromNapiValue, Promise},
    threadsafe_function::{ThreadSafeCallContext, ThreadsafeFunction},
    Env, JsFunction, JsUnknown,
};
use tracing::trace;

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

pub struct JsHook<I, O>
where
    I: JsInput,
    O: JsOutput,
{
    f: ThreadsafeFunction<I>,
    _marker: PhantomData<O>,
}

impl<I, O> JsHook<I, O>
where
    I: JsInput,
    O: JsOutput,
{
    pub fn new(env: &napi::Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            f: env.create_threadsafe_function(f, 0, |cx: ThreadSafeCallContext<I>| {
                let arg = cx.value.into_js(&cx.env)?.into_unknown();

                if cfg!(debug_assertions) {
                    trace!("Converted to js value");
                }
                Ok(vec![arg])
            })?,
            _marker: PhantomData,
        })
    }

    #[tracing::instrument(skip_all, fields(perf = "JsHook::call"))]
    pub async fn call(&self, input: I) -> napi::Result<O> {
        if cfg!(debug_assertions) {
            trace!("Calling js function");
        }

        let result: Promise<O> = self.f.call_async(Ok(input)).await?;

        let res = result.await?;

        Ok(res)
    }
}
