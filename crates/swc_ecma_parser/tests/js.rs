#![allow(clippy::needless_update)]

use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, PResult, Parser, Syntax};
use swc_ecma_visit::FoldWith;
use testing::StdErr;

use crate::common::Normalizer;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/js/**/*.js")]
fn spec(file: PathBuf) {
    let output = file.parent().unwrap().join(format!(
        "{}.json",
        file.file_name().unwrap().to_string_lossy()
    ));
    run_spec(&file, &output);
}

fn run_spec(file: &Path, output_json: &Path) {
    let file_name = file
        .display()
        .to_string()
        .replace("\\\\", "/")
        .replace('\\', "/");

    {
        // Drop to reduce memory usage.
        //
        // Because the test suite contains lots of test cases, it results in oom in
        // github actions.
        let input = {
            let mut buf = String::new();
            File::open(file).unwrap().read_to_string(&mut buf).unwrap();
            buf
        };

        eprintln!(
            "\n\n========== Running reference test {}\nSource:\n{}\n",
            file_name, input
        );
    }

    with_parser(false, file, false, |p, _| {
        let program = p.parse_program()?.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        let json =
            serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

        if StdErr::from(json).compare_to_file(output_json).is_err() {
            panic!()
        }

        Ok(())
    })
    .map_err(|_| ())
    .unwrap();
}

fn with_parser<F, Ret>(
    treat_error_as_bug: bool,
    file_name: &Path,
    shift: bool,
    f: F,
) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer>, &SingleThreadedComments) -> PResult<Ret>,
{
    ::testing::run_test(treat_error_as_bug, |cm, handler| {
        if shift {
            cm.new_source_file(FileName::Anon.into(), "".into());
        }

        let comments = SingleThreadedComments::default();

        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                explicit_resource_management: true,
                import_attributes: true,
                decorators: true,
                ..Default::default()
            }),
            EsVersion::Es2015,
            (&*fm).into(),
            Some(&comments),
        );

        let mut p = Parser::new_from(lexer);

        let res = f(&mut p, &comments).map_err(|e| e.into_diagnostic(handler).emit());

        for err in p.take_errors() {
            err.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        res
    })
}
