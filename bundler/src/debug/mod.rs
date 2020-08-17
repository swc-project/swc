#![allow(dead_code)]

use std::io::{stdout, Write};
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_ast::{Ident, Module};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_visit::{Fold, FoldWith};

pub(crate) fn print_hygiene(event: &str, cm: &Lrc<SourceMap>, t: &Module) {
    let module = t.clone().fold_with(&mut HygieneVisualizer);

    let stdout = stdout();
    let mut w = stdout.lock();

    writeln!(w, "==================== @ {} ====================", event).unwrap();
    Emitter {
        cfg: swc_ecma_codegen::Config { minify: false },
        cm: cm.clone(),
        comments: None,
        wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut w, None)),
    }
    .emit_module(&module)
    .unwrap();
    writeln!(w, "==================== @ ====================").unwrap();
}

struct HygieneVisualizer;

impl Fold for HygieneVisualizer {
    fn fold_ident(&mut self, node: Ident) -> Ident {
        Ident {
            sym: format!("{}{:?}", node.sym, node.span.ctxt()).into(),
            ..node
        }
    }
}
