#![allow(unused)]
#![deny(warnings)]
#![allow(clippy::unused_unit)]

use std::sync::Arc;

use anyhow::{Context, Error};
use js_sys::{JsString, JSON};
use once_cell::sync::Lazy;
use swc_core::{
    ast::{EsVersion, Program},
    base::{
        config::{ErrorFormat, JsMinifyOptions, Options, ParseOptions, SourceMapsConfig},
        try_with_handler, Compiler,
    },
    common::{comments::Comments, FileName, FilePathMapping, SourceMap},
};
use wasm_bindgen::{prelude::*, JsCast};
use wasm_bindgen_futures::{future_to_promise, spawn_local, JsFuture};

mod types;

fn convert_err(err: Error, error_format: ErrorFormat) -> JsValue {
    error_format.format(&err).into()
}

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function minify(src: string, opts?: JsMinifyOptions): Promise<Output>;
export function minifySync(code: string, opts?: JsMinifyOptions): Output;

export function parse(src: string, options: ParseOptions & {
    isModule: false;
}): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parseSync(src: string, options: ParseOptions & {
    isModule: false;
}): Script;
export function parseSync(src: string, options?: ParseOptions): Module;

export function print(m: Program, options?: Options): Promise<Output>;
export function printSync(m: Program, options?: Options): Output

/**
 * Note: this interface currently does not do _actual_ async work, only provides
 * a corresponding async interfaces to the `@swc/core`'s interface.
 */
export function transform(
    code: string | Program,
    options?: Options,
    experimental_plugin_bytes_resolver?: any
): Promise<Output>;
/**
 * @param {string} code
 * @param {Options} opts
 * @param {Record<string, ArrayBuffer>} experimental_plugin_bytes_resolver An object contains bytes array for the plugin
 * specified in config. Key of record represents the name of the plugin specified in config. Note this is an experimental
 * interface, likely will change.
 * @returns {Output}
 */
export function transformSync(code: string | Program, opts?: Options, experimental_plugin_bytes_resolver?: any): Output;
"#;

#[wasm_bindgen(
    js_name = "minifySync",
    typescript_type = "minifySync",
    skip_typescript
)]
pub fn minify_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    try_with_handler(
        c.cm.clone(),
        swc_core::base::HandlerOpts {
            ..Default::default()
        },
        |handler| {
            c.run(|| {
                let opts = if opts.is_null() || opts.is_undefined() {
                    Default::default()
                } else {
                    opts.into_serde().context("failed to parse options")?
                };

                let fm = c.cm.new_source_file(FileName::Anon, s.into());
                let program = c
                    .minify(fm, handler, &opts)
                    .context("failed to minify file")?;

                JsValue::from_serde(&program).context("failed to serialize json")
            })
        },
    )
    .map_err(|e| convert_err(e, ErrorFormat::Normal))
}

#[wasm_bindgen(js_name = "minify", typescript_type = "minify", skip_typescript)]
pub fn minify(s: JsString, opts: JsValue) -> js_sys::Promise {
    // TODO: This'll be properly scheduled once wasm have standard backed thread
    // support.
    future_to_promise(async { minify_sync(s, opts) })
}

#[wasm_bindgen(js_name = "parseSync", typescript_type = "parseSync", skip_typescript)]
pub fn parse_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    try_with_handler(
        c.cm.clone(),
        swc_core::base::HandlerOpts {
            ..Default::default()
        },
        |handler| {
            c.run(|| {
                let opts: ParseOptions = if opts.is_null() || opts.is_undefined() {
                    Default::default()
                } else {
                    opts.into_serde().context("failed to parse options")?
                };

                let fm = c.cm.new_source_file(FileName::Anon, s.into());

                let cmts = c.comments().clone();
                let comments = if opts.comments {
                    Some(&cmts as &dyn Comments)
                } else {
                    None
                };

                let program = c
                    .parse_js(
                        fm,
                        handler,
                        opts.target,
                        opts.syntax,
                        opts.is_module,
                        comments,
                    )
                    .context("failed to parse code")?;

                JsValue::from_serde(&program).context("failed to serialize json")
            })
        },
    )
    .map_err(|e| convert_err(e, ErrorFormat::Normal))
}

#[wasm_bindgen(js_name = "parse", typescript_type = "parse", skip_typescript)]
pub fn parse(s: JsString, opts: JsValue) -> js_sys::Promise {
    // TODO: This'll be properly scheduled once wasm have standard backed thread
    // support.
    future_to_promise(async { parse_sync(s, opts) })
}

#[wasm_bindgen(js_name = "printSync", typescript_type = "printSync", skip_typescript)]
pub fn print_sync(s: JsValue, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    try_with_handler(
        c.cm.clone(),
        swc_core::base::HandlerOpts {
            ..Default::default()
        },
        |_handler| {
            c.run(|| {
                let opts: Options = if opts.is_null() || opts.is_undefined() {
                    Default::default()
                } else {
                    opts.into_serde().context("failed to parse options")?
                };

                let program: Program = s.into_serde().context("failed to deserialize program")?;

                let s = c
                    .print(
                        &program,
                        None,
                        None,
                        true,
                        opts.codegen_target().unwrap_or(EsVersion::Es2020),
                        opts.source_maps
                            .clone()
                            .unwrap_or(SourceMapsConfig::Bool(false)),
                        &Default::default(),
                        None,
                        opts.config.minify.into(),
                        None,
                        opts.config.emit_source_map_columns.into_bool(),
                        false,
                    )
                    .context("failed to print code")?;

                JsValue::from_serde(&s).context("failed to serialize json")
            })
        },
    )
    .map_err(|e| convert_err(e, ErrorFormat::Normal))
}

#[wasm_bindgen(js_name = "print", typescript_type = "print", skip_typescript)]
pub fn print(s: JsValue, opts: JsValue) -> js_sys::Promise {
    // TODO: This'll be properly scheduled once wasm have standard backed thread
    // support.
    future_to_promise(async { print_sync(s, opts) })
}

#[wasm_bindgen(
    js_name = "transformSync",
    typescript_type = "transformSync",
    skip_typescript
)]
#[allow(unused_variables)]
pub fn transform_sync(
    s: JsValue,
    opts: JsValue,
    experimental_plugin_bytes_resolver: JsValue,
) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    #[cfg(feature = "plugin")]
    {
        if experimental_plugin_bytes_resolver.is_object() {
            use js_sys::{Array, Object, Uint8Array};
            use wasm_bindgen::JsCast;

            // TODO: This is probably very inefficient, including each transform
            // deserializes plugin bytes.
            let plugin_bytes_resolver_object: Object = experimental_plugin_bytes_resolver
                .try_into()
                .expect("Resolver should be a js object");

            swc_core::plugin_runner::cache::init_plugin_module_cache_once();

            let entries = Object::entries(&plugin_bytes_resolver_object);
            for entry in entries.iter() {
                let entry: Array = entry
                    .try_into()
                    .expect("Resolver object missing either key or value");
                let name: String = entry
                    .get(0)
                    .as_string()
                    .expect("Resolver key should be a string");
                let buffer = entry.get(1);

                //https://github.com/rustwasm/wasm-bindgen/issues/2017#issue-573013044
                //We may use https://github.com/cloudflare/serde-wasm-bindgen instead later
                let data = if JsCast::is_instance_of::<Uint8Array>(&buffer) {
                    JsValue::from(Array::from(&buffer))
                } else {
                    buffer
                };

                let bytes: Vec<u8> = data
                    .into_serde()
                    .expect("Could not read byte from plugin resolver");

                // In here we 'inject' externally loaded bytes into the cache, so
                // remaining plugin_runner execution path works as much as
                // similar between embedded runtime.
                swc_core::plugin_runner::cache::PLUGIN_MODULE_CACHE.store_once(&name, bytes);
            }
        }
    }

    let opts: Options = if opts.is_null() || opts.is_undefined() {
        Default::default()
    } else {
        opts.into_serde()
            .context("failed to parse options")
            .map_err(|e| convert_err(e, ErrorFormat::Normal))?
    };

    let error_format = opts.experimental.error_format.unwrap_or_default();

    try_with_handler(
        c.cm.clone(),
        swc_core::base::HandlerOpts {
            ..Default::default()
        },
        |handler| {
            c.run(|| {
                let s = s.dyn_into::<js_sys::JsString>();
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
                        c.process_js_file(fm, handler, &opts)
                            .context("failed to process input file")?
                    }
                    Err(v) => unsafe { c.process_js(handler, v.into_serde().expect(""), &opts)? },
                };

                JsValue::from_serde(&out).context("failed to serialize json")
            })
        },
    )
    .map_err(|e| convert_err(e, error_format))
}

#[wasm_bindgen(js_name = "transform", typescript_type = "transform", skip_typescript)]
pub fn transform(
    s: JsValue,
    opts: JsValue,
    experimental_plugin_bytes_resolver: JsValue,
) -> js_sys::Promise {
    // TODO: This'll be properly scheduled once wasm have standard backed thread
    // support.
    future_to_promise(async { transform_sync(s, opts, experimental_plugin_bytes_resolver) })
}

/// Get global sourcemap
fn compiler() -> Arc<Compiler> {
    static C: Lazy<Arc<Compiler>> = Lazy::new(|| {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

        Arc::new(Compiler::new(cm))
    });

    C.clone()
}
