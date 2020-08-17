#![feature(test)]

extern crate test;

use swc_common::{FileName, Span, DUMMY_SP};
use swc_ecma_ast::Module;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_visit::{Fold, FoldWith, VisitMut, VisitMutWith};
use test::Bencher;

static SOURCE: &str = include_str!("../../parser/benches/files/angular-1.2.5.js");

fn run<F>(b: &mut Bencher, mut op: F)
where
    F: FnMut(Module) -> Module,
{
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        let mut parser = Parser::new(Syntax::default(), StringInput::from(&*fm), None);
        let module = parser.parse_module().map_err(|_| ()).unwrap();
        b.iter(|| {
            let module = module.clone();
            let module = op(module);
            test::black_box(module)
        });
        Ok(())
    });
}

#[bench]
fn visit_mut_span(b: &mut Bencher) {
    run(b, |mut m| {
        m.visit_mut_with(&mut RespanVisitMut);

        m
    });
}

struct RespanVisitMut;

impl VisitMut for RespanVisitMut {
    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = DUMMY_SP;
    }
}

#[bench]
fn fold_span(b: &mut Bencher) {
    run(b, |m| m.fold_with(&mut RespanFold));
}

struct RespanFold;

impl Fold for RespanFold {
    fn fold_span(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}
