#![feature(test)]
#![feature(bench_black_box)]

extern crate test;

use std::{hint::black_box, io::stderr, sync::Arc};
use swc_babel_compat::babelify::{Babelify, Context};
use swc_common::{errors::Handler, FileName, FilePathMapping, SourceFile, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::{compat::es2020, typescript};
use swc_ecma_visit::FoldWith;
use test::Bencher;

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    let c = swc::Compiler::new(cm.clone());

    c
}

fn parse(c: &swc::Compiler, src: &str) -> (Arc<SourceFile>, Program) {
    let fm = c.cm.new_source_file(
        FileName::Real("rxjs/src/internal/observable/dom/AjaxObservable.ts".into()),
        src.to_string(),
    );

    let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

    let module = c
        .parse_js(
            fm.clone(),
            &handler,
            EsVersion::Es5,
            Syntax::Typescript(Default::default()),
            true,
            true,
        )
        .unwrap();

    (fm, module)
}

#[bench]
fn babelify_only(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let c = mk();
    let (fm, module) = parse(&c, SOURCE);
    let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

    let module = c.run_transform(&handler, false, || {
        module
            .fold_with(&mut typescript::strip())
            .fold_with(&mut es2020(Default::default()))
    });

    b.iter(|| {
        let program = module.clone();
        let ctx = Context {
            fm: fm.clone(),
            cm: c.cm.clone(),
            comments: c.comments().clone(),
        };

        let babel_ast = program.babelify(&ctx);
        black_box(babel_ast)
    });
}

fn parse_and_babelify(b: &mut Bencher, _name: &str, src: &str) {
    b.bytes = src.len() as _;

    let c = mk();

    b.iter(|| {
        let (fm, program) = parse(&c, src);
        let ctx = Context {
            fm,
            cm: c.cm.clone(),
            comments: c.comments().clone(),
        };

        let babel_ast = program.babelify(&ctx);
        black_box(babel_ast);
    });
}

/// https://esprima.org/test/compare.html
macro_rules! src_to_babel_ast {
    ($name:ident, $src:expr) => {
        #[bench]
        fn $name(b: &mut Bencher) {
            parse_and_babelify(b, stringify!($name), $src);
        }
    };
}

src_to_babel_ast!(
    parse_and_babelify_angular,
    include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js")
);

src_to_babel_ast!(
    parse_and_babelify_backbone,
    include_str!("../../swc_ecma_parser/benches/files/backbone-1.1.0.js")
);

src_to_babel_ast!(
    parse_and_babelify_jquery,
    include_str!("../../swc_ecma_parser/benches/files/jquery-1.9.1.js")
);

src_to_babel_ast!(
    parse_and_babelify_jquery_mobile,
    include_str!("../../swc_ecma_parser/benches/files/jquery.mobile-1.4.2.js")
);

src_to_babel_ast!(
    parse_and_babelify_mootools,
    include_str!("../../swc_ecma_parser/benches/files/mootools-1.4.5.js")
);

src_to_babel_ast!(
    parse_and_babelify_underscore,
    include_str!("../../swc_ecma_parser/benches/files/underscore-1.5.2.js")
);

src_to_babel_ast!(
    parse_and_babelify_yui,
    include_str!("../../swc_ecma_parser/benches/files/yui-3.12.0.js")
);
