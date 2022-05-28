use std::fmt::Debug;

use napi::{
    bindgen_prelude::ToNapiValue,
    threadsafe_function::{
        ThreadSafeCallContext, ThreadSafeResultContext, ThreadsafeFunction,
        ThreadsafeFunctionCallMode,
    },
    Env, JsExternal, JsFunction, JsUnknown,
};
use tokio::sync::oneshot;

pub(crate) struct JsHook<I, O>
where
    I: 'static + Send + Debug + ToNapiValue,
    O: 'static + Send + Debug,
{
    f: ThreadsafeFunction<(I, oneshot::Sender<O>)>,
}

impl<I, O> JsHook<I, O>
where
    I: 'static + Send + Debug + ToNapiValue,
    O: 'static + Send + Debug,
{
    pub fn new(
        env: &napi::Env,
        f: &JsFunction,
        map_to_js: fn(&Env, I) -> napi::Result<JsUnknown>,
        map_result: fn(&Env, JsUnknown) -> O,
    ) -> napi::Result<Self> {
        Ok(Self {
            f: env.create_threadsafe_function(
                f,
                0,
                move |cx: ThreadSafeCallContext<(I, oneshot::Sender<O>)>| {
                    let ext = cx
                        .env
                        .create_external(Some(cx.value.1), None)?
                        .into_unknown();

                    let arg = map_to_js(&cx.env, cx.value.0)?.into_unknown();
                    Ok(vec![arg, ext])
                },
                move |mut cx: ThreadSafeResultContext<Vec<JsUnknown>>| {
                    let sender = unsafe { cx.return_value.remove(1).cast::<JsExternal>() };
                    let unknown = cx.return_value.remove(0);

                    let output = map_result(&cx.env, unknown);
                    let sender = cx
                        .env
                        .get_value_external::<Option<oneshot::Sender<O>>>(&sender)
                        .unwrap()
                        .take();
                    if let Some(sender) = sender {
                        sender.send(output);
                    }
                },
            )?,
        })
    }

    pub async fn call(&self, input: I) -> napi::Result<O> {
        let (tx, rx) = oneshot::channel();

        self.f
            .call(Ok((input, tx)), ThreadsafeFunctionCallMode::NonBlocking);

        Ok(rx.await.unwrap())
    }
}
