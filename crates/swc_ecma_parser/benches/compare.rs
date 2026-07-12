extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::{Module, Program};
use swc_ecma_parser::{Parser, SourceType};
use swc_ecma_visit::{Fold, FoldWith, VisitMut, VisitMutWith};

static SOURCE: &str = include_str!("files/angular-1.2.5.js");

fn run<F>(b: &mut Bencher, mut op: F)
where
    F: FnMut(Module) -> Module,
{
    let _ = ::testing::run_test(false, |_cm, _| {
        let result = Parser::new(SOURCE, SourceType::module()).parse();
        let Program::Module(module) = result.program else {
            unreachable!("module source type must produce a module")
        };
        b.iter(|| {
            let module = module.clone();
            let module = op(module);
            black_box(module)
        });
        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("es/visitor/compare/clone", |b| run(b, |m| m));

    c.bench_function("es/visitor/compare/visit_mut_span", |b| {
        struct RespanVisitMut;

        impl VisitMut for RespanVisitMut {
            fn visit_mut_span(&mut self, span: &mut Span) {
                *span = DUMMY_SP;
            }
        }

        run(b, |mut m| {
            m.visit_mut_with(&mut RespanVisitMut);

            m
        });
    });

    c.bench_function("es/visitor/compare/visit_mut_span_panic", |b| {
        struct RespanVisitMut;

        impl VisitMut for RespanVisitMut {
            fn visit_mut_span(&mut self, span: &mut Span) {
                *span = DUMMY_SP;
            }
        }

        run(b, |mut m| {
            m.visit_mut_with(&mut RespanVisitMut);

            m
        });
    });

    c.bench_function("es/visitor/compare/fold_span", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run(b, |m| m.fold_with(&mut RespanFold));
    });

    c.bench_function("es/visitor/compare/fold_span_panic", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run(b, |m| m.fold_with(&mut RespanFold));
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
