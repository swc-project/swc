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
#[testing::fixture("tests/js/**/*.cjs")]
fn spec(file: PathBuf) {
    let output = file.parent().unwrap().join(format!(
        "{}.json",
        file.file_name().unwrap().to_string_lossy()
    ));
    let config_path = file.parent().unwrap().join("config.json");
    run_spec(&file, &output, &config_path);
}

fn run_spec(file: &Path, output_json: &Path, config_path: &Path) {
    let is_commonjs = file.extension().map(|ext| ext == "cjs").unwrap_or_default();

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

        eprintln!("\n\n========== Running reference test {file_name}\nSource:\n{input}\n");
    }

    with_parser(false, file, false, config_path, |p, _| {
        let program = if is_commonjs {
            p.parse_commonjs().map(Program::Script)?
        } else {
            p.parse_program()?
        };

        let program = program.fold_with(&mut Normalizer {
            drop_span: false,
            is_test262: false,
        });

        // json
        {
            let json =
                serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

            if StdErr::from(json).compare_to_file(output_json).is_err() {
                panic!()
            }
        }

        // cbor
        {
            use cbor4ii::core::{
                dec::Decode,
                enc::Encode,
                utils::{BufWriter, SliceReader},
            };

            let mut buf = BufWriter::new(Vec::new());
            program.encode(&mut buf).unwrap();

            let buf = buf.into_inner();
            let mut buf = SliceReader::new(buf.as_slice());
            let _program = Program::decode(&mut buf).unwrap();
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
    config_path: &Path,
    f: F,
) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer>, &SingleThreadedComments) -> PResult<Ret>,
{
    ::testing::run_test(treat_error_as_bug, |cm, handler| {
        if shift {
            cm.new_source_file(FileName::Anon.into(), "");
        }

        let comments = SingleThreadedComments::default();

        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        // Try to load EsSyntax configuration from config.json in the same directory as
        // the test file
        let syntax = {
            let mut config_str = String::new();
            File::open(config_path)
                .ok()
                .and_then(|mut file| file.read_to_string(&mut config_str).ok())
                .and_then(|_| serde_json::from_str::<EsSyntax>(&config_str).ok())
        }
        .map(Syntax::Es)
        .unwrap_or_else(|| {
            eprintln!(
                "Failed to load or parse {}, using default configuration",
                config_path.display()
            );
            Syntax::Es(EsSyntax {
                explicit_resource_management: true,
                import_attributes: true,
                decorators: true,
                ..Default::default()
            })
        });

        let lexer = Lexer::new(syntax, EsVersion::Es2015, (&*fm).into(), Some(&comments));

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
