#![allow(clippy::redundant_closure_call)]

extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{errors::HANDLER, FileName, Mark};
use swc_ecma_ast::Program;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transforms_base::helpers;

static SOURCE: &str = include_str!("../../swc_ecma_minifier/benches/full/typescript.js");

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
        let _ = ::testing::run_test(false, |cm, handler| {
            HANDLER.set(&handler, || {
                let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());

                let mut parser = Parser::new(
                    Syntax::Typescript(Default::default()),
                    StringInput::from(&*fm),
                    None,
                );
                let module = parser.parse_module().map_err(|_| ()).unwrap();
                helpers::HELPERS.set(&Default::default(), || {
                    $b.iter(|| {
                        let module = Program::Module(module.clone());
                        black_box(module.apply($tr()))
                    });
                    Ok(())
                })
            })
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

fn fixer(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms_base::fixer::fixer(None));
}

fn hygiene(b: &mut Bencher) {
    tr!(b, swc_ecma_transforms_base::hygiene::hygiene);
}

fn resolver_with_hygiene(b: &mut Bencher) {
    tr!(b, || (
        swc_ecma_transforms_base::resolver(Mark::new(), Mark::new(), false),
        swc_ecma_transforms_base::hygiene::hygiene()
    ));
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("es/resolver/typescript", resolver);
    c.bench_function("es/fixer/typescript", fixer);
    c.bench_function("es/hygiene/typescript", hygiene);
    c.bench_function("es/resolver_with_hygiene/typescript", resolver_with_hygiene);
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
