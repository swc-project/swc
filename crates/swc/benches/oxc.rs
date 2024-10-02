extern crate swc_malloc;

use std::{fs, io::stderr, sync::Arc};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::config::{Config, JscConfig, Options, TransformConfig};
use swc_common::{errors::Handler, FileName, FilePathMapping, SourceMap, GLOBALS};
use swc_compiler_base::SourceMapsConfig;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms::react::Runtime;

const FILES: &[&str] = &[
    "benches/assets/parser.ts",
    "benches/assets/renderer.ts",
    "benches/assets/table.tsx",
    "benches/assets/UserSettings.tsx",
];

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn bench_full(b: &mut Bencher, filename: &str, opts: &Options) {
    let c = mk();

    let source = Arc::new(fs::read_to_string(filename).unwrap());

    b.iter(|| {
        GLOBALS.set(&Default::default(), || {
            let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

            let fm = c.cm.new_source_file_from(
                FileName::Real(filename.to_string().into()).into(),
                black_box(source.clone()),
            );
            let _ = c.process_js_file(fm, &handler, opts).unwrap();
        })
    });
}

fn full_group(c: &mut Criterion) {
    for filename in FILES {
        for source_map in [true, false] {
            for react_dev in [true, false] {
                c.bench_function(
                    &format!(
                        "es/oxc/{}/sourceMap={}/reactDev={}",
                        filename, source_map, react_dev
                    ),
                    |b| {
                        bench_full(
                            b,
                            filename,
                            &Options {
                                config: Config {
                                    jsc: JscConfig {
                                        target: Some(EsVersion::EsNext),
                                        syntax: Some(Syntax::Typescript(TsSyntax {
                                            tsx: filename.ends_with(".tsx"),
                                            ..Default::default()
                                        })),
                                        transform: Some(TransformConfig {
                                            react: swc_ecma_transforms::react::Options {
                                                runtime: Some(Runtime::Automatic),
                                                development: Some(react_dev),
                                                ..Default::default()
                                            },
                                            ..Default::default()
                                        })
                                        .into(),
                                        ..Default::default()
                                    },
                                    module: None,
                                    source_maps: if source_map {
                                        Some(SourceMapsConfig::Bool(true))
                                    } else {
                                        None
                                    },
                                    ..Default::default()
                                },
                                swcrc: false,
                                ..Default::default()
                            },
                        );
                    },
                );
            }
        }
    }
}

criterion_group!(benches, full_group);
criterion_main!(benches);
