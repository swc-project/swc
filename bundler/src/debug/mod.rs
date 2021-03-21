#![allow(dead_code)]

use std::io::{stderr, Write};
use swc_common::{sync::Lrc, SourceMap, SyntaxContext};
use swc_ecma_ast::{Ident, Module};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub(crate) fn print_hygiene(event: &str, cm: &Lrc<SourceMap>, t: &Module) {
    let module = t.clone().fold_with(&mut HygieneVisualizer);

    let stdout = stderr();
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
    noop_fold_type!();

    fn fold_ident(&mut self, node: Ident) -> Ident {
        if node.span.ctxt == SyntaxContext::empty() {
            return node;
        }
        Ident {
            sym: format!("{}{:?}", node.sym, node.span.ctxt()).into(),
            ..node
        }
    }
}
