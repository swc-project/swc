use std::marker::PhantomData;

use napi::{
    bindgen_prelude::Promise,
    threadsafe_function::{ThreadSafeCallContext, ThreadsafeFunction},
    JsFunction,
};
use tracing::trace;

use crate::types::{JsInput, JsOutput};

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
