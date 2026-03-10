extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_es_parser::{lexer::Lexer, EsSyntax, Parser, Syntax, TsSyntax};

fn parse_must_succeed(fixture: &str, syntax: Syntax, src: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);
        let lexer = Lexer::new(syntax, StringInput::from(&*fm), None);
        let mut parser = Parser::new_from(lexer);
        let parsed = parser.parse_program();
        let recovered = parser.take_errors();

        if let Err(err) = parsed {
            panic!(
                "benchmark fixture `{fixture}` must parse without fatal error: code={:?}, \
                 message={}, recovered_errors={}",
                err.code(),
                err.message(),
                recovered.len()
            );
        }

        black_box(recovered);

        Ok(())
    });
}

fn bench_parse_program(b: &mut Bencher, fixture: &str, syntax: Syntax, src: &'static str) {
    parse_must_succeed(fixture, syntax, src);

    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);

        b.iter(|| {
            let lexer = Lexer::new(syntax, StringInput::from(&*fm), None);
            let mut parser = Parser::new_from(lexer);
            let _ = black_box(parser.parse_program());
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("es_parser/bootstrap/colors", |b| {
        bench_parse_program(
            b,
            "colors.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/colors.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/angular", |b| {
        bench_parse_program(
            b,
            "angular-1.2.5.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/backbone", |b| {
        bench_parse_program(
            b,
            "backbone-1.1.0.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/backbone-1.1.0.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/jquery", |b| {
        bench_parse_program(
            b,
            "jquery-1.9.1.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/jquery-1.9.1.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/jquery-mobile", |b| {
        bench_parse_program(
            b,
            "jquery.mobile-1.4.2.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/jquery.mobile-1.4.2.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/mootools", |b| {
        bench_parse_program(
            b,
            "mootools-1.4.5.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/mootools-1.4.5.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/underscore", |b| {
        bench_parse_program(
            b,
            "underscore-1.5.2.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/underscore-1.5.2.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/three", |b| {
        bench_parse_program(
            b,
            "three-0.138.3.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/three-0.138.3.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/yui", |b| {
        bench_parse_program(
            b,
            "yui-3.12.0.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/yui-3.12.0.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/typescript", |b| {
        bench_parse_program(
            b,
            "cal.com.tsx",
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            include_str!("./files/cal.com.tsx"),
        )
    });

    c.bench_function("es_parser/bootstrap/typescript-js", |b| {
        bench_parse_program(
            b,
            "typescript.js",
            Syntax::Es(EsSyntax::default()),
            include_str!("./files/typescript.js"),
        )
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
