use std::{
    fmt::{self, Display, Formatter},
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc_common::{
    self,
    errors::{DiagnosticBuilder, Emitter, Handler},
    sync::Lrc,
    FileName, SourceMap, SourceMapperDyn,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(js_name = "parseSync")]
pub fn parse() -> Result<JsValue, JsValue> {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = new_handler(cm.clone()).0;

    // Real usage
    // let fm = cm
    //     .load_file(Path::new("test.js"))
    //     .expect("failed to load test.js");

    let fm = cm.new_source_file(
        FileName::Custom("test.js".into()),
        "interface Foo {}".into(),
    );

    let lexer = Lexer::new(
        Syntax::Es(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    let module = parser
        .parse_module()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("Failed to parse module.");

    Ok(JsValue::from_serde(&module).map_err(|err| format!("failed to return value: {}", err))?)
}

/// Creates a new handler which emits to returned buffer.
fn new_handler(_cm: Lrc<SourceMapperDyn>) -> (Lrc<Handler>, BufferedError) {
    let e = BufferedError::default();

    let handler = Handler::with_emitter(true, false, Box::new(MyEmitter::default()));

    (Lrc::new(handler), e)
}

#[derive(Clone, Default)]
struct MyEmitter(BufferedError);

impl Emitter for MyEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder<'_>) {
        let z = &(self.0).0;
        for msg in &db.message {
            z.write().unwrap().push_str(&msg.0);
        }
    }
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
