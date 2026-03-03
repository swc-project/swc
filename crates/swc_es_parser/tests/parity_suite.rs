use std::{
    fs,
    path::{Path, PathBuf},
};

use serde_json::Value;
use swc_common::{comments::SingleThreadedComments, SourceMap};
use swc_es_parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, Error, EsSyntax, Syntax,
    TsSyntax,
};
use walkdir::WalkDir;

const CORE_CATEGORIES: &[&str] = &[
    "js",
    "jsx",
    "typescript",
    "typescript-errors",
    "errors",
    "comments",
    "span",
    "shifted",
];

// Mirrors `crates/swc_ecma_parser/tests/typescript.rs`.
const TSC_IGNORES_CONTAINS: &[&str] = &[
    "tsc/FunctionDeclaration7_es6",
    "unicodeExtendedEscapesInStrings11_ES5",
    "tsc/unicodeExtendedEscapesInStrings10_ES5",
    "tsc/unicodeExtendedEscapesInStrings11_ES6",
    "tsc/unicodeExtendedEscapesInStrings10_ES6",
    "tsc/propertyNamesOfReservedWords",
    "unicodeExtendedEscapesInTemplates10_ES5",
    "unicodeExtendedEscapesInTemplates10_ES6",
    "tsc/unicodeExtendedEscapesInTemplates11_ES5",
    "tsc/unicodeExtendedEscapesInTemplates11_ES6",
    "tsc/parser.numericSeparators.decimal",
    "tsc/callSignaturesWithParameterInitializers",
    "tsc/jsdocDisallowedInTypescript",
    "tsc/errorSuperCalls",
    "tsc/restElementMustBeLast",
    "tsc/parserRegularExpressionDivideAmbiguity3",
    "tsc/inlineJsxFactoryDeclarationsx",
    "tsc/importDefaultNamedType",
    "tsc/tsxAttributeResolution5x",
    "tsc/tsxErrorRecovery2x",
    "tsc/tsxErrorRecovery3x",
    "tsc/tsxErrorRecovery5x",
    "tsc/tsxReactEmitEntitiesx",
    "tsc/tsxTypeArgumentsJsxPreserveOutputx",
    "tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3",
    "tsc/objectLiteralGettersAndSetters",
    "tsc/unicodeEscapesInJsxtagsx",
    "tsc/FunctionDeclaration6_es6",
    "tsc/checkJsxNamespaceNamesQuestionableForms",
    "tsc/classExtendingOptionalChain",
    "tsc/inlineJsxFactoryDeclarations",
    "tsc/interfaceExtendingOptionalChain",
    "tsc/interfacesWithPredefinedTypesAsNames",
    "tsc/namedTupleMembersErrors",
    "tsc/parserForOfStatement23",
    "tsc/topLevelAwait.2",
    "tsc/tsxAttributeResolution5",
    "tsc/tsxErrorRecovery2",
    "tsc/tsxErrorRecovery3",
    "tsc/tsxTypeArgumentsJsxPreserveOutput",
    "tsc/unicodeEscapesInJsxtags",
    "tsc/propertyAccessNumericLiterals",
    "tsc/parserAssignmentExpression1",
    "tsc/parserGreaterThanTokenAmbiguity11",
    "tsc/parserGreaterThanTokenAmbiguity15",
    "tsc/parserGreaterThanTokenAmbiguity16",
    "tsc/parserGreaterThanTokenAmbiguity20",
    "tsc/awaitUsingDeclarationsInFor",
];

const TSC_IGNORES_ENDS_WITH: &[&str] = &[
    "tsc/usingDeclarationsInFor.ts",
    "tsc/decoratorOnClassMethod12.ts",
    "tsc/esDecorators-preservesThis.ts",
    "tsc/topLevelVarHoistingCommonJS.ts",
];

// Mirrors `crates/swc_ecma_parser/tests/test262.rs` IGNORED_PASS_TESTS.
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

// Mirrors `crates/swc_ecma_parser/tests/test262.rs` IGNORED_ERROR_TESTS.
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

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ParseMode {
    Program,
    Module,
    Script,
}

#[derive(Debug, Default, Clone)]
struct FixtureOptions {
    throws: bool,
    source_type_module: bool,
    import_attributes: Option<bool>,
    explicit_resource_management: Option<bool>,
    jsx: Option<bool>,
}

#[derive(Debug, Clone)]
struct Case {
    path: PathBuf,
    category: String,
}

fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

fn normalized(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn read_json(path: &Path) -> Option<Value> {
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str::<Value>(&content).ok()
}

fn collect_fixture_options(path: &Path) -> FixtureOptions {
    let mut out = FixtureOptions::default();
    let Some(parent) = path.parent() else {
        return out;
    };

    if let Some(options) = read_json(&parent.join("options.json")) {
        out.throws = options.get("throws").and_then(Value::as_str).is_some();
        out.source_type_module = options
            .get("sourceType")
            .and_then(Value::as_str)
            .map(|value| value == "module")
            .unwrap_or(false);

        if let Some(plugins) = options.get("plugins").and_then(Value::as_array) {
            if plugins.is_empty() {
                out.import_attributes = Some(false);
            } else {
                let mut enabled = false;
                for plugin in plugins {
                    let name = if let Some(name) = plugin.as_str() {
                        Some(name)
                    } else {
                        plugin
                            .as_array()
                            .and_then(|items| items.first())
                            .and_then(Value::as_str)
                    };
                    if matches!(name, Some("importAttributes" | "importAssertions")) {
                        enabled = true;
                    }
                }
                out.import_attributes = Some(enabled);
            }
        }
    }

    if let Some(config) = read_json(&parent.join("config.json")) {
        if let Some(import_attributes) = config.get("importAttributes").and_then(Value::as_bool) {
            out.import_attributes = Some(import_attributes);
        }
        if let Some(explicit_resource_management) = config
            .get("explicitResourceManagement")
            .and_then(Value::as_bool)
        {
            out.explicit_resource_management = Some(explicit_resource_management);
        }
        if let Some(jsx) = config.get("jsx").and_then(Value::as_bool) {
            out.jsx = Some(jsx);
        }
    }

    out
}

fn syntax_for_file(path: &Path, category: &str, options: &FixtureOptions) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = normalized(path);
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_cjs = ext == "cjs";
    let is_jsx = options
        .jsx
        .unwrap_or(ext == "jsx" || is_tsx || file_name.contains("/jsx/"));

    if is_ts {
        Syntax::Typescript(TsSyntax {
            tsx: is_tsx,
            decorators: true,
            no_early_errors: category != "typescript-errors",
            disallow_ambiguous_jsx_like: matches!(ext, "mts" | "cts"),
            ..Default::default()
        })
    } else {
        Syntax::Es(EsSyntax {
            jsx: is_jsx,
            decorators: true,
            import_attributes: options.import_attributes.unwrap_or(true),
            explicit_resource_management: options.explicit_resource_management.unwrap_or(true),
            allow_return_outside_function: is_cjs,
            ..Default::default()
        })
    }
}

fn parse_mode_for(path: &Path, options: &FixtureOptions) -> ParseMode {
    let file = normalized(path);
    let file_name = path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("");

    if path.extension().and_then(|ext| ext.to_str()) == Some("cjs") {
        return ParseMode::Script;
    }
    if options.source_type_module {
        return ParseMode::Module;
    }
    if file.contains("/test262-parser/") && file_name.contains("module") {
        return ParseMode::Module;
    }

    ParseMode::Program
}

fn is_expected_fail(case: &Case, options: &FixtureOptions) -> bool {
    let path = normalized(&case.path);

    if options.throws {
        return true;
    }
    if case.category == "errors" || case.category == "typescript-errors" {
        return true;
    }
    if case.category == "jsx" && path.contains("/jsx/errors/") {
        return true;
    }
    if case.category == "test262-parser" && path.contains("/test262-parser/fail/") {
        return true;
    }

    false
}

fn collect_files_for_category(category: &str) -> Vec<PathBuf> {
    let root = ecma_fixture_root().join(category);
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        let Some(ext) = path.extension().and_then(|ext| ext.to_str()) else {
            continue;
        };
        if !matches!(
            ext,
            "js" | "jsx" | "cjs" | "mjs" | "ts" | "tsx" | "mts" | "cts"
        ) {
            continue;
        }
        files.push(path.to_path_buf());
    }

    files.sort();
    files
}

fn filter_ignored_cases(mut cases: Vec<Case>) -> Vec<Case> {
    cases.retain(|case| {
        let path = normalized(&case.path);
        let file_name = case
            .path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("");

        if case.category == "tsc" {
            if TSC_IGNORES_CONTAINS
                .iter()
                .any(|pattern| path.contains(pattern))
            {
                return false;
            }
            if TSC_IGNORES_ENDS_WITH
                .iter()
                .any(|pattern| path.ends_with(pattern))
            {
                return false;
            }
        }

        if case.category == "test262-parser"
            && path.contains("/pass/")
            && TEST262_IGNORED_PASS.contains(&file_name)
        {
            return false;
        }
        if case.category == "test262-parser"
            && path.contains("/fail/")
            && TEST262_IGNORED_FAIL.contains(&file_name)
        {
            return false;
        }

        true
    });
    cases
}

fn parse_case(case: &Case) -> (bool, Option<Error>, Vec<Error>) {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    let comments = SingleThreadedComments::default();
    let options = collect_fixture_options(&case.path);
    let syntax = syntax_for_file(&case.path, &case.category, &options);
    let mode = parse_mode_for(&case.path, &options);
    let mut recovered = Vec::new();

    let fatal = match mode {
        ParseMode::Program => {
            parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered).err()
        }
        ParseMode::Module => {
            parse_file_as_module(&fm, syntax, Some(&comments), &mut recovered).err()
        }
        ParseMode::Script => {
            parse_file_as_script(&fm, syntax, Some(&comments), &mut recovered).err()
        }
    };
    let observed_success = fatal.is_none() && recovered.is_empty();
    (observed_success, fatal, recovered)
}

fn run_cases(name: &str, cases: Vec<Case>) {
    let mut mismatches = Vec::new();
    let mut checked = 0usize;

    for case in cases {
        let options = collect_fixture_options(&case.path);
        let expected_success = !is_expected_fail(&case, &options);
        let (observed_success, fatal, recovered) = parse_case(&case);
        let observed_success = if !expected_success
            && (options.throws
                || (case.category == "errors")
                || (case.category == "typescript-errors")
                || (case.category == "jsx" && normalized(&case.path).contains("/jsx/errors/"))
                || (case.category == "test262-parser"
                    && normalized(&case.path).contains("/test262-parser/fail/")))
        {
            // `throws` fixtures are parser-option negative tests in the reused suite.
            false
        } else {
            observed_success
        };
        checked += 1;

        if observed_success != expected_success {
            let path = normalized(&case.path);
            let fatal_desc = fatal
                .as_ref()
                .map(|error| {
                    format!(
                        "{:?}:{:?}:{}",
                        error.severity(),
                        error.code(),
                        error.message()
                    )
                })
                .unwrap_or_else(|| "none".to_string());
            mismatches.push(format!(
                "{path}\n  expected_success={expected_success} \
                 observed_success={observed_success}\n  fatal={fatal_desc}\n  recovered={}",
                recovered.len()
            ));
        }
    }

    assert!(
        mismatches.is_empty(),
        "{name}: {}/{} mismatches\n{}",
        mismatches.len(),
        checked,
        mismatches.join("\n\n")
    );
}

#[test]
fn parity_core_corpus() {
    let mut cases = Vec::new();
    for category in CORE_CATEGORIES {
        for path in collect_files_for_category(category) {
            cases.push(Case {
                path,
                category: (*category).to_string(),
            });
        }
    }

    let cases = filter_ignored_cases(cases);
    run_cases("core-corpus", cases);
}

#[test]
fn parity_large_samples() {
    let tsc_cases = collect_files_for_category("tsc")
        .into_iter()
        .map(|path| Case {
            path,
            category: "tsc".to_string(),
        })
        .collect::<Vec<_>>();
    let tsc_cases = filter_ignored_cases(tsc_cases);

    let test262_cases = collect_files_for_category("test262-parser")
        .into_iter()
        .filter(|path| {
            let normalized = normalized(path);
            normalized.contains("/test262-parser/pass/")
                || normalized.contains("/test262-parser/fail/")
        })
        .map(|path| Case {
            path,
            category: "test262-parser".to_string(),
        })
        .collect::<Vec<_>>();
    let test262_cases = filter_ignored_cases(test262_cases);
    let test262_pass = test262_cases
        .iter()
        .filter(|case| normalized(&case.path).contains("/test262-parser/pass/"))
        .cloned()
        .collect::<Vec<_>>();
    let test262_fail = test262_cases
        .iter()
        .filter(|case| normalized(&case.path).contains("/test262-parser/fail/"))
        .cloned()
        .collect::<Vec<_>>();

    let mut cases = Vec::new();
    cases.extend(tsc_cases);
    cases.extend(test262_pass);
    cases.extend(test262_fail);

    run_cases("large-samples", cases);
}
