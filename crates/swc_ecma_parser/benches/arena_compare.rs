extern crate swc_malloc;

use criterion::{criterion_group, criterion_main, Criterion};
use swc_allocator::arena::Allocator;
use swc_common::{FileName, Span, DUMMY_SP};
use swc_ecma_parser::{StringInput, Syntax, TsSyntax};

static SOURCE: &str = include_str!("files/cal.com.tsx");

fn bench_cases(b: &mut Criterion) {
    let syntax = Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    });
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());
        b.bench_function("es/parser/origin", |b| {
            b.iter(|| {
                let mut parser =
                    swc_ecma_parser::Parser::new(syntax, StringInput::from(&*fm), None);
                parser.parse_module().map_err(|_| ()).unwrap();
            });
        });

        b.bench_function("es/parser/arena", |b| {
            let mut allocator = Allocator::default();
            b.iter(|| {
                let mut parser = swc_ecma_parser::arena::Parser::new(
                    &allocator,
                    syntax,
                    StringInput::from(&*fm),
                    None,
                );
                parser.parse_module().map_err(|_| ()).unwrap();
                allocator.reset();
            });
        });

        b.bench_function("es/visit/origin", |b| {
            struct RespanVisitMut;
            impl swc_ecma_visit::VisitMut for RespanVisitMut {
                fn visit_mut_span(&mut self, span: &mut Span) {
                    *span = DUMMY_SP;
                }
            }

            let mut parser = swc_ecma_parser::Parser::new(syntax, StringInput::from(&*fm), None);
            let mut module = parser.parse_module().map_err(|_| ()).unwrap();

            b.iter(|| {
                swc_ecma_visit::VisitMutWith::visit_mut_with(&mut module, &mut RespanVisitMut);
            });
        });

        b.bench_function("es/visit/arena", |b| {
            struct RespanVisitMut;
            impl swc_ecma_visit::arena::VisitMut<'_> for RespanVisitMut {
                fn visit_mut_span(&mut self, span: &mut Span) {
                    *span = DUMMY_SP;
                }
            }

            let allocator = Allocator::default();
            let mut parser = swc_ecma_parser::arena::Parser::new(
                &allocator,
                syntax,
                StringInput::from(&*fm),
                None,
            );
            let mut module = parser.parse_module().map_err(|_| ()).unwrap();

            b.iter(|| {
                swc_ecma_visit::arena::VisitMutWith::visit_mut_with(
                    &mut module,
                    &mut RespanVisitMut,
                );
            });
        });
        Ok(())
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
