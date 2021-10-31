use once_cell::sync::Lazy;
use std::{env, process::Command};
use swc_common::{sync::Lrc, SourceMap, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms::{fixer, hygiene};
use swc_ecma_utils::{drop_span, DropSpan};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, FoldWith, Node, Visit, VisitMut, VisitMutWith, VisitWith,
};

pub(crate) struct Debugger {}

impl VisitMut for Debugger {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if !cfg!(feature = "debug") {
            return;
        }

        if n.span.ctxt == SyntaxContext::empty() {
            return;
        }

        n.sym = format!("{}{:?}", n.sym, n.span.ctxt).into();
        n.span.ctxt = SyntaxContext::empty();
    }

    fn visit_mut_str_kind(&mut self, n: &mut StrKind) {
        if !cfg!(feature = "debug") {
            return;
        }

        *n = Default::default();
    }
}

pub(crate) fn dump<N>(node: &N) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan> + VisitMutWith<Debugger>,
{
    if !cfg!(feature = "debug") {
        return String::new();
    }

    let mut node = node.clone();
    node.visit_mut_with(&mut Debugger {});
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

    if cfg!(debug_assertions) {
        module.visit_with(&Invalid { span: DUMMY_SP }, &mut AssertValid);
    }

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

    tracing::info!(
        "[SWC_RUN]\n{}\n{}",
        code,
        String::from_utf8_lossy(&output.stdout)
    )
}

pub(crate) struct AssertValid;

impl Visit for AssertValid {
    noop_visit_type!();

    fn visit_invalid(&mut self, _: &Invalid, _: &dyn Node) {
        panic!("[SWC_RUN] Invalid node found");
    }

    fn visit_setter_prop(&mut self, p: &SetterProp, _: &dyn Node) {
        p.body.visit_with(p, self);
    }

    fn visit_tpl(&mut self, l: &Tpl, _: &dyn Node) {
        l.visit_children_with(self);

        assert_eq!(l.exprs.len() + 1, l.quasis.len());
    }
}
