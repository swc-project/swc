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

#[testing::fixture("ecmascript/parser/tests/typescript/tsc/**/input.ts")]
#[testing::fixture("ecmascript/parser/tests/typescript/tsc/**/input.tsx")]
fn fixture(input: PathBuf) {
    for (name, opts) in matrix() {
        let rel_path = input
            .strip_prefix(
                Path::new("ecmascript")
                    .join("parser")
                    .join("tests")
                    .join("typescript")
                    .join("tsc"),
            )
            .unwrap();

        let output_dir = Path::new("tests")
            .join("tsc-references")
            .join(rel_path)
            .join(&name);

        let _ = create_dir_all(&output_dir);

        let output_path = output_dir.join("output.js");

        compile(&input, &output_path, opts);
    }
}

fn matrix() -> Vec<(String, Options)> {
    let targets = vec![
        EsVersion::Es5,
        EsVersion::Es2015,
        EsVersion::Es2016,
        EsVersion::Es2017,
        EsVersion::Es2018,
        EsVersion::Es2019,
        EsVersion::Es2020,
        EsVersion::Es2021,
    ];

    let mut res = vec![];

    for target in targets {
        let opts = Options {
            config: Config {
                jsc: JscConfig {
                    target: Some(target),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        };

        let s = serde_json::to_string(&target).unwrap();

        res.push((format!("{}.1.normal", s), Options { ..opts.clone() }));
        res.push((format!("{}.2.minified", s), Options { ..opts.clone() }));
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
                Err(ref err) if format!("{:?}", err).contains("not matched") => {}
                Err(err) => panic!("Error: {:?}", err),
            }

            Ok(())
        })
        .map(|_| ())
        .expect("failed");
}
