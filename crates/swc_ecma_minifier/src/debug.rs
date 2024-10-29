use std::{
    io::Write,
    process::{Command, Stdio},
};

use swc_common::{sync::Lrc, SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene};
pub use swc_ecma_transforms_optimization::{debug_assert_valid, AssertValid};
use swc_ecma_utils::{drop_span, DropSpan};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use tracing::debug;

pub(crate) struct Debugger {}

impl VisitMut for Debugger {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if !cfg!(feature = "debug") {
            return;
        }

        if n.ctxt == SyntaxContext::empty() {
            return;
        }

        n.sym = format!("{}{:?}", n.sym, n.ctxt).into();
        n.ctxt = SyntaxContext::empty();
    }
}

pub(crate) fn dump<N>(node: &N, force: bool) -> String
where
    N: swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan> + VisitMutWith<Debugger>,
{
    if !force {
        #[cfg(not(feature = "debug"))]
        {
            return String::new();
        }
    }

    let mut node = node.clone();
    node.visit_mut_with(&mut Debugger {});
    node = drop_span(node);
    let mut buf = Vec::new();
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
pub(crate) fn invoke_module(module: &Module) {
    debug_assert_valid(module);

    let _noop_sub = tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

    let should_run =
        cfg!(debug_assertions) && cfg!(feature = "debug") && option_env!("SWC_RUN") == Some("1");
    let should_check = cfg!(debug_assertions) && option_env!("SWC_CHECK") == Some("1");

    if !should_run && !should_check {
        return;
    }

    let module = Program::Module(module.clone())
        .apply(hygiene())
        .apply(fixer(None));
    let module = drop_span(module);

    let mut buf = Vec::new();
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        emitter.emit_program(&module).unwrap();
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
            .arg("--input-type=module")
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

/// Invokes code using node.js.
///
/// If the cargo feature `debug` is disabled or the environment variable
/// `SWC_RUN` is not `1`, this function is noop.
pub(crate) fn invoke_script(script: &Script) {
    debug_assert_valid(script);

    let _noop_sub = tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

    let should_run =
        cfg!(debug_assertions) && cfg!(feature = "debug") && option_env!("SWC_RUN") == Some("1");
    let should_check = cfg!(debug_assertions) && option_env!("SWC_CHECK") == Some("1");

    if !should_run && !should_check {
        return;
    }

    let script = Program::Script(script.clone())
        .apply(hygiene())
        .apply(fixer(None));
    let script = drop_span(script);

    let mut buf = Vec::new();
    let cm = Lrc::new(SourceMap::default());

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        emitter.emit_program(&script).unwrap();
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
