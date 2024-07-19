use std::{
    io::Write,
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use flate2::{write::ZlibEncoder, Compression};
use swc_common::{comments::SingleThreadedComments, errors::HANDLER, Mark, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_codegen::text_writer::{omit_trailing_semi, JsWriter, WriteJs};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::VisitMutWith;

pub mod minifier;

/// Type annotation
pub fn wrap_task<T, F>(op: F) -> Result<T>
where
    F: FnOnce() -> Result<T>,
{
    op()
}

pub fn gzipped_size(code: &str) -> usize {
    let mut e = ZlibEncoder::new(Vec::new(), Compression::new(9));
    e.write_all(code.as_bytes()).unwrap();
    let compressed_bytes = e.finish().unwrap();
    compressed_bytes.len()
}

pub fn make_pretty(f: &Path) -> Result<()> {
    let mut c = Command::new("npx");
    c.stderr(Stdio::inherit());
    c.arg("js-beautify").arg("--replace").arg(f);

    let output = c.output().context("failed to run prettier")?;

    if !output.status.success() {
        bail!("prettier failed");
    }

    Ok(())
}

pub fn parse_js(fm: Arc<SourceFile>) -> Result<ModuleRecord> {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut errors = Vec::new();
    let comments = SingleThreadedComments::default();
    let res = parse_file_as_module(
        &fm,
        Syntax::Es(Default::default()),
        EsVersion::latest(),
        Some(&comments),
        &mut errors,
    )
    .map_err(|err| HANDLER.with(|handler| err.into_diagnostic(handler).emit()));

    for err in errors {
        HANDLER.with(|handler| err.into_diagnostic(handler).emit());
    }

    let mut m = match res {
        Ok(v) => v,
        Err(()) => bail!("failed to parse a js file as a module"),
    };

    m.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

    Ok(ModuleRecord {
        module: m,
        comments,
        top_level_mark,
        unresolved_mark,
    })
}

pub fn print_js(cm: Arc<SourceMap>, m: &Module, minify: bool) -> Result<String> {
    let mut buf = Vec::new();

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;
        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut e = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(true),
            cm,
            comments: None,
            wr,
        };

        e.emit_module(m).unwrap();
    }

    String::from_utf8(buf).context("swc emitted non-utf8 output")
}

#[derive(Debug, Clone)]
pub struct ModuleRecord {
    pub module: Module,
    pub comments: SingleThreadedComments,
    pub top_level_mark: Mark,
    pub unresolved_mark: Mark,
}

pub fn all_js_files(path: &Path) -> Result<Vec<PathBuf>> {
    wrap_task(|| {
        if path.is_dir() {
            let mut files = Vec::new();
            for entry in path.read_dir().context("failed to read dir")? {
                let entry = entry.context("read_dir returned an error")?;
                let path = entry.path();
                files.extend(all_js_files(&path)?);
            }
            Ok(files)
        } else if path.extension() == Some("js".as_ref()) {
            Ok(vec![path.to_path_buf()])
        } else {
            Ok(Vec::new())
        }
    })
    .with_context(|| format!("failed to get list of `.js` files in {}", path.display()))
}

pub(crate) struct ChildGuard(pub Child);

impl Drop for ChildGuard {
    fn drop(&mut self) {
        if let Err(e) = self.0.kill() {
            eprintln!("Could not kill child process: {}", e)
        }
    }
}
