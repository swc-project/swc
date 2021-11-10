#![cfg(not(feature = "wrong-target"))]

use serde::de::DeserializeOwned;
use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
};
use swc::{
    config::{Config, JscConfig, Options},
    Compiler,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use testing::{NormalizedOutput, Tester};

#[testing::fixture(
    "../swc_ecma_parser/tests/typescript/tsc/**/input.ts",
    exclude(
        "privateNameFieldDestructuredBinding/input.ts",
        "restPropertyWithBindingPattern/input.ts",
        "elementAccessChain\\.3/input.ts",
        "propertyAccessChain\\.3/input.ts",
        "objectRestNegative/input.ts",
        "objectRestPropertyMustBeLast/input.ts",
    )
)]
#[testing::fixture("../swc_ecma_parser/tests/typescript/tsc/**/input.tsx")]
fn fixture(input: PathBuf) {
    if input.to_string_lossy().contains("jsdoc") {
        return;
    }

    let base = Path::new("..")
        .join("swc_ecma_parser")
        .join("tests")
        .join("typescript")
        .join("tsc")
        .canonicalize()
        .unwrap();

    for (name, opts) in matrix() {
        let rel_path = input.strip_prefix(&base).unwrap();

        let output_dir = Path::new("tests")
            .join("tsc-references")
            .join(rel_path)
            .join(&name);

        let _ = create_dir_all(&output_dir);

        let output_path = output_dir.join("output.js");

        compile(&input, &output_path, opts);
    }
}

fn from_json<T>(s: &str) -> T
where
    T: DeserializeOwned,
{
    serde_json::from_str(s).unwrap()
}

fn matrix() -> Vec<(String, Options)> {
    // If we use `es5` as target, we can also verify es2015+ transforms.
    // But we test using es2015 to verify hygiene pass.
    let targets = vec![EsVersion::Es5, EsVersion::Es2015];

    let mut res = vec![];

    for target in targets {
        for minify in vec![true, false] {
            let opts = Options {
                config: Config {
                    jsc: JscConfig {
                        target: Some(target),
                        minify: if minify {
                            Some(from_json(
                                "{ \"compress\": { \"toplevel\": true }, \"mangle\": false, \
                                 \"toplevel\": true }",
                            ))
                        } else {
                            None
                        },
                        ..Default::default()
                    },
                    ..Default::default()
                },
                ..Default::default()
            };

            let s = serde_json::to_string(&target).unwrap().replace('"', "");

            if minify {
                res.push((format!("{}.2.minified", s), opts));
            } else {
                res.push((format!("{}.1.normal", s), opts));
            }
        }
    }

    res
}

fn compile(input: &Path, output: &Path, opts: Options) {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.load_file(input).expect("failed to load file");

            match c.process_js_file(
                fm,
                &handler,
                &Options {
                    is_module: true,

                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsConfig {
                                tsx: input.to_string_lossy().ends_with(".tsx"),
                                decorators: true,
                                dynamic_import: true,
                                dts: false,
                                no_early_errors: true,
                                import_assertions: false,
                            })),
                            ..opts.config.jsc
                        },
                        ..opts.config
                    },
                    ..opts
                },
            ) {
                Ok(res) => {
                    NormalizedOutput::from(res.code)
                        .compare_to_file(output)
                        .unwrap();
                }
                Err(ref err) if format!("{:?}", err).contains("Syntax Error") => {}
                Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                Err(err) => panic!("Error: {:?}", err),
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}
