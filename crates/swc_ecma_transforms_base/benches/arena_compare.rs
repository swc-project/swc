extern crate swc_malloc;

use criterion::{criterion_group, criterion_main, Criterion};
use swc_allocator::arena::{Allocator, Box};
use swc_common::FileName;
use swc_ecma_parser::{StringInput, Syntax, TsSyntax};

static SOURCE: &str = include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx");

fn bench_cases(b: &mut Criterion) {
    let syntax = Syntax::Typescript(TsSyntax {
        tsx: true,
        ..Default::default()
    });
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), SOURCE.into());
        b.bench_function("es/hygiene/origin", |b| {
            use swc_ecma_ast::Pass;
            let mut parser = swc_ecma_parser::Parser::new(syntax, StringInput::from(&*fm), None);
            let mut module =
                swc_ecma_ast::Program::Module(parser.parse_module().map_err(|_| ()).unwrap());
            b.iter(|| {
                swc_ecma_transforms_base::hygiene::hygiene().process(&mut module);
            });
        });

        b.bench_function("es/hygiene/arena", |b| {
            use swc_ecma_ast::arena::Pass;
            let allocator = Allocator::default();
            let mut parser = swc_ecma_parser::arena::Parser::new(
                &allocator,
                syntax,
                StringInput::from(&*fm),
                None,
            );
            let mut module = swc_ecma_ast::arena::Program::Module(Box::new_in(
                parser.parse_module().map_err(|_| ()).unwrap(),
                &allocator,
            ));

            b.iter(|| {
                swc_ecma_transforms_base::arena::hygiene::hygiene(&allocator).process(&mut module);
            });
        });

        Ok(())
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
