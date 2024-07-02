#![cfg(feature = "flow")]
#![allow(clippy::needless_update)]

use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, FlowSyntax, PResult, Parser, Syntax};
use testing::StdErr;

#[testing::fixture("tests/flow/**/*.js")]
fn spec(file: PathBuf) {
    run_spec(&file);
}

#[derive(Debug, Deserialize)]
struct Spec {
    #[serde(default)]
    errors: Vec<SpecError>,
}

#[derive(Debug, Deserialize)]
struct SpecError {
    #[serde(default)]
    start: SpecLoc,
    #[serde(default)]
    end: SpecLoc,

    #[serde(default)]
    message: String,
}

#[derive(Debug, Default, Deserialize)]
struct SpecLoc {}

impl Spec {
    fn read(file: &Path) -> Self {
        let mut buf = String::new();
        File::open(file).unwrap().read_to_string(&mut buf).unwrap();

        serde_json::from_str(&buf).unwrap()
    }
}

const IGNORED: &[&str] = &[
    "invalid identifier",
    "reserved word",
    "eval or arguments",
    "Duplicate export",
];

fn run_spec(file: &Path) {
    let spec_json = file.parent().unwrap().join(format!(
        "{}.tree.json",
        file.file_stem().unwrap().to_string_lossy()
    ));
    let output_json = file.parent().unwrap().join(format!(
        "{}.output.json",
        file.file_stem().unwrap().to_string_lossy()
    ));

    let mut spec = Spec::read(&spec_json);
    let all_error_count = spec.errors.len();

    spec.errors
        .retain(|err| !IGNORED.iter().any(|ignored| err.message.contains(ignored)));

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

    let result = with_parser(file, false, |p, _| {
        let program = p.parse_program()?;

        let json =
            serde_json::to_string_pretty(&program).expect("failed to serialize module as json");

        if StdErr::from(json).compare_to_file(output_json).is_err() {
            panic!()
        }

        Ok(())
    });

    if result.is_ok() {
        if !spec.errors.is_empty() {
            panic!("parsing suceeded but it should have failed")
        }
    } else if all_error_count == 0 {
        result.expect("failed to parse");
    }
}

fn with_parser<F, Ret>(file_name: &Path, shift: bool, f: F) -> Result<Ret, StdErr>
where
    F: FnOnce(&mut Parser<Lexer>, &SingleThreadedComments) -> PResult<Ret>,
{
    ::testing::run_test(false, |cm, handler| {
        if shift {
            cm.new_source_file(FileName::Anon, "".into());
        }

        let comments = SingleThreadedComments::default();

        let fm = cm
            .load_file(file_name)
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name.display(), e));

        let lexer = Lexer::new(
            Syntax::Flow(FlowSyntax {}),
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
