use rustc_hash::FxHashMap;
use serde_json::Value;
use swc_common::{sync::Lrc, FileName, FilePathMapping, SourceMap};
use swc_compiler_base::{print, IdentCollector, PrintArgs, SourceMapsConfig};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::Config as CodegenConfig;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, Syntax};
use swc_ecma_visit::VisitWith;

fn parse_program(cm: Lrc<SourceMap>, src: &str) -> Program {
    let fm = cm.new_source_file(FileName::Real("input.js".into()).into(), src.to_owned());
    let lexer = Lexer::new(
        Syntax::Es(EsSyntax::default()),
        EsVersion::Es2022,
        (&*fm).into(),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    Program::Module(parser.parse_module().expect("module should parse"))
}

fn print_map(
    emit_source_map_scopes: bool,
    orig: Option<swc_sourcemap::SourceMap>,
) -> (Value, swc_sourcemap::SourceMap) {
    let cm: Lrc<SourceMap> = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let program = parse_program(cm.clone(), "function foo(a){let b=a;return b}");

    let mut names = IdentCollector {
        names: FxHashMap::default(),
    };
    program.visit_with(&mut names);

    let output = print(
        cm,
        &program,
        PrintArgs {
            source_file_name: Some("input.js"),
            inline_sources_content: true,
            source_map: SourceMapsConfig::Bool(true),
            source_map_names: &names.names,
            orig,
            emit_source_map_scopes,
            codegen_config: CodegenConfig::default().with_target(EsVersion::Es2022),
            ..Default::default()
        },
    )
    .expect("print should succeed");
    let map_text = output.map.expect("source map should be emitted");
    let map = swc_sourcemap::SourceMap::from_slice(map_text.as_bytes()).expect("valid source map");
    let map_json: Value = serde_json::from_str(&map_text).expect("valid source map json");

    (map_json, map)
}

#[test]
fn emits_scopes_when_enabled() {
    let (map_json, map) = print_map(true, None);
    assert!(map_json.get("scopes").and_then(|v| v.as_str()).is_some());
    assert!(map.get_scopes().is_some());
}

#[test]
fn skips_scopes_when_disabled() {
    let (map_json, map) = print_map(false, None);
    assert!(map_json.get("scopes").is_none());
    assert!(map.get_scopes().is_none());
}

#[test]
fn skips_scopes_when_composing_from_orig() {
    let orig = swc_sourcemap::SourceMap::from_slice(
        br#"{
            "version": 3,
            "sources": ["input.js"],
            "names": [],
            "mappings": "AAAA"
        }"#,
    )
    .expect("valid input source map");

    let (map_json, map) = print_map(true, Some(orig));
    assert!(map_json.get("scopes").is_none());
    assert!(map.get_scopes().is_none());
}
