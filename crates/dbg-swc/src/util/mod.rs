use std::sync::Arc;

use anyhow::{bail, Context, Result};
use swc_common::{errors::HANDLER, Mark, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_codegen::text_writer::{omit_trailing_semi, JsWriter, WriteJs};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::VisitMutWith;

/// Type annotation
pub fn wrap_task<T, F>(op: F) -> Result<T>
where
    F: FnOnce() -> Result<T>,
{
    op()
}

pub fn parse_js(fm: Arc<SourceFile>) -> Result<ModuleRecord> {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut errors = vec![];
    let res = parse_file_as_module(
        &fm,
        Syntax::Es(Default::default()),
        EsVersion::latest(),
        None,
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
        top_level_mark,
        unresolved_mark,
    })
}

pub fn print_js(cm: Arc<SourceMap>, m: &Module, minify: bool) -> Result<String> {
    let mut buf = vec![];

    {
        let mut wr = box JsWriter::new(cm.clone(), "\n", &mut buf, None) as Box<dyn WriteJs>;
        if minify {
            wr = box omit_trailing_semi(wr);
        }

        let mut e = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr,
        };

        e.emit_module(m).unwrap();
    }

    String::from_utf8(buf).context("swc emitted non-utf8 output")
}

#[derive(Debug)]
pub struct ModuleRecord {
    pub module: Module,
    pub top_level_mark: Mark,
    pub unresolved_mark: Mark,
}
