use std::{
    fs::create_dir_all,
    mem,
    panic::{catch_unwind, resume_unwind, AssertUnwindSafe},
    path::{Path, PathBuf},
    sync::Arc,
};

use serde::de::DeserializeOwned;
use swc::{
    config::{Config, IsModule, JscConfig, Options, SourceMapsConfig},
    try_with_handler, Compiler,
};
use swc_common::{errors::ColorConfig, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use testing::NormalizedOutput;

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
        "privateNameStaticAccessorsDerivedClasses.ts",
        "privateNameErrorsOnNotUseDefineForClassFieldsInEsNext.ts",
        "enumConstantMembers.ts",
        "jsDeclarationsDocCommentsOnConsts.ts",
        "jsDeclarationsReexportedCjsAlias.ts",
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

    let panics = matrix()
        .into_iter()
        .filter_map(|(name, opts)| {
            //

            catch_unwind(AssertUnwindSafe(|| {
                let output_dir = Path::new("tests").join("tsc-references");

                let _ = create_dir_all(&output_dir);

                let output_path = output_dir.join(format!(
                    "{}_{}.js",
                    input.file_stem().unwrap().to_str().unwrap(),
                    name
                ));

                compile(&input, &output_path, opts);
            }))
            .err()
        })
        .collect::<Vec<_>>();

    if panics.is_empty() {
        return;
    }

    resume_unwind(panics.into_iter().next().unwrap());
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
                                "{ \"compress\": { \"toplevel\": true, \"module\": true, \
                                 \"passes\": 0 }, \"mangle\": false, \"toplevel\": true }",
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

fn is_filename_directives(line: &str) -> bool {
    line.starts_with("// @Filename:")
        || line.starts_with("// @filename:")
        || line.starts_with("//@Filename:")
        || line.starts_with("//@filename:")
}

fn compile(input: &Path, output: &Path, opts: Options) {
    let cm = Arc::<SourceMap>::default();

    let c = Compiler::new(cm.clone());

    let fm = cm.load_file(input).expect("failed to load file");

    let mut files = vec![];

    if fm.src.lines().any(is_filename_directives) {
        let mut buffer = String::default();

        let mut iter = fm.src.lines();

        let mut meta_line = None;

        loop {
            let line = iter.next();
            if line.map_or(true, is_filename_directives) {
                if !buffer.is_empty() {
                    let mut source = String::default();
                    mem::swap(&mut source, &mut buffer);

                    files.push((
                        meta_line,
                        cm.new_source_file(swc_common::FileName::Anon, source),
                    ));
                }
                meta_line = line;
            }

            if let Some(line) = line {
                buffer += line;
                buffer.push('\n');
            } else {
                break;
            }
        }
    } else {
        files = vec![(None, fm)];
    }

    let mut result = String::default();

    let options = Options {
        config: Config {
            jsc: JscConfig {
                syntax: Some(Syntax::Typescript(TsConfig {
                    tsx: input.to_string_lossy().ends_with(".tsx"),
                    decorators: true,
                    dts: false,
                    no_early_errors: false,
                })),
                external_helpers: true.into(),
                ..opts.config.jsc
            },
            source_maps: Some(SourceMapsConfig::Bool(
                !input.to_string_lossy().contains("Unicode"),
            )),
            is_module: IsModule::Bool(true),
            ..opts.config
        },
        ..opts
    };

    for (meta_line, file) in files {
        match try_with_handler(
            cm.clone(),
            swc::HandlerOpts {
                color: ColorConfig::Never,
                skip_filename: true,
            },
            |handler| c.process_js_file(file, handler, &options),
        ) {
            Ok(res) => {
                result += &res.code;
            }
            Err(ref err) => {
                let error_text = format!("{:?}", err);

                if let Some(meta_line) = meta_line {
                    result += meta_line;
                    result.push('\n');
                }

                for line in error_text.lines() {
                    result.push_str("//!");
                    result.push_str(line);
                    result.push('\n');
                }
            }
        }
    }

    NormalizedOutput::from(result)
        .compare_to_file(output)
        .unwrap();
}
