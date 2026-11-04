use std::{fmt::Write, path::PathBuf};

use swc_common::{BytePos, Mark, Span};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::{exec_tr, test_fixture, Tester};
use swc_ecma_transforms_typescript::{typescript, Config};
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::{visit_mut_pass, VisitMut};

#[testing::fixture("tests/namespace-bindings/**/exec.ts")]
#[testing::fixture("tests/enum-semantics/**/exec.ts")]
fn runtime(input: PathBuf) {
    execute(input, true);
}

#[testing::fixture("tests/namespace-bindings/reference-roles/exec.ts")]
#[testing::fixture("tests/namespace-bindings/parameter-type-merge/exec.ts")]
#[testing::fixture("tests/namespace-bindings/fused-type-uses/exec.ts")]
#[testing::fixture("tests/enum-semantics/enum-initializer-binding-owners/exec.ts")]
fn runtime_without_type_resolution(input: PathBuf) {
    execute(input, false);
}

fn execute(input: PathBuf, handle_types: bool) {
    execute_config(
        input,
        handle_types,
        Config {
            no_empty_export: true,
            ..Default::default()
        },
    );
}

fn pipeline(handle_types: bool, config: Config) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    (
        resolver(unresolved_mark, top_level_mark, handle_types),
        typescript(config, unresolved_mark, top_level_mark),
    )
}

fn execute_config(input: PathBuf, handle_types: bool, config: Config) {
    let code = std::fs::read_to_string(input).expect("semantic execution fixture must be readable");
    exec_tr(
        "typescript_semantics",
        Syntax::Typescript(TsSyntax::default()),
        |_| pipeline(handle_types, config),
        &code,
    );
}

// Semantic body identities must survive normalized and generated AST spans.
fn spanless_pipeline() -> impl Pass {
    let unresolved = Mark::new();
    let top_level = Mark::new();
    (
        resolver(unresolved, top_level, true),
        DropSpan,
        typescript(
            Config {
                no_empty_export: true,
                ..Default::default()
            },
            unresolved,
            top_level,
        ),
    )
}

// Reuse ordinary snapshots unless span-sensitive class lowering changes the
// output shape independently of enum declaration identity.
fn spanless_output(input: &std::path::Path) -> PathBuf {
    let case_dir = input.parent().unwrap().parent().unwrap();
    let output = case_dir.join("output.spanless.js");
    if output.is_file() {
        output
    } else {
        case_dir.join("output/input.ts")
    }
}

#[testing::fixture(
    "../swc/tests/compile/typescript/class-properties/standard/enum-semantics/body-identity/**/\
     input/input.ts"
)]
fn snapshot_without_spans(input: PathBuf) {
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| spanless_pipeline(),
        &input,
        &spanless_output(&input),
        Default::default(),
    );
}

struct IdenticalSpans;

impl VisitMut for IdenticalSpans {
    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = Span::new(BytePos(1), BytePos(2));
    }
}

#[testing::fixture(
    "../swc/tests/compile/typescript/class-properties/standard/enum-semantics/body-identity/\
     member-order/input/input.ts"
)]
#[testing::fixture(
    "../swc/tests/compile/typescript/class-properties/standard/enum-semantics/body-identity/\
     availability/**/input/input.ts"
)]
fn snapshot_with_identical_spans(input: PathBuf) {
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                visit_mut_pass(IdenticalSpans),
                typescript(
                    Config {
                        no_empty_export: true,
                        ..Default::default()
                    },
                    unresolved,
                    top_level,
                ),
            )
        },
        &input,
        &spanless_output(&input),
        Default::default(),
    );
}

struct NormalizeOutputSpans;

impl VisitMut for NormalizeOutputSpans {
    fn visit_mut_span(&mut self, span: &mut Span) {
        if *span != swc_common::source_map::PURE_SP {
            *span = swc_common::DUMMY_SP;
        }
    }
}

struct ReversedSpans;

impl VisitMut for ReversedSpans {
    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = Span::new(BytePos(u32::MAX - span.hi.0), BytePos(u32::MAX - span.lo.0));
    }
}

#[testing::fixture(
    "../swc/tests/compile/typescript/class-properties/standard/enum-semantics/body-identity/\
     availability/**/input/input.ts"
)]
fn snapshot_with_reversed_spans(input: PathBuf) {
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                visit_mut_pass(ReversedSpans),
                typescript(
                    Config {
                        no_empty_export: true,
                        ..Default::default()
                    },
                    unresolved,
                    top_level,
                ),
                visit_mut_pass(NormalizeOutputSpans),
            )
        },
        &input,
        &spanless_output(&input),
        Default::default(),
    );
}

#[testing::fixture("tests/enum-semantics/body-identity/**/exec.ts")]
fn runtime_without_spans(input: PathBuf) {
    let code = std::fs::read_to_string(input).expect("semantic execution fixture must be readable");
    exec_tr(
        "typescript_semantics_without_spans",
        Syntax::Typescript(TsSyntax::default()),
        |_| spanless_pipeline(),
        &code,
    );
}

fn fixture_config(input: &std::path::Path) -> Config {
    let config = std::fs::read(input.with_file_name("config.json"))
        .expect("semantic configuration fixture must be readable");
    serde_json::from_slice(&config).expect("semantic fixture configuration must be valid")
}

#[testing::fixture("tests/semantic/**/input.ts")]
fn configured_snapshot(input: PathBuf) {
    let config = fixture_config(&input);
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| pipeline(true, config),
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}

#[testing::fixture("tests/semantic/**/exec.ts")]
fn configured_runtime(input: PathBuf) {
    let config = fixture_config(&input);
    execute_config(input, true, config);
}

#[derive(serde::Deserialize)]
struct AliasDepthFixture {
    aliases: usize,
    terminal: AliasTerminal,
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "lowercase")]
enum AliasTerminal {
    Value,
    Cycle,
}

/// Generate a deep dependency graph from a compact fixture. The syntax stays
/// flat, so compilation must not require one call-stack frame per alias.
#[testing::fixture("tests/enum-semantics/alias-depth/**/input.json")]
fn alias_dependency_depth(input: PathBuf) {
    let config = std::fs::read(input).expect("alias depth fixture must be readable");
    let config: AliasDepthFixture =
        serde_json::from_slice(&config).expect("alias depth fixture must be valid");
    assert!(
        config.aliases > 0,
        "alias depth fixture must contain an alias"
    );

    let mut source = String::with_capacity(config.aliases * 32);
    source.push_str("enum E { Value = 21 }\nnamespace N {\n");
    for alias in 0..config.aliases {
        write!(source, "export import A{alias} = ").unwrap();
        let next = alias + 1;
        if next < config.aliases {
            writeln!(source, "N.A{next};").unwrap();
        } else {
            source.push_str(match config.terminal {
                AliasTerminal::Value => "E;\n",
                AliasTerminal::Cycle => "N.A0;\n",
            });
        }
    }
    source.push_str("}\nconst result = N.A0;\n");

    Tester::run(|tester| {
        tester.apply_transform(
            pipeline(true, Config::default()),
            "alias-depth.ts",
            Syntax::Typescript(TsSyntax::default()),
            Some(true),
            &source,
        )
    });
}
