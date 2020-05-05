#![feature(box_syntax)]

use once_cell::sync::Lazy;
use std::{
    fmt::{self, Display, Formatter},
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc::{
    common::{
        errors::{EmitterWriter, Handler, HandlerFlags, SourceMapperDyn},
        FileName, FilePathMapping, SourceMap,
    },
    config::{InputSourceMap, Options, ParseOptions, SourceMapsConfig},
    ecmascript::ast::Program,
    Compiler,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "parseSync")]
pub fn parse_sync(s: &str, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let opts: ParseOptions = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let (c, errors) = compiler();

    let fm = c.cm.new_source_file(FileName::Anon, s.into());
    let (prog, src_map) = c
        .parse_js(
            fm,
            opts.target,
            opts.syntax,
            opts.is_module,
            opts.comments,
            &InputSourceMap::Bool(false),
        )
        .map_err(|err| format!("failed to parse: {}\n{}", err, errors))?;

    let mut source_map = vec![];
    if let Some(src_map) = src_map {
        src_map
            .to_writer(&mut source_map)
            .map_err(|err| format!("failed to print source map file: {}", err))?;
    }

    Ok(
        JsValue::from_serde(&(prog, &*String::from_utf8_lossy(&source_map)))
            .map_err(|err| format!("failed to return value: {}", err))?,
    )
}

#[wasm_bindgen(js_name = "printSync")]
pub fn print_sync(s: JsValue, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let program: Program = s
        .into_serde()
        .map_err(|err| format!("not a program: {}", err))?;

    let opts: Options = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let (c, errors) = compiler();

    let s = c
        .print(
            &program,
            c.comments(),
            opts.source_maps
                .clone()
                .unwrap_or(SourceMapsConfig::Bool(false)),
            None,
            opts.config.unwrap_or_default().minify.unwrap_or_default(),
        )
        .map_err(|err| format!("failed to print: {}\n{}", err, errors))?;

    Ok(JsValue::from_serde(&s).map_err(|err| format!("failed to print: {}\n{}", err, errors))?)
}

#[wasm_bindgen(js_name = "transformSync")]
pub fn transform_sync(s: &str, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let opts: Options = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let (c, errors) = compiler();

    let fm = c.cm.new_source_file(FileName::Anon, s.into());
    let out = c
        .process_js_file(fm, &opts)
        .map_err(|err| format!("failed to process code: {}\n{}", err, errors))?;

    Ok(JsValue::from_serde(&out).unwrap())
}

fn compiler() -> (Compiler, BufferedError) {
    let cm = codemap();

    let (handler, errors) = new_handler(cm.clone());

    let c = Compiler::new(cm.clone(), handler);

    (c, errors)
}

/// Get global sourcemap
fn codemap() -> Arc<SourceMap> {
    static CM: Lazy<Arc<SourceMap>> =
        Lazy::new(|| Arc::new(SourceMap::new(FilePathMapping::empty())));

    CM.clone()
}

/// Creates a new handler which emits to returned buffer.
fn new_handler(cm: Arc<SourceMapperDyn>) -> (Handler, BufferedError) {
    let e = BufferedError::default();

    let handler = Handler::with_emitter_and_flags(
        Box::new(EmitterWriter::new(
            Box::new(e.clone()),
            Some(cm.clone()),
            false,
            false,
        )),
        HandlerFlags {
            treat_err_as_bug: false,
            can_emit_warnings: true,
            ..Default::default()
        },
    );

    (handler, e)
}

#[derive(Clone, Default)]
pub(crate) struct BufferedError(Arc<RwLock<String>>);

impl Write for BufferedError {
    fn write(&mut self, d: &[u8]) -> io::Result<usize> {
        self.0
            .write()
            .unwrap()
            .push_str(&String::from_utf8_lossy(d));

        Ok(d.len())
    }
    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}

impl Display for BufferedError {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(&self.0.read().unwrap(), f)
    }
}
