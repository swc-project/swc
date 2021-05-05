use napi::CallContext;
use napi::JsObject;

#[js_function(3)]
pub fn babelify(ctx: CallContext) -> napi::Result<JsObject> {}
