use criterion::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::SourceFileInput, FileName};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

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

fn assert_cnt(b: &mut Bencher, src: &str, cnt: usize) {
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

        b.iter(|| {
            let mut v = Outer {
                v: Inner { cnt: 0 },
            };
            module.visit_mut_with(&mut v);

            assert_eq!(v.v.cnt, cnt);
        });

        Ok(())
    })
    .unwrap();
}

fn time_5(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{
            call()
        }}}}}",
        5,
    );
}

fn time_10(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{{{{{{
                    call()
        }}}}}}}}}}",
        10,
    );
}

fn time_15(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{{{{{{{{{{{
                        call()
        }}}}}}}}}}}}}}}",
        15,
    );
}

fn time_20(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{{{{{{{{{{{{{{{{
                                call()
        }}}}}}}}}}}}}}}}}}}}",
        20,
    );
}

fn time_40(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{
                                                    call()
        }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}",
        40,
    );
}

fn time_60(b: &mut Bencher) {
    assert_cnt(
        b,
        "
        {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{
                                                                        call()
        }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}",
        60,
    );
}

fn bench_cases(c: &mut Criterion) {
    c.bench_function("misc/visitors/time-complexity/time 5", time_5);
    c.bench_function("misc/visitors/time-complexity/time 10", time_10);
    c.bench_function("misc/visitors/time-complexity/time 15", time_15);
    c.bench_function("misc/visitors/time-complexity/time 20", time_20);
    c.bench_function("misc/visitors/time-complexity/time 40", time_40);
    c.bench_function("misc/visitors/time-complexity/time 60", time_60);
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
