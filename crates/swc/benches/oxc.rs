extern crate swc_malloc;

use std::{
    fs,
    io::{self, stderr},
    sync::Arc,
};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::config::{Config, IsModule, JscConfig, Options};
use swc_common::{
    errors::Handler, FileName, FilePathMapping, Mark, SourceFile, SourceMap, GLOBALS,
};
use swc_compiler_base::PrintArgs;
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms::{fixer, resolver, typescript};
use swc_ecma_visit::FoldWith;

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

fn parse(c: &swc::Compiler, filename: &str) -> (Arc<SourceFile>, Program) {
    let fm = c.cm.new_source_file(
        FileName::Real(filename.to_string().into()).into(),
        fs::read_to_string(filename).unwrap(),
    );
    let handler = Handler::with_emitter_writer(Box::new(io::stderr()), Some(c.cm.clone()));

    let comments = c.comments().clone();
    (
        fm.clone(),
        c.parse_js(
            fm,
            &handler,
            EsVersion::Es5,
            Syntax::Typescript(Default::default()),
            IsModule::Bool(true),
            Some(&comments),
        )
        .unwrap(),
    )
}

fn as_es(c: &swc::Compiler, filename: &str) -> Program {
    let program = parse(c, filename).1;
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    program
        .fold_with(&mut resolver(unresolved_mark, top_level_mark, true))
        .fold_with(&mut typescript::strip(unresolved_mark, top_level_mark))
}

fn bench_full(b: &mut Bencher, filename: &str, opts: &Options) {
    let c = mk();

    let source = Arc::new(fs::read_to_string(filename).unwrap());

    b.iter(|| {
        GLOBALS.set(&Default::default(), || {
            let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

            let fm = c.cm.new_source_file_from(
                FileName::Real(filename.to_string().into()).into(),
                source.clone(),
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
                        "es/oxc/{}/sourceMap={},reactDev={}",
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
                                        ..Default::default()
                                    },
                                    module: None,
                                    ..Default::default()
                                },
                                swcrc: false,
                                ..Default::default()
                            },
                        );
                    },
                )
            }
        }
    }
}

criterion_group!(benches, full_group);
criterion_main!(benches);
