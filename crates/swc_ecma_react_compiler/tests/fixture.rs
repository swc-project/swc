use std::{fs, path::PathBuf};

use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax};
use swc_ecma_react_compiler::{
    compile_program, default_options, CompilerPass, DynamicGatingOptions,
};

fn parse(input: &PathBuf) -> Program {
    let cm = Lrc::new(SourceMap::default());
    let source = fs::read_to_string(input).unwrap();
    let fm = cm.new_source_file(FileName::Real(input.clone()).into(), source);

    Program::Module(
        parse_file_as_module(
            &fm,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut vec![],
        )
        .unwrap(),
    )
}

fn print(program: &Program) -> String {
    let cm = Lrc::new(SourceMap::default());
    let mut out = Vec::new();
    {
        let wr = JsWriter::new(cm.clone(), "\n", &mut out, None);
        let mut emitter = Emitter {
            cfg: Default::default(),
            comments: None,
            cm,
            wr,
        };
        emitter.emit_program(program).unwrap();
    }
    String::from_utf8(out).unwrap()
}

fn normalize(value: &str) -> String {
    value.replace("\r\n", "\n").trim().to_string()
}

fn run_fixture(input: PathBuf) {
    let mut program = parse(&input);
    let expected_output = input.with_file_name("output.js");
    let expected_error = input.with_file_name("error.txt");

    let mut options = default_options();
    options.dynamic_gating = Some(DynamicGatingOptions {
        source: "feature-flags".into(),
    });

    let result = compile_program(
        &mut program,
        &CompilerPass {
            opts: options,
            filename: Some(input.to_string_lossy().to_string()),
            comments: Vec::new(),
            code: None,
        },
    );

    if expected_error.exists() {
        let expected = fs::read_to_string(expected_error).unwrap();

        match result {
            Ok(report) => {
                let joined = report
                    .diagnostics
                    .iter()
                    .map(|detail| detail.reason.clone())
                    .collect::<Vec<_>>()
                    .join("\n");
                assert!(
                    normalize(&joined).contains(&normalize(&expected)),
                    "expected error fragment not found: {expected}\nactual:\n{joined}"
                );
            }
            Err(err) => {
                assert!(
                    normalize(&err.to_string()).contains(&normalize(&expected)),
                    "expected error fragment not found: {expected}\nactual:\n{err}",
                );
            }
        }

        return;
    }

    result.unwrap();

    let expected = fs::read_to_string(expected_output).unwrap();
    let actual = print(&program);

    assert_eq!(normalize(&actual), normalize(&expected));
}

#[test]
fn fixture_cases() {
    let fixture_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");

    let mut inputs = Vec::new();
    for entry in fs::read_dir(&fixture_root).unwrap() {
        let entry = entry.unwrap();
        if !entry.file_type().unwrap().is_dir() {
            continue;
        }

        let input = entry.path().join("input.js");
        if input.exists() {
            inputs.push(input);
        }
    }

    inputs.sort();
    assert!(!inputs.is_empty(), "no fixture input.js files were found");

    for input in inputs {
        run_fixture(input);
    }
}
