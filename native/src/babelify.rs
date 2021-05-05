use crate::get_compiler;
use crate::util::CtxtExt;
use napi::CallContext;
use napi::JsObject;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct HiddenOptions {
    should_parse_input: bool,
}

struct BabelifyTask {
    opts: HiddenOptions,
}

/// The second argument provided the user.
pub enum BabelifyOptions {}

#[js_function(3)]
pub fn babelify(ctx: CallContext) -> napi::Result<JsObject> {
    let opts = ctx.get_deserialized::<HiddenOptions>(0)?;
}

#[js_function(3)]
pub fn babelify_sync(ctx: CallContext) -> napi::Result<JsObject> {
    let opts = ctx.get_deserialized::<HiddenOptions>(0)?;
    let module = if opts.should_parse_input {
    } else {
    };
}
