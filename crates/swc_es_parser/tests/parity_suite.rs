use std::{
    fmt::Write as _,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, SourceMap};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use walkdir::WalkDir;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum ExpectedOutcome {
    Success,
    Failure,
}

#[derive(Debug)]
struct ParityCase {
    path: PathBuf,
    expected: ExpectedOutcome,
}

fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

fn normalized_path(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
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

fn syntax_for_file(path: &Path) -> Syntax {
    let ext = path.extension().and_then(|ext| ext.to_str()).unwrap_or("");
    let file_name = normalized_path(path);
    let is_ts = matches!(ext, "ts" | "tsx" | "mts" | "cts");
    let is_tsx = ext == "tsx";
    let is_jsx = ext == "jsx" || is_tsx || file_name.contains("/jsx/");

    if is_ts {
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
    }
}

fn should_skip_tsc_fixture(path: &str) -> bool {
    path.ends_with("for-of51.ts")
        || path.contains("parserArrowFunctionExpression11")
        || path.contains("esDecorators-decoratorExpression.1")
}

fn should_skip_typescript_run_spec(path: &str) -> bool {
    let ignore = path.contains("tsc/FunctionDeclaration7_es6")
        || path.contains("unicodeExtendedEscapesInStrings11_ES5")
        || path.contains("tsc/unicodeExtendedEscapesInStrings10_ES5")
        || path.contains("tsc/unicodeExtendedEscapesInStrings11_ES6")
        || path.contains("tsc/unicodeExtendedEscapesInStrings10_ES6")
        || path.contains("tsc/propertyNamesOfReservedWords")
        || path.contains("unicodeExtendedEscapesInTemplates10_ES5")
        || path.contains("unicodeExtendedEscapesInTemplates10_ES6")
        || path.contains("tsc/unicodeExtendedEscapesInTemplates11_ES5")
        || path.contains("tsc/unicodeExtendedEscapesInTemplates11_ES6")
        || path.contains("tsc/parser.numericSeparators.decimal");

    let ignore = ignore
        || path.contains("tsc/callSignaturesWithParameterInitializers")
        || path.contains("tsc/jsdocDisallowedInTypescript")
        || path.contains("tsc/errorSuperCalls")
        || path.contains("tsc/restElementMustBeLast")
        || path.contains("tsc/parserRegularExpressionDivideAmbiguity3");

    ignore
        || path.contains("tsc/inlineJsxFactoryDeclarationsx")
        || path.contains("tsc/importDefaultNamedType")
        || path.contains("tsc/tsxAttributeResolution5x")
        || path.contains("tsc/tsxErrorRecovery2x")
        || path.contains("tsc/tsxErrorRecovery3x")
        || path.contains("tsc/tsxErrorRecovery5x")
        || path.contains("tsc/tsxReactEmitEntitiesx")
        || path.contains("tsc/tsxTypeArgumentsJsxPreserveOutputx")
        || path.contains("tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3")
        || path.contains("tsc/objectLiteralGettersAndSetters")
        || path.contains("tsc/restElementMustBeLast")
        || path.contains("tsc/unicodeEscapesInJsxtagsx")
        || path.contains("tsc/FunctionDeclaration6_es6")
        || path.contains("tsc/checkJsxNamespaceNamesQuestionableForms")
        || path.contains("tsc/classExtendingOptionalChain")
        || path.contains("tsc/inlineJsxFactoryDeclarations")
        || path.contains("tsc/interfaceExtendingOptionalChain")
        || path.contains("tsc/interfacesWithPredefinedTypesAsNames")
        || path.contains("tsc/namedTupleMembersErrors")
        || path.contains("tsc/parserForOfStatement23")
        || path.contains("tsc/topLevelAwait.2")
        || path.contains("tsc/tsxAttributeResolution5")
        || path.contains("tsc/tsxErrorRecovery2")
        || path.contains("tsc/tsxErrorRecovery3")
        || path.contains("tsc/tsxTypeArgumentsJsxPreserveOutput")
        || path.contains("tsc/unicodeEscapesInJsxtags")
        || path.contains("tsc/propertyAccessNumericLiterals")
        || path.contains("tsc/parserAssignmentExpression1")
        || path.contains("tsc/parserGreaterThanTokenAmbiguity11")
        || path.contains("tsc/parserGreaterThanTokenAmbiguity15")
        || path.contains("tsc/parserGreaterThanTokenAmbiguity16")
        || path.contains("tsc/parserGreaterThanTokenAmbiguity20")
        || path.contains("tsc/awaitUsingDeclarationsInFor")
        || path.ends_with("tsc/usingDeclarationsInFor.ts")
        || path.ends_with("tsc/decoratorOnClassMethod12.ts")
        || path.ends_with("tsc/esDecorators-preservesThis.ts")
        || path.ends_with("tsc/topLevelVarHoistingCommonJS.ts")
}

const TEST262_IGNORED_PASS_TESTS: &[&str] = &[
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

fn should_skip_test262_pass(path: &str) -> bool {
    let Some(file_name) = path.rsplit('/').next() else {
        return false;
    };

    TEST262_IGNORED_PASS_TESTS.contains(&file_name)
}

fn collect_cases() -> Vec<ParityCase> {
    let mut cases = Vec::new();

    for path in collect_fixture_files("js", &["js", "cjs"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("jsx/basic", &["js", "jsx"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("typescript", &["ts", "tsx", "mts", "cts"]) {
        let normalized = normalized_path(&path);
        if should_skip_typescript_run_spec(&normalized) {
            continue;
        }
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("shifted", &["ts"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("tsc", &["ts"]) {
        let normalized = normalized_path(&path);
        if should_skip_tsc_fixture(&normalized) || should_skip_typescript_run_spec(&normalized) {
            continue;
        }
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("comments", &["js"]) {
        let normalized = normalized_path(&path);
        if !normalized.ends_with("/input.js") {
            continue;
        }
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("span", &["js", "ts"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("test262-parser/pass", &["js"]) {
        let normalized = normalized_path(&path);
        if should_skip_test262_pass(&normalized) {
            continue;
        }
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("test262-parser/pass-explicit", &["js"]) {
        let normalized = normalized_path(&path);
        if should_skip_test262_pass(&normalized) {
            continue;
        }
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Success,
        });
    }

    for path in collect_fixture_files("typescript-errors", &["ts", "tsx", "mts", "cts"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Failure,
        });
    }

    for path in collect_fixture_files("errors", &["cjs", "js", "mjs", "ts", "tsx"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Failure,
        });
    }

    for path in collect_fixture_files("jsx/errors", &["js"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Failure,
        });
    }

    for path in collect_fixture_files("test262-parser/fail", &["js"]) {
        cases.push(ParityCase {
            path,
            expected: ExpectedOutcome::Failure,
        });
    }

    cases.sort_by(|a, b| a.path.cmp(&b.path));
    cases
}

fn run_case(cm: &SourceMap, case: &ParityCase) -> Option<String> {
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    let comments = SingleThreadedComments::default();
    let mut recovered_errors = Vec::new();

    let result = parse_file_as_program(
        &fm,
        syntax_for_file(&case.path),
        Some(&comments),
        &mut recovered_errors,
    );

    let passed = match case.expected {
        ExpectedOutcome::Success => result.is_ok() && recovered_errors.is_empty(),
        ExpectedOutcome::Failure => result.is_err() || !recovered_errors.is_empty(),
    };

    if passed {
        return None;
    }

    let mut msg = String::new();
    let _ = write!(
        &mut msg,
        "case={} expected={:?} got={} recovered={}",
        case.path.display(),
        case.expected,
        if result.is_ok() { "ok" } else { "fatal" },
        recovered_errors.len(),
    );
    Some(msg)
}

#[test]
fn full_suite_pass_fail_parity() {
    std::env::set_var("SWC_ES_PARSER_PARITY_MODE", "1");
    let cm = SourceMap::default();
    let cases = collect_cases();
    assert!(!cases.is_empty(), "expected parity cases to be discovered");

    let mut failures = Vec::new();
    for case in &cases {
        if let Some(failure) = run_case(&cm, case) {
            failures.push(failure);
            if failures.len() >= 100 {
                break;
            }
        }
    }

    assert!(
        failures.is_empty(),
        "parity mismatches: {} / {} (showing up to 100)\n{}",
        failures.len(),
        cases.len(),
        failures.join("\n")
    );
}
