extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{ModuleKind, Parser, SourceType, Syntax, TsSyntax};

fn bench_module(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let (source_type, options) =
        SourceType::from_legacy(syntax, ModuleKind::Module, EsVersion::latest());
    b.iter(|| {
        black_box(
            Parser::new(src, source_type)
                .with_options(options)
                .with_tokens()
                .parse(),
        );
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("es/lexer/colors", |b| {
        // Copied from ratel-rust
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/colors.js"),
        )
    });

    c.bench_function("es/lexer/angular", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es/lexer/backbone", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/backbone-1.1.0.js"),
        )
    });

    c.bench_function("es/lexer/jquery", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/jquery-1.9.1.js"),
        )
    });

    c.bench_function("es/lexer/jquery mobile", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/jquery.mobile-1.4.2.js"),
        )
    });
    c.bench_function("es/lexer/mootools", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/mootools-1.4.5.js"),
        )
    });

    c.bench_function("es/lexer/underscore", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/underscore-1.5.2.js"),
        )
    });

    c.bench_function("es/lexer/three", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/three-0.138.3.js"),
        )
    });

    c.bench_function("es/lexer/yui", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/yui-3.12.0.js"),
        )
    });

    c.bench_function("es/lexer/cal-com", |b| {
        bench_module(
            b,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx"),
        )
    });

    c.bench_function("es/lexer/typescript", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/typescript.js"),
        )
    });

    c.bench_function("es/lexer/numeric-separators", |b| {
        bench_module(
            b,
            Default::default(),
            include_str!("../../swc_ecma_parser/benches/files/numeric-separators.js"),
        )
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
