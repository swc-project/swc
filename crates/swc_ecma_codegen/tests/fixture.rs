use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::comments::SingleThreadedComments;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{
    text_writer::{JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use testing::{run_test2, NormalizedOutput};

const fn true_by_default() -> bool {
    true
}

#[derive(Deserialize)]
struct TestConfig {
    #[serde(default = "true_by_default")]
    reduce_escaped_newline: bool,
}

impl Default for TestConfig {
    fn default() -> Self {
        TestConfig {
            reduce_escaped_newline: true,
        }
    }
}

fn find_config(dir: &Path) -> TestConfig {
    let mut cur = Some(dir);
    while let Some(dir) = cur {
        let config = dir.join("config.json");
        if config.exists() {
            let config = read_to_string(&config).expect("failed to read config.json");
            let config: TestConfig = serde_json::from_str(&config)
                .expect("failed to deserialize value into a codegen config");

            return config;
        }

        cur = dir.parent();
    }

    Default::default()
}

fn run(input: &Path, minify: bool) {
    let dir = input.parent().unwrap();

    let dts = is_dts(input);

    let output = output_path(input, minify, dts);

    run_test2(false, |cm, _| {
        let config = find_config(dir);
        let fm = cm.load_file(input).unwrap();
        let comments = SingleThreadedComments::default();

        let m = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                decorators: true,
                tsx: true,
                dts,
                ..Default::default()
            }),
            EsVersion::latest(),
            Some(&comments),
            &mut Vec::new(),
        )
        .expect("failed to parse input as a module");

        let mut buf = Vec::new();

        {
            let mut wr =
                Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

            if minify {
                wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));
            }

            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config::default()
                    .with_minify(minify)
                    .with_reduce_escaped_newline(config.reduce_escaped_newline),
                cm,
                comments: Some(&comments),
                wr,
            };

            emitter.emit_module(&m).unwrap();
        }

        NormalizedOutput::from(String::from_utf8(buf).unwrap())
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

fn is_dts(input: &Path) -> bool {
    let file_name = input
        .file_name()
        .and_then(|file_name| file_name.to_str())
        .unwrap();
    file_name.ends_with(".d.ts") || file_name.ends_with(".d.mts") || file_name.ends_with(".d.cts")
}

fn output_path(input: &Path, minify: bool, is_dts: bool) -> PathBuf {
    let dir = input.parent().unwrap();

    if minify {
        dir.join(format!(
            "output.min.{}{}",
            if is_dts { "d." } else { "" },
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}{}",
            if is_dts { "d." } else { "" },
            input.extension().unwrap().to_string_lossy()
        ))
    }
}

#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
#[testing::fixture("tests/fixture/**/input.d.ts")]
fn ts(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/fixture/**/input.jsx")]
fn js(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}
