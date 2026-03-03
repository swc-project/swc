use std::path::Path;

use swc_common::{comments::SingleThreadedComments, input::StringInput, FileName, SourceMap};
use swc_es_parser::{
    lexer::Lexer, parse_file_as_program, parse_file_as_script, ErrorCode, EsSyntax, Parser, Syntax,
    TsSyntax,
};

fn parse_fixture(path: &Path, syntax: Syntax) {
    testing::run_test(false, |cm, _handler| {
        let fm = cm
            .load_file(path)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

        let comments = SingleThreadedComments::default();
        let mut recovered = Vec::new();
        let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
            .unwrap_or_else(|err| panic!("failed to parse fixture {}: {:?}", path.display(), err));

        let program = parsed
            .store
            .program(parsed.program)
            .expect("program should exist");
        assert!(!program.body.is_empty() || recovered.is_empty());

        Ok(())
    })
    .unwrap();
}

#[test]
fn parses_reused_js_fixture() {
    parse_fixture(
        Path::new("../swc_ecma_parser/tests/js/issue-11214/input.js"),
        Syntax::Es(EsSyntax {
            explicit_resource_management: true,
            ..Default::default()
        }),
    );
}

#[test]
fn parses_reused_module_fixture() {
    parse_fixture(
        Path::new("../swc_ecma_parser/tests/js/import-attributes/valid-export-function/input.js"),
        Syntax::Es(EsSyntax {
            import_attributes: true,
            ..Default::default()
        }),
    );
}

#[test]
fn parses_reused_typescript_fixture() {
    parse_fixture(
        Path::new("../swc_ecma_parser/tests/typescript/type-alias/plain/input.ts"),
        Syntax::Typescript(TsSyntax::default()),
    );
}

#[test]
fn lexer_and_parser_api_bootstrap() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom("api.ts".into()).into(), "let a = 1;");

    let lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);
    let mut parser = Parser::new_from(lexer);

    let parsed = parser.parse_program().expect("program should parse");
    assert_eq!(
        parsed
            .store
            .program(parsed.program)
            .expect("program should exist")
            .body
            .len(),
        1
    );
}

#[test]
fn parse_file_as_program_returns_err_for_fatal_error() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom("fatal.js".into()).into(), "const = 1;");

    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let result = parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax::default()),
        Some(&comments),
        &mut recovered,
    );

    assert!(result.is_err());
}

#[test]
fn parse_file_as_script_collects_recovered_errors() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom("recover.js".into()).into(), "return 1;");

    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let result = parse_file_as_script(
        &fm,
        Syntax::Es(EsSyntax::default()),
        Some(&comments),
        &mut recovered,
    );

    assert!(result.is_ok());
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::ReturnOutsideFunction)));
}
