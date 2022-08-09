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
    binding_macros::{
        build_minify, build_minify_sync, build_parse, build_parse_sync, build_print,
        build_print_sync, build_transform,
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

build_minify_sync!(#[wasm_bindgen(js_name = "minifySync", typescript_type = "minifySync", skip_typescript)]);
build_minify!(#[wasm_bindgen(js_name = "minify", typescript_type = "minify", skip_typescript)]);

build_parse_sync!(#[wasm_bindgen(js_name = "parseSync", typescript_type = "parseSync", skip_typescript)]);
build_parse!(#[wasm_bindgen(js_name = "parse", typescript_type = "parse", skip_typescript)]);

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

build_transform!(#[wasm_bindgen(js_name = "transform", typescript_type = "transform", skip_typescript)]);

build_print_sync!(#[wasm_bindgen(js_name = "printSync", typescript_type = "printSync", skip_typescript)]);
build_print!(#[wasm_bindgen(js_name = "print", typescript_type = "print", skip_typescript)]);

/// Get global sourcemap
fn compiler() -> Arc<Compiler> {
    static C: Lazy<Arc<Compiler>> = Lazy::new(|| {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

        Arc::new(Compiler::new(cm))
    });

    C.clone()
}
