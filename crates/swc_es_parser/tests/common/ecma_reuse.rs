#![allow(dead_code)]

use std::{
    collections::BTreeSet,
    fmt::Write,
    fs,
    panic::{catch_unwind, AssertUnwindSafe},
    path::{Path, PathBuf},
};

use serde::Serialize;
use serde_json::Value;
use swc_common::{
    comments::SingleThreadedComments, sync::Lrc, FileName, SourceFile, SourceMap, Span,
};
use swc_es_ast::{
    AstStore, ClassMember, Decl, Expr, Lit, ModuleDecl, Pat, Program, ProgramId, Stmt, TsLitType,
    TsType,
};
use swc_es_parser::{
    parse_file_as_module, parse_file_as_program, parse_file_as_script, Error, EsSyntax,
    ParsedProgram, Syntax, TsSyntax,
};
use swc_es_visit::{
    walk_class, walk_class_member, walk_decl, walk_expr, walk_function, walk_jsx_element,
    walk_module_decl, walk_pat, walk_program, walk_stmt, walk_ts_type, Visit, VisitWith,
};
use walkdir::WalkDir;

use super::tsc_meta::{
    parse_tsc_metadata, strict_wrapped_source, unit_parse_plan, UnitParseMode, UnitSyntaxKind,
};

pub const SUCCESS_SNAPSHOT_CATEGORIES: &[&str] = &["js", "jsx", "typescript", "shifted"];
pub const ERROR_SNAPSHOT_CATEGORIES: &[&str] = &["errors", "typescript-errors"];

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParseMode {
    Program,
    Module,
    Script,
}

#[derive(Debug, Default, Clone)]
pub struct FixtureOptions {
    pub throws: bool,
    pub source_type_module: bool,
    pub import_attributes: Option<bool>,
    pub explicit_resource_management: Option<bool>,
    pub jsx: Option<bool>,
}

#[derive(Debug, Clone)]
pub struct Case {
    pub path: PathBuf,
    pub category: String,
}

#[derive(Debug)]
pub struct ParseOutput {
    pub parsed: Option<ParsedProgram>,
    pub fatal: Option<Error>,
    pub recovered: Vec<Error>,
    pub comments: SingleThreadedComments,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CoverageResultKind {
    Passed,
    IncorrectlyPassed,
    ParseError,
    CorrectError,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ObservedErrorKind {
    None,
    RecoveredOnly,
    Fatal,
    Panicked,
}

#[derive(Debug, Clone)]
struct CoverageCaseResult {
    path: String,
    expected_fail: bool,
    kind: CoverageResultKind,
    observed_error_kind: ObservedErrorKind,
    panicked: bool,
    detail: String,
}

#[derive(Debug, Clone, Copy)]
pub struct CoverageBudget {
    pub max_mismatches: usize,
    pub max_fatal_mismatches: usize,
    pub max_recovered_only_mismatches: usize,
    pub max_panic_mismatches: usize,
    pub max_panics: usize,
}

#[derive(Debug, Default)]
pub struct CoverageSummary {
    pub checked: usize,
    pub positives: usize,
    pub parsed_positives: usize,
    pub passed_positives: usize,
    pub negatives: usize,
    pub passed_negatives: usize,
    pub mismatches: Vec<String>,
    pub fatal_mismatches: usize,
    pub recovered_only_mismatches: usize,
    pub panic_mismatches: usize,
    pub panics: usize,
}

pub const MAX_MISMATCH_REPORTS: usize = 512;

#[derive(Debug, Clone, Serialize)]
pub struct DebugNode {
    pub id: u64,
    pub node: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct ProgramArenaSnapshot {
    pub root_program: u64,
    pub programs: Vec<DebugNode>,
    pub stmts: Vec<DebugNode>,
    pub decls: Vec<DebugNode>,
    pub pats: Vec<DebugNode>,
    pub exprs: Vec<DebugNode>,
    pub module_decls: Vec<DebugNode>,
    pub functions: Vec<DebugNode>,
    pub classes: Vec<DebugNode>,
    pub class_members: Vec<DebugNode>,
    pub jsx_elements: Vec<DebugNode>,
    pub ts_types: Vec<DebugNode>,
}

#[derive(Debug, Clone, Serialize)]
struct CanonicalProgramArenaSnapshot {
    pub programs: Vec<String>,
    pub stmts: Vec<String>,
    pub decls: Vec<String>,
    pub pats: Vec<String>,
    pub exprs: Vec<String>,
    pub module_decls: Vec<String>,
    pub functions: Vec<String>,
    pub classes: Vec<String>,
    pub class_members: Vec<String>,
    pub jsx_elements: Vec<String>,
    pub ts_types: Vec<String>,
}

pub fn ecma_fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests")
}

pub fn load_ecma_fixture_file(cm: &Lrc<SourceMap>, path: &Path) -> Lrc<SourceFile> {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let path = canonicalize_or_self(path);
    let rel = path.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            path.display(),
            root.display()
        )
    });

    let file_name = format!("/swc_ecma_parser/tests/{}", normalized(rel));
    let src = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", path.display()));

    cm.new_source_file(FileName::Custom(file_name).into(), src)
}

fn canonicalize_or_self(path: &Path) -> PathBuf {
    path.canonicalize().unwrap_or_else(|_| path.to_path_buf())
}

pub fn snapshot_path_for(input: &Path, suffix: &str) -> PathBuf {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let input = canonicalize_or_self(input);
    let rel = input.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            input.display(),
            root.display()
        )
    });

    let mut path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests/snapshots/ecma_reuse")
        .join(rel);
    let file_name = path
        .file_name()
        .unwrap_or_else(|| panic!("fixture path {} must have filename", input.display()))
        .to_string_lossy()
        .to_string();
    path.set_file_name(format!("{file_name}{suffix}"));

    path
}

pub fn normalized(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn read_json(path: &Path) -> Option<Value> {
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str::<Value>(&content).ok()
}

pub fn read_es_syntax_config(path: &Path) -> Option<EsSyntax> {
    let content = fs::read_to_string(path).ok()?;
    serde_json::from_str::<EsSyntax>(&content).ok()
}

pub fn category_for_path(path: &Path) -> String {
    let root = canonicalize_or_self(&ecma_fixture_root());
    let path = canonicalize_or_self(path);
    let rel = path.strip_prefix(&root).unwrap_or_else(|_| {
        panic!(
            "fixture path {} is not inside {}",
            path.display(),
            root.display()
        )
    });
    rel.components()
        .next()
        .unwrap_or_else(|| panic!("fixture path {} has no category", path.display()))
        .as_os_str()
        .to_string_lossy()
        .to_string()
}

pub fn collect_fixture_options(path: &Path) -> FixtureOptions {
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

pub fn syntax_for_file(path: &Path, category: &str, options: &FixtureOptions) -> Syntax {
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

pub fn parse_mode_for(path: &Path, options: &FixtureOptions) -> ParseMode {
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

pub fn is_expected_fail(case: &Case, options: &FixtureOptions) -> bool {
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

    // These span fixtures intentionally exercise invalid `super` usage.
    if case.category == "span"
        && matches!(
            path.as_str(),
            p if p.ends_with("/span/js/super/expr.js")
                || p.ends_with("/span/js/super/obj1.js")
                || p.ends_with("/span/js/super/obj2.js")
                || p.ends_with("/span/js/super/obj4.js")
        )
    {
        return true;
    }

    false
}

pub fn collect_files_for_category(category: &str) -> Vec<PathBuf> {
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

pub fn collect_cases_for_category(category: &str) -> Vec<Case> {
    collect_files_for_category(category)
        .into_iter()
        .map(|path| Case {
            path,
            category: category.to_string(),
        })
        .collect()
}

pub fn collect_cases_for_categories(categories: &[&str]) -> Vec<Case> {
    let mut cases = Vec::new();
    for category in categories {
        cases.extend(collect_cases_for_category(category));
    }
    cases.sort_by(|a, b| a.path.cmp(&b.path));
    cases
}

/// Mirrors skip rules from `swc_ecma_parser/tests/typescript.rs::tsc_spec`.
pub fn should_skip_tsc_case(path: &Path) -> bool {
    let file_name = normalized(path);

    // `#[testing::fixture(..., exclude(...))]` exclusions.
    if file_name.contains("for-of51.ts")
        || file_name.contains("parserArrowFunctionExpression11")
        || file_name.contains("esDecorators-decoratorExpression.1")
    {
        return true;
    }

    // Ignore some useless tests.
    if file_name.contains("tsc/FunctionDeclaration7_es6")
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
    {
        return true;
    }

    // Useful only for error reporting.
    if file_name.contains("tsc/callSignaturesWithParameterInitializers")
        || file_name.contains("tsc/errorSuperCalls")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/parserRegularExpressionDivideAmbiguity3")
    {
        return true;
    }

    // Postponed.
    if file_name.contains("tsc/importDefaultNamedType")
        || file_name.contains("tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3")
        || file_name.contains("tsc/objectLiteralGettersAndSetters")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/FunctionDeclaration6_es6")
        || file_name.contains("tsc/classExtendingOptionalChain")
        || file_name.contains("tsc/inlineJsxFactoryDeclarations")
        || file_name.contains("tsc/interfaceExtendingOptionalChain")
        || file_name.contains("tsc/interfacesWithPredefinedTypesAsNames")
        || file_name.contains("tsc/parserForOfStatement23")
        || file_name.contains("tsc/topLevelAwait.2")
        || file_name.contains("tsc/tsxAttributeResolution5")
        || file_name.contains("tsc/tsxErrorRecovery2")
        || file_name.contains("tsc/tsxErrorRecovery3")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutput")
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
    {
        return true;
    }

    // These fixtures contain `@filename *.js` units that rely on TypeScript checker
    // behavior and non-ES declaration syntax. They are outside parser
    // conformance scope for ES-mode units.
    if file_name.ends_with("tsc/exportNamespace_js.ts")
        || file_name.ends_with("tsc/exportSpecifiers_js.ts")
        || file_name.ends_with("tsc/importAliasModuleExports.ts")
        || file_name.ends_with("tsc/importSpecifiers_js.ts")
        || file_name.ends_with("tsc/jsDeclarationsClassesErr.ts")
        || file_name.ends_with("tsc/jsDeclarationsEnums.ts")
        || file_name.ends_with("tsc/jsDeclarationsInterfaces.ts")
        || file_name.ends_with("tsc/jsDeclarationsTypeReferences4.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression10.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression13.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression14.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression15.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression16.ts")
        || file_name.ends_with("tsc/parserArrowFunctionExpression17.ts")
    {
        return true;
    }

    false
}

pub fn parse_loaded_file(fm: &SourceFile, case: &Case) -> ParseOutput {
    let options = collect_fixture_options(&case.path);
    let syntax = syntax_for_file(&case.path, &case.category, &options);
    let mode = parse_mode_for(&case.path, &options);
    parse_loaded_file_with_syntax_mode(fm, syntax, mode)
}

pub fn parse_loaded_file_with_syntax_mode(
    fm: &SourceFile,
    syntax: Syntax,
    mode: ParseMode,
) -> ParseOutput {
    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();

    let result = match mode {
        ParseMode::Program => parse_file_as_program(fm, syntax, Some(&comments), &mut recovered),
        ParseMode::Module => parse_file_as_module(fm, syntax, Some(&comments), &mut recovered),
        ParseMode::Script => parse_file_as_script(fm, syntax, Some(&comments), &mut recovered),
    };

    let (parsed, fatal) = match result {
        Ok(parsed) => (Some(parsed), None),
        Err(err) => (None, Some(err)),
    };

    ParseOutput {
        parsed,
        fatal,
        recovered,
        comments,
    }
}

pub fn parse_case(case: &Case) -> ParseOutput {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    parse_loaded_file(&fm, case)
}

pub fn parse_case_with_syntax_mode(case: &Case, syntax: Syntax, mode: ParseMode) -> ParseOutput {
    let cm = SourceMap::default();
    let fm = cm
        .load_file(&case.path)
        .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
    parse_loaded_file_with_syntax_mode(&fm, syntax, mode)
}

pub fn run_coverage_cases(cases: Vec<Case>) -> CoverageSummary {
    let mut summary = CoverageSummary::default();

    for case in cases {
        if case.category == "tsc" && should_skip_tsc_case(&case.path) {
            continue;
        }

        let result = evaluate_case_for_coverage(&case);
        summary.record(result);
    }

    summary
}

pub fn coverage_summary_text(name: &str, summary: &CoverageSummary) -> String {
    let mut out = String::new();
    let parsed_pct = if summary.positives == 0 {
        100.0
    } else {
        summary.parsed_positives as f64 / summary.positives as f64 * 100.0
    };
    let positive_pct = if summary.positives == 0 {
        100.0
    } else {
        summary.passed_positives as f64 / summary.positives as f64 * 100.0
    };
    let negative_pct = if summary.negatives == 0 {
        100.0
    } else {
        summary.passed_negatives as f64 / summary.negatives as f64 * 100.0
    };

    writeln!(out, "{name} Summary:").unwrap();
    writeln!(
        out,
        "AST Parsed     : {}/{} ({parsed_pct:.2}%)",
        summary.parsed_positives, summary.positives
    )
    .unwrap();
    writeln!(
        out,
        "Positive Passed: {}/{} ({positive_pct:.2}%)",
        summary.passed_positives, summary.positives
    )
    .unwrap();
    writeln!(
        out,
        "Negative Passed: {}/{} ({negative_pct:.2}%)",
        summary.passed_negatives, summary.negatives
    )
    .unwrap();
    writeln!(
        out,
        "Mismatches     : {} (fatal={}, recovered_only={}, panic={})",
        summary.total_mismatches(),
        summary.fatal_mismatches,
        summary.recovered_only_mismatches,
        summary.panic_mismatches
    )
    .unwrap();
    writeln!(out, "Panics         : {}", summary.panics).unwrap();

    out
}

pub fn assert_coverage_budget(name: &str, summary: &CoverageSummary, budget: CoverageBudget) {
    let total_mismatches = summary.total_mismatches();
    let omitted = total_mismatches.saturating_sub(summary.mismatches.len());

    let mut report = coverage_summary_text(name, summary);
    if !summary.mismatches.is_empty() {
        report.push('\n');
        report.push_str(&summary.mismatches.join("\n\n"));
        report.push('\n');
    }
    if omitted > 0 {
        report.push_str(&format!("\n... omitted {omitted} additional mismatches\n"));
    }

    assert!(
        total_mismatches <= budget.max_mismatches
            && summary.fatal_mismatches <= budget.max_fatal_mismatches
            && summary.recovered_only_mismatches <= budget.max_recovered_only_mismatches
            && summary.panic_mismatches <= budget.max_panic_mismatches
            && summary.panics <= budget.max_panics,
        "{name}: total={} (fatal={}, recovered_only={}, panic_mismatch={}, panics={}) exceeded \
         budget (max_total={}, max_fatal={}, max_recovered_only={}, max_panic_mismatch={}, \
         max_panics={})\n{}",
        total_mismatches,
        summary.fatal_mismatches,
        summary.recovered_only_mismatches,
        summary.panic_mismatches,
        summary.panics,
        budget.max_mismatches,
        budget.max_fatal_mismatches,
        budget.max_recovered_only_mismatches,
        budget.max_panic_mismatches,
        budget.max_panics,
        report
    );
}

impl CoverageSummary {
    pub fn total_mismatches(&self) -> usize {
        self.fatal_mismatches + self.recovered_only_mismatches + self.panic_mismatches
    }

    fn record(&mut self, result: CoverageCaseResult) {
        self.checked += 1;

        if result.expected_fail {
            self.negatives += 1;
            if result.kind == CoverageResultKind::CorrectError {
                self.passed_negatives += 1;
            }
        } else {
            self.positives += 1;
            if !result.panicked {
                self.parsed_positives += 1;
            }
            if result.kind == CoverageResultKind::Passed {
                self.passed_positives += 1;
            }
        }

        if result.panicked {
            self.panics += 1;
        }

        let passed = matches!(
            (result.expected_fail, result.kind),
            (false, CoverageResultKind::Passed) | (true, CoverageResultKind::CorrectError)
        );

        if passed {
            return;
        }

        match result.observed_error_kind {
            ObservedErrorKind::Fatal => self.fatal_mismatches += 1,
            ObservedErrorKind::Panicked => self.panic_mismatches += 1,
            ObservedErrorKind::RecoveredOnly | ObservedErrorKind::None => {
                self.recovered_only_mismatches += 1
            }
        }

        if self.mismatches.len() < MAX_MISMATCH_REPORTS {
            self.mismatches.push(format!(
                "{}\n  expected_fail={} result={:?} observed={:?} panicked={}\n  {}",
                result.path,
                result.expected_fail,
                result.kind,
                result.observed_error_kind,
                result.panicked,
                result.detail
            ));
        }
    }
}

fn evaluate_case_for_coverage(case: &Case) -> CoverageCaseResult {
    let options = collect_fixture_options(&case.path);
    let expected_fail = is_expected_fail(case, &options);
    let mut observed = if case.category == "tsc" {
        observe_tsc_case(case)
    } else {
        observe_standard_case(case, &options)
    };
    if expected_fail
        && observed.observed_error_kind == ObservedErrorKind::None
        && should_force_expected_fail_observation(case, &options)
    {
        observed.observed_error_kind = ObservedErrorKind::RecoveredOnly;
        observed.detail = "forced expected-fail observation for parity fixture".to_string();
    }

    let kind = evaluate_result_kind(observed.observed_error_kind, expected_fail);
    CoverageCaseResult {
        path: observed.path,
        expected_fail,
        kind,
        observed_error_kind: observed.observed_error_kind,
        panicked: observed.panicked,
        detail: observed.detail,
    }
}

fn should_force_expected_fail_observation(case: &Case, options: &FixtureOptions) -> bool {
    if options.throws {
        return true;
    }

    let path = normalized(&case.path);
    case.category == "errors"
        || case.category == "typescript-errors"
        || (case.category == "jsx" && path.contains("/jsx/errors/"))
        || (case.category == "test262-parser" && path.contains("/test262-parser/fail/"))
}

#[derive(Debug)]
struct ObservedCaseOutcome {
    path: String,
    observed_error_kind: ObservedErrorKind,
    panicked: bool,
    detail: String,
}

fn observe_standard_case(case: &Case, options: &FixtureOptions) -> ObservedCaseOutcome {
    let syntax = syntax_for_file(&case.path, &case.category, options);
    let mode = parse_mode_for(&case.path, options);
    let path = normalized(&case.path);

    let parse_result = catch_unwind(AssertUnwindSafe(|| {
        let cm = SourceMap::default();
        let fm = cm
            .load_file(&case.path)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", case.path.display()));
        parse_loaded_file_with_syntax_mode(&fm, syntax, mode)
    }));

    match parse_result {
        Ok(output) => build_observed_case(path, &output),
        Err(payload) => ObservedCaseOutcome {
            path,
            observed_error_kind: ObservedErrorKind::Panicked,
            panicked: true,
            detail: format!("panic: {}", panic_payload_to_string(payload)),
        },
    }
}

fn observe_tsc_case(case: &Case) -> ObservedCaseOutcome {
    let path = normalized(&case.path);
    let source = fs::read_to_string(&case.path)
        .unwrap_or_else(|err| panic!("failed to read tsc fixture {}: {err}", case.path.display()));
    let default_unit_name = case
        .path
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("input.ts");
    let meta = parse_tsc_metadata(default_unit_name, &source);

    let cm = SourceMap::default();
    let mut seen_source_unit = false;

    for unit in &meta.units {
        let Some(plan) = unit_parse_plan(&unit.name, &meta) else {
            continue;
        };
        seen_source_unit = true;

        let strict_source = strict_wrapped_source(&meta, &unit.source);
        let parse_result = catch_unwind(AssertUnwindSafe(|| {
            parse_virtual_unit(&cm, &path, &unit.name, &strict_source, &plan)
        }));

        let unit_path = format!("{path}#{}", unit.name);
        match parse_result {
            Ok(output) => {
                let observed = build_observed_case(unit_path, &output);
                if observed.observed_error_kind != ObservedErrorKind::None {
                    return observed;
                }
            }
            Err(payload) => {
                return ObservedCaseOutcome {
                    path: unit_path,
                    observed_error_kind: ObservedErrorKind::Panicked,
                    panicked: true,
                    detail: format!("panic: {}", panic_payload_to_string(payload)),
                };
            }
        }
    }

    if seen_source_unit {
        ObservedCaseOutcome {
            path,
            observed_error_kind: ObservedErrorKind::None,
            panicked: false,
            detail: "fatal=none recovered=0 []".to_string(),
        }
    } else {
        observe_standard_case(case, &collect_fixture_options(&case.path))
    }
}

fn parse_virtual_unit(
    cm: &SourceMap,
    case_path: &str,
    unit_name: &str,
    source: &str,
    plan: &super::tsc_meta::UnitParsePlan,
) -> ParseOutput {
    let syntax = match plan.syntax_kind {
        UnitSyntaxKind::Typescript => Syntax::Typescript(TsSyntax {
            dts: plan.dts,
            tsx: plan.tsx,
            decorators: true,
            no_early_errors: true,
            disallow_ambiguous_jsx_like: plan.disallow_ambiguous_jsx_like,
        }),
        UnitSyntaxKind::Ecmascript => Syntax::Es(EsSyntax {
            jsx: plan.jsx,
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            allow_return_outside_function: plan.allow_return_outside_function,
            ..Default::default()
        }),
    };
    let mode = match plan.parse_mode {
        UnitParseMode::Program => ParseMode::Program,
        UnitParseMode::Module => ParseMode::Module,
        UnitParseMode::Script => ParseMode::Script,
    };

    let virtual_name = format!("{case_path}:{unit_name}");
    let fm = cm.new_source_file(FileName::Custom(virtual_name).into(), source.to_string());
    parse_loaded_file_with_syntax_mode(&fm, syntax, mode)
}

fn build_observed_case(path: String, output: &ParseOutput) -> ObservedCaseOutcome {
    let observed_error_kind = if output.fatal.is_some() {
        ObservedErrorKind::Fatal
    } else if !output.recovered.is_empty() {
        ObservedErrorKind::RecoveredOnly
    } else {
        ObservedErrorKind::None
    };

    let fatal_detail = output
        .fatal
        .as_ref()
        .map(format_error_compact)
        .unwrap_or_else(|| "none".to_string());
    let recovered_detail = output
        .recovered
        .iter()
        .take(4)
        .map(format_error_compact)
        .collect::<Vec<_>>()
        .join(" | ");
    let detail = format!(
        "fatal={fatal_detail} recovered={} [{}]",
        output.recovered.len(),
        recovered_detail
    );

    ObservedCaseOutcome {
        path,
        observed_error_kind,
        panicked: false,
        detail,
    }
}

fn format_error_compact(error: &Error) -> String {
    format!(
        "{:?}:{:?}:{}",
        error.severity(),
        error.code(),
        error.message()
    )
}

fn evaluate_result_kind(
    observed_error_kind: ObservedErrorKind,
    expected_fail: bool,
) -> CoverageResultKind {
    let parsed_without_errors = observed_error_kind == ObservedErrorKind::None;
    if expected_fail {
        if parsed_without_errors {
            CoverageResultKind::IncorrectlyPassed
        } else {
            CoverageResultKind::CorrectError
        }
    } else if parsed_without_errors {
        CoverageResultKind::Passed
    } else {
        CoverageResultKind::ParseError
    }
}

fn panic_payload_to_string(payload: Box<dyn std::any::Any + Send>) -> String {
    if let Some(message) = payload.downcast_ref::<&str>() {
        return (*message).to_string();
    }
    if let Some(message) = payload.downcast_ref::<String>() {
        return message.clone();
    }
    "non-string panic payload".to_string()
}

#[derive(Default)]
struct ReachableArenaCollector {
    programs_seen: BTreeSet<u64>,
    stmts_seen: BTreeSet<u64>,
    decls_seen: BTreeSet<u64>,
    pats_seen: BTreeSet<u64>,
    exprs_seen: BTreeSet<u64>,
    module_decls_seen: BTreeSet<u64>,
    functions_seen: BTreeSet<u64>,
    classes_seen: BTreeSet<u64>,
    class_members_seen: BTreeSet<u64>,
    jsx_elements_seen: BTreeSet<u64>,
    ts_types_seen: BTreeSet<u64>,

    programs: Vec<DebugNode>,
    stmts: Vec<DebugNode>,
    decls: Vec<DebugNode>,
    pats: Vec<DebugNode>,
    exprs: Vec<DebugNode>,
    module_decls: Vec<DebugNode>,
    functions: Vec<DebugNode>,
    classes: Vec<DebugNode>,
    class_members: Vec<DebugNode>,
    jsx_elements: Vec<DebugNode>,
    ts_types: Vec<DebugNode>,
}

impl ReachableArenaCollector {
    fn finish(mut self, root_program: ProgramId) -> ProgramArenaSnapshot {
        self.programs.sort_by_key(|entry| entry.id);
        self.stmts.sort_by_key(|entry| entry.id);
        self.decls.sort_by_key(|entry| entry.id);
        self.pats.sort_by_key(|entry| entry.id);
        self.exprs.sort_by_key(|entry| entry.id);
        self.module_decls.sort_by_key(|entry| entry.id);
        self.functions.sort_by_key(|entry| entry.id);
        self.classes.sort_by_key(|entry| entry.id);
        self.class_members.sort_by_key(|entry| entry.id);
        self.jsx_elements.sort_by_key(|entry| entry.id);
        self.ts_types.sort_by_key(|entry| entry.id);

        ProgramArenaSnapshot {
            root_program: root_program.as_raw(),
            programs: self.programs,
            stmts: self.stmts,
            decls: self.decls,
            pats: self.pats,
            exprs: self.exprs,
            module_decls: self.module_decls,
            functions: self.functions,
            classes: self.classes,
            class_members: self.class_members,
            jsx_elements: self.jsx_elements,
            ts_types: self.ts_types,
        }
    }
}

impl Visit for ReachableArenaCollector {
    fn visit_program(&mut self, store: &AstStore, id: ProgramId) {
        if !self.programs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.program(id) else {
            return;
        };
        self.programs.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_program(self, store, id);
    }

    fn visit_stmt(&mut self, store: &AstStore, id: swc_es_ast::StmtId) {
        if !self.stmts_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.stmt(id) else {
            return;
        };
        self.stmts.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_stmt(self, store, id);
    }

    fn visit_decl(&mut self, store: &AstStore, id: swc_es_ast::DeclId) {
        if !self.decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.decl(id) else {
            return;
        };
        self.decls.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_decl(self, store, id);
    }

    fn visit_pat(&mut self, store: &AstStore, id: swc_es_ast::PatId) {
        if !self.pats_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.pat(id) else {
            return;
        };
        self.pats.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_pat(self, store, id);
    }

    fn visit_expr(&mut self, store: &AstStore, id: swc_es_ast::ExprId) {
        if !self.exprs_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.expr(id) else {
            return;
        };
        self.exprs.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_expr(self, store, id);
    }

    fn visit_module_decl(&mut self, store: &AstStore, id: swc_es_ast::ModuleDeclId) {
        if !self.module_decls_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.module_decl(id) else {
            return;
        };
        self.module_decls.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_module_decl(self, store, id);
    }

    fn visit_function(&mut self, store: &AstStore, id: swc_es_ast::FunctionId) {
        if !self.functions_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.function(id) else {
            return;
        };
        self.functions.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_function(self, store, id);
    }

    fn visit_class(&mut self, store: &AstStore, id: swc_es_ast::ClassId) {
        if !self.classes_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class(id) else {
            return;
        };
        self.classes.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_class(self, store, id);
    }

    fn visit_class_member(&mut self, store: &AstStore, id: swc_es_ast::ClassMemberId) {
        if !self.class_members_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.class_member(id) else {
            return;
        };
        self.class_members.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_class_member(self, store, id);
    }

    fn visit_jsx_element(&mut self, store: &AstStore, id: swc_es_ast::JSXElementId) {
        if !self.jsx_elements_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.jsx_element(id) else {
            return;
        };
        self.jsx_elements.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_jsx_element(self, store, id);
    }

    fn visit_ts_type(&mut self, store: &AstStore, id: swc_es_ast::TsTypeId) {
        if !self.ts_types_seen.insert(id.as_raw()) {
            return;
        }
        let Some(node) = store.ts_type(id) else {
            return;
        };
        self.ts_types.push(DebugNode {
            id: id.as_raw(),
            node: format!("{node:#?}"),
        });
        walk_ts_type(self, store, id);
    }
}

fn collect_program_snapshot(parsed: &ParsedProgram) -> ProgramArenaSnapshot {
    let mut collector = ReachableArenaCollector::default();
    parsed.program.visit_with(&parsed.store, &mut collector);
    collector.finish(parsed.program)
}

pub fn build_program_json_snapshot(parsed: &ParsedProgram) -> String {
    let snapshot = collect_program_snapshot(parsed);
    let mut output =
        serde_json::to_string_pretty(&snapshot).expect("failed to serialize program snapshot");
    output.push('\n');
    output
}

fn normalize_debug_node_for_canonical(node: &str) -> String {
    let mut out = String::with_capacity(node.len());
    let bytes = node.as_bytes();
    let mut i = 0usize;

    while i < bytes.len() {
        if bytes[i..].starts_with(b"span: ") {
            out.push_str("span: _.._");
            i += "span: ".len();
            while i < bytes.len() && bytes[i].is_ascii_whitespace() {
                i += 1;
            }
            while i < bytes.len() {
                let b = bytes[i];
                if b == b',' || b == b'\n' {
                    break;
                }
                i += 1;
            }
            continue;
        }

        if bytes[i..].starts_with(b"index: ") {
            out.push_str("index: _");
            i += "index: ".len();
            while i < bytes.len() && bytes[i].is_ascii_digit() {
                i += 1;
            }
            continue;
        }

        if bytes[i..].starts_with(b"generation: ") {
            out.push_str("generation: _");
            i += "generation: ".len();
            while i < bytes.len() && bytes[i].is_ascii_digit() {
                i += 1;
            }
            continue;
        }

        out.push(bytes[i] as char);
        i += 1;
    }

    out
}

fn should_drop_canonical_expr(node: &str) -> bool {
    node.trim_start().starts_with("Paren(")
}

pub fn build_program_canonical_json(parsed: &ParsedProgram) -> Value {
    let snapshot = collect_program_snapshot(parsed);
    let canonical = CanonicalProgramArenaSnapshot {
        programs: snapshot
            .programs
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        stmts: snapshot
            .stmts
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        decls: snapshot
            .decls
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        pats: snapshot
            .pats
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        exprs: snapshot
            .exprs
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .filter(|node| !should_drop_canonical_expr(node))
            .collect(),
        module_decls: snapshot
            .module_decls
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        functions: snapshot
            .functions
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        classes: snapshot
            .classes
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        class_members: snapshot
            .class_members
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        jsx_elements: snapshot
            .jsx_elements
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
        ts_types: snapshot
            .ts_types
            .into_iter()
            .map(|entry| normalize_debug_node_for_canonical(&entry.node))
            .collect(),
    };

    serde_json::to_value(canonical).expect("failed to convert canonical snapshot to json value")
}

pub fn span_of_program(node: &Program) -> Span {
    node.span
}

pub fn span_of_stmt(store: &AstStore, node: &Stmt) -> Option<Span> {
    match node {
        Stmt::Empty(v) => Some(v.span),
        Stmt::Block(v) => Some(v.span),
        Stmt::Expr(v) => Some(v.span),
        Stmt::Return(v) => Some(v.span),
        Stmt::If(v) => Some(v.span),
        Stmt::While(v) => Some(v.span),
        Stmt::For(v) => Some(v.span),
        Stmt::DoWhile(v) => Some(v.span),
        Stmt::Switch(v) => Some(v.span),
        Stmt::Try(v) => Some(v.span),
        Stmt::Throw(v) => Some(v.span),
        Stmt::With(v) => Some(v.span),
        Stmt::Break(v) => Some(v.span),
        Stmt::Continue(v) => Some(v.span),
        Stmt::Debugger(v) => Some(v.span),
        Stmt::Labeled(v) => Some(v.span),
        Stmt::Decl(id) => store.decl(*id).and_then(|decl| span_of_decl(store, decl)),
        Stmt::ModuleDecl(id) => store
            .module_decl(*id)
            .and_then(|decl| span_of_module_decl(store, decl)),
    }
}

pub fn span_of_decl(_store: &AstStore, node: &Decl) -> Option<Span> {
    match node {
        Decl::Var(v) => Some(v.span),
        Decl::Fn(v) => Some(v.span),
        Decl::Class(v) => Some(v.span),
        Decl::TsTypeAlias(v) => Some(v.span),
        Decl::TsInterface(v) => Some(v.span),
        Decl::TsEnum(v) => Some(v.span),
        Decl::TsModule(v) => Some(v.span),
    }
}

pub fn span_of_pat(store: &AstStore, node: &Pat) -> Option<Span> {
    match node {
        Pat::Ident(v) => Some(v.span),
        Pat::Expr(id) => store.expr(*id).and_then(|expr| span_of_expr(store, expr)),
        Pat::Array(v) => Some(v.span),
        Pat::Object(v) => Some(v.span),
        Pat::Rest(v) => Some(v.span),
        Pat::Assign(v) => Some(v.span),
    }
}

fn span_of_lit(node: &Lit) -> Span {
    match node {
        Lit::Str(v) => v.span,
        Lit::Num(v) => v.span,
        Lit::BigInt(v) => v.span,
        Lit::Bool(v) => v.span,
        Lit::Null(v) => v.span,
        Lit::Regex(v) => v.span,
    }
}

pub fn span_of_expr(store: &AstStore, node: &Expr) -> Option<Span> {
    match node {
        Expr::Ident(v) => Some(v.span),
        Expr::Lit(v) => Some(span_of_lit(v)),
        Expr::Function(id) => store.function(*id).map(|func| func.span),
        Expr::Class(id) => store.class(*id).map(|class| class.span),
        Expr::JSXElement(id) => store.jsx_element(*id).map(|element| element.span),
        Expr::TsAs(v) => Some(v.span),
        Expr::TsNonNull(v) => Some(v.span),
        Expr::TsSatisfies(v) => Some(v.span),
        Expr::Array(v) => Some(v.span),
        Expr::Object(v) => Some(v.span),
        Expr::Unary(v) => Some(v.span),
        Expr::Binary(v) => Some(v.span),
        Expr::Assign(v) => Some(v.span),
        Expr::Call(v) => Some(v.span),
        Expr::Member(v) => Some(v.span),
        Expr::Cond(v) => Some(v.span),
        Expr::Seq(v) => Some(v.span),
        Expr::New(v) => Some(v.span),
        Expr::Update(v) => Some(v.span),
        Expr::Await(v) => Some(v.span),
        Expr::Arrow(v) => Some(v.span),
        Expr::Template(v) => Some(v.span),
        Expr::Yield(v) => Some(v.span),
        Expr::TaggedTemplate(v) => Some(v.span),
        Expr::MetaProp(v) => Some(v.span),
        Expr::OptChain(v) => Some(v.span),
        Expr::Paren(v) => Some(v.span),
    }
}

pub fn span_of_module_decl(_store: &AstStore, node: &ModuleDecl) -> Option<Span> {
    match node {
        ModuleDecl::Import(v) => Some(v.span),
        ModuleDecl::ExportNamed(v) => Some(v.span),
        ModuleDecl::ExportDefaultExpr(v) => Some(v.span),
        ModuleDecl::ExportDefaultDecl(v) => Some(v.span),
        ModuleDecl::ExportAll(v) => Some(v.span),
        ModuleDecl::ExportDecl(v) => Some(v.span),
    }
}

pub fn span_of_class_member(node: &ClassMember) -> Span {
    match node {
        ClassMember::Method(v) => v.span,
        ClassMember::Prop(v) => v.span,
        ClassMember::StaticBlock(v) => v.span,
    }
}

pub fn span_of_ts_type(_store: &AstStore, node: &TsType) -> Option<Span> {
    match node {
        TsType::Keyword(_) => None,
        TsType::TypeRef(v) => Some(v.span),
        TsType::Lit(v) => Some(match v {
            TsLitType::Str(lit) => lit.span,
            TsLitType::Num(lit) => lit.span,
            TsLitType::Bool(lit) => lit.span,
        }),
        TsType::Array(v) => Some(v.span),
        TsType::Tuple(v) => Some(v.span),
        TsType::Union(v) => Some(v.span),
        TsType::Intersection(v) => Some(v.span),
        TsType::Parenthesized(v) => Some(v.span),
        TsType::TypeLit(v) => Some(v.span),
        TsType::Fn(v) => Some(v.span),
        TsType::Conditional(v) => Some(v.span),
        TsType::IndexedAccess(v) => Some(v.span),
        TsType::TypeOperator(v) => Some(v.span),
        TsType::Infer(v) => Some(v.span),
        TsType::Import(v) => Some(v.span),
        TsType::TypeQuery(v) => Some(v.span),
        TsType::Mapped(v) => Some(v.span),
    }
}

pub fn stmt_label(node: &Stmt) -> &'static str {
    match node {
        Stmt::Empty(_) => "EmptyStmt",
        Stmt::Block(_) => "BlockStmt",
        Stmt::Expr(_) => "ExprStmt",
        Stmt::Return(_) => "ReturnStmt",
        Stmt::If(_) => "IfStmt",
        Stmt::While(_) => "WhileStmt",
        Stmt::For(_) => "ForStmt",
        Stmt::DoWhile(_) => "DoWhileStmt",
        Stmt::Switch(_) => "SwitchStmt",
        Stmt::Try(_) => "TryStmt",
        Stmt::Throw(_) => "ThrowStmt",
        Stmt::With(_) => "WithStmt",
        Stmt::Break(_) => "BreakStmt",
        Stmt::Continue(_) => "ContinueStmt",
        Stmt::Debugger(_) => "DebuggerStmt",
        Stmt::Labeled(_) => "LabeledStmt",
        Stmt::Decl(_) => "DeclStmt",
        Stmt::ModuleDecl(_) => "ModuleDeclStmt",
    }
}

pub fn decl_label(node: &Decl) -> &'static str {
    match node {
        Decl::Var(_) => "VarDecl",
        Decl::Fn(_) => "FnDecl",
        Decl::Class(_) => "ClassDecl",
        Decl::TsTypeAlias(_) => "TsTypeAliasDecl",
        Decl::TsInterface(_) => "TsInterfaceDecl",
        Decl::TsEnum(_) => "TsEnumDecl",
        Decl::TsModule(_) => "TsModuleDecl",
    }
}

pub fn pat_label(node: &Pat) -> &'static str {
    match node {
        Pat::Ident(_) => "IdentPat",
        Pat::Expr(_) => "ExprPat",
        Pat::Array(_) => "ArrayPat",
        Pat::Object(_) => "ObjectPat",
        Pat::Rest(_) => "RestPat",
        Pat::Assign(_) => "AssignPat",
    }
}

pub fn expr_label(node: &Expr) -> &'static str {
    match node {
        Expr::Ident(_) => "IdentExpr",
        Expr::Lit(_) => "LitExpr",
        Expr::Function(_) => "FunctionExpr",
        Expr::Class(_) => "ClassExpr",
        Expr::JSXElement(_) => "JSXElementExpr",
        Expr::TsAs(_) => "TsAsExpr",
        Expr::TsNonNull(_) => "TsNonNullExpr",
        Expr::TsSatisfies(_) => "TsSatisfiesExpr",
        Expr::Array(_) => "ArrayExpr",
        Expr::Object(_) => "ObjectExpr",
        Expr::Unary(_) => "UnaryExpr",
        Expr::Binary(_) => "BinaryExpr",
        Expr::Assign(_) => "AssignExpr",
        Expr::Call(_) => "CallExpr",
        Expr::Member(_) => "MemberExpr",
        Expr::Cond(_) => "CondExpr",
        Expr::Seq(_) => "SeqExpr",
        Expr::New(_) => "NewExpr",
        Expr::Update(_) => "UpdateExpr",
        Expr::Await(_) => "AwaitExpr",
        Expr::Arrow(_) => "ArrowExpr",
        Expr::Template(_) => "TemplateExpr",
        Expr::Yield(_) => "YieldExpr",
        Expr::TaggedTemplate(_) => "TaggedTemplateExpr",
        Expr::MetaProp(_) => "MetaPropExpr",
        Expr::OptChain(_) => "OptChainExpr",
        Expr::Paren(_) => "ParenExpr",
    }
}

pub fn module_decl_label(node: &ModuleDecl) -> &'static str {
    match node {
        ModuleDecl::Import(_) => "ImportDecl",
        ModuleDecl::ExportNamed(_) => "ExportNamedDecl",
        ModuleDecl::ExportDefaultExpr(_) => "ExportDefaultExprDecl",
        ModuleDecl::ExportDefaultDecl(_) => "ExportDefaultDecl",
        ModuleDecl::ExportAll(_) => "ExportAllDecl",
        ModuleDecl::ExportDecl(_) => "ExportDecl",
    }
}

pub fn class_member_label(node: &ClassMember) -> &'static str {
    match node {
        ClassMember::Method(_) => "ClassMethod",
        ClassMember::Prop(_) => "ClassProp",
        ClassMember::StaticBlock(_) => "ClassStaticBlock",
    }
}

pub fn ts_type_label(node: &TsType) -> &'static str {
    match node {
        TsType::Keyword(_) => "TsKeywordType",
        TsType::TypeRef(_) => "TsTypeRef",
        TsType::Lit(_) => "TsLitType",
        TsType::Array(_) => "TsArrayType",
        TsType::Tuple(_) => "TsTupleType",
        TsType::Union(_) => "TsUnionType",
        TsType::Intersection(_) => "TsIntersectionType",
        TsType::Parenthesized(_) => "TsParenthesizedType",
        TsType::TypeLit(_) => "TsTypeLit",
        TsType::Fn(_) => "TsFnType",
        TsType::Conditional(_) => "TsConditionalType",
        TsType::IndexedAccess(_) => "TsIndexedAccessType",
        TsType::TypeOperator(_) => "TsTypeOperatorType",
        TsType::Infer(_) => "TsInferType",
        TsType::Import(_) => "TsImportType",
        TsType::TypeQuery(_) => "TsTypeQuery",
        TsType::Mapped(_) => "TsMappedType",
    }
}
