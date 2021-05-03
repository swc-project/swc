#![feature(test)]

extern crate test;

use std::{hint::black_box, sync::Arc};
use swc::config::{Config, JscConfig, Options, SourceMapsConfig};
use swc_babel_compat::Babelify;
use swc_babel_compat::Context;
use swc_common::SourceFile;
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

fn parse(c: &swc::Compiler) -> (Arc<SourceFile>, Program) {
    let fm = c.cm.new_source_file(
        FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
        SOURCE.to_string(),
    );
    let module = c
        .parse_js(
            fm.clone(),
            JscTarget::Es5,
            Syntax::Typescript(Default::default()),
            true,
            true,
        )
        .unwrap();

    (fm, module)
}

#[bench]
fn babelify_without_comments(b: &mut Bencher) {
    let c = mk();
    let module = parse(&c);

    b.iter(|| {
        let (fm, program) = module.clone();
        let ctx = Context {
            fm,
            cm: c.cm.clone(),
            comments: Arc::new(c.comments().clone()),
        };

        let babel_ast = program.babelify(&ctx);
        black_box(babel_ast)
    });
}
