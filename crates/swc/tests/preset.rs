use std::{fs::create_dir_all, path::PathBuf};

use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use testing::{NormalizedOutput, Tester};
use walkdir::WalkDir;

/// Compiles each input with its inherited `.swcrc` and verifies every output.
#[testing::fixture("tests/preset/**/input/")]
fn fixture(input_dir: PathBuf) {
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

    let output_dir = input_dir.parent().unwrap().join("output");

    for entry in WalkDir::new(&input_dir) {
        let entry = entry.unwrap();

        let errors = Tester::new().print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            if entry.metadata().unwrap().is_dir() {
                return Ok(());
            }
            println!("File: {}", entry.path().to_string_lossy());

            if !entry.file_name().to_string_lossy().ends_with(".ts")
                && !entry.file_name().to_string_lossy().ends_with(".js")
                && !entry.file_name().to_string_lossy().ends_with(".jsx")
                && !entry.file_name().to_string_lossy().ends_with(".tsx")
            {
                return Ok(());
            }

            let rel_path = entry
                .path()
                .strip_prefix(&input_dir)
                .expect("failed to strip prefix");

            let fm = cm.load_file(entry.path()).expect("failed to load file");
            match c.process_js_file(
                fm,
                &handler,
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
                Ok(v) => {
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
                                .compare_to_file(
                                    output_dir.join(rel_path.with_extension("extra.json")),
                                )
                                .unwrap();
                        }
                    }
                }
                Err(ref err) if format!("{err:?}").contains("not matched") => {}
                Err(ref err) if format!("{err:?}").contains("Syntax Error") => return Err(()),
                Err(err) => panic!("Error: {err:?}"),
            }
            if handler.has_errors() {
                Err(())
            } else {
                Ok(())
            }
        });

        if let Err(err) = errors {
            err.compare_to_file(output_dir.join(entry.path().with_extension("swc-stderr")))
                .unwrap();
        }
    }
}
