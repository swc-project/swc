extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName, Span, SyntaxContext, DUMMY_SP};
use swc_css_ast::Stylesheet;
use swc_css_parser::{lexer::Lexer, parser::Parser};
use swc_css_visit::{Fold, FoldWith, VisitMut, VisitMutWith};

static SOURCE: &str = include_str!("files/bootstrap_5_1_3.css");

fn run<F>(b: &mut Bencher, mut op: F)
where
    F: FnMut(Stylesheet) -> Stylesheet,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let lexer = Lexer::new(StringInput::from(&*fm), Default::default());
        let mut parser = Parser::new(lexer, Default::default());
        let stylesheet: Stylesheet = parser.parse_all().unwrap();

        b.iter(|| {
            let stylesheet = stylesheet.clone();
            let stylesheet = op(stylesheet);

            black_box(stylesheet)
        });

        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("css/visitor/compare/clone", |b| run(b, |m: Stylesheet| m));

    c.bench_function("css/visitor/compare/visit_mut_span", |b| {
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

    c.bench_function("css/visitor/compare/visit_mut_span_panic", |b| {
        struct RespanVisitMut;

        impl VisitMut for RespanVisitMut {
            fn visit_mut_span(&mut self, span: &mut Span) {
                if span.ctxt != SyntaxContext::empty() {
                    panic!()
                }

                *span = DUMMY_SP;
            }
        }

        run(b, |mut m| {
            m.visit_mut_with(&mut RespanVisitMut);

            m
        });
    });

    c.bench_function("css/visitor/compare/fold_span", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        run(b, |m| m.fold_with(&mut RespanFold));
    });

    c.bench_function("css/visitor/compare/fold_span_panic", |b| {
        struct RespanFold;

        impl Fold for RespanFold {
            fn fold_span(&mut self, s: Span) -> Span {
                if s.ctxt != SyntaxContext::empty() {
                    panic!()
                }

                DUMMY_SP
            }
        }

        run(b, |m| m.fold_with(&mut RespanFold));
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
