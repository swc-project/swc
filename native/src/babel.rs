use napi::CallContext;
use napi::JsObject;
use napi::JsString;
use napi::JsUnknown;
use napi_derive::js_function;
use swc_babel_rt::plugin::Plugin;

#[js_function(2)]
pub fn invoke_plugin(cx: CallContext) -> napi::Result<JsUnknown> {
    let name = cx.get::<JsString>(0)?;
    let options = cx.get::<JsObject>(1)?;

    let plugin = Plugin::load_named(&cx.env, &name, options)?;

    Ok(cx.env.get_undefined()?.into_unknown())
}
