use std::{
    fs::create_dir_all,
    path::{Path, PathBuf},
};

use serde::de::DeserializeOwned;
use swc::{
    config::{Config, IsModule, JscConfig, Options, SourceMapsConfig},
    Compiler,
};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use testing::{NormalizedOutput, Tester};

#[testing::fixture(
    "../swc_ecma_parser/tests/tsc/**/*.ts",
    exclude(
        "privateNameFieldDestructuredBinding.ts",
        "restPropertyWithBindingPattern.ts",
        "elementAccessChain\\.3.ts",
        "propertyAccessChain\\.3.ts",
        "objectRestNegative.ts",
        "objectRestPropertyMustBeLast.ts",
        "privateNameAndAny.ts",
        "privateNameAndIndexSignature.ts",
        "privateNameImplicitDeclaration.ts",
        "privateNameStaticAccessorssDerivedClasses.ts",
        "privateNameErrorsOnNotUseDefineForClassFieldsInEsNext.ts",
        "enumConstantMembers.ts",
    )
)]
#[testing::fixture(
    "../swc_ecma_parser/tests/tsc/**/*.tsx",
    exclude("checkJsxNamespaceNamesQuestionableForms.tsx")
)]
fn fixture(input: PathBuf) {
    if input.to_string_lossy().contains("jsdoc") {
        return;
    }

    for (name, opts) in matrix() {
        let output_dir = Path::new("tests").join("tsc-references");

        let _ = create_dir_all(&output_dir);

        let output_path = output_dir.join(format!(
            "{}_{}.js",
            input.file_stem().unwrap().to_str().unwrap(),
            name
        ));

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
        for minify in [true, false] {
            let opts = Options {
                config: Config {
                    jsc: JscConfig {
                        target: Some(target),
                        minify: if minify {
                            Some(from_json(
                                "{ \"compress\": { \"toplevel\": true, \"module\": true }, \
                                 \"mangle\": false, \"toplevel\": true }",
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
                    is_module: IsModule::Bool(true),

                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsConfig {
                                tsx: input.to_string_lossy().ends_with(".tsx"),
                                decorators: true,
                                dts: false,
                                no_early_errors: true,
                            })),
                            external_helpers: true,
                            ..opts.config.jsc
                        },
                        source_maps: Some(SourceMapsConfig::Bool(
                            !input.to_string_lossy().contains("Unicode"),
                        )),
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
