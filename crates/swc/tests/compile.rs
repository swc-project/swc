use std::path::{Path, PathBuf};

use swc::{config::Options, Compiler, HandlerOpts};
use swc_common::{
    errors::{ColorConfig, Handler, HANDLER},
    sync::Lrc,
    SourceMap, GLOBALS,
};
use swc_config::merge::Merge;
use swc_error_reporters::{handler::ThreadSafetyDiagnostics, ErrorEmitter};
use testing::NormalizedOutput;
use walkdir::WalkDir;

fn with_suffix(path: &Path, suffix: &str) -> PathBuf {
    let mut path = path.as_os_str().to_os_string();
    path.push(suffix);
    PathBuf::from(path)
}

/// Compiles each input with its inherited `.swcrc` and snapshots every result.
#[testing::fixture(
    "tests/compile/**/input/",
    exclude("[/\\\\]react-compiler[/\\\\]feature-only[/\\\\]")
)]
#[cfg_attr(
    feature = "react-compiler",
    testing::fixture("tests/compile/options/react-compiler/feature-only/**/input/")
)]
fn fixture(input_dir: PathBuf) {
    let _log = testing::init();
    #[cfg(not(feature = "flow"))]
    if input_dir.ends_with("flow/strip/input") {
        return;
    }
    #[cfg(not(feature = "react-compiler"))]
    {
        let tests = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/compile");
        let react_compiler = tests.join("options/react-compiler");
        // Match canonical fixture paths, including verbatim Windows prefixes.
        let react_compiler = react_compiler.canonicalize().unwrap();
        if input_dir.starts_with(react_compiler) {
            return;
        }
    }

    let output_dir = input_dir.parent().unwrap().join("output");
    for entry in WalkDir::new(&input_dir).sort_by_file_name() {
        let entry = entry.unwrap();
        let input = entry.path();
        let extension = input.extension().and_then(|ext| ext.to_str());
        let is_source = matches!(extension, Some("js" | "jsx" | "ts" | "tsx"));
        if !entry.file_type().is_file() || !is_source {
            continue;
        }
        println!("File: {}", input.display());

        let relative_path = input.strip_prefix(&input_dir).unwrap();
        let output_path = output_dir.join(relative_path);
        let cm: Lrc<SourceMap> = Default::default();
        let diagnostics = ThreadSafetyDiagnostics::default();
        let emitter = ErrorEmitter {
            diagnostics: diagnostics.clone(),
            cm: cm.clone(),
            opts: HandlerOpts {
                color: ColorConfig::Never,
                ..Default::default()
            },
        };
        let handler = Handler::with_emitter(true, false, Box::new(emitter));
        let result = GLOBALS.set(&Default::default(), || {
            HANDLER.set(&handler, || {
                let compiler = Compiler::new(cm.clone());
                let file = cm.load_file(input).unwrap();
                let mut options = Options {
                    swcrc: true,
                    output_path: Some(output_path.clone()),
                    ..Default::default()
                };
                let config = compiler.read_config(&options, &file.name)?;
                if let Some(config) = config {
                    options.config.jsc.external_helpers = config.jsc.external_helpers;
                }
                options.config.jsc.external_helpers.merge(true.into());
                compiler.process_js_file(file, &handler, &options)
            })
        });
        let output = match result {
            Ok(output) => Some(output),
            Err(error) => {
                // Configuration failures may not have emitted a diagnostic yet.
                if !diagnostics.contains_error() {
                    let message = format!("{error:#}");
                    handler.err(&message);
                }
                None
            }
        };
        let stderr = diagnostics.to_pretty_string(&cm, false, ColorConfig::Never);
        let (code, map, extra) = match output {
            Some(output) => (output.code, output.map, output.output),
            None => Default::default(),
        };

        let raw_path = with_suffix(&output_path, ".raw");
        let (code, code_path) = if raw_path.is_file() {
            (NormalizedOutput::new_raw(code), &raw_path)
        } else {
            (NormalizedOutput::from(code), &output_path)
        };
        code.compare_to_file(code_path).unwrap();

        let stderr = NormalizedOutput::from(stderr.join(""));
        let stderr_path = with_suffix(&output_path, ".stderr");
        stderr.compare_to_file(stderr_path).unwrap();

        let map = map.map(|map| {
            let map: serde_json::Value = serde_json::from_str(&map).unwrap();
            serde_json::to_string_pretty(&map).unwrap()
        });
        let map = NormalizedOutput::from(map.unwrap_or_default());
        let map_path = with_suffix(&output_path, ".map");
        map.compare_to_file(map_path).unwrap();

        let mut extra: serde_json::Map<String, serde_json::Value> = match extra {
            Some(extra) => serde_json::from_str(&extra).unwrap(),
            None => Default::default(),
        };
        let declarations = extra.remove("__swc_isolated_declarations__");
        let declarations = declarations.map(|code| code.as_str().unwrap().to_owned());
        let declarations = NormalizedOutput::from(declarations.unwrap_or_default());
        let declarations_path = with_suffix(&output_path, ".d.ts");
        declarations.compare_to_file(declarations_path).unwrap();

        let extra = if extra.is_empty() {
            String::new()
        } else {
            serde_json::to_string_pretty(&extra).unwrap()
        };
        let extra = NormalizedOutput::from(extra);
        let extra_path = with_suffix(&output_path, ".extra.json");
        extra.compare_to_file(extra_path).unwrap();
    }
}
