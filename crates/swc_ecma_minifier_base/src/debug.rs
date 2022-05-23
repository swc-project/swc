#![cfg_attr(not(debug_assertions), allow(unused))]

use std::{
    fmt::Debug,
    io::Write,
    mem::forget,
    process::{Command, Stdio},
};

use swc_common::{sync::Lrc, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene};
use swc_ecma_utils::{drop_span, DropSpan};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, FoldWith, Visit, VisitMut, VisitMutWith, VisitWith,
};
use tracing::debug;

pub struct Debugger {}

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
}

pub fn dump<N>(node: &N, force: bool) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan> + VisitMutWith<Debugger>,
{
    if !force && !cfg!(feature = "debug") {
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
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        node.emit_with(&mut emitter).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

/// Invokes code using node.js.
///
/// If the cargo feature `debug` is disabled or the environment variable
/// `SWC_RUN` is not `1`, this function is noop.
pub fn invoke(module: &Module) {
    if cfg!(debug_assertions) {
        module.visit_with(&mut AssertValid);
    }

    let should_run =
        cfg!(debug_assertions) && cfg!(feature = "debug") && option_env!("SWC_RUN") == Some("1");
    let should_check = cfg!(debug_assertions) && option_env!("SWC_CHECK") == Some("1");

    if !should_run && !should_check {
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
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        emitter.emit_module(&module).unwrap();
    }

    let code = String::from_utf8(buf).unwrap();

    debug!("Validating with node.js:\n{}", code);

    if should_check {
        let mut child = Command::new("node")
            .arg("-")
            .arg("--check")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .expect("failed to spawn node");

        {
            let child_stdin = child.stdin.as_mut().unwrap();
            child_stdin
                .write_all(code.as_bytes())
                .expect("failed to write");
        }

        let output = child.wait_with_output().expect("failed to check syntax");

        if !output.status.success() {
            panic!(
                "[SWC_CHECK] Failed to validate code:\n{}\n===== ===== ===== ===== =====\n{}\n{}",
                code,
                String::from_utf8_lossy(&output.stdout),
                String::from_utf8_lossy(&output.stderr),
            );
        }
    } else {
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
}

#[cfg(debug_assertions)]
struct Ctx<'a> {
    v: &'a dyn Debug,
}

#[cfg(debug_assertions)]
impl Drop for Ctx<'_> {
    fn drop(&mut self) {
        eprintln!("Context: {:?}", self.v);
    }
}

pub(crate) struct AssertValid;

impl Visit for AssertValid {
    noop_visit_type!();

    #[cfg(debug_assertions)]
    fn visit_expr(&mut self, n: &Expr) {
        let ctx = Ctx { v: n };
        n.visit_children_with(self);
        forget(ctx);
    }

    #[cfg(debug_assertions)]
    fn visit_invalid(&mut self, _: &Invalid) {
        panic!("Invalid node found");
    }

    #[cfg(debug_assertions)]
    fn visit_number(&mut self, n: &Number) {
        assert!(!n.value.is_nan(), "NaN should be an identifier");
    }

    #[cfg(debug_assertions)]
    fn visit_setter_prop(&mut self, p: &SetterProp) {
        p.body.visit_with(self);
    }

    #[cfg(debug_assertions)]
    fn visit_stmt(&mut self, n: &Stmt) {
        let ctx = Ctx { v: n };
        n.visit_children_with(self);
        forget(ctx);
    }

    #[cfg(debug_assertions)]
    fn visit_tpl(&mut self, l: &Tpl) {
        l.visit_children_with(self);

        assert_eq!(l.exprs.len() + 1, l.quasis.len());
    }

    #[cfg(debug_assertions)]
    fn visit_var_declarators(&mut self, v: &[VarDeclarator]) {
        v.visit_children_with(self);

        if v.is_empty() {
            panic!("Found empty var declarators");
        }
    }
}
