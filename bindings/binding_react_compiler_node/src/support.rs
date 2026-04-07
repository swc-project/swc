use napi::bindgen_prelude::*;
use react_compiler::entrypoint::plugin_options::{CompilerTarget, GatingConfig, PluginOptions};
use serde::Deserialize;
use swc_ecma_react_compiler::{self, SourceParser, SourceSyntax};

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
    fn into_source_parser(self) -> SourceParser {
        let mut parser = SourceParser::default();

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
struct TransformOptions {
    parser: Option<ParserOptions>,
    filename: Option<String>,
    is_dev: Option<bool>,
    compilation_mode: Option<String>,
    panic_threshold: Option<String>,
    target: Option<CompilerTarget>,
    gating: Option<GatingConfig>,
    enable_reanimated: Option<bool>,
}

impl TransformOptions {
    fn into_plugin_options(self, source_code: &str) -> PluginOptions {
        PluginOptions {
            should_compile: true,
            enable_reanimated: self.enable_reanimated.unwrap_or(false),
            is_dev: self.is_dev.unwrap_or(false),
            filename: self.filename,
            compilation_mode: self
                .compilation_mode
                .unwrap_or_else(|| String::from("infer")),
            panic_threshold: self.panic_threshold.unwrap_or_else(|| String::from("none")),
            target: self
                .target
                .unwrap_or_else(|| CompilerTarget::Version(String::from("19"))),
            gating: self.gating,
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

    fn source_parser(&self) -> SourceParser {
        self.parser
            .clone()
            .map(ParserOptions::into_source_parser)
            .unwrap_or_default()
    }
}

struct IsReactCompilerRequiredTask {
    code: String,
}

#[napi]
impl Task for IsReactCompilerRequiredTask {
    type JsValue = bool;
    type Output = bool;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        Ok(is_react_compiler_required_inner(&self.code))
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

struct TransformTask {
    code: String,
    options: Buffer,
}

#[napi]
impl Task for TransformTask {
    type JsValue = crate::TransformOutput;
    type Output = crate::TransformOutput;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let code = std::mem::take(&mut self.code);
        let options = deserialize_transform_options(self.options.as_ref())?;
        transform_inner(&code, options)
    }

    fn resolve(&mut self, _env: napi::Env, output: Self::Output) -> napi::Result<Self::JsValue> {
        Ok(output)
    }
}

fn decode_code(code: Buffer) -> String {
    String::from_utf8_lossy(code.as_ref()).into_owned()
}

fn deserialize_transform_options(input: &[u8]) -> napi::Result<TransformOptions> {
    if input.is_empty() {
        return Ok(TransformOptions::default());
    }

    serde_json::from_slice(input).map_err(|err| {
        napi::Error::from_reason(format!("failed to parse transform options: {err}"))
    })
}

fn transform_inner(code: &str, options: TransformOptions) -> napi::Result<crate::TransformOutput> {
    let parser = options.source_parser();
    let options = options.into_plugin_options(code);

    let result =
        swc_ecma_react_compiler::try_transform_source_to_code_with_parser(code, options, parser)
            .map_err(napi::Error::from_reason)?;

    Ok(crate::TransformOutput {
        code: result.code,
        map: result.map,
        diagnostics: result.diagnostics,
    })
}

fn is_react_compiler_required_inner(code: &str) -> bool {
    swc_ecma_react_compiler::is_required_source_with_parser(code, SourceParser::default())
        .unwrap_or(false)
}

#[napi]
fn transform(
    code: Buffer,
    options: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<TransformTask> {
    let task = TransformTask {
        code: decode_code(code),
        options,
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
fn transform_sync(code: Buffer, options: Buffer) -> napi::Result<crate::TransformOutput> {
    transform_inner(
        &decode_code(code),
        deserialize_transform_options(options.as_ref())?,
    )
}

#[napi]
fn is_react_compiler_required(
    code: Buffer,
    signal: Option<AbortSignal>,
) -> AsyncTask<IsReactCompilerRequiredTask> {
    let task = IsReactCompilerRequiredTask {
        code: decode_code(code),
    };

    AsyncTask::with_optional_signal(task, signal)
}

#[napi]
pub fn is_react_compiler_required_sync(code: Buffer) -> napi::Result<bool> {
    Ok(is_react_compiler_required_inner(&decode_code(code)))
}
