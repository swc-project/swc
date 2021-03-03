#![feature(test)]

extern crate test;

use swc_common::{FileName, Span, SyntaxContext, DUMMY_SP};
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
fn base_clone(b: &mut Bencher) {
    run(b, |m| m);
}

#[bench]
fn visit_mut_span(b: &mut Bencher) {
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
}

#[bench]
fn visit_mut_span_panic(b: &mut Bencher) {
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
}

#[bench]
fn fold_span(b: &mut Bencher) {
    struct RespanFold;

    impl Fold for RespanFold {
        fn fold_span(&mut self, _: Span) -> Span {
            DUMMY_SP
        }
    }

    run(b, |m| m.fold_with(&mut RespanFold));
}

#[bench]
fn fold_span_panic(b: &mut Bencher) {
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
}
