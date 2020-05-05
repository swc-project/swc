#![feature(box_syntax)]

use once_cell::sync::Lazy;
use std::{
    fmt::{self, Display, Formatter},
    io::{self, Write},
    path::Path,
    sync::{Arc, RwLock},
};
use swc::{
    common::{
        errors::{
            Diagnostic, DiagnosticBuilder, Emitter, EmitterWriter, Handler, HandlerFlags,
            SourceMapperDyn,
        },
        FileName, FilePathMapping, SourceMap,
    },
    config::Options,
    Compiler,
};
use wasm_bindgen::prelude::*;

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

#[wasm_bindgen(js_name = "transformFileSync")]
pub fn transform_file_sync(path: &str, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let opts: Options = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let (c, errors) = compiler();

    let fm =
        c.cm.load_file(Path::new(path))
            .map_err(|err| format!("failed to load file: {}\n{}", err, errors))?;
    let out = c
        .process_js_file(fm, &opts)
        .map_err(|err| format!("failed to process file]: {}\n{}", err, errors))?;

    Ok(JsValue::from_serde(&out).unwrap())
}

fn compiler() -> (Compiler, BufferedError) {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    let (handler, errors) = new_handler(cm.clone());

    let c = Compiler::new(cm.clone(), handler);

    (c, errors)
}

/// Creates a new handler for testing.
pub(crate) fn new_handler(cm: Arc<SourceMapperDyn>) -> (Handler, BufferedError) {
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
