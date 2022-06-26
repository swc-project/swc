extern crate swc_node_base;

use std::{
    io::{self, stderr},
    sync::Arc,
};

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::config::{Config, IsModule, JscConfig, Options, SourceMapsConfig};
use swc_common::{errors::Handler, FileName, FilePathMapping, Mark, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms::{fixer, hygiene, resolver, typescript};
use swc_ecma_visit::FoldWith;

static SOURCE: &str = include_str!("assets/Observable.ts");

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn parse(c: &swc::Compiler) -> (Arc<SourceFile>, Program) {
    let fm = c.cm.new_source_file(
        FileName::Real("rxjs/src/internal/Observable.ts".into()),
        SOURCE.to_string(),
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

fn as_es(c: &swc::Compiler) -> Program {
    let program = parse(c).1;
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    program
        .fold_with(&mut resolver(unresolved_mark, top_level_mark, true))
        .fold_with(&mut typescript::strip(top_level_mark))
}

fn base_tr_group(c: &mut Criterion) {
    c.bench_function("es/full/base/fixer", base_tr_fixer);
    c.bench_function(
        "es/full/base/resolver_and_hygiene",
        base_tr_resolver_and_hygiene,
    );
}

fn base_tr_fixer(b: &mut Bencher) {
    let c = mk();
    c.run(|| {
        let module = as_es(&c);

        b.iter(|| {
            let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));
            black_box(c.run_transform(&handler, true, || {
                module.clone().fold_with(&mut fixer(Some(c.comments())))
            }))
        });
    });
}

fn base_tr_resolver_and_hygiene(b: &mut Bencher) {
    let c = mk();
    c.run(|| {
        let module = as_es(&c);

        b.iter(|| {
            let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));
            black_box(c.run_transform(&handler, true, || {
                module
                    .clone()
                    .fold_with(&mut resolver(Mark::new(), Mark::new(), false))
                    .fold_with(&mut hygiene())
            }))
        });
    })
}

/// This benchmark exists to know exact execution time of each pass.

fn bench_codegen(b: &mut Bencher, _target: EsVersion) {
    let c = mk();

    c.run(|| {
        let module = as_es(&c);

        //TODO: Use target

        b.iter(|| {
            black_box(
                c.print(
                    &module,
                    None,
                    None,
                    false,
                    EsVersion::Es2020,
                    SourceMapsConfig::Bool(false),
                    &Default::default(),
                    None,
                    false,
                    None,
                    false,
                    false,
                )
                .unwrap(),
            );
        })
    });
}

fn codegen_group(c: &mut Criterion) {
    macro_rules! codegen {
        ($name:ident, $target:expr) => {
            c.bench_function(&format!("es/full/codegen/{}", stringify!($name)), |b| {
                bench_codegen(b, $target);
            });
        };
    }

    codegen!(es3, EsVersion::Es3);
    codegen!(es5, EsVersion::Es5);
    codegen!(es2015, EsVersion::Es2015);
    codegen!(es2016, EsVersion::Es2016);
    codegen!(es2017, EsVersion::Es2017);
    codegen!(es2018, EsVersion::Es2018);
    codegen!(es2019, EsVersion::Es2019);
    codegen!(es2020, EsVersion::Es2020);
}

fn bench_full(b: &mut Bencher, opts: &Options) {
    let c = mk();

    b.iter(|| {
        for _ in 0..100 {
            let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

            let fm = c.cm.new_source_file(
                FileName::Real("rxjs/src/internal/Observable.ts".into()),
                SOURCE.to_string(),
            );
            let _ = c.process_js_file(fm, &handler, opts).unwrap();
        }
    });
}

fn full_group(c: &mut Criterion) {
    macro_rules! compat {
        ($name:ident, $target:expr) => {
            c.bench_function(&format!("es/full/all/{}", stringify!($name)), |b| {
                bench_full(
                    b,
                    &Options {
                        config: Config {
                            jsc: JscConfig {
                                target: Some($target),
                                syntax: Some(Syntax::Typescript(TsConfig {
                                    ..Default::default()
                                })),
                                ..Default::default()
                            },
                            module: None,
                            is_module: IsModule::Bool(true),
                            ..Default::default()
                        },
                        swcrc: false,
                        ..Default::default()
                    },
                );
            });
        };
    }

    compat!(es3, EsVersion::Es3);
    compat!(es5, EsVersion::Es5);
    compat!(es2015, EsVersion::Es2015);
    compat!(es2016, EsVersion::Es2016);
    compat!(es2017, EsVersion::Es2017);
    compat!(es2018, EsVersion::Es2018);
    compat!(es2019, EsVersion::Es2019);
    compat!(es2020, EsVersion::Es2020);
}

fn parser_group(c: &mut Criterion) {
    c.bench_function("es/full/parser", parser);
}

fn parser(b: &mut Bencher) {
    let c = mk();

    //TODO: Use target

    b.iter(|| {
        black_box(parse(&c));
    })
}

criterion_group!(
    benches,
    codegen_group,
    full_group,
    parser_group,
    base_tr_group
);
criterion_main!(benches);
