use std::{
    fs,
    path::{Path, PathBuf},
};

use react_compiler::entrypoint::plugin_options::{CompilerTarget, GatingConfig, PluginOptions};
use serde::Deserialize;
use swc_ecma_react_compiler::{
    try_transform_source_to_code_with_parser, SourceParser, SourceSyntax,
};
use testing::NormalizedOutput;

#[derive(Clone, Copy, Debug, Deserialize)]
enum ParserSyntax {
    #[serde(rename = "ecmascript")]
    EcmaScript,
    #[serde(rename = "typescript")]
    TypeScript,
}

#[derive(Clone, Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ParserOptions {
    syntax: Option<ParserSyntax>,
    jsx: Option<bool>,
    tsx: Option<bool>,
    decorators: Option<bool>,
}

impl ParserOptions {
    fn into_source_parser(self, default: SourceParser) -> SourceParser {
        let mut parser = default;

        if let Some(syntax) = self.syntax {
            parser.syntax = match syntax {
                ParserSyntax::EcmaScript => SourceSyntax::EcmaScript,
                ParserSyntax::TypeScript => SourceSyntax::TypeScript,
            };
        }
        if let Some(jsx) = self.jsx {
            parser.jsx = jsx;
        }
        if let Some(tsx) = self.tsx {
            parser.tsx = tsx;
        }
        if let Some(decorators) = self.decorators {
            parser.decorators = decorators;
        }

        parser
    }
}

#[derive(Clone, Debug, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
struct FixtureOptions {
    parser: Option<ParserOptions>,
    filename: Option<String>,
    is_dev: Option<bool>,
    compilation_mode: Option<String>,
    panic_threshold: Option<String>,
    target: Option<CompilerTarget>,
    gating: Option<GatingConfig>,
    enable_reanimated: Option<bool>,
}

fn default_source_parser(input: &Path) -> SourceParser {
    match input.extension().and_then(|ext| ext.to_str()) {
        Some("js") => SourceParser {
            syntax: SourceSyntax::EcmaScript,
            jsx: false,
            tsx: false,
            decorators: true,
        },
        Some("jsx") => SourceParser {
            syntax: SourceSyntax::EcmaScript,
            jsx: true,
            tsx: false,
            decorators: true,
        },
        Some("ts") => SourceParser {
            syntax: SourceSyntax::TypeScript,
            jsx: false,
            tsx: false,
            decorators: true,
        },
        Some("tsx") => SourceParser {
            syntax: SourceSyntax::TypeScript,
            jsx: false,
            tsx: true,
            decorators: true,
        },
        _ => SourceParser::default(),
    }
}

fn load_fixture_options(input: &Path) -> FixtureOptions {
    let options_path = input.with_file_name("options.json");
    if !options_path.exists() {
        return FixtureOptions::default();
    }

    serde_json::from_str(
        &fs::read_to_string(&options_path).expect("failed to read fixture options"),
    )
    .expect("failed to parse fixture options")
}

fn to_plugin_options(input: &Path, source_code: &str, options: FixtureOptions) -> PluginOptions {
    PluginOptions {
        should_compile: true,
        enable_reanimated: options.enable_reanimated.unwrap_or(false),
        is_dev: options.is_dev.unwrap_or(false),
        filename: options
            .filename
            .or_else(|| Some(input.display().to_string())),
        compilation_mode: options
            .compilation_mode
            .unwrap_or_else(|| String::from("infer")),
        panic_threshold: options
            .panic_threshold
            .unwrap_or_else(|| String::from("none")),
        target: options
            .target
            .unwrap_or_else(|| CompilerTarget::Version(String::from("19"))),
        gating: options.gating,
        dynamic_gating: None,
        no_emit: false,
        output_mode: None,
        eslint_suppression_rules: None,
        flow_suppressions: true,
        ignore_use_no_forget: false,
        custom_opt_out_directives: None,
        environment: Default::default(),
        source_code: Some(source_code.to_string()),
        profiling: false,
        debug: false,
    }
}

#[testing::fixture("tests/fixture/**/input.jsx")]
#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
fn transform_fixture(input: PathBuf) {
    let source = fs::read_to_string(&input).expect("failed to read input fixture");
    let output = input.with_file_name("output.js");
    let options = load_fixture_options(&input);
    let parser = options
        .parser
        .clone()
        .map(|parser| parser.into_source_parser(default_source_parser(&input)))
        .unwrap_or_else(|| default_source_parser(&input));
    let plugin_options = to_plugin_options(&input, &source, options);

    let result = try_transform_source_to_code_with_parser(&source, plugin_options, parser)
        .expect("transform should succeed");

    NormalizedOutput::from(result.code)
        .compare_to_file(&output)
        .unwrap();
}
