use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
};

use swc::{config::Options, try_with_handler, Compiler, HandlerOpts};
use swc_common::{errors::ColorConfig, sync::Lrc, FilePathMapping, SourceMap, GLOBALS};
use swc_config::merge::Merge;
use swc_error_reporters::{
    handler::to_pretty_handler, GraphicalReportHandler, GraphicalTheme, ToPrettyDiagnostic,
};
use testing::NormalizedOutput;
use walkdir::WalkDir;

fn with_suffix(path: &Path, suffix: &str) -> PathBuf {
    let mut path = path.as_os_str().to_os_string();
    path.push(suffix);
    PathBuf::from(path)
}

/// Compiles each input with its inherited `.swcrc` and verifies every output.
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
    {
        let input_dir_norm = input_dir.to_string_lossy().replace('\\', "/");
        if input_dir_norm.ends_with("/tests/compile/flow/strip/input")
            || input_dir_norm.ends_with("tests/compile/flow/strip/input")
        {
            return;
        }
    }

    #[cfg(not(feature = "react-compiler"))]
    {
        let input_dir_norm = input_dir.to_string_lossy().replace('\\', "/");
        if input_dir_norm.contains("tests/compile/options/react-compiler/") {
            return;
        }
    }

    let case_dir = input_dir.parent().unwrap();
    let output_dir = case_dir.join("output");
    let diagnostics_path = case_dir.join("output.swc-stderr");
    let expect_failure = diagnostics_path.is_file();

    for entry in WalkDir::new(&input_dir).sort_by_file_name() {
        let entry = entry.unwrap();
        if !entry.file_type().is_file()
            || !matches!(
                entry.path().extension().and_then(|ext| ext.to_str()),
                Some("js" | "jsx" | "ts" | "tsx")
            )
        {
            continue;
        }
        println!("File: {}", entry.path().display());

        let rel_path = entry.path().strip_prefix(&input_dir).unwrap();
        let output_path = output_dir.join(rel_path);
        let raw_path = with_suffix(&output_path, ".raw");
        let combined_diagnostics_path = with_suffix(&output_path, ".stderr");
        let expect_code_and_diagnostics = combined_diagnostics_path.is_file();
        let expected_diagnostics = if expect_failure {
            Some(diagnostics_path.clone())
        } else {
            let path = entry.path().with_extension("swc-stderr");
            path.is_file().then_some(path)
        };
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
        let mut emitted_code = None;
        let result = GLOBALS.set(&Default::default(), || {
            try_with_handler(
                cm.clone(),
                HandlerOpts {
                    color: ColorConfig::Never,
                    ..Default::default()
                },
                |handler| {
                    let c = Compiler::new(cm.clone());
                    let fm = cm.load_file(entry.path()).expect("failed to load file");
                    let mut options = Options {
                        swcrc: true,
                        output_path: Some(output_dir.join(entry.file_name())),
                        ..Default::default()
                    };
                    let config = c.read_config(&options, &fm.name)?;
                    // Keep the historical default while honoring explicit
                    // helper settings and configuration selection in `.swcrc`.
                    if let Some(config) = config {
                        options.config.jsc.external_helpers = config.jsc.external_helpers;
                    }
                    options.config.jsc.external_helpers.merge(true.into());
                    // Let process_js_file load the full configuration as usual;
                    // some source-map settings are read before options merge.
                    let result = match c.process_js_file(fm, handler, &options) {
                        // Let the compiler reject excluded inputs instead of
                        // skipping them before compilation. Their empty output
                        // is checked against the same snapshot paths below.
                        Err(err)
                            if err
                                .to_string()
                                .contains("cannot process file because it's ignored by .swcrc") =>
                        {
                            Ok(None)
                        }
                        Err(err) if format!("{err:?}").contains("not matched") => Ok(None),
                        result => result.map(Some),
                    };
                    // The diagnostic wrapper returns an error even when the
                    // compiler emitted code. Keep both observations for cases
                    // that intentionally assert code alongside diagnostics.
                    if expect_code_and_diagnostics {
                        if let Ok(Some(output)) = &result {
                            assert!(output.map.is_none() && output.output.is_none());
                            emitted_code = Some(output.code.clone());
                        }
                    }
                    result
                },
            )
        });

        match result {
            Ok(Some(v)) => {
                assert!(
                    !expect_failure && !expect_code_and_diagnostics,
                    "expected compilation to emit diagnostics"
                );
                if raw_path.is_file() {
                    assert!(!output_path.exists(), "fixture has two output snapshots");
                    NormalizedOutput::new_raw(v.code)
                        .compare_to_file(raw_path)
                        .unwrap();
                } else {
                    NormalizedOutput::from(v.code)
                        .compare_to_file(output_path)
                        .unwrap();
                }

                let _ = create_dir_all(output_dir.join(rel_path).parent().unwrap());

                let map = v.map.map(|json| {
                    let json: serde_json::Value = serde_json::from_str(&json).unwrap();
                    serde_json::to_string_pretty(&json).unwrap()
                });

                NormalizedOutput::from(map.unwrap_or_default())
                    .compare_to_file(
                        output_dir.join(rel_path.with_extension("map").file_name().unwrap()),
                    )
                    .unwrap();

                if let Some(extra) = v.output {
                    let mut value: serde_json::Map<_, serde_json::Value> =
                        serde_json::from_str(&extra).unwrap();

                    if let Some(v) = value.remove("__swc_isolated_declarations__") {
                        let code = v
                            .as_str()
                            .expect("isolated declaration pass should emit string");

                        NormalizedOutput::from(code.to_string())
                            .compare_to_file(output_dir.join(rel_path).with_extension("d.ts"))
                            .unwrap();
                    }

                    if !value.is_empty() {
                        let extra = serde_json::to_string_pretty(&value).unwrap();

                        NormalizedOutput::from(extra)
                            .compare_to_file(output_dir.join(rel_path.with_extension("extra.json")))
                            .unwrap();
                    }
                }
            }
            Ok(None) => {
                assert!(
                    !expect_failure && !expect_code_and_diagnostics,
                    "expected compilation to emit diagnostics"
                );
                // Missing snapshots already mean empty output. Compare every
                // output kind so exclusion cannot leave stale expectations.
                for path in [
                    output_path.clone(),
                    raw_path,
                    output_dir.join(rel_path.with_extension("map").file_name().unwrap()),
                    output_path.with_extension("d.ts"),
                    output_path.with_extension("extra.json"),
                ] {
                    NormalizedOutput::default().compare_to_file(path).unwrap();
                }
            }
            Err(err) => {
                if expect_code_and_diagnostics {
                    assert!(!expect_failure, "fixture has two diagnostic expectations");
                    let code =
                        emitted_code.expect("expected code to be emitted alongside diagnostics");
                    NormalizedOutput::from(code)
                        .compare_to_file(&output_path)
                        .unwrap();
                    let report =
                        GraphicalReportHandler::default().with_theme(GraphicalTheme::none());
                    let diagnostic = err
                        .diagnostics()
                        .iter()
                        .map(|diagnostic| diagnostic.to_pretty_string(&cm, false, &report))
                        .collect::<String>();
                    NormalizedOutput::from(diagnostic)
                        .compare_to_file(&combined_diagnostics_path)
                        .unwrap();
                    continue;
                }
                let path = expected_diagnostics.unwrap_or_else(|| {
                    panic!(
                        "unexpected compilation error for {}:\n{err}",
                        entry.path().display()
                    )
                });
                // Preserve both existing snapshot formats without changing the
                // compiler options or its diagnostic collection.
                let report = if expect_failure {
                    to_pretty_handler(ColorConfig::Never)
                } else {
                    GraphicalReportHandler::default().with_theme(GraphicalTheme::none())
                };
                let diagnostic = if err.diagnostics().is_empty() {
                    // Configuration errors can fail before emitting a source
                    // diagnostic. Preserve their complete error chain too.
                    err.to_pretty_error()
                        .chain()
                        .map(ToString::to_string)
                        .filter(|message| !message.is_empty())
                        .collect::<Vec<_>>()
                        .join("\nCaused by:\n")
                } else {
                    err.diagnostics()
                        .iter()
                        .map(|diagnostic| diagnostic.to_pretty_string(&cm, expect_failure, &report))
                        .collect::<String>()
                };
                NormalizedOutput::from(diagnostic)
                    .compare_to_file(path)
                    .unwrap();
            }
        }
    }
}
