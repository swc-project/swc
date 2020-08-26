#![feature(test)]

extern crate test;

use swc_common::{chain, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms::{compat, helpers, typescript};
use swc_ecma_visit::{Fold, FoldWith};
use test::Bencher;

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

fn module(cm: Lrc<SourceMap>) -> Module {
    let fm = cm.new_source_file(FileName::Anon, SOURCE.into());
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

fn run<V>(b: &mut Bencher, tr: impl Fn() -> V)
where
    V: Fold,
{
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
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
fn base(b: &mut Bencher) {
    struct Noop;
    impl Fold for Noop {
        #[inline]
        fn fold_module(&mut self, m: Module) -> Module {
            m
        }
    }
    run(b, || Noop);
}

#[bench]
fn common_typescript(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
        let module = module.fold_with(&mut typescript::strip());

        b.iter(|| {
            let module = module.clone();

            let _ = helpers::HELPERS.set(&Default::default(), || {
                test::black_box(module.fold_with(&mut typescript::strip()));
            });
        });

        Ok(())
    });
}

#[bench]
fn common_reserved_word(b: &mut Bencher) {
    run(b, || compat::reserved_words::reserved_words());
}

#[bench]
fn es2020(b: &mut Bencher) {
    run(b, || compat::es2020());
}

#[bench]
fn es2020_nullish_coalescing(b: &mut Bencher) {
    run(b, || compat::es2020::nullish_coalescing());
}

#[bench]
fn es2020_optional_chaining(b: &mut Bencher) {
    run(b, || compat::es2020::optional_chaining());
}

#[bench]
fn es2020_typescript_class_properties(b: &mut Bencher) {
    run(b, || compat::es2020::typescript_class_properties());
}

#[bench]
fn es2020_class_properties(b: &mut Bencher) {
    run(b, || compat::es2020::class_properties());
}

#[bench]
fn es2018(b: &mut Bencher) {
    run(b, || compat::es2018());
}

#[bench]
fn es2018_object_rest_spread(b: &mut Bencher) {
    run(b, || compat::es2018::object_rest_spread());
}

#[bench]
fn es2018_optional_catch_binding(b: &mut Bencher) {
    run(b, || compat::es2018::optional_catch_binding());
}

#[bench]
fn es2017(b: &mut Bencher) {
    run(b, || compat::es2017());
}

#[bench]
fn es2017_async_to_generator(b: &mut Bencher) {
    run(b, || compat::es2017::async_to_generator());
}

#[bench]
fn es2016(b: &mut Bencher) {
    run(b, || compat::es2016());
}

#[bench]
fn es2016_exponentation(b: &mut Bencher) {
    run(b, || compat::es2016::exponentation());
}

#[bench]
fn es2015(b: &mut Bencher) {
    run(b, || {
        compat::es2015(Mark::fresh(Mark::root()), Default::default())
    });
}

#[bench]
fn es2015_arrow(b: &mut Bencher) {
    run(b, || compat::es2015::arrow());
}

#[bench]
fn es2015_block_scoped_fn(b: &mut Bencher) {
    run(b, || compat::es2015::block_scoped_functions());
}

#[bench]
fn es2015_block_scoping(b: &mut Bencher) {
    run(b, || compat::es2015::block_scoping());
}

#[bench]
fn es2015_classes(b: &mut Bencher) {
    run(b, || compat::es2015::classes());
}

#[bench]
fn es2015_computed_props(b: &mut Bencher) {
    run(b, compat::es2015::computed_properties);
}

#[bench]
fn es2015_destructuring(b: &mut Bencher) {
    run(b, || compat::es2015::destructuring(Default::default()));
}

#[bench]
fn es2015_duplicate_keys(b: &mut Bencher) {
    run(b, || compat::es2015::duplicate_keys());
}

#[bench]
fn es2015_parameters(b: &mut Bencher) {
    run(b, || compat::es2015::parameters());
}

#[bench]
fn es2015_fn_name(b: &mut Bencher) {
    run(b, || compat::es2015::function_name());
}

#[bench]
fn es2015_for_of(b: &mut Bencher) {
    run(b, || compat::es2015::for_of(Default::default()));
}

#[bench]
fn es2015_instanceof(b: &mut Bencher) {
    run(b, || compat::es2015::instance_of());
}

#[bench]
fn es2015_shorthand_property(b: &mut Bencher) {
    run(b, || compat::es2015::shorthand());
}

#[bench]
fn es2015_spread(b: &mut Bencher) {
    run(b, || {
        compat::es2015::spread(compat::es2015::spread::Config {
            ..Default::default()
        })
    });
}

#[bench]
fn es2015_sticky_regex(b: &mut Bencher) {
    run(b, || compat::es2015::sticky_regex());
}

#[bench]
fn es2015_typeof_symbol(b: &mut Bencher) {
    run(b, || compat::es2015::typeof_symbol());
}

#[bench]
fn es3(b: &mut Bencher) {
    run(b, || compat::es3(Default::default()));
}

#[bench]
fn full_es2016(b: &mut Bencher) {
    run(b, || {
        chain!(
            compat::es2020(),
            compat::es2018(),
            compat::es2017(),
            compat::es2016(),
        )
    });
}

#[bench]
fn full_es2017(b: &mut Bencher) {
    run(b, || {
        chain!(compat::es2020(), compat::es2018(), compat::es2017(),)
    });
}

#[bench]
fn full_es2018(b: &mut Bencher) {
    run(b, || chain!(compat::es2020(), compat::es2018(),));
}
