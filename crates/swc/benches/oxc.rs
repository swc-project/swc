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
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{fixer, resolver, typescript};
use swc_ecma_visit::FoldWith;

const FILES: &[&str] = &[
    "./benches/assets/parser.ts",
    "./benches/assets/renderer.ts",
    "./benches/assets/table.tsx",
    "./benches/assets/UserSettings.tsx",
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
    macro_rules! compat {
        ($name:ident, $target:expr) => {{
            for filename in FILES {
                c.bench_function(
                    &format!("es/full/all/{}/{}", stringify!($name), filename),
                    |b| {
                        bench_full(
                            b,
                            filename,
                            &Options {
                                config: Config {
                                    jsc: JscConfig {
                                        target: Some($target),
                                        syntax: Some(Syntax::Typescript(Default::default())),
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
                );
            }
        }};
    }

    compat!(es3, EsVersion::Es3);
    compat!(es5, EsVersion::Es5);
    compat!(es2015, EsVersion::Es2015);
    compat!(es2016, EsVersion::Es2016);
    compat!(es2017, EsVersion::Es2017);
    compat!(es2018, EsVersion::Es2018);
    compat!(es2019, EsVersion::Es2019);
    compat!(es2020, EsVersion::Es2020);
    compat!(es2021, EsVersion::Es2021);
    compat!(es2022, EsVersion::Es2022);
    compat!(esnext, EsVersion::EsNext);
}

criterion_group!(benches, full_group);
criterion_main!(benches);
