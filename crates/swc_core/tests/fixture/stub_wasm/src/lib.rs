use anyhow::Error;
use serde::Serialize;
use serde_wasm_bindgen::Serializer;
use swc_core::{
    base::HandlerOpts,
    binding_macros::wasm::{
        compiler, convert_err, future_to_promise,
        js_sys::{JsString, Promise},
        noop, Options, ParseOptions, SourceMapsConfig,
    },
    common::{
        comments::{self, SingleThreadedComments},
        errors::Handler,
        sync::Lrc,
        FileName, Mark, SourceMap, GLOBALS,
    },
    ecma::{
        ast::{EsVersion, Program},
        transforms::base::resolver,
        visit::VisitMutWith,
    },
};
use wasm_bindgen::{prelude::*, JsCast};

// A serializer with options to provide backward compat for the input / output
// from the bindgen generated swc interfaces.
const COMPAT_SERIALIZER: Serializer = Serializer::new()
    .serialize_maps_as_objects(true)
    .serialize_missing_as_null(true);

fn try_with_handler<F, Ret>(cm: Lrc<SourceMap>, config: HandlerOpts, op: F) -> Result<Ret, Error>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    GLOBALS.set(&Default::default(), || {
        swc_core::base::try_with_handler(cm, config, op)
    })
}

#[wasm_bindgen(js_name = "transformSync")]
#[allow(unused_variables)]
pub fn transform_sync(
    s: JsValue,
    opts: JsValue,
    experimental_plugin_bytes_resolver: JsValue,
) -> Result<JsValue, JsValue> {
    let c = compiler();
    let opts: Options = if opts.is_null() || opts.is_undefined() {
        Default::default()
    } else {
        serde_wasm_bindgen::from_value(opts)?
    };

    let error_format = opts.experimental.error_format.unwrap_or_default();
    try_with_handler(c.cm.clone(), Default::default(), |handler| {
        c.run(|| {
            let s = JsCast::dyn_into::<JsString>(s);
            let out = match s {
                Ok(s) => {
                    let fm = c.cm.new_source_file(
                        if opts.filename.is_empty() {
                            FileName::Anon
                        } else {
                            FileName::Real(opts.filename.clone().into())
                        },
                        s.into(),
                    );
                    let cm = c.cm.clone();
                    let file = fm.clone();
                    let comments = SingleThreadedComments::default();
                    anyhow::Context::context(
                        c.process_js_with_custom_pass(
                            fm,
                            None,
                            handler,
                            &opts,
                            comments,
                            |_| noop(),
                            |_| noop(),
                        ),
                        "failed to process js file",
                    )?
                }
                Err(v) => c.process_js(
                    handler,
                    serde_wasm_bindgen::from_value(v)
                        .expect("Should able to deserialize into program"),
                    &opts,
                )?,
            };

            out.serialize(&COMPAT_SERIALIZER)
                .map_err(|e| anyhow::anyhow!("failed to serialize transform result: {}", e))
        })
    })
    .map_err(|e| convert_err(e, Some(error_format)))
}
