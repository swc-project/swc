use once_cell::sync::Lazy;
use std::env;
use std::process::Command;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::Ident;
use swc_ecma_ast::Module;
use swc_ecma_ast::StrKind;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_transforms::fixer;
use swc_ecma_transforms::hygiene;
use swc_ecma_utils::drop_span;
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::FoldWith;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub(crate) struct Debugger;

impl VisitMut for Debugger {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if n.span.ctxt == SyntaxContext::empty() {
            return;
        }

        n.sym = format!("{}{:?}", n.sym, n.span.ctxt).into();
        n.span.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_str_kind(&mut self, n: &mut StrKind) {
        *n = Default::default();
    }
}

pub(crate) fn dump<N>(node: &N) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan> + VisitMutWith<Debugger>,
{
    let mut node = node.clone();
    node.visit_mut_with(&mut Debugger);
    node = drop_span(node);
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

/// Invokes code using node.js.
///
/// If the cargo feature `debug` is disabled or the environment variable
/// `SWC_RUN` is not `1`, this function is noop.
pub(crate) fn invoke(module: &Module) {
    static ENABLED: Lazy<bool> =
        Lazy::new(|| cfg!(feature = "debug") && env::var("SWC_RUN").unwrap_or_default() == "1");

    if !*ENABLED {
        return;
    }

    let module = module
        .clone()
        .fold_with(&mut hygiene())
        .fold_with(&mut fixer(None));
    let module = drop_span(module);

    let mut buf = vec![];
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        emitter.emit_module(&module).unwrap();
    }

    let code = String::from_utf8(buf).unwrap();

    let output = Command::new("node")
        .arg("-e")
        .arg(&code)
        .output()
        .expect("[SWC_RUN] failed to validate code using `node`");
    if !output.status.success() {
        panic!(
            "[SWC_RUN] Failed to validate code:\n{}\n===== ===== ===== ===== =====\n{}\n{}",
            code,
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr),
        );
    }

    log::debug!("[SWC_RUN]\n{}", String::from_utf8_lossy(&output.stdout))
}
