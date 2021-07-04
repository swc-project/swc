use dashmap::DashMap;
use napi::{CallContext, JsFunction, JsUndefined};
use once_cell::sync::Lazy;
use swc_ecma_ast::Module;

static REQ_QUEUE: Lazy<DashMap<u64, std::sync::mpsc::Sender<Module>>> =
    Lazy::new(|| Default::default());

/// Called by javascript code in @swc/core.
///
/// Argument: `(call_id, babel_ast)`
#[js_function(2)]
pub(super) fn response(cx: CallContext) -> napi::Result<JsUndefined> {
    todo!()
}

#[js_function(2)]
pub(super) fn run_babel_plugin(cx: CallContext) -> napi::Result<JsUndefined> {
    let f: JsFunction = cx.get(0)?;

    cx.env.create_threadsafe_function(&f, 0, |cx| todo!());

    todo!()
}
