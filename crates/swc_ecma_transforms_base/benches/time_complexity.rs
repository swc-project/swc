#![feature(test)]

extern crate test;

use swc_common::{input::SourceFileInput, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use test::Bencher;

struct Inner {
    cnt: usize,
}

struct Outer {
    v: Inner,
}

impl VisitMut for Outer {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        s.visit_mut_children_with(self);

        s.visit_mut_with(&mut self.v);
    }
}

impl VisitMut for Inner {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, _: &mut Ident) {
        self.cnt += 1;
    }
}

fn assert_cnt(src: &str, cnt: usize) {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let lexer = Lexer::new(
            Syntax::default(),
            EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let mut module = match parser.parse_module() {
            Ok(v) => v,
            // We are not testing parser
            Err(..) => return Ok(()),
        };

        let mut v = Outer {
            v: Inner { cnt: 0 },
        };
        module.visit_mut_with(&mut v);

        assert_eq!(v.v.cnt, cnt);

        Ok(())
    })
    .unwrap();
}

#[bench]
fn time_5(b: &mut Bencher) {
    b.iter(|| {
        assert_cnt(
            "
            {{{{{
                call()
            }}}}}",
            5,
        );
    });
}

#[bench]
fn time_10(b: &mut Bencher) {
    b.iter(|| {
        assert_cnt(
            "
            {{{{{{{{{{
                        call()
            }}}}}}}}}}",
            10,
        );
    });
}

#[bench]
fn time_15(b: &mut Bencher) {
    b.iter(|| {
        assert_cnt(
            "
            {{{{{{{{{{{{{{{
                            call()
            }}}}}}}}}}}}}}}",
            15,
        );
    });
}

#[bench]
fn time_20(b: &mut Bencher) {
    b.iter(|| {
        assert_cnt(
            "
            {{{{{{{{{{{{{{{{{{{{
                                    call()
            }}}}}}}}}}}}}}}}}}}}",
            20,
        );
    });
}
