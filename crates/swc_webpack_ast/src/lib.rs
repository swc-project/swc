use std::path::Path;

use crate::reducer::ast_reducer;
use anyhow::{Context, Error};
use swc_common::{sync::Lrc, FilePathMapping, Globals, Mark, SourceFile, SourceMap, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver::resolver_with_mark;
use swc_ecma_visit::VisitMutWith;
use swc_estree_ast::flavor::Flavor;
use swc_estree_compat::babelify::Babelify;
use swc_timer::timer;

pub mod reducer;

pub fn parse_file_as_webpack_ast(path: &Path) -> Result<String, Error> {
    let globals = Globals::new();
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let fm = cm
        .load_file(&path)
        .with_context(|| format!("failed to load file at `{}`", path.display()))?;

    let syntax = match path.extension() {
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
                Syntax::Es(EsConfig {
                    jsx: true,
                    ..Default::default()
                })
            }
        }
        None => Default::default(),
    };

    let module = {
        let lexer = Lexer::new(syntax, EsVersion::latest(), StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);

        parser.parse_module().map_err(|err| {
            // err.into_diagnostic(handler).emit();
            anyhow::anyhow!("failed to parse module")
        })?
    };

    GLOBALS.set(&globals, || webpack_ast(cm.clone(), fm, module))
}

/// `n` is expected to be pure (`resolver` is not applied)
pub fn webpack_ast(
    cm: Lrc<SourceMap>,
    fm: Lrc<SourceFile>,
    mut n: Module,
) -> Result<String, Error> {
    let _timer = timer!("webpack_ast");
    let top_level_mark = Mark::fresh(Mark::root());

    Flavor::Acorn {
        extra_comments: true,
    }
    .with(|| {
        {
            let _timer = timer!("resolver");
            n.visit_mut_with(&mut resolver_with_mark(top_level_mark));
        }
        {
            n.visit_mut_with(&mut ast_reducer(top_level_mark));
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
