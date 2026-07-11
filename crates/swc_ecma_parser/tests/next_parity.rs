use std::{
    fs,
    path::{Path, PathBuf},
};

#[cfg(feature = "flow")]
use serde::Deserialize;
use swc_common::{BytePos, EqIgnoreSpan, Spanned};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{
    lexer::Lexer,
    next::{ModuleKind, Parser as NextParser, SourceType},
    EsSyntax, Parser as LegacyParser, StringInput, Syntax, TsSyntax,
};

fn assert_valid_fixture_parity(
    path: PathBuf,
    syntax: Syntax,
    module_kind: ModuleKind,
    target: EsVersion,
) {
    let source = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", path.display()));
    let start = BytePos(1);
    let end = start + BytePos(source.len() as u32);
    let lexer = Lexer::new(syntax, target, StringInput::new(&source, start, end), None);
    let mut legacy = LegacyParser::new_from(lexer);
    let legacy_program = match module_kind {
        ModuleKind::Script => legacy.parse_script().map(Program::Script),
        ModuleKind::Module => legacy.parse_module().map(Program::Module),
        ModuleKind::Unambiguous => legacy.parse_program(),
        ModuleKind::CommonJs => legacy.parse_commonjs().map(Program::Script),
    };

    // Some fixture directories contain proposal-negative inputs alongside
    // valid snapshots. Invalid behavior is covered by the dedicated error
    // suites; the differential oracle only compares successfully built ASTs.
    let Ok(legacy_program) = legacy_program else {
        return;
    };

    let (source_type, options) = SourceType::from_legacy(syntax, module_kind, target);
    let next = NextParser::new(&source, source_type)
        .with_options(options)
        .parse();

    assert!(
        !next.panicked,
        "next parser failed for {}: {:?}",
        path.display(),
        next.diagnostics
            .iter()
            .map(|error| error.kind())
            .collect::<Vec<_>>()
    );
    assert!(
        next.program.eq_ignore_span(&legacy_program),
        "normalized AST mismatch for {}",
        path.display()
    );
}

fn assert_invalid_fixture_terminates(path: PathBuf, syntax: Syntax, module_kind: ModuleKind) {
    let source = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", path.display()));
    let (source_type, options) = SourceType::from_legacy(syntax, module_kind, EsVersion::Es2015);
    let result = NextParser::new(&source, source_type)
        .with_options(options)
        .parse();

    assert!(
        result.panicked || !result.diagnostics.is_empty(),
        "invalid fixture parsed without a diagnostic: {}",
        path.display()
    );

    let span = result.program.span();
    let end = BytePos(1 + source.len() as u32);
    assert!(
        span.lo <= span.hi && span.lo >= BytePos(1) && span.hi <= end,
        "recovery AST has an invalid root span for {}: {span:?}",
        path.display()
    );
}

#[testing::fixture("tests/js/**/*.js")]
#[testing::fixture("tests/js/**/*.cjs")]
fn javascript(path: PathBuf) {
    let config_path = path.parent().unwrap().join("config.json");
    let syntax = fs::read_to_string(config_path)
        .ok()
        .and_then(|config| serde_json::from_str::<EsSyntax>(&config).ok())
        .unwrap_or_else(|| EsSyntax {
            explicit_resource_management: true,
            import_attributes: true,
            decorators: true,
            ..EsSyntax::default()
        });
    let module_kind = if path.extension().is_some_and(|ext| ext == "cjs") {
        ModuleKind::CommonJs
    } else {
        ModuleKind::Unambiguous
    };

    assert_valid_fixture_parity(path, Syntax::Es(syntax), module_kind, EsVersion::Es2015);
}

#[testing::fixture("tests/jsx/basic/**/*.js")]
#[testing::fixture("tests/jsx/basic/**/*.jsx")]
fn jsx(path: PathBuf) {
    assert_valid_fixture_parity(
        path,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..EsSyntax::default()
        }),
        ModuleKind::Module,
        EsVersion::Es2015,
    );
}

#[cfg(feature = "typescript")]
#[testing::fixture("tests/typescript/**/*.ts")]
#[testing::fixture("tests/typescript/**/*.mts")]
#[testing::fixture("tests/typescript/**/*.cts")]
#[testing::fixture("tests/typescript/**/*.tsx")]
fn typescript(path: PathBuf) {
    let file_name = path.to_string_lossy();
    let syntax = TsSyntax {
        dts: file_name.ends_with(".d.ts"),
        tsx: file_name.contains("tsx"),
        decorators: true,
        no_early_errors: true,
        disallow_ambiguous_jsx_like: file_name.contains("cts") || file_name.contains("mts"),
    };

    assert_valid_fixture_parity(
        path,
        Syntax::Typescript(syntax),
        ModuleKind::Unambiguous,
        EsVersion::Es2015,
    );
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/flow/**/*.js")]
fn flow(path: PathBuf) {
    use swc_ecma_parser::FlowSyntax;

    let config_path = path.parent().unwrap().join("config.json");
    let syntax = fs::read_to_string(config_path)
        .ok()
        .and_then(|config| serde_json::from_str::<FlowSyntax>(&config).ok())
        .unwrap_or_default();

    assert_valid_fixture_parity(
        path,
        Syntax::Flow(syntax),
        ModuleKind::Unambiguous,
        EsVersion::Es2015,
    );
}

#[cfg(feature = "flow")]
#[derive(Default, Deserialize)]
#[serde(default)]
struct HermesOptions {
    enums: Option<bool>,
    types: Option<bool>,
    esproposal_decorators: Option<bool>,
    components: Option<bool>,
    pattern_matching: Option<bool>,
}

#[cfg(feature = "flow")]
fn hermes_flow_syntax(path: &Path) -> swc_ecma_parser::FlowSyntax {
    use swc_ecma_parser::FlowSyntax;

    let corpus = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/flow-hermes/corpus");
    let relative = path
        .strip_prefix(&corpus)
        .unwrap_or_else(|_| {
            panic!(
                "Hermes fixture is outside {}: {}",
                corpus.display(),
                path.display()
            )
        })
        .to_string_lossy()
        .replace('\\', "/");
    let options_path = path.with_extension("options.json");
    let options = fs::read_to_string(&options_path)
        .ok()
        .map(|source| {
            serde_json::from_str::<HermesOptions>(&source).unwrap_or_else(|error| {
                panic!("failed to parse {}: {error}", options_path.display())
            })
        })
        .unwrap_or_default();

    FlowSyntax {
        // Hermes parses the entire Flow corpus with JSX enabled.
        jsx: true,
        all: false,
        require_directive: matches!(options.types, Some(false)),
        enums: options.enums.unwrap_or_else(|| {
            relative.starts_with("enums/") && relative != "enums/declare-enum-option-off.js"
        }),
        decorators: options.esproposal_decorators.unwrap_or(false),
        components: options.components.unwrap_or_else(|| {
            relative.starts_with("components/") || relative.starts_with("hook_syntax/")
        }),
        pattern_matching: options
            .pattern_matching
            .unwrap_or_else(|| relative.starts_with("match/")),
    }
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/flow-hermes/corpus/**/*.js")]
fn flow_hermes(path: PathBuf) {
    let syntax = hermes_flow_syntax(&path);

    assert_valid_fixture_parity(
        path,
        Syntax::Flow(syntax),
        ModuleKind::Unambiguous,
        EsVersion::latest(),
    );
}

#[testing::fixture("tests/test262-parser/pass/*.js")]
fn test262(path: PathBuf) {
    let module_kind = if path.to_string_lossy().ends_with(".module.js") {
        ModuleKind::Module
    } else {
        ModuleKind::Script
    };

    assert_valid_fixture_parity(path, Syntax::default(), module_kind, EsVersion::latest());
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/errors/**/*.cjs")]
#[testing::fixture("tests/errors/**/*.js")]
#[testing::fixture("tests/errors/**/*.mjs")]
#[testing::fixture("tests/errors/**/*.ts")]
#[testing::fixture("tests/errors/**/*.tsx")]
fn invalid_javascript_or_typescript(path: PathBuf) {
    let extension = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let is_typescript = matches!(extension, "ts" | "tsx");
    let syntax = if is_typescript {
        Syntax::Typescript(TsSyntax {
            tsx: extension == "tsx",
            ..TsSyntax::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: extension == "jsx",
            explicit_resource_management: true,
            ..EsSyntax::default()
        })
    };
    let is_script_fixture = path.to_string_lossy().contains("script");
    let module_kind = if extension == "cjs" || is_script_fixture {
        ModuleKind::Script
    } else {
        ModuleKind::Module
    };

    assert_invalid_fixture_terminates(path, syntax, module_kind);
}

#[cfg(feature = "verify")]
#[testing::fixture("tests/jsx/errors/**/*.js")]
fn invalid_jsx(path: PathBuf) {
    assert_invalid_fixture_terminates(
        path,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..EsSyntax::default()
        }),
        ModuleKind::Module,
    );
}

#[cfg(feature = "typescript")]
#[testing::fixture("tests/typescript-errors/**/*.ts")]
#[testing::fixture("tests/typescript-errors/**/*.mts")]
#[testing::fixture("tests/typescript-errors/**/*.cts")]
#[testing::fixture("tests/typescript-errors/**/*.tsx")]
fn invalid_typescript(path: PathBuf) {
    let file_name = path.to_string_lossy();
    let module_kind = if file_name.contains("top-level-await-jsc-target") {
        ModuleKind::Script
    } else {
        ModuleKind::Module
    };
    let syntax = TsSyntax {
        dts: file_name.ends_with(".d.ts"),
        tsx: file_name.contains("tsx"),
        decorators: true,
        no_early_errors: false,
        disallow_ambiguous_jsx_like: file_name.contains("cts") || file_name.contains("mts"),
    };

    assert_invalid_fixture_terminates(path, Syntax::Typescript(syntax), module_kind);
}

#[cfg(feature = "flow")]
#[testing::fixture("tests/flow-errors/**/*.js")]
fn invalid_flow(path: PathBuf) {
    use swc_ecma_parser::FlowSyntax;

    let config_path = path.parent().unwrap().join("config.json");
    let syntax = fs::read_to_string(config_path)
        .ok()
        .and_then(|config| serde_json::from_str::<FlowSyntax>(&config).ok())
        .unwrap_or_default();

    assert_invalid_fixture_terminates(path, Syntax::Flow(syntax), ModuleKind::Unambiguous);
}
