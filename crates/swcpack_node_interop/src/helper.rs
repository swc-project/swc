use std::fmt::Debug;

use napi::{
    bindgen_prelude::{FromNapiValue, Promise, ToNapiValue},
    threadsafe_function::{
        ThreadSafeCallContext, ThreadSafeResultContext, ThreadsafeFunction,
        ThreadsafeFunctionCallMode,
    },
    Env, JsExternal, JsFunction, JsUnknown,
};
use tokio::sync::oneshot;
use tracing::trace;

pub trait JsInput: 'static + Send + Debug + ToNapiValue {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown>;
}

impl JsInput for String {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        Ok(env.create_string(&self)?.into_unknown())
    }
}

impl JsInput for Vec<u8> {
    fn into_js(self, env: &Env) -> napi::Result<JsUnknown> {
        Ok(env.create_buffer_with_data(self)?.into_unknown())
    }
}

pub trait JsOutput: 'static + FromNapiValue + Send + Debug {
    fn from_js(env: &Env, v: JsUnknown) -> Self;
}

impl JsOutput for String {
    fn from_js(env: &Env, v: JsUnknown) -> Self {
        v.coerce_to_string()
            .unwrap()
            .into_utf8()
            .unwrap()
            .into_owned()
            .unwrap()
    }
}

impl JsOutput for Vec<u8> {
    fn from_js(env: &Env, v: JsUnknown) -> Self {
        todo!()
    }
}

pub(crate) struct JsHook<I, O>
where
    I: JsInput,
    O: JsOutput,
{
    f: ThreadsafeFunction<(I, oneshot::Sender<Promise<O>>)>,
}

impl<I, O> JsHook<I, O>
where
    I: JsInput,
    O: JsOutput,
{
    pub fn new(env: &napi::Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            f: env.create_threadsafe_function(
                f,
                0,
                |cx: ThreadSafeCallContext<(I, oneshot::Sender<Promise<O>>)>| {
                    // dbg!(&cx.value.0);
                    let ext = cx
                        .env
                        .create_external(Some(cx.value.1), None)?
                        .into_unknown();

                    // dbg!(&cx.value.0);

                    // TODO: map_to_js seems like erroring, maybe related to move

                    let arg = cx.value.0.into_js(&cx.env)?.into_unknown();

                    if cfg!(debug_assertions) {
                        trace!("after map_to_js");
                    }
                    Ok(vec![arg, ext])
                },
                |mut cx: ThreadSafeResultContext<Vec<JsUnknown>>| {
                    // for v in &cx.return_value {
                    //     dbg!(v.get_type());
                    // }

                    let external = cx.return_value.remove(1);

                    let sender = unsafe { external.cast::<JsExternal>() };
                    let unknown = cx.return_value.remove(0);

                    let output = Promise::from_unknown(unknown).unwrap();
                    let sender = cx
                        .env
                        .get_value_external::<Option<oneshot::Sender<Promise<O>>>>(&sender)
                        .expect("js code should return the sender arg")
                        .take();
                    if let Some(sender) = sender {
                        let _ = sender.send(output);
                    }
                },
            )?,
        })
    }

    pub async fn call(&self, input: I) -> napi::Result<O> {
        let (tx, rx) = oneshot::channel();

        if cfg!(debug_assertions) {
            trace!("Calling js function");
        }

        self.f
            .call(Ok((input, tx)), ThreadsafeFunctionCallMode::NonBlocking);

        let res = rx.await.unwrap();
        if cfg!(debug_assertions) {
            trace!("Js function returned");
        }

        let res = res.await?;

        Ok(res)
    }
}
