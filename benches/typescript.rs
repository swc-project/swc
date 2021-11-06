#![feature(test)]
#![feature(bench_black_box)]

extern crate swc_node_base;
extern crate test;

use std::{
    hint::black_box,
    io::{self, stderr},
    sync::Arc,
};
use swc::config::{Config, JscConfig, Options, SourceMapsConfig};
use swc_common::{errors::Handler, FileName, FilePathMapping, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{Syntax, TsConfig};
use swc_ecma_transforms::{fixer, hygiene, resolver, typescript};
use swc_ecma_visit::FoldWith;
use test::Bencher;

static SOURCE: &str = include_str!("assets/Observable.ts");

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    let c = swc::Compiler::new(cm.clone());

    c
}

fn parse(c: &swc::Compiler) -> (Arc<SourceFile>, Program) {
    let fm = c.cm.new_source_file(
        FileName::Real("rxjs/src/internal/Observable.ts".into()),
        SOURCE.to_string(),
    );
    let handler = Handler::with_emitter_writer(Box::new(io::stderr()), Some(c.cm.clone()));

    (
        fm.clone(),
        c.parse_js(
            fm,
            &handler,
            EsVersion::Es5,
            Syntax::Typescript(Default::default()),
            true,
            true,
        )
        .unwrap(),
    )
}

fn as_es(c: &swc::Compiler) -> Program {
    let program = parse(c).1;

    program.fold_with(&mut typescript::strip())
}

#[bench]
fn base_tr_fixer(b: &mut Bencher) {
    let c = mk();
    let module = as_es(&c);

    b.iter(|| {
        let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

        black_box(c.run_transform(&handler, true, || {
            module.clone().fold_with(&mut fixer(Some(c.comments())))
        }))
    });
}

#[bench]
fn base_tr_resolver_and_hygiene(b: &mut Bencher) {
    let c = mk();
    let module = as_es(&c);

    b.iter(|| {
        let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

        black_box(c.run_transform(&handler, true, || {
            module
                .clone()
                .fold_with(&mut resolver())
                .fold_with(&mut hygiene())
        }))
    });
}

/// This benchmark exists to know exact execution time of each pass.

fn bench_codegen(b: &mut Bencher, _target: EsVersion) {
    let c = mk();
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
            )
            .unwrap(),
        );
    })
}

macro_rules! codegen {
    ($name:ident, $target:expr) => {
        #[bench]
        fn $name(b: &mut Bencher) {
            bench_codegen(b, $target);
        }
    };
}

codegen!(codegen_es3, EsVersion::Es3);
codegen!(codegen_es5, EsVersion::Es5);
codegen!(codegen_es2015, EsVersion::Es2015);
codegen!(codegen_es2016, EsVersion::Es2016);
codegen!(codegen_es2017, EsVersion::Es2017);
codegen!(codegen_es2018, EsVersion::Es2018);
codegen!(codegen_es2019, EsVersion::Es2019);
codegen!(codegen_es2020, EsVersion::Es2020);

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

macro_rules! compat {
    ($name:ident, $target:expr) => {
        #[bench]
        fn $name(b: &mut Bencher) {
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
                        ..Default::default()
                    },
                    swcrc: false,
                    is_module: true,
                    ..Default::default()
                },
            );
        }
    };
}

compat!(full_es3, EsVersion::Es3);
compat!(full_es5, EsVersion::Es5);
compat!(full_es2015, EsVersion::Es2015);
compat!(full_es2016, EsVersion::Es2016);
compat!(full_es2017, EsVersion::Es2017);
compat!(full_es2018, EsVersion::Es2018);
compat!(full_es2019, EsVersion::Es2019);
compat!(full_es2020, EsVersion::Es2020);

#[bench]
fn parser(b: &mut Bencher) {
    let c = mk();

    //TODO: Use target

    b.iter(|| {
        black_box(parse(&c));
    })
}
