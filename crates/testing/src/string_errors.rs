use super::StdErr;
use std::{
    io::{self, Write},
    sync::{Arc, RwLock},
};
use swc_common::{
    errors::{EmitterWriter, Handler, HandlerFlags, SourceMapperDyn},
    sync::Lrc,
};

/// Creates a new handler for testing.
pub(crate) fn new_handler(
    cm: Lrc<SourceMapperDyn>,
    treat_err_as_bug: bool,
) -> (Handler, BufferedError) {
    let buf: BufferedError = Default::default();

    let e = EmitterWriter::new(Box::new(buf.clone()), Some(cm.clone()), false, true);

    let handler = Handler::with_emitter_and_flags(
        Box::new(e),
        HandlerFlags {
            treat_err_as_bug,
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
