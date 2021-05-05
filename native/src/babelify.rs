use crate::util::CtxtExt;
use napi::CallContext;
use napi::JsObject;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct BabelifyOptions {
    pub should_parse_input: bool,
}

#[js_function(3)]
pub fn babelify(ctx: CallContext) -> napi::Result<JsObject> {
    let opts = ctx.get_deserialized::<BabelifyOptions>(0)?;
    let module = if opts.should_parse_input {
    } else {
    };
}

#[js_function(3)]
pub fn babelify_sync(ctx: CallContext) -> napi::Result<JsObject> {
    let opts = ctx.get_deserialized::<BabelifyOptions>(0)?;
    let module = if opts.should_parse_input {
    } else {
    };
}
