use std::{
    fmt,
    io::{self, Write},
    sync::{Arc, RwLock},
};

use swc_common::{
    errors::{Emitter, Handler, HandlerFlags},
    sync::Lrc,
    SourceMap,
};
use swc_error_reporters::{GraphicalReportHandler, GraphicalTheme};

use super::StdErr;
use crate::errors::{multi_emitter, stderr::stderr_emitter};

/// Creates a new handler for testing.
pub(crate) fn new_handler(cm: Lrc<SourceMap>, treat_err_as_bug: bool) -> (Handler, BufferedError) {
    let buffer: BufferedError = Default::default();

    let buffered_emitter = BufferedEmitter {
        cm: cm.clone(),
        report: GraphicalReportHandler::default().with_theme(GraphicalTheme::none()),
        buffer: buffer.clone(),
    };

    let emitter = multi_emitter(Box::new(buffered_emitter), stderr_emitter(cm));
    let handler = Handler::with_emitter_and_flags(
        emitter,
        HandlerFlags {
            treat_err_as_bug,
            ..Default::default()
        },
    );

    (handler, buffer)
}

pub struct BufferedEmitter {
    cm: Lrc<SourceMap>,
    report: GraphicalReportHandler,
    buffer: BufferedError,
}

impl Emitter for BufferedEmitter {
    fn emit(&mut self, db: &mut swc_common::errors::DiagnosticBuilder<'_>) {
        let d = db.take();
        let pretty_diagnostic = d.to_pretty_diagnostic(&self.cm, false);
        self.buffer
            .write(pretty_diagnostic.to_pretty_string(&self.report).as_bytes())
            .unwrap();
    }
}

#[derive(Clone, Default)]
pub(crate) struct BufferedError(Arc<RwLock<Vec<u8>>>);

impl Write for BufferedError {
    fn write(&mut self, d: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(d)
    }

    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}
impl From<BufferedError> for StdErr {
    fn from(buf: BufferedError) -> Self {
        let s = buf.0.read().unwrap();
        let s: String = String::from_utf8_lossy(&s).into();

        s.into()
    }
}

impl fmt::Write for BufferedError {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.write(s.as_bytes()).map_err(|_| fmt::Error)?;
        Ok(())
    }
}
