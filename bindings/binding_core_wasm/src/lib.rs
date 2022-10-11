use anyhow::Error;
use swc_core::{
    base::HandlerOpts,
    binding_macros::wasm::{
        compiler, convert_err, future_to_promise,
        js_sys::{JsString, Promise},
        noop, Options, ParseOptions, SourceMapsConfig,
    },
    common::{comments, errors::Handler, sync::Lrc, FileName, Mark, SourceMap, GLOBALS},
    ecma::{
        ast::{EsVersion, Program},
        transforms::base::resolver,
    },
};
use wasm_bindgen::{prelude::*, JsCast};
mod types;

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

fn try_with_handler<F, Ret>(cm: Lrc<SourceMap>, config: HandlerOpts, op: F) -> Result<Ret, Error>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    GLOBALS.set(&Default::default(), || {
        swc_core::base::try_with_handler(cm, config, op)
    })
}

#[wasm_bindgen(
    js_name = "minifySync",
    typescript_type = "minifySync",
    skip_typescript
)]
pub fn minify_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
    let c = compiler();
    try_with_handler(c.cm.clone(), Default::default(), |handler| {
        c.run(|| {
            let opts = if opts.is_null() || opts.is_undefined() {
                Default::default()
            } else {
                anyhow::Context::context(opts.into_serde(), "failed to parse options")?
            };
            let fm = c.cm.new_source_file(FileName::Anon, s.into());
            let program =
                anyhow::Context::context(c.minify(fm, handler, &opts), "failed to minify file")?;
            anyhow::Context::context(JsValue::from_serde(&program), "failed to serialize json")
        })
    })
    .map_err(|e| convert_err(e, None))
}

#[wasm_bindgen(js_name = "minify", typescript_type = "minify", skip_typescript)]
pub fn minify(s: JsString, opts: JsValue) -> Promise {
    future_to_promise(async { minify_sync(s, opts) })
}

#[wasm_bindgen(js_name = "parseSync", typescript_type = "parseSync", skip_typescript)]
pub fn parse_sync(s: JsString, opts: JsValue) -> Result<JsValue, JsValue> {
    let c = compiler();
    try_with_handler(c.cm.clone(), Default::default(), |handler| {
        c.run(|| {
            GLOBALS.set(&Default::default(), || {
                let opts: ParseOptions = if opts.is_null() || opts.is_undefined() {
                    Default::default()
                } else {
                    anyhow::Context::context(opts.into_serde(), "failed to parse options")?
                };
                let fm = c.cm.new_source_file(FileName::Anon, s.into());
                let cmts = c.comments().clone();
                let comments = if opts.comments {
                    Some(&cmts as &dyn comments::Comments)
                } else {
                    None
                };
                let program = anyhow::Context::context(
                    c.parse_js(
                        fm,
                        handler,
                        opts.target,
                        opts.syntax,
                        opts.is_module,
                        comments,
                    ),
                    "failed to parse code",
                )?;

                program.visit_mut_with(&mut resolver(Mark::new(), Mark::new()));

                anyhow::Context::context(JsValue::from_serde(&program), "failed to serialize json")
            })
        })
    })
    .map_err(|e| convert_err(e, None))
}

#[wasm_bindgen(js_name = "parse", typescript_type = "parse", skip_typescript)]
pub fn parse(s: JsString, opts: JsValue) -> Promise {
    future_to_promise(async { parse_sync(s, opts) })
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
    let c = compiler();
    let opts: Options = if opts.is_null() || opts.is_undefined() {
        Default::default()
    } else {
        anyhow::Context::context(opts.into_serde(), "failed to parse options")
            .map_err(|e| convert_err(e, None))?
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
                    anyhow::Context::context(
                        c.process_js_with_custom_pass(
                            fm,
                            None,
                            handler,
                            &opts,
                            |_, _| noop(),
                            |_, _| noop(),
                        ),
                        "failed to process js file",
                    )?
                }
                Err(v) => unsafe { c.process_js(handler, v.into_serde().expect(""), &opts)? },
            };
            anyhow::Context::context(JsValue::from_serde(&out), "failed to serialize json")
        })
    })
    .map_err(|e| convert_err(e, Some(error_format)))
}

#[wasm_bindgen(js_name = "transform", typescript_type = "transform", skip_typescript)]
pub fn transform(
    s: JsValue,
    opts: JsValue,
    experimental_plugin_bytes_resolver: JsValue,
) -> Promise {
    future_to_promise(async { transform_sync(s, opts, experimental_plugin_bytes_resolver) })
}

#[wasm_bindgen(js_name = "printSync", typescript_type = "printSync", skip_typescript)]
pub fn print_sync(s: JsValue, opts: JsValue) -> Result<JsValue, JsValue> {
    let c = compiler();
    try_with_handler(c.cm.clone(), Default::default(), |_handler| {
        c.run(|| {
            let opts: Options = if opts.is_null() || opts.is_undefined() {
                Default::default()
            } else {
                anyhow::Context::context(opts.into_serde(), "failed to parse options")?
            };
            let program: Program =
                anyhow::Context::context(s.into_serde(), "failed to deserialize program")?;
            let s = anyhow::Context::context(
                c.print(
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
                ),
                "failed to print code",
            )?;
            anyhow::Context::context(JsValue::from_serde(&s), "failed to serialize json")
        })
    })
    .map_err(|e| convert_err(e, None))
}

#[wasm_bindgen(js_name = "print", typescript_type = "print", skip_typescript)]
pub fn print(s: JsValue, opts: JsValue) -> Promise {
    future_to_promise(async { print_sync(s, opts) })
}
