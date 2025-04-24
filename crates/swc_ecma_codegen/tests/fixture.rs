use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{
    text_writer::{JsWriter, SpannedWriteJs, WriteJs},
    Emitter, Node, NodeEmitter,
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
    let output = if minify {
        dir.join(format!(
            "output.min.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    };

    run_test2(false, |cm, _| {
        let config = find_config(dir);
        let fm = cm.load_file(input).unwrap();

        let m = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                decorators: true,
                tsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
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
                cm: cm.clone(),
                comments: None,
                wr,
            };

            emitter.emit_module(&m).unwrap();
        }

        NormalizedOutput::from(String::from_utf8(buf.clone()).unwrap())
            .compare_to_file(&output)
            .unwrap();

        let new_module = {
            let wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None))
                as Box<dyn SpannedWriteJs>;

            let mut emitter = NodeEmitter::new(Emitter {
                cfg: swc_ecma_codegen::Config::default()
                    .with_minify(minify)
                    .with_reduce_escaped_newline(config.reduce_escaped_newline),
                cm: cm.clone(),
                comments: None,
                wr,
            });

            m.with_new_span(&mut emitter).unwrap()
        };

        let buf = String::from_utf8(buf).unwrap();
        let fm = cm.new_source_file(FileName::Anon.into(), buf.clone());

        let m = parse_file_as_module(
            &fm,
            Syntax::default(),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .expect("failed to parse input as a module");

        assert_eq!(new_module, m);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
fn ts(input: PathBuf) {
    run(&input, false);
}

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/fixture/**/input.jsx")]
fn js(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}
