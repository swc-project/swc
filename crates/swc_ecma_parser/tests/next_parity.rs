use std::{
    fs,
    path::{Path, PathBuf},
};

#[cfg(feature = "flow")]
use serde::Deserialize;
use swc_common::{BytePos, Spanned};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{
    error::Error, lexer::Lexer, unstable::next::Parser as IndependentParser, EsSyntax,
    LegacyParser, ModuleKind, Parser as NextParser, SourceType, StringInput, Syntax, TsSyntax,
};

fn assert_valid_fixture_parity(
    path: PathBuf,
    syntax: Syntax,
    module_kind: ModuleKind,
    target: EsVersion,
) {
    let source = fs::read_to_string(&path)
        .unwrap_or_else(|error| panic!("failed to read {}: {error}", path.display()));
    let (legacy_program, legacy_diagnostics) = if max_delimiter_depth(&source) > 32 {
        // The reference parser lacks stack growth on parenthesized expression
        // recursion. Give only those differential-oracle cases a larger test
        // stack; the independent parser still uses its production stack guard.
        std::thread::scope(|scope| {
            std::thread::Builder::new()
                .name("legacy-parity-parser".into())
                .stack_size(16 * 1024 * 1024)
                .spawn_scoped(scope, || {
                    parse_legacy_program(&source, syntax, module_kind, target)
                })
                .expect("failed to spawn legacy parity parser")
                .join()
                .expect("legacy parity parser panicked")
        })
    } else {
        parse_legacy_program(&source, syntax, module_kind, target)
    };

    // Some fixture directories contain proposal-negative inputs alongside
    // valid snapshots. Invalid behavior is covered by the dedicated error
    // suites; the differential oracle only compares successfully built ASTs.
    let Ok(legacy_program) = legacy_program else {
        return;
    };
    if !legacy_diagnostics.is_empty() {
        return;
    }
    let next_program = match (syntax, &legacy_program) {
        #[cfg(feature = "typescript")]
        (Syntax::Typescript(config), Program::Script(_)) => {
            if config.tsx {
                IndependentParser::new(&source)
                    .parse_typescript_tsx_script()
                    .map(Program::Script)
            } else {
                IndependentParser::new(&source)
                    .parse_typescript_script()
                    .map(Program::Script)
            }
        }
        #[cfg(feature = "typescript")]
        (Syntax::Typescript(config), Program::Module(_)) => {
            if config.tsx {
                IndependentParser::new(&source)
                    .parse_typescript_tsx_module()
                    .map(Program::Module)
            } else {
                IndependentParser::new(&source)
                    .parse_typescript_module()
                    .map(Program::Module)
            }
        }
        #[cfg(feature = "flow")]
        (Syntax::Flow(config), Program::Script(_)) => IndependentParser::new(&source)
            .parse_flow_script(config.jsx, config.require_directive)
            .map(Program::Script),
        #[cfg(feature = "flow")]
        (Syntax::Flow(config), Program::Module(_)) => IndependentParser::new(&source)
            .parse_flow_module(config.jsx, config.require_directive)
            .map(Program::Module),
        (_, Program::Script(_)) => IndependentParser::new(&source)
            .parse_script()
            .map(Program::Script),
        (_, Program::Module(_)) => IndependentParser::new(&source)
            .parse_module()
            .map(Program::Module),
    }
    .unwrap_or_else(|error| {
        panic!(
            "independent parser failed for {} at {:?}: {:?}",
            path.display(),
            error.span(),
            error.kind()
        )
    });
    let legacy_normalized = normalize_ast(&legacy_program);
    let next_normalized = normalize_ast(&next_program);
    if let Some(difference) = first_ast_difference(&next_normalized, &legacy_normalized, "$".into())
    {
        panic!(
            "normalized AST mismatch for {} at {difference}",
            path.display()
        );
    }
}

fn parse_legacy_program(
    source: &str,
    syntax: Syntax,
    module_kind: ModuleKind,
    target: EsVersion,
) -> (Result<Program, Error>, Vec<Error>) {
    let start = BytePos(1);
    let end = start + BytePos(source.len() as u32);
    let lexer = Lexer::new(syntax, target, StringInput::new(source, start, end), None);
    let mut parser = LegacyParser::new_from(lexer);
    let program = match module_kind {
        ModuleKind::Script => parser.parse_script().map(Program::Script),
        ModuleKind::Module => parser.parse_module().map(Program::Module),
        ModuleKind::Unambiguous => parser.parse_program(),
        ModuleKind::CommonJs => parser.parse_commonjs().map(Program::Script),
    };
    (program, parser.take_errors())
}

fn max_delimiter_depth(source: &str) -> usize {
    let mut depth = 0usize;
    let mut maximum = 0usize;
    for byte in source.bytes() {
        match byte {
            b'(' | b'[' | b'{' => {
                depth += 1;
                maximum = maximum.max(depth);
            }
            b')' | b']' | b'}' => depth = depth.saturating_sub(1),
            _ => {}
        }
    }
    maximum
}

fn first_ast_difference(
    left: &serde_json::Value,
    right: &serde_json::Value,
    path: String,
) -> Option<String> {
    match (left, right) {
        (serde_json::Value::Array(left), serde_json::Value::Array(right)) => {
            if left.len() != right.len() {
                return Some(format!("{path}.len ({} != {})", left.len(), right.len()));
            }
            left.iter()
                .zip(right)
                .enumerate()
                .find_map(|(index, (left, right))| {
                    first_ast_difference(left, right, format!("{path}[{index}]"))
                })
        }
        (serde_json::Value::Object(left), serde_json::Value::Object(right)) => {
            for (key, left_value) in left {
                let Some(right_value) = right.get(key) else {
                    return Some(format!(
                        "{path}.{key} missing on reference AST ({} != {})",
                        left.get("type").unwrap_or(&serde_json::Value::Null),
                        right.get("type").unwrap_or(&serde_json::Value::Null)
                    ));
                };
                if let Some(difference) =
                    first_ast_difference(left_value, right_value, format!("{path}.{key}"))
                {
                    return Some(difference);
                }
            }
            right
                .keys()
                .find(|key| !left.contains_key(*key))
                .map(|key| format!("{path}.{key} missing on independent AST"))
        }
        _ if left == right => None,
        _ => Some(format!("{path} ({left} != {right})")),
    }
}

fn normalize_ast(program: &Program) -> serde_json::Value {
    fn remove_locations(value: &mut serde_json::Value) {
        match value {
            serde_json::Value::Array(values) => {
                values.iter_mut().for_each(remove_locations);
            }
            serde_json::Value::Object(map) => {
                map.remove("span");
                map.remove("ctxt");
                map.remove("raw");
                map.values_mut().for_each(remove_locations);
            }
            _ => {}
        }
    }

    let mut value = serde_json::to_value(program).expect("AST must be serializable");
    remove_locations(&mut value);
    value
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
