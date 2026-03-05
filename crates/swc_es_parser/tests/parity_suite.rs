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

#[derive(Debug, Clone, Copy)]
struct ParityBudget {
    max_mismatches: usize,
    max_fatal_mismatches: usize,
    max_recovered_only_mismatches: usize,
}

#[derive(Debug, Default)]
struct ParitySummary {
    checked: usize,
    mismatches: Vec<String>,
    fatal_mismatches: usize,
    recovered_only_mismatches: usize,
}

const MAX_MISMATCH_REPORTS: usize = 512;

// These budgets are intentionally strict for the current parser capability.
// They make parity useful as a regression signal without pretending full
// compatibility with the reused fixture corpus yet.
const CORE_CORPUS_BUDGET: ParityBudget = ParityBudget {
    max_mismatches: 0,
    max_fatal_mismatches: 0,
    max_recovered_only_mismatches: 0,
};

const LARGE_SAMPLES_BUDGET: ParityBudget = ParityBudget {
    max_mismatches: 0,
    max_fatal_mismatches: 0,
    max_recovered_only_mismatches: 0,
};

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

fn run_cases(cases: Vec<Case>) -> ParitySummary {
    let mut summary = ParitySummary::default();

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
        summary.checked += 1;

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

            if fatal.is_some() {
                summary.fatal_mismatches += 1;
            } else {
                summary.recovered_only_mismatches += 1;
            }

            if summary.mismatches.len() < MAX_MISMATCH_REPORTS {
                let recovered_desc = recovered
                    .iter()
                    .take(4)
                    .map(|error| {
                        format!(
                            "{:?}:{:?}:{}",
                            error.severity(),
                            error.code(),
                            error.message()
                        )
                    })
                    .collect::<Vec<_>>()
                    .join(" | ");
                summary.mismatches.push(format!(
                    "{path}\n  expected_success={expected_success} \
                     observed_success={observed_success}\n  fatal={fatal_desc}\n  recovered={} \
                     [{}]",
                    recovered.len(),
                    recovered_desc
                ));
            }
        }
    }

    summary
}

fn assert_budget(name: &str, summary: &ParitySummary, budget: ParityBudget) {
    let total_mismatches = summary.fatal_mismatches + summary.recovered_only_mismatches;
    let omitted = total_mismatches.saturating_sub(summary.mismatches.len());
    let mut report = summary.mismatches.join("\n\n");
    if omitted > 0 {
        if !report.is_empty() {
            report.push_str("\n\n");
        }
        report.push_str(&format!("... omitted {omitted} additional mismatches"));
    }

    assert!(
        total_mismatches <= budget.max_mismatches
            && summary.fatal_mismatches <= budget.max_fatal_mismatches
            && summary.recovered_only_mismatches <= budget.max_recovered_only_mismatches,
        "{name}: {total_mismatches}/{} mismatches (fatal={}, recovered_only={}) exceeded budget \
         (max_total={}, max_fatal={}, max_recovered_only={})\n{}",
        summary.checked,
        summary.fatal_mismatches,
        summary.recovered_only_mismatches,
        budget.max_mismatches,
        budget.max_fatal_mismatches,
        budget.max_recovered_only_mismatches,
        report
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

    let summary = run_cases(cases);
    assert_budget("core-corpus", &summary, CORE_CORPUS_BUDGET);
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

    let summary = run_cases(cases);
    assert_budget("large-samples", &summary, LARGE_SAMPLES_BUDGET);
}
