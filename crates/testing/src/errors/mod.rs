use swc_common::errors::{DiagnosticBuilder, Emitter};

pub(crate) mod stderr;

pub(crate) fn multi_emitter(a: Box<dyn Emitter>, b: Box<dyn Emitter>) -> Box<dyn Emitter> {
    Box::new(MultiEmitter { a, b })
}

struct MultiEmitter {
    a: Box<dyn Emitter>,
    b: Box<dyn Emitter>,
}

impl Emitter for MultiEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder<'_>) {
        self.a.emit(db);
        self.b.emit(db);
    }
}
