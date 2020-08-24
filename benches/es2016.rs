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

#[bench]
fn es2016(b: &mut Bencher) {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Arc::new(Handler::with_tty_emitter(
        ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    ));

    let c = swc::Compiler::new(cm.clone(), handler);
    b.iter(|| {
        let fm = cm.new_source_file(
            FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
            SOURCE.to_string(),
        );
        c.process_js_file(
            fm,
            &Options {
                config: Some(Config {
                    jsc: JscConfig {
                        target: JscTarget::Es2016,
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
        )
    });
}
