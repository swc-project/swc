#![feature(test)]

extern crate test;

use std::sync::Arc;
use swc::config::{Config, JscConfig, ModuleConfig, Options};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_parser::{JscTarget, Syntax, TsConfig};
use swc_ecma_transforms::modules::common_js;
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

#[bench]
fn base_parsing(b: &mut Bencher) {
    let c = mk();

    b.iter(|| {
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
        .unwrap();
    });
}

fn bench_swc(b: &mut Bencher, opts: &Options) {
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
    ($name:ident, $cjs_name:ident, $target:expr) => {
        #[bench]
        fn $name(b: &mut Bencher) {
            bench_swc(
                b,
                &Options {
                    config: Some(Config {
                        jsc: JscConfig {
                            target: $target,
                            syntax: Some(Syntax::Typescript(TsConfig {
                                ..Default::default()
                            })),
                            ..Default::default()
                        },
                        module: None,
                        ..Default::default()
                    }),
                    swcrc: false,
                    is_module: true,
                    ..Default::default()
                },
            );
        }

        #[bench]
        fn $cjs_name(b: &mut Bencher) {
            bench_swc(
                b,
                &Options {
                    config: Some(Config {
                        jsc: JscConfig {
                            target: $target,
                            syntax: Some(Syntax::Typescript(TsConfig {
                                ..Default::default()
                            })),
                            ..Default::default()
                        },
                        module: Some(ModuleConfig::CommonJs(common_js::Config {
                            ..Default::default()
                        })),
                        ..Default::default()
                    }),
                    swcrc: false,
                    is_module: true,
                    ..Default::default()
                },
            );
        }
    };
}

compat!(es3, es3_cjs, JscTarget::Es3);
compat!(es5, es5_cjs, JscTarget::Es5);
compat!(es2015, es2015_cjs, JscTarget::Es2015);
compat!(es2016, es2016_cjs, JscTarget::Es2016);
compat!(es2017, es2017_cjs, JscTarget::Es2017);
compat!(es2018, es2018_cjs, JscTarget::Es2018);
compat!(es2019, es2019_cjs, JscTarget::Es2019);
compat!(es2020, es2020_cjs, JscTarget::Es2020);
