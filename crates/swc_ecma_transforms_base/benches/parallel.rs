extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use rayon::prelude::*;
use swc_common::{chain, errors::HANDLER, FileName, Mark, GLOBALS};
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transforms_base::helpers;
use swc_ecma_visit::FoldWith;

static SOURCE: &str = include_str!("../../swc_ecma_minifier/benches/full/typescript.js");

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
        let _ = ::testing::run_test(false, |cm, handler| {
            let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

            let mut parser = Parser::new(
                Syntax::Typescript(Default::default()),
                StringInput::from(&*fm),
                None,
            );
            let module = parser.parse_module().map_err(|_| ()).unwrap();

            $b.iter(|| {
                GLOBALS.with(|globals| {
                    (0..50).into_par_iter().for_each(|_| {
                        GLOBALS.set(globals, || {
                            HANDLER.set(&handler, || {
                                helpers::HELPERS.set(&Default::default(), || {
                                    let mut tr = $tr();

                                    let module = module.clone();
                                    black_box(module.fold_with(&mut tr));
                                })
                            })
                        })
                    })
                })
            });
            Ok(())
        });
    };
}

fn resolver(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms_base::resolver(
        Mark::new(),
        Mark::new(),
        false
    ));
}

fn hygiene(b: &mut Bencher) {
    tr!(b, swc_ecma_transforms_base::hygiene::hygiene);
}

fn resolver_with_hygiene(b: &mut Bencher) {
    tr!(b, || chain!(
        swc_ecma_transforms_base::resolver(Mark::new(), Mark::new(), false),
        swc_ecma_transforms_base::hygiene::hygiene()
    ));
}

fn bench_cases(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/base/parallel");
    group.sample_size(10);

    group.bench_function("resolver/typescript", resolver);
    group.bench_function("hygiene/typescript", hygiene);
    group.bench_function("resolver_with_hygiene/typescript", resolver_with_hygiene);
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
