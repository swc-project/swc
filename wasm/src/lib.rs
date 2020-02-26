#![feature(box_syntax)]

use once_cell::sync::Lazy;
use std::{
    path::{Path, PathBuf},
    sync::{Arc, RwLock},
};
use swc::{
    common::{
        errors::{Diagnostic, DiagnosticBuilder, Emitter, Handler, HandlerFlags, SourceMapperDyn},
        FileName, FilePathMapping, SourceMap,
    },
    config::Options,
    Compiler,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "transformSync")]
pub fn transform_sync(s: &str, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    let opts: Options = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let fm = c.cm.new_source_file(FileName::Anon, s.into());
    let out = c
        .process_js_file(fm, &opts)
        .map_err(|err| format!("failed to process code: {}", err))?;

    Ok(JsValue::from_serde(&out).unwrap())
}

#[wasm_bindgen(js_name = "transformFileSync")]
pub fn transform_file_sync(path: &str, opts: JsValue) -> Result<JsValue, JsValue> {
    console_error_panic_hook::set_once();

    let c = compiler();

    let opts: Options = opts
        .into_serde()
        .map_err(|err| format!("failed to parse options: {}", err))?;

    let fm =
        c.cm.load_file(Path::new(path))
            .map_err(|err| format!("failed to load file: {}", err))?;
    let out = c
        .process_js_file(fm, &opts)
        .map_err(|err| format!("failed to process file]: {}", err))?;

    Ok(JsValue::from_serde(&out).unwrap())
}

fn compiler() -> Arc<Compiler> {
    static COMPILER: Lazy<Arc<Compiler>> = Lazy::new(|| {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

        let (handler, _) = new_handler(cm.clone());

        let c = Compiler::new(cm.clone(), handler);

        Arc::new(c)
    });

    COMPILER.clone()
}

/// Creates a new handler for testing.
pub(crate) fn new_handler(_: Arc<SourceMapperDyn>) -> (Handler, BufferedError) {
    let e = BufferedError::default();

    let handler = Handler::with_emitter_and_flags(
        box e.clone(),
        HandlerFlags {
            treat_err_as_bug: false,
            can_emit_warnings: true,
            ..Default::default()
        },
    );

    (handler, e)
}

#[derive(Clone, Default)]
pub(crate) struct BufferedError(Arc<RwLock<Vec<Diagnostic>>>);

impl Emitter for BufferedError {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        self.0.write().unwrap().push((**db).clone());
    }
}

impl From<BufferedError> for Vec<Diagnostic> {
    fn from(buf: BufferedError) -> Self {
        let s = buf.0.read().unwrap();

        s.clone()
    }
}
