use std::{fs::create_dir_all, path::PathBuf};

use swc::{
    config::{Config, JscConfig, Options},
    try_with_handler, Compiler, HandlerOpts,
};
use swc_common::{errors::ColorConfig, sync::Lrc, FilePathMapping, SourceMap, GLOBALS};
use swc_error_reporters::{
    handler::to_pretty_handler, GraphicalReportHandler, GraphicalTheme, ToPrettyDiagnostic,
};
use testing::NormalizedOutput;
use walkdir::WalkDir;

/// Compiles each input with its inherited `.swcrc` and verifies every output.
#[testing::fixture("tests/preset/**/input/")]
fn fixture(input_dir: PathBuf) {
    let _log = testing::init();
    #[cfg(not(feature = "flow"))]
    {
        let input_dir_norm = input_dir.to_string_lossy().replace('\\', "/");
        if input_dir_norm.ends_with("/tests/preset/flow/strip/input")
            || input_dir_norm.ends_with("tests/preset/flow/strip/input")
        {
            return;
        }
    }

    #[cfg(not(feature = "react-compiler"))]
    {
        let input_dir_norm = input_dir.to_string_lossy().replace('\\', "/");
        if input_dir_norm.contains("tests/preset/options/react-compiler/") {
            return;
        }
    }

    let case_dir = input_dir.parent().unwrap();
    let output_dir = case_dir.join("output");
    let diagnostics_path = case_dir.join("output.swc-stderr");
    let expect_failure = diagnostics_path.is_file();

    for entry in WalkDir::new(&input_dir) {
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
        let expected_diagnostics = if expect_failure {
            Some(diagnostics_path.clone())
        } else {
            let path = entry.path().with_extension("swc-stderr");
            path.is_file().then_some(path)
        };
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
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
                    match c.process_js_file(
                        fm,
                        handler,
                        &Options {
                            swcrc: true,
                            output_path: Some(output_dir.join(entry.file_name())),
                            config: Config {
                                jsc: JscConfig {
                                    external_helpers: true.into(),
                                    ..Default::default()
                                },
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                    ) {
                        Err(err) if format!("{err:?}").contains("not matched") => Ok(None),
                        result => result.map(Some),
                    }
                },
            )
        });

        match result {
            Ok(Some(v)) => {
                assert!(!expect_failure, "expected compilation to fail");
                let output_path = output_dir.join(rel_path);
                let mut raw_path = output_path.as_os_str().to_os_string();
                raw_path.push(".raw");
                let raw_path = PathBuf::from(raw_path);
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
                assert!(!expect_failure, "expected compilation to fail");
            }
            Err(err) => {
                // Preserve both existing snapshot formats without changing the
                // compiler options or its diagnostic collection.
                let report = if expect_failure {
                    to_pretty_handler(ColorConfig::Never)
                } else {
                    GraphicalReportHandler::default().with_theme(GraphicalTheme::none())
                };
                let diagnostic = err
                    .diagnostics()
                    .iter()
                    .map(|diagnostic| diagnostic.to_pretty_string(&cm, expect_failure, &report))
                    .collect::<String>();
                let path = expected_diagnostics.unwrap_or_else(|| {
                    panic!(
                        "unexpected compilation error for {}:\n{err}",
                        entry.path().display()
                    )
                });
                NormalizedOutput::from(diagnostic)
                    .compare_to_file(path)
                    .unwrap();
            }
        }
    }
}
