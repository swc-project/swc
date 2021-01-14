use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_utils::drop_span;
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::VisitMutWith;

pub(crate) fn dump<N>(node: &N) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan>,
{
    let node = drop_span(node.clone());
    let mut buf = vec![];
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        node.emit_with(&mut emitter).unwrap();
    }

    String::from_utf8(buf).unwrap()
}
