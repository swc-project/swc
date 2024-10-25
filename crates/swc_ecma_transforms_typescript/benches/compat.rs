use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{comments::SingleThreadedComments, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::{Module, Pass, Program};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::{helpers, resolver};
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::{fold_pass, Fold};

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

fn module(cm: Lrc<SourceMap>) -> Program {
    let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());
    let lexer = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);

    parser
        .parse_module()
        .map(Program::Module)
        .map_err(|_| ())
        .unwrap()
}

fn run<V>(b: &mut Bencher, tr: impl Fn(Mark) -> V)
where
    V: Pass,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());
        let module = module
            .apply(resolver(unresolved_mark, top_level_mark, true))
            .apply(strip(unresolved_mark, top_level_mark));

        b.iter(|| {
            let module = module.clone();

            helpers::HELPERS.set(&Default::default(), || {
                let tr = tr(unresolved_mark);

                black_box(module.apply(tr));
            });
        });

        Ok(())
    });
}

fn baseline_group(c: &mut Criterion) {
    c.bench_function("es/transform/baseline/base", base);
    c.bench_function(
        "es/transform/baseline/common_reserved_word",
        common_reserved_word,
    );
    c.bench_function("es/transform/baseline/common_typescript", common_typescript);
}

fn base(b: &mut Bencher) {
    struct Noop;
    impl Fold for Noop {
        #[inline]
        fn fold_module(&mut self, m: Module) -> Module {
            m
        }
    }
    run(b, |_| fold_pass(Noop));
}

fn common_typescript(b: &mut Bencher) {
    let _ = ::testing::run_test(false, |cm, _| {
        let module = module(cm);
        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());
        let module = module
            .apply(resolver(unresolved_mark, top_level_mark, true))
            .apply(strip(unresolved_mark, top_level_mark));

        b.iter(|| {
            let module = module.clone();

            helpers::HELPERS.set(&Default::default(), || {
                black_box(module.apply(strip(unresolved_mark, top_level_mark)));
            });
        });

        Ok(())
    });
}

fn common_reserved_word(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::reserved_words::reserved_words()
    });
}

fn version_group(c: &mut Criterion) {
    c.bench_function("es/target/es3", es3);
    c.bench_function("es/target/es2015", es2015);
    c.bench_function("es/target/es2016", es2016);
    c.bench_function("es/target/es2017", es2017);
    c.bench_function("es/target/es2018", es2018);
    c.bench_function("es/target/es2020", es2020);
}

fn single_tr_group(c: &mut Criterion) {
    c.bench_function("es2020_nullish_coalescing", es2020_nullish_coalescing);
    c.bench_function("es2020_optional_chaining", es2020_optional_chaining);
    c.bench_function("es2022_class_properties", es2022_class_properties);
    c.bench_function("es2018_object_rest_spread", es2018_object_rest_spread);
    c.bench_function(
        "es2019_optional_catch_binding",
        es2019_optional_catch_binding,
    );
    c.bench_function("es2017_async_to_generator", es2017_async_to_generator);
    c.bench_function("es2016_exponentiation", es2016_exponentiation);
    c.bench_function("es2015_arrow", es2015_arrow);
    c.bench_function("es2015_block_scoped_fn", es2015_block_scoped_fn);
    c.bench_function("es2015_block_scoping", es2015_block_scoping);
    c.bench_function("es2015_classes", es2015_classes);
    c.bench_function("es2015_computed_props", es2015_computed_props);
    c.bench_function("es2015_destructuring", es2015_destructuring);
    c.bench_function("es2015_duplicate_keys", es2015_duplicate_keys);
    c.bench_function("es2015_parameters", es2015_parameters);
    c.bench_function("es2015_fn_name", es2015_fn_name);
    c.bench_function("es2015_for_of", es2015_for_of);
    c.bench_function("es2015_instanceof", es2015_instanceof);
    c.bench_function("es2015_shorthand_property", es2015_shorthand_property);
    c.bench_function("es2015_spread", es2015_spread);
    c.bench_function("es2015_sticky_regex", es2015_sticky_regex);
    c.bench_function("es2015_typeof_symbol", es2015_typeof_symbol);
}

fn es2020(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        swc_ecma_transforms_compat::es2022(Default::default(), unresolved_mark)
    });
}

fn es2020_nullish_coalescing(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2020::nullish_coalescing(
            swc_ecma_transforms_compat::es2020::nullish_coalescing::Config {
                no_document_all: false,
            },
        )
    });
}

fn es2020_optional_chaining(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2020::optional_chaining(Default::default(), Mark::new())
    });
}

fn es2022_class_properties(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        swc_ecma_transforms_compat::es2022::class_properties(Default::default(), unresolved_mark)
    });
}

fn es2018(b: &mut Bencher) {
    run(
        b,
        |_| swc_ecma_transforms_compat::es2018(Default::default()),
    );
}

fn es2018_object_rest_spread(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2018::object_rest_spread(Default::default())
    });
}

fn es2019_optional_catch_binding(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2019::optional_catch_binding()
    });
}

fn es2017(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2017(Default::default(), Mark::new())
    });
}

fn es2017_async_to_generator(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2017::async_to_generator(Default::default(), Mark::new())
    });
}

fn es2016(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2016());
}

fn es2016_exponentiation(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2016::exponentiation());
}

fn es2015(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        swc_ecma_transforms_compat::es2015(
            unresolved_mark,
            Some(SingleThreadedComments::default()),
            Default::default(),
        )
    });
}

fn es2015_arrow(b: &mut Bencher) {
    run(
        b,
        |_| swc_ecma_transforms_compat::es2015::arrow(Mark::new()),
    );
}

fn es2015_block_scoped_fn(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::block_scoped_functions()
    });
}

fn es2015_block_scoping(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::block_scoping(Mark::new())
    });
}

fn es2015_classes(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::classes(Default::default())
    });
}

fn es2015_computed_props(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::computed_properties(Default::default())
    });
}

fn es2015_destructuring(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::destructuring(Default::default())
    });
}

fn es2015_duplicate_keys(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::duplicate_keys());
}

fn es2015_parameters(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::parameters(Default::default(), Mark::new())
    });
}

fn es2015_fn_name(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::function_name());
}

fn es2015_for_of(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::for_of(Default::default())
    });
}

fn es2015_instanceof(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::instance_of());
}

fn es2015_shorthand_property(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::shorthand());
}

fn es2015_spread(b: &mut Bencher) {
    run(b, |_| {
        swc_ecma_transforms_compat::es2015::spread(Default::default())
    });
}

fn es2015_sticky_regex(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::sticky_regex());
}

fn es2015_typeof_symbol(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es2015::typeof_symbol());
}

fn es3(b: &mut Bencher) {
    run(b, |_| swc_ecma_transforms_compat::es3(Default::default()));
}

fn full_es2016(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        (
            swc_ecma_transforms_compat::es2022(Default::default(), unresolved_mark),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
            swc_ecma_transforms_compat::es2017(Default::default(), Mark::new()),
            swc_ecma_transforms_compat::es2016(),
        )
    });
}

fn full_es2017(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        (
            swc_ecma_transforms_compat::es2022(Default::default(), unresolved_mark),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
            swc_ecma_transforms_compat::es2017(Default::default(), Mark::new()),
        )
    });
}

fn full_es2018(b: &mut Bencher) {
    run(b, |unresolved_mark| {
        (
            swc_ecma_transforms_compat::es2022(Default::default(), unresolved_mark),
            swc_ecma_transforms_compat::es2019(),
            swc_ecma_transforms_compat::es2018(Default::default()),
        )
    });
}

fn full_group(c: &mut Criterion) {
    c.bench_function("es/full-target/es2016", full_es2016);
    c.bench_function("es/full-target/es2017", full_es2017);
    c.bench_function("es/full-target/es2018", full_es2018);
}

criterion_group!(
    benches,
    full_group,
    single_tr_group,
    baseline_group,
    version_group
);
criterion_main!(benches);
