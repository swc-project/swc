use std::{fs, path::Path, sync::Arc};

use anyhow::Context;
use swc::{
    self,
    config::{Config, JscConfig, ModuleConfig, Options},
    try_with_handler, HandlerOpts,
};
use swc_common::SourceMap;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms::modules::{common_js, es6, util};

fn main() {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());

    let output = try_with_handler(
        cm.clone(),
        HandlerOpts {
            ..Default::default()
        },
        |handler| {
            let fm = cm
                .load_file(Path::new("examples/input.js"))
                .expect("failed to load file");

            c.process_js_file(
                fm,
                handler,
                &Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsConfig {
                                ..Default::default()
                            })),
                            external_helpers: true.into(),
                            target: Some(EsVersion::Es2022),
                            ..Default::default()
                        },
                        module: Some(ModuleConfig::Es6(es6::Config {
                            create_require: true,
                            config: util::Config {
                                ..Default::default()
                            },
                            ..Default::default()
                        })),
                        ..Default::default()
                    },
                    ..Default::default()
                },
            )
            .context("failed to process file")
        },
    )
    .unwrap();

    // println!("{}", output.code);
    fs::write("examples/output-es6-createrequire-actual.js", output.code).unwrap();

    let output = try_with_handler(
        cm.clone(),
        HandlerOpts {
            ..Default::default()
        },
        |handler| {
            let fm = cm
                .load_file(Path::new("examples/input.js"))
                .expect("failed to load file");

            c.process_js_file(
                fm,
                handler,
                &Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsConfig {
                                ..Default::default()
                            })),
                            external_helpers: true.into(),
                            target: Some(EsVersion::Es2022),
                            ..Default::default()
                        },
                        module: Some(ModuleConfig::Es6(es6::Config {
                            create_require: false,
                            config: util::Config {
                                ..Default::default()
                            },
                            ..Default::default()
                        })),
                        ..Default::default()
                    },
                    ..Default::default()
                },
            )
            .context("failed to process file")
        },
    )
    .unwrap();

    // println!("{}", output.code);
    fs::write("examples/output-es6-actual.js", output.code).unwrap();

    let output = try_with_handler(
        cm.clone(),
        HandlerOpts {
            ..Default::default()
        },
        |handler| {
            let fm = cm
                .load_file(Path::new("examples/input.js"))
                .expect("failed to load file");

            c.process_js_file(
                fm,
                handler,
                &Options {
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Typescript(TsConfig {
                                ..Default::default()
                            })),
                            external_helpers: true.into(),
                            target: Some(EsVersion::Es2022),
                            ..Default::default()
                        },
                        module: Some(ModuleConfig::CommonJs(common_js::Config {
                            ..Default::default()
                        })),
                        ..Default::default()
                    },
                    ..Default::default()
                },
            )
            .context("failed to process file")
        },
    )
    .unwrap();

    // println!("{}", output.code);
    fs::write("examples/output-commonjs-actual.js", output.code).unwrap();
}
