#![allow(clippy::vec_box)]

use anyhow::{anyhow, Context, Error};
use serde::Serialize;
use swc_common::{
    errors::HANDLER, sync::Lrc, FileName, FilePathMapping, Globals, Mark, SourceFile, SourceMap,
    GLOBALS,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver;
use swc_ecma_visit::VisitMutWith;
use swc_estree_ast::flavor::Flavor;
use swc_estree_compat::babelify::Babelify;
use swc_timer::timer;

use crate::reducer::ast_reducer;

pub mod reducer;

#[derive(Serialize)]
pub struct AstOutput {
    pub ast: String,
    pub src: Option<Lrc<String>>,
}

pub fn process_file<F>(load_file: F, include_src: bool) -> Result<AstOutput, Error>
where
    F: FnOnce(&Lrc<SourceMap>) -> Result<Lrc<SourceFile>, Error>,
{
    let globals = Globals::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let fm = load_file(&cm).context("failed to load file")?;

    // Default
    let syntax = Syntax::Es(EsConfig {
        jsx: true,
        ..Default::default()
    });
    let syntax = match &fm.name {
        FileName::Real(path) => match path.extension() {
            Some(ext) => {
                if ext == "tsx" {
                    Syntax::Typescript(TsConfig {
                        tsx: true,
                        no_early_errors: true,
                        ..Default::default()
                    })
                } else if ext == "ts" {
                    Syntax::Typescript(TsConfig {
                        no_early_errors: true,
                        ..Default::default()
                    })
                } else {
                    syntax
                }
            }
            _ => syntax,
        },
        _ => syntax,
    };

    let module = {
        parse_file_as_module(&fm, syntax, EsVersion::latest(), None, &mut vec![]).map_err(
            |err| {
                HANDLER.with(|h| {
                    err.into_diagnostic(h).emit();
                    anyhow!("failed to parse module")
                })
            },
        )?
    };

    let ast = GLOBALS.set(&globals, || webpack_ast(cm.clone(), fm.clone(), module))?;

    Ok(AstOutput {
        ast,
        src: if include_src {
            Some(fm.src.clone())
        } else {
            None
        },
    })
}

/// `n` is expected to be pure (`resolver` is not applied)
pub fn webpack_ast(
    cm: Lrc<SourceMap>,
    fm: Lrc<SourceFile>,
    mut n: Module,
) -> Result<String, Error> {
    let _timer = timer!("webpack_ast");

    Flavor::Acorn {
        extra_comments: true,
    }
    .with(|| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        {
            let _timer = timer!("resolver");
            n.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));
        }

        {
            n.visit_mut_with(&mut ast_reducer(unresolved_mark));
        }

        let ctx = swc_estree_compat::babelify::Context {
            fm,
            cm: cm.clone(),
            comments: Default::default(),
        };

        let babel_ast = {
            let _timer = timer!("babelify");
            n.babelify(&ctx)
        };

        let _timer = timer!("acorn ast to json");
        serde_json::to_string(&babel_ast).context("failed to serialize babel ast")
    })
}
