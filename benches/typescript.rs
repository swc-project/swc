#![feature(test)]

extern crate test;

use std::{hint::black_box, sync::Arc};
use swc::config::{Config, JscConfig, Options, SourceMapsConfig};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_ast::Program;
use swc_ecma_parser::{JscTarget, Syntax, TsConfig};
use swc_ecma_transforms::{fixer, hygiene, resolver, typescript};
use swc_ecma_visit::FoldWith;
use test::Bencher;

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));

    let c = swc::Compiler::new(cm.clone(), handler);

    c
}

fn parse(c: &swc::Compiler) -> Program {
    let fm = c.cm.new_source_file(
        FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
        SOURCE.to_string(),
    );
    c.parse_js(
        fm,
        JscTarget::Es5,
        Syntax::Typescript(Default::default()),
        true,
        true,
    )
    .unwrap()
}

fn as_es(c: &swc::Compiler) -> Program {
    let program = parse(c);

    program.fold_with(&mut typescript::strip())
}

#[bench]
fn base_tr_fixer(b: &mut Bencher) {
    let c = mk();
    let module = as_es(&c);

    b.iter(|| {
        black_box(c.run_transform(true, || {
            module.clone().fold_with(&mut fixer(Some(c.comments())))
        }))
    });
}

#[bench]
fn base_tr_resolver_and_hygiene(b: &mut Bencher) {
    let c = mk();
    let module = as_es(&c);

    b.iter(|| {
        black_box(c.run_transform(true, || {
            module
                .clone()
                .fold_with(&mut resolver())
                .fold_with(&mut hygiene())
        }))
    });
}

/// This benchmark exists to know exact execution time of each pass.
#[bench]
fn config_for_file(b: &mut Bencher) {
    let c = mk();

    b.iter(|| {
        black_box(c.config_for_file(
            &Options {
                config: Config {
                    jsc: JscConfig {
                        target: Some(JscTarget::Es2016),
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
            &FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
        ))
    });
}

/// This benchmark exists to know exact execution time of each pass.

fn bench_codegen(b: &mut Bencher, _target: JscTarget) {
    let c = mk();
    let module = as_es(&c);

    //TODO: Use target

    b.iter(|| {
        black_box(
            c.print(
                &module,
                JscTarget::Es2020,
                SourceMapsConfig::Bool(false),
                None,
                false,
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

codegen!(codegen_es3, JscTarget::Es3);
codegen!(codegen_es5, JscTarget::Es5);
codegen!(codegen_es2015, JscTarget::Es2015);
codegen!(codegen_es2016, JscTarget::Es2016);
codegen!(codegen_es2017, JscTarget::Es2017);
codegen!(codegen_es2018, JscTarget::Es2018);
codegen!(codegen_es2019, JscTarget::Es2019);
codegen!(codegen_es2020, JscTarget::Es2020);

fn bench_full(b: &mut Bencher, opts: &Options) {
    let c = mk();

    b.iter(|| {
        let fm = c.cm.new_source_file(
            FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
            SOURCE.to_string(),
        );
        c.process_js_file(fm, opts)
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

compat!(full_es3, JscTarget::Es3);
compat!(full_es5, JscTarget::Es5);
compat!(full_es2015, JscTarget::Es2015);
compat!(full_es2016, JscTarget::Es2016);
compat!(full_es2017, JscTarget::Es2017);
compat!(full_es2018, JscTarget::Es2018);
compat!(full_es2019, JscTarget::Es2019);
compat!(full_es2020, JscTarget::Es2020);

macro_rules! tr_only {
    ($name:ident, $target:expr) => {
        #[bench]
        fn $name(b: &mut Bencher) {
            let c = mk();
            let module = parse(&c);

            b.iter(|| {
                let program = module.clone();

                let mut config = c
                    .config_for_file(
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
                        &FileName::Real(
                            "rxjs/src/internal/observable/dom/AjaxObservable.ts".into(),
                        ),
                    )
                    .unwrap()
                    .unwrap();
                let program = c.run_transform(true, || program.fold_with(&mut config.pass));
                black_box(program)
            });
        }
    };
}

tr_only!(transforms_es3, JscTarget::Es3);
tr_only!(transforms_es5, JscTarget::Es5);
tr_only!(transforms_es2015, JscTarget::Es2015);
tr_only!(transforms_es2016, JscTarget::Es2016);
tr_only!(transforms_es2017, JscTarget::Es2017);
tr_only!(transforms_es2018, JscTarget::Es2018);
tr_only!(transforms_es2019, JscTarget::Es2019);
tr_only!(transforms_es2020, JscTarget::Es2020);

#[bench]
fn parser(b: &mut Bencher) {
    let c = mk();

    //TODO: Use target

    b.iter(|| {
        black_box(parse(&c));
    })
}
