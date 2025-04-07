extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::FileName;
use swc_ecma_fast_parser::{token::TokenType, JscTarget, Lexer, Syntax};

fn bench_module(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        b.iter(|| {
            let mut count = 0;
            let mut lexer = Lexer::new(&fm.src, JscTarget::EsNext, syntax, None);

            loop {
                if lexer.current.token_type == TokenType::EOF {
                    break;
                }
                count += 1;
                let token = lexer.next_token();

                black_box(token).unwrap_or_else(|err| {
                    let loc = cm.lookup_char_pos(err.span.lo);
                    panic!("{err:?}: {loc:?}");
                });
            }

            assert_ne!(count, 0);
        });
        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("es/fast-lexer/angular", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es/fast-lexer/backbone", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/backbone-1.1.0.js"),
        )
    });

    c.bench_function("es/fast-lexer/jquery", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/jquery-1.9.1.js"),
        )
    });

    c.bench_function("es/fast-lexer/jquery mobile", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/jquery.mobile-1.4.2.js"),
        )
    });
    c.bench_function("es/fast-lexer/mootools", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/mootools-1.4.5.js"),
        )
    });

    c.bench_function("es/fast-lexer/underscore", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/underscore-1.5.2.js"),
        )
    });

    c.bench_function("es/fast-lexer/three", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/three-0.138.3.js"),
        )
    });

    c.bench_function("es/fast-lexer/yui", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/yui-3.12.0.js"),
        )
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
