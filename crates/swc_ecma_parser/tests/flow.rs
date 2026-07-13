#![allow(clippy::needless_update)]
#![cfg(feature = "flow")]

use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};

use swc_common::comments::SingleThreadedComments;
use swc_ecma_ast::*;
use swc_ecma_parser::{attach_comments, FlowSyntax, ModuleKind, Parser, SourceType, Syntax};
use swc_ecma_visit::FoldWith;
use testing::StdErr;

use crate::common::{assert_json_ast_matches_file, Normalizer};

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/flow/**/*.js")]
fn spec(file: PathBuf) {
    let output = file.parent().unwrap().join(format!(
        "{}.json",
        file.file_name().unwrap().to_string_lossy()
    ));
    let config_path = file.parent().unwrap().join("config.json");

    run_spec(&file, &output, &config_path);
}

fn run_spec(file: &Path, output_json: &Path, config_path: &Path) {
    let file_name = file
        .display()
        .to_string()
        .replace("\\\\", "/")
        .replace('\\', "/");

    {
        let input = {
            let mut buf = String::new();
            File::open(file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!("\n\n========== Running flow test {file_name}\nSource:\n{input}\n");
    }

    with_parser(false, file, config_path, |program, _| {
        let program = program.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        let json = serde_json::to_string_pretty(&program).expect("failed to serialize as json");
        assert_json_ast_matches_file(&json, output_json);

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

fn with_parser<F, Ret>(
    treat_error_as_bug: bool,
    file_name: &Path,
    config_path: &Path,
    f: F,
) -> Result<Ret, StdErr>
where
    F: FnOnce(Program, &SingleThreadedComments) -> Result<Ret, ()>,
{
    ::testing::run_test(treat_error_as_bug, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let is_jsx = file_name
            .extension()
            .map(|ext| ext == "jsx")
            .unwrap_or_default();

        let syntax = {
            let mut config_str = String::new();
            File::open(config_path)
                .ok()
                .and_then(|mut file| file.read_to_string(&mut config_str).ok())
                .and_then(|_| serde_json::from_str::<FlowSyntax>(&config_str).ok())
        }
        .map(|mut flow| {
            flow.jsx |= is_jsx;
            flow
        })
        .unwrap_or_else(|| FlowSyntax {
            jsx: is_jsx,
            ..Default::default()
        });

        let (source_type, options) = SourceType::from_legacy(
            Syntax::Flow(syntax),
            ModuleKind::Unambiguous,
            EsVersion::Es2015,
        );
        let mut result = Parser::new(&fm.src, source_type)
            .with_options(options)
            .with_start_pos(fm.start_pos)
            .with_tokens()
            .parse();
        attach_comments(
            &fm.src,
            fm.start_pos,
            &comments,
            std::mem::take(&mut result.comments),
            &result.tokens,
            &result.program,
        );
        for error in result.diagnostics {
            error.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        f(result.program, &comments)
    })
}

#[testing::fixture("tests/flow-errors/**/*.js")]
fn errors(file: PathBuf) {
    let file_name = file.display().to_string();
    let config_path = file.parent().unwrap().join("config.json");

    {
        let input = {
            let mut buf = String::new();
            File::open(&file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!("\n\n========== Running flow error test {file_name}\nSource:\n{input}\n");
    }

    let outcome = with_parser(false, &file, &config_path, |program, _| Ok(program));
    assert!(outcome.is_err(), "should fail, but parsed as");
}
