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

fn parse_program_with_recovered(src: &str) -> (bool, Vec<swc_es_parser::Error>) {
    parse_program_with_syntax(src, Syntax::Es(EsSyntax::default()))
}

fn parse_program_with_syntax(src: &str, syntax: Syntax) -> (bool, Vec<swc_es_parser::Error>) {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom("inline.js".into()).into(), src.to_string());
    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let fatal = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered).is_err();
    (fatal, recovered)
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

#[test]
fn rejects_invalid_escape_sequences() {
    let (fatal, recovered) = parse_program_with_recovered("'\\8'; '\\9';");
    assert!(!fatal);
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::InvalidEscape)));
}

#[test]
fn rejects_legacy_octal_escape_in_use_strict_prologue() {
    let (fatal, recovered) = parse_program_with_recovered("\"\\1\"; 'use strict';");
    assert!(!fatal);
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::StrictModeViolation)));
}

#[test]
fn rejects_unicode_regex_decimal_escape() {
    let (fatal, recovered) = parse_program_with_recovered("/\\1/u;");
    assert!(!fatal);
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::InvalidRegex)));
}

#[test]
fn rejects_invalid_for_of_lhs_with_let_member() {
    let (fatal, recovered) = parse_program_with_recovered("for(let.a of 0);");
    assert!(fatal || !recovered.is_empty());
}

#[test]
fn rejects_invalid_arrow_member_binding() {
    let (fatal, recovered) = parse_program_with_recovered("({e: a.b}) => 0;");
    assert!(fatal || !recovered.is_empty());
}

#[test]
fn rejects_array_rest_followed_by_comma() {
    let (fatal, recovered) = parse_program_with_recovered("[...a,] = b;");
    assert!(fatal || !recovered.is_empty());
}

#[test]
fn accepts_new_target_with_escaped_target_identifier() {
    let (fatal, recovered) =
        parse_program_with_recovered("function f(){ return new.\\u0074arget; }");
    assert!(!fatal);
    assert!(recovered.is_empty());
}

#[test]
fn parses_async_generic_arrow_fixture() {
    parse_fixture(
        Path::new("../swc_ecma_parser/tests/typescript/arrow-function/async-generic/input.ts"),
        Syntax::Typescript(TsSyntax::default()),
    );
}

#[test]
fn parses_async_generic_false_positive_fixture() {
    parse_fixture(
        Path::new(
            "../swc_ecma_parser/tests/typescript/arrow-function/async-generic-false-positive/\
             input.ts",
        ),
        Syntax::Typescript(TsSyntax::default()),
    );
}

#[test]
fn parses_using_lookahead_fixtures() {
    parse_fixture(
        Path::new(
            "../swc_ecma_parser/tests/js/explicit-resource-management/\
             valid-using-as-identifier-for-of/input.js",
        ),
        Syntax::Es(EsSyntax {
            explicit_resource_management: true,
            ..Default::default()
        }),
    );
    parse_fixture(
        Path::new(
            "../swc_ecma_parser/tests/js/explicit-resource-management/valid-using-binding-using/\
             input.js",
        ),
        Syntax::Es(EsSyntax {
            explicit_resource_management: true,
            ..Default::default()
        }),
    );
}

#[test]
fn parses_let_for_head_variants() {
    let (fatal_for_of, recovered_for_of) = parse_program_with_syntax(
        "for (let item of items) { item; }",
        Syntax::Es(EsSyntax::default()),
    );
    assert!(!fatal_for_of);
    assert!(recovered_for_of.is_empty());

    let (fatal_for_in, recovered_for_in) = parse_program_with_syntax(
        "for (let key in obj) { key; }",
        Syntax::Es(EsSyntax::default()),
    );
    assert!(!fatal_for_in);
    assert!(recovered_for_in.is_empty());
}

#[test]
fn parses_typescript_import_type_fixture() {
    parse_fixture(
        Path::new("../swc_ecma_parser/tests/typescript/custom/import-type/typeof/simple/input.ts"),
        Syntax::Typescript(TsSyntax::default()),
    );
}

#[test]
fn rejects_duplicate_regex_flags() {
    let (fatal, recovered) = parse_program_with_recovered("/a/gg;");
    assert!(!fatal);
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::InvalidRegex)));
}

#[test]
fn rejects_unknown_regex_flag() {
    let (fatal, recovered) = parse_program_with_recovered("/a/z;");
    assert!(!fatal);
    assert!(recovered
        .iter()
        .any(|error| matches!(error.code(), ErrorCode::InvalidRegex)));
}
