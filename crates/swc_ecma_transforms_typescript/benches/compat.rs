use criterion::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{chain, comments::SingleThreadedComments, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::{helpers, resolver::resolver_with_mark};
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::{Fold, FoldWith};

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

    parser.parse_module().map_err(|_| ()).unwrap()
}

fn run<V>(b: &mut Bencher, tr: impl Fn() -> V)
where
    V: Fold,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
        let mark = Mark::fresh(Mark::root());
        let module = module
            .fold_with(&mut resolver_with_mark(mark))
            .fold_with(&mut strip(mark));

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

fn baseline_group(c: &mut Criterion) {
    c.bench_function("base", base);
    c.bench_function("common_reserved_word", common_reserved_word);
    c.bench_function("common_typescript", common_typescript);
}

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

fn common_typescript(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
        let mark = Mark::fresh(Mark::root());
        let module = module
            .fold_with(&mut resolver_with_mark(mark))
            .fold_with(&mut strip(mark));

        b.iter(|| {
            let module = module.clone();

            let _ = helpers::HELPERS.set(&Default::default(), || {
                test::black_box(module.fold_with(&mut strip(mark)));
            });
        });

        Ok(())
    });
}

fn common_reserved_word(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::reserved_words::reserved_words()
    });
}

fn version_group(c: &mut Criterion) {
    c.bench_function("es2015", es2015);
    c.bench_function("es2016", es2016);
    c.bench_function("es2017", es2017);
    c.bench_function("es2018", es2018);
    c.bench_function("es2019", es2019);
    c.bench_function("es2020", es2020);
}

fn single_tr_group(c: &mut Criterion) {
    c.bench_function("es2020_nullish_coalescing", es2020_nullish_coalescing);
    c.bench_function("es2020_optional_chaining", es2020_optional_chaining);
    c.bench_function("es2022_class_properties", es2022_class_properties);
    c.bench_function("es2018_object_rest_spread", es2018_object_rest_spread);
}

fn es2020(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2022(
            Some(SingleThreadedComments::default()),
            Default::default(),
        )
    });
}

fn es2020_nullish_coalescing(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2020::nullish_coalescing(
            swc_ecma_transforms_compat::es2020::nullish_coalescing::Config {
                no_document_all: false,
            },
        )
    });
}

fn es2020_optional_chaining(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2020::optional_chaining(Default::default())
    });
}

fn es2022_class_properties(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2022::class_properties(
            Some(SingleThreadedComments::default()),
            Default::default(),
        )
    });
}

fn es2018(b: &mut Bencher) {
    run(b, || swc_ecma_transforms_compat::es2018(Default::default()));
}

fn es2018_object_rest_spread(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2018::object_rest_spread(Default::default())
    });
}

#[bench]
fn es2019_optional_catch_binding(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2019::optional_catch_binding()
    });
}

fn es2017(b: &mut Bencher) {
    run(b, || swc_ecma_transforms_compat::es2017(Default::default()));
}

#[bench]
fn es2017_async_to_generator(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2017::async_to_generator(Default::default())
    });
}

fn es2016(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2016);
}

#[bench]
fn es2016_exponentation(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2016::exponentation);
}

fn es2015(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015(
            Mark::fresh(Mark::root()),
            Some(SingleThreadedComments::default()),
            Default::default(),
        )
    });
}

#[bench]
fn es2015_arrow(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::arrow);
}

#[bench]
fn es2015_block_scoped_fn(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::block_scoped_functions()
    });
}

#[bench]
fn es2015_block_scoping(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::block_scoping);
}

#[bench]
fn es2015_classes(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::classes(
            Some(SingleThreadedComments::default()),
            Default::default(),
        )
    });
}

#[bench]
fn es2015_computed_props(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::computed_properties(Default::default())
    });
}

#[bench]
fn es2015_destructuring(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::destructuring(Default::default())
    });
}

#[bench]
fn es2015_duplicate_keys(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::duplicate_keys);
}

#[bench]
fn es2015_parameters(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::parameters(Default::default())
    });
}

#[bench]
fn es2015_fn_name(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::function_name);
}

#[bench]
fn es2015_for_of(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::for_of(Default::default())
    });
}

#[bench]
fn es2015_instanceof(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::instance_of);
}

#[bench]
fn es2015_shorthand_property(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::shorthand);
}

#[bench]
fn es2015_spread(b: &mut Bencher) {
    run(b, || {
        swc_ecma_transforms_compat::es2015::spread(
            swc_ecma_transforms_compat::es2015::spread::Config {
                ..Default::default()
            },
        )
    });
}

#[bench]
fn es2015_sticky_regex(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::sticky_regex);
}

#[bench]
fn es2015_typeof_symbol(b: &mut Bencher) {
    run(b, swc_ecma_transforms_compat::es2015::typeof_symbol);
}

#[bench]
fn es3(b: &mut Bencher) {
    run(b, || swc_ecma_transforms_compat::es3(Default::default()));
}

fn full_es2016(b: &mut Bencher) {
    run(b, || {
        chain!(
            swc_ecma_transforms_compat::es2022(
                Some(SingleThreadedComments::default()),
                Default::default()
            ),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
            swc_ecma_transforms_compat::es2017(Default::default()),
            swc_ecma_transforms_compat::es2016(),
        )
    });
}

fn full_es2017(b: &mut Bencher) {
    run(b, || {
        chain!(
            swc_ecma_transforms_compat::es2022(
                Some(SingleThreadedComments::default()),
                Default::default()
            ),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
            swc_ecma_transforms_compat::es2017(Default::default()),
        )
    });
}

fn full_es2018(b: &mut Bencher) {
    run(b, || {
        chain!(
            swc_ecma_transforms_compat::es2022(
                Some(SingleThreadedComments::default()),
                Default::default()
            ),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
        )
    });
}

fn full_group(c: &mut Criterion) {
    c.bench_function("es2016", full_es2016);
    c.bench_function("es2017", full_es2017);
    c.bench_function("es2018", full_es2018);
}

criterion_group!(benches, full_group, single_tr_group, baseline_group);
criterion_main!(benches);
