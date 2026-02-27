use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, SourceMap};
use swc_ecma_ast::Program as EcmaProgram;
use swc_ecma_parser::{Parser as EcmaParser, Syntax as EcmaSyntax};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use walkdir::WalkDir;

fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

fn collect_fixture_files(category: &str, exts: &[&str]) -> Vec<PathBuf> {
    let root = ecma_fixture_root().join(category);
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }

        let path = entry.path();
        let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
        if exts.contains(&ext) {
            files.push(path.to_path_buf());
        }
    }

    files.sort();
    files
}

#[derive(Debug, Clone, Copy)]
struct ParseSummary {
    ok: bool,
    body_len: usize,
}

fn convert_syntax_to_ecma(syntax: Syntax) -> EcmaSyntax {
    match syntax {
        Syntax::Es(es) => EcmaSyntax::Es(swc_ecma_parser::EsSyntax {
            jsx: es.jsx,
            fn_bind: es.fn_bind,
            decorators: es.decorators,
            decorators_before_export: es.decorators_before_export,
            export_default_from: es.export_default_from,
            import_attributes: es.import_attributes,
            allow_super_outside_method: es.allow_super_outside_method,
            allow_return_outside_function: es.allow_return_outside_function,
            auto_accessors: es.auto_accessors,
            explicit_resource_management: es.explicit_resource_management,
        }),
        Syntax::Typescript(ts) => EcmaSyntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: ts.tsx,
            decorators: ts.decorators,
            dts: ts.dts,
            no_early_errors: ts.no_early_errors,
            disallow_ambiguous_jsx_like: ts.disallow_ambiguous_jsx_like,
        }),
    }
}

fn syntax_for_file(path: &Path) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = path.to_string_lossy().replace('\\', "/");
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_jsx = ext == "jsx" || is_tsx || file_name.contains("/jsx/");

    let default = if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_tsx,
            decorators: true,
            disallow_ambiguous_jsx_like: matches!(ext, "mts" | "cts"),
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        })
    };

    let config_path = path.parent().map(|parent| parent.join("config.json"));
    if let Some(config_path) = config_path {
        if let Ok(config_str) = fs::read_to_string(config_path) {
            if let Ok(config) = serde_json::from_str::<Syntax>(&config_str) {
                return config;
            }
        }
    }

    default
}

fn parse_with_oracle(path: &Path, syntax: Syntax) -> ParseSummary {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

    let comments = SingleThreadedComments::default();
    let mut parser = EcmaParser::new(
        convert_syntax_to_ecma(syntax),
        (&*fm).into(),
        Some(&comments),
    );

    let result = parser.parse_program();
    match result {
        Ok(program) => ParseSummary {
            ok: true,
            body_len: ecma_program_len(&program),
        },
        Err(_) => ParseSummary {
            ok: false,
            body_len: 0,
        },
    }
}

fn ecma_program_len(program: &EcmaProgram) -> usize {
    match program {
        EcmaProgram::Script(script) => script.body.len(),
        EcmaProgram::Module(module) => module.body.len(),
    }
}

fn parse_with_swc_es(path: &Path, syntax: Syntax) -> ParseSummary {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

    let comments = SingleThreadedComments::default();
    let mut recovered_errors = Vec::new();
    match parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered_errors) {
        Ok(parsed) => {
            let program = parsed
                .store
                .program(parsed.program)
                .expect("program should exist");
            ParseSummary {
                ok: true,
                body_len: program.body.len(),
            }
        }
        Err(_) => ParseSummary {
            ok: false,
            body_len: 0,
        },
    }
}

fn run_fixture(path: &Path) {
    let syntax = syntax_for_file(path);

    let oracle = parse_with_oracle(path, syntax);
    let swc_es = parse_with_swc_es(path, syntax);

    assert_eq!(
        swc_es.ok,
        oracle.ok,
        "parse success mismatch for fixture {}\nsyntax={syntax:?}",
        path.display()
    );

    if oracle.ok {
        assert_eq!(
            swc_es.body_len,
            oracle.body_len,
            "top-level body length mismatch for fixture {}\nsyntax={syntax:?}",
            path.display()
        );
    }
}

fn run_category(category: &str, exts: &[&str]) {
    let fixtures = collect_fixture_files(category, exts);
    assert!(
        !fixtures.is_empty(),
        "no fixtures found for category {category}"
    );
    for fixture in fixtures {
        run_fixture(&fixture);
    }
}

#[test]
fn fixtures_js() {
    run_category("js", &["js", "mjs", "cjs"]);
}

#[test]
fn fixtures_jsx() {
    run_category("jsx", &["js", "jsx"]);
}

#[test]
fn fixtures_typescript() {
    run_category("typescript", &["ts", "tsx", "mts", "cts"]);
}

#[test]
fn fixtures_typescript_errors() {
    run_category("typescript-errors", &["ts", "tsx", "mts", "cts"]);
}

#[test]
fn fixtures_errors() {
    run_category("errors", &["js", "mjs", "cjs", "ts", "tsx"]);
}

#[test]
fn fixtures_comments() {
    run_category("comments", &["js"]);
}

#[test]
fn fixtures_span() {
    run_category("span", &["js", "ts"]);
}

#[test]
fn fixtures_shifted() {
    run_category("shifted", &["ts"]);
}

#[test]
fn fixtures_tsc() {
    run_category("tsc", &["ts", "tsx", "js"]);
}

#[test]
fn fixtures_test262() {
    run_category("test262-parser", &["js"]);
}
