#![allow(clippy::too_many_lines)]

use std::{
    fs::File,
    io::Read,
    path::{Path, PathBuf},
};

use serde_json::Value;
use swc_common::comments::SingleThreadedComments;
use swc_es_parser::{
    parse_file_as_commonjs, parse_file_as_module, parse_file_as_program, parse_file_as_script,
    parse_file_as_typescript_module, Error, EsSyntax, Syntax, TsSyntax,
};
use walkdir::WalkDir;

#[derive(Clone, Copy)]
enum ParseKind {
    Program,
    Module,
    Script,
    CommonJs,
    TypeScriptModule,
}

#[derive(Default)]
struct FixtureOptions {
    source_type: Option<String>,
    expect_throw: bool,
    plugins: Vec<String>,
    deprecated_assert_syntax: bool,
    config: Option<Value>,
}

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

fn read_json_file(path: &Path) -> Option<Value> {
    let mut buf = String::new();
    let mut file = File::open(path).ok()?;
    file.read_to_string(&mut buf).ok()?;
    serde_json::from_str(&buf).ok()
}

fn parse_plugin_list(plugins: &Value) -> (Vec<String>, bool) {
    let mut names = Vec::new();
    let mut deprecated_assert_syntax = false;

    let Some(items) = plugins.as_array() else {
        return (names, deprecated_assert_syntax);
    };

    for item in items {
        if let Some(name) = item.as_str() {
            names.push(name.to_string());
            continue;
        }

        let Some(plugin_tuple) = item.as_array() else {
            continue;
        };
        if plugin_tuple.is_empty() {
            continue;
        }

        let Some(name) = plugin_tuple[0].as_str() else {
            continue;
        };
        names.push(name.to_string());

        if name == "importAttributes"
            && plugin_tuple.len() > 1
            && plugin_tuple[1]
                .get("deprecatedAssertSyntax")
                .and_then(Value::as_bool)
                .unwrap_or(false)
        {
            deprecated_assert_syntax = true;
        }
    }

    (names, deprecated_assert_syntax)
}

fn load_fixture_options(path: &Path) -> FixtureOptions {
    let mut options = FixtureOptions::default();
    let Some(parent) = path.parent() else {
        return options;
    };

    let options_path = parent.join("options.json");
    if let Some(value) = read_json_file(&options_path) {
        options.source_type = value
            .get("sourceType")
            .and_then(Value::as_str)
            .map(ToOwned::to_owned);
        options.expect_throw = value.get("throws").is_some();
        if let Some(plugins) = value.get("plugins") {
            let (names, deprecated_assert_syntax) = parse_plugin_list(plugins);
            options.plugins = names;
            options.deprecated_assert_syntax = deprecated_assert_syntax;
        }
    }

    let config_path = parent.join("config.json");
    options.config = read_json_file(&config_path);

    options
}

fn config_bool(config: &Value, key: &str) -> Option<bool> {
    config.get(key).and_then(Value::as_bool)
}

fn syntax_for_file(path: &Path, options: &FixtureOptions) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = path.to_string_lossy().replace('\\', "/");
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_jsx = ext == "jsx" || is_tsx || file_name.contains("/jsx/");

    if is_ts {
        return Syntax::Typescript(TsSyntax {
            tsx: is_tsx,
            decorators: true,
            no_early_errors: false,
            disallow_ambiguous_jsx_like: matches!(ext, "mts" | "cts"),
            ..Default::default()
        });
    }

    let mut es = EsSyntax {
        jsx: is_jsx,
        decorators: true,
        import_attributes: true,
        import_assertions: true,
        deprecated_assert_syntax: options.deprecated_assert_syntax,
        explicit_resource_management: true,
        ..Default::default()
    };

    if !options.plugins.is_empty() {
        es.import_attributes = options
            .plugins
            .iter()
            .any(|plugin| plugin == "importAttributes");
        es.import_assertions = options
            .plugins
            .iter()
            .any(|plugin| plugin == "importAssertions");
    }

    if let Some(config) = &options.config {
        if let Some(jsx) = config_bool(config, "jsx") {
            es.jsx = jsx;
        }
        if let Some(decorators) = config_bool(config, "decorators") {
            es.decorators = decorators;
        }
        if let Some(export_default_from) = config_bool(config, "exportDefaultFrom") {
            es.export_default_from = export_default_from;
        }
        if let Some(import_attributes) = config_bool(config, "importAttributes") {
            es.import_attributes = import_attributes;
        }
        if let Some(explicit_resource_management) =
            config_bool(config, "explicitResourceManagement")
        {
            es.explicit_resource_management = explicit_resource_management;
        }
    }

    Syntax::Es(es)
}

fn parse_kind_for_file(path: &Path, category: &str, options: &FixtureOptions) -> ParseKind {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    if ext == "cjs" {
        return ParseKind::CommonJs;
    }

    if category == "errors" {
        return ParseKind::Module;
    }

    if category == "typescript-errors" {
        return ParseKind::TypeScriptModule;
    }

    if category == "test262-pass" || category == "test262-fail" {
        let file_name = path.file_name().and_then(|f| f.to_str()).unwrap_or("");
        if file_name.contains(".module.") {
            return ParseKind::Module;
        }
        return ParseKind::Script;
    }

    if options.source_type.as_deref() == Some("module") {
        return ParseKind::Module;
    }

    ParseKind::Program
}

fn run_fixture(path: &Path, category: &str, expected_fail: bool) {
    let options = load_fixture_options(path);
    let expected_fail = expected_fail || options.expect_throw;
    let syntax = syntax_for_file(path, &options);
    let parse_kind = parse_kind_for_file(path, category, &options);

    let result = testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(path)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

        let comments = SingleThreadedComments::default();
        let mut recovered_errors = Vec::<Error>::new();
        let mut debug_errors = Vec::<String>::new();

        let parsed = match parse_kind {
            ParseKind::Program => {
                parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered_errors)
            }
            ParseKind::Module => {
                parse_file_as_module(&fm, syntax, Some(&comments), &mut recovered_errors)
            }
            ParseKind::Script => {
                parse_file_as_script(&fm, syntax, Some(&comments), &mut recovered_errors)
            }
            ParseKind::CommonJs => {
                parse_file_as_commonjs(&fm, syntax, Some(&comments), &mut recovered_errors)
            }
            ParseKind::TypeScriptModule => {
                parse_file_as_typescript_module(&fm, syntax, Some(&comments), &mut recovered_errors)
            }
        };

        if let Err(fatal) = parsed {
            debug_errors.push(format!("[fatal:{:?}] {}", fatal.code(), fatal.message()));
            fatal.into_diagnostic(handler).emit();
        }
        for err in recovered_errors {
            debug_errors.push(format!("[{:?}] {}", err.code(), err.message()));
            err.into_diagnostic(handler).emit();
        }

        if expected_fail {
            if handler.has_errors() {
                return Err(());
            }
            panic!("fixture should fail: {}", path.display());
        }

        if handler.has_errors() {
            panic!(
                "fixture should pass: {}\nerrors:\n{}",
                path.display(),
                debug_errors.join("\n")
            );
        }

        Ok(())
    });

    if expected_fail {
        result.expect_err("fixture should fail");
    } else {
        result.unwrap();
    }
}

fn run_category<F>(category: &str, exts: &[&str], should_skip: F, expected_fail: bool)
where
    F: Fn(&Path) -> bool,
{
    let fixtures = collect_fixture_files(category, exts);
    assert!(
        !fixtures.is_empty(),
        "no fixtures found for category {category}"
    );

    for fixture in fixtures {
        if should_skip(&fixture) {
            continue;
        }
        run_fixture(&fixture, category, expected_fail);
    }
}

fn is_ignored_tsc(path: &Path) -> bool {
    let file_name = path.to_string_lossy().replace('\\', "/");

    file_name.contains("tsc/FunctionDeclaration7_es6")
        || file_name.contains("unicodeExtendedEscapesInStrings11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings11_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES6")
        || file_name.contains("tsc/propertyNamesOfReservedWords")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES5")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES6")
        || file_name.contains("tsc/parser.numericSeparators.decimal")
        || file_name.contains("tsc/callSignaturesWithParameterInitializers")
        || file_name.contains("tsc/jsdocDisallowedInTypescript")
        || file_name.contains("tsc/errorSuperCalls")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/parserRegularExpressionDivideAmbiguity3")
        || file_name.contains("tsc/inlineJsxFactoryDeclarationsx")
        || file_name.contains("tsc/importDefaultNamedType")
        || file_name.contains("tsc/tsxAttributeResolution5x")
        || file_name.contains("tsc/tsxErrorRecovery2x")
        || file_name.contains("tsc/tsxErrorRecovery3x")
        || file_name.contains("tsc/tsxErrorRecovery5x")
        || file_name.contains("tsc/tsxReactEmitEntitiesx")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutputx")
        || file_name.contains("tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3")
        || file_name.contains("tsc/objectLiteralGettersAndSetters")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/unicodeEscapesInJsxtagsx")
        || file_name.contains("tsc/FunctionDeclaration6_es6")
        || file_name.contains("tsc/checkJsxNamespaceNamesQuestionableForms")
        || file_name.contains("tsc/classExtendingOptionalChain")
        || file_name.contains("tsc/inlineJsxFactoryDeclarations")
        || file_name.contains("tsc/interfaceExtendingOptionalChain")
        || file_name.contains("tsc/interfacesWithPredefinedTypesAsNames")
        || file_name.contains("tsc/namedTupleMembersErrors")
        || file_name.contains("tsc/parserForOfStatement23")
        || file_name.contains("tsc/topLevelAwait.2")
        || file_name.contains("tsc/tsxAttributeResolution5")
        || file_name.contains("tsc/tsxErrorRecovery2")
        || file_name.contains("tsc/tsxErrorRecovery3")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutput")
        || file_name.contains("tsc/unicodeEscapesInJsxtags")
        || file_name.contains("tsc/propertyAccessNumericLiterals")
        || file_name.contains("tsc/parserAssignmentExpression1")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity11")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity15")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity16")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity20")
        || file_name.contains("tsc/awaitUsingDeclarationsInFor")
        || file_name.ends_with("tsc/usingDeclarationsInFor.ts")
        || file_name.ends_with("tsc/decoratorOnClassMethod12.ts")
        || file_name.ends_with("tsc/esDecorators-preservesThis.ts")
        || file_name.ends_with("tsc/topLevelVarHoistingCommonJS.ts")
}

const TEST262_IGNORED_PASS: &[&str] = &[
    "431ecef8c85d4d24.js",
    "8386fbff927a9e0e.js",
    "5654d4106d7025c2.js",
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    "dcc5609dcc043200.js",
    "88d42455ac933ef5.js",
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
    "8f8bfb27569ac008.js",
    "ce569e89a005c02a.js",
    "046a0bb70d03d0cc.js",
    "08a39e4289b0c3f3.js",
    "300a638d978d0f2c.js",
    "44f31660bd715f05.js",
];

const TEST262_IGNORED_FAIL: &[&str] = &[
    "e3fbcf63d7e43ead.js",
    "569a2c1bad3beeb2.js",
    "3b6f737a4ac948a8.js",
    "829d9261aa6cd22c.js",
    "b03ee881dce1a367.js",
    "cb92787da5075fd1.js",
    "f0f498d6ae70038f.js",
    "0d5e450f1da8a92a.js",
    "346316bef54d805a.js",
    "976b6247ca78ab51.js",
    "ae0a7ac275bc9f5c.js",
    "748656edbfb2d0bb.js",
    "79f882da06f88c9f.js",
    "d28e80d99f819136.js",
    "92b6af54adef3624.js",
    "ef2d369cccc5386c.js",
    "147fa078a7436e0e.js",
    "15a6123f6b825c38.js",
    "3bc2b27a7430f818.js",
    "2fa321f0374c7017.js",
    "3dbb6e166b14a6c0.js",
    "66e383bfd18e66ab.js",
    "78c215fabdf13bae.js",
    "bf49ec8d96884562.js",
    "e4a43066905a597b.js",
    "98204d734f8c72b3.js",
    "ef81b93cf9bdb4ec.js",
];

fn is_ignored_test262_pass(path: &Path) -> bool {
    let name = path
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or_default();
    TEST262_IGNORED_PASS.contains(&name)
}

fn is_ignored_test262_fail(path: &Path) -> bool {
    let name = path
        .file_name()
        .and_then(|f| f.to_str())
        .unwrap_or_default();
    TEST262_IGNORED_FAIL.contains(&name)
}

#[test]
fn fixtures_js() {
    run_category("js", &["js", "mjs", "cjs"], |_| false, false);
}

#[test]
fn fixtures_jsx() {
    run_category("jsx", &["js", "jsx"], |_| false, false);
}

#[test]
fn fixtures_typescript() {
    run_category("typescript", &["ts", "tsx", "mts", "cts"], |_| false, false);
}

#[test]
fn fixtures_typescript_errors() {
    run_category(
        "typescript-errors",
        &["ts", "tsx", "mts", "cts"],
        |_| false,
        true,
    );
}

#[test]
fn fixtures_errors() {
    run_category(
        "errors",
        &["js", "mjs", "cjs", "ts", "tsx"],
        |_| false,
        true,
    );
}

#[test]
fn fixtures_comments() {
    run_category("comments", &["js"], |_| false, false);
}

#[test]
fn fixtures_span() {
    run_category("span", &["js", "ts"], |_| false, false);
}

#[test]
fn fixtures_shifted() {
    run_category("shifted", &["ts"], |_| false, false);
}

#[test]
fn fixtures_tsc() {
    run_category("tsc", &["ts", "tsx", "js"], is_ignored_tsc, false);
}

#[test]
fn fixtures_test262_pass() {
    run_category(
        "test262-parser/pass",
        &["js"],
        is_ignored_test262_pass,
        false,
    );
}

#[test]
fn fixtures_test262_fail() {
    run_category(
        "test262-parser/fail",
        &["js"],
        is_ignored_test262_fail,
        true,
    );
}
