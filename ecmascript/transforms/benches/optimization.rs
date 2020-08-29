#![feature(test)]

extern crate test;

use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms::{helpers, optimization::simplify::dce, typescript};
use swc_ecma_visit::{Fold, FoldWith};
use test::Bencher;

fn module(cm: Lrc<SourceMap>, src: &str) -> Module {
    let fm = cm.new_source_file(FileName::Anon, src.into());
    let lexer = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let module = parser.parse_module().map_err(|_| ()).unwrap();
    module
}

fn run<V>(b: &mut Bencher, src: &str, tr: impl Fn() -> V)
where
    V: Fold,
{
    b.bytes = src.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm, src);
        let module = module.fold_with(&mut typescript::strip());

        b.iter(|| {
            let module = module.clone();

            let _ = helpers::HELPERS.set(&Default::default(), || {
                let mut tr = tr();

                test::black_box(module.fold_with(&mut tr));
            });
        });

        Ok(())
    });
}

#[bench]
fn dce_4(b: &mut Bencher) {
    run(b, "{{{{ a }}}}", || dce::dce(Default::default()));
}

#[bench]
fn dce_16(b: &mut Bencher) {
    run(b, "{{{{{{{{{{{{{{{{ a }}}}}}}}}}}}}}}}", || {
        dce::dce(Default::default())
    });
}
