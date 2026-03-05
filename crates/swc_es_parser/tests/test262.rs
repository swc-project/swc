use std::path::{Path, PathBuf};

use swc_es_parser::{ParsedProgram, Syntax};
use testing::NormalizedOutput;

mod common;

use common::ecma_reuse::{
    build_program_canonical_json, build_program_json_snapshot, ecma_fixture_root,
    parse_loaded_file_with_syntax_mode, snapshot_path_for, ParseMode,
};

const IGNORED_PASS_TESTS: &[&str] = &[
    // Temporarily ignored.
    "431ecef8c85d4d24.js",
    "8386fbff927a9e0e.js",
    "5654d4106d7025c2.js",
    // Stack size (stupid parens).
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    // Static constructor.
    "dcc5609dcc043200.js",
    "88d42455ac933ef5.js",
    // Wrong tests (variable name or value is different).
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
    "82c827ccaecbe22c.js",
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
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
    // Wrong test - strict mode.
    "8f8bfb27569ac008.js",
    "ce569e89a005c02a.js",
    // Unicode 14 vs 15.
    "046a0bb70d03d0cc.js",
    "08a39e4289b0c3f3.js",
    "300a638d978d0f2c.js",
    "44f31660bd715f05.js",
];

const IGNORED_ERROR_TESTS: &[&str] = &[
    // pass in script. error in module.
    "e3fbcf63d7e43ead.js",
    // Old (wrong) tests.
    "569a2c1bad3beeb2.js",
    "3b6f737a4ac948a8.js",
    "829d9261aa6cd22c.js",
    "b03ee881dce1a367.js",
    "cb92787da5075fd1.js",
    "f0f498d6ae70038f.js",
    // Wrong tests.
    "0d5e450f1da8a92a.js",
    "346316bef54d805a.js",
    "976b6247ca78ab51.js",
    "ae0a7ac275bc9f5c.js",
    "748656edbfb2d0bb.js",
    "79f882da06f88c9f.js",
    "d28e80d99f819136.js",
    "92b6af54adef3624.js",
    "ef2d369cccc5386c.js",
    // Temporarily ignore tests for using octal escape before use strict.
    "147fa078a7436e0e.js",
    "15a6123f6b825c38.js",
    "3bc2b27a7430f818.js",
    // Temporarily ignored.
    "2fa321f0374c7017.js",
    "3dbb6e166b14a6c0.js",
    "66e383bfd18e66ab.js",
    "78c215fabdf13bae.js",
    "bf49ec8d96884562.js",
    "e4a43066905a597b.js",
    "98204d734f8c72b3.js",
    "ef81b93cf9bdb4ec.js",
];

const IGNORED_PASS_CANONICAL_MISMATCHES: &str =
    include_str!("fixtures/test262-pass-canonical-ignore.txt");

fn file_name(path: &Path) -> &str {
    path.file_name()
        .and_then(|name| name.to_str())
        .unwrap_or_else(|| panic!("{} should have valid UTF-8 filename", path.display()))
}

fn parse_mode(path: &Path) -> ParseMode {
    if file_name(path).contains("module") {
        ParseMode::Module
    } else {
        ParseMode::Script
    }
}

fn is_known_pass_canonical_mismatch(name: &str) -> bool {
    IGNORED_PASS_CANONICAL_MISMATCHES
        .lines()
        .any(|line| line == name)
}

fn parse_success(path: &Path, mode: ParseMode) -> ParsedProgram {
    testing::run_test(false, |cm, handler| -> Result<ParsedProgram, ()> {
        let fm = cm
            .load_file(path)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", path.display()));

        let output = parse_loaded_file_with_syntax_mode(&fm, Syntax::default(), mode);

        for error in output.recovered {
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = output.fatal {
            error.into_diagnostic(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        output
            .parsed
            .ok_or_else(|| panic!("parser returned no AST for {}", path.display()))
    })
    .unwrap_or_else(|err| {
        panic!(
            "test262 success fixture should parse: {}\n{}",
            path.display(),
            err
        )
    })
}

#[testing::fixture("../swc_ecma_parser/tests/test262-parser/pass/*.js")]
fn identity(entry: PathBuf) {
    let file_name = file_name(&entry);
    if IGNORED_PASS_TESTS.contains(&file_name) || is_known_pass_canonical_mismatch(file_name) {
        return;
    }

    let explicit = ecma_fixture_root()
        .join("test262-parser")
        .join("pass-explicit")
        .join(file_name);

    let mode = parse_mode(&entry);
    let parsed = parse_success(&entry, mode);
    let explicit_parsed = parse_success(&explicit, mode);

    let source = build_program_canonical_json(&parsed);
    let expected = build_program_canonical_json(&explicit_parsed);

    assert_eq!(
        source,
        expected,
        "test262 canonical mismatch for {} vs {}",
        entry.display(),
        explicit.display()
    );

    NormalizedOutput::from(build_program_json_snapshot(&parsed))
        .compare_to_file(snapshot_path_for(&entry, ".json"))
        .unwrap_or_else(|_| panic!("snapshot mismatch: {}", entry.display()));
}

#[testing::fixture("../swc_ecma_parser/tests/test262-parser/fail/*.js")]
fn error(entry: PathBuf) {
    if IGNORED_ERROR_TESTS.contains(&file_name(&entry)) {
        return;
    }

    let mode = parse_mode(&entry);

    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&entry)
            .unwrap_or_else(|err| panic!("failed to load {}: {err}", entry.display()));

        let parsed = parse_loaded_file_with_syntax_mode(&fm, Syntax::default(), mode);

        for error in parsed.recovered {
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = parsed.fatal {
            error.into_diagnostic(handler).emit();
        }

        if !handler.has_errors() {
            handler
                .struct_err("expected parser diagnostics; parser accepted input")
                .emit();
        }

        Err(())
    })
    .expect_err("should fail, but parsed as");

    output
        .compare_to_file(snapshot_path_for(&entry, ".swc-stderr"))
        .unwrap_or_else(|_| panic!("stderr snapshot mismatch: {}", entry.display()));
}
