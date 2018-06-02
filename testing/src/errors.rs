use super::StdErr;
use rustc_data_structures::sync::Lrc;
use std::io::{self, Write};
use std::sync::Arc;
use std::sync::RwLock;
use swc_common::errors::{CodeMap, EmitterWriter, Handler, HandlerFlags};

/// Creates a new handler for testing.
pub(crate) fn new_handler(cm: Lrc<CodeMap>) -> (Handler, BufferedError) {
    let buf: BufferedError = Default::default();

    let e = EmitterWriter::new(box buf.clone(), Some(cm), false, true);

    let handler = Handler::with_emitter(
        box e,
        HandlerFlags {
            can_emit_warnings: true,
            ..Default::default()
        },
    );

    (handler, buf)
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
