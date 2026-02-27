extern crate swc_malloc;

use codspeed_criterion_compat::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_ecma_parser::Parser as EcmaParser;
use swc_es_parser::{lexer::Lexer, EsSyntax, Parser, Syntax, TsSyntax};

fn bench_parse_program_swc_es(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);

        b.iter(|| {
            let lexer = Lexer::new(syntax, StringInput::from(&*fm), None);
            let mut parser = Parser::new_from(lexer);
            let _ = parser.parse_program();
        });

        Ok(())
    });
}

fn convert_syntax_to_ecma(syntax: Syntax) -> swc_ecma_parser::Syntax {
    match syntax {
        Syntax::Es(es) => swc_ecma_parser::Syntax::Es(swc_ecma_parser::EsSyntax {
            jsx: es.jsx,
            fn_bind: es.fn_bind,
            decorators: es.decorators,
            decorators_before_export: es.decorators_before_export,
            export_default_from: es.export_default_from,
            import_attributes: es.import_attributes,
            allow_super_outside_method: es.allow_super_outside_method,
            allow_return_outside_function: es.allow_return_outside_function,
            auto_accessors: es.auto_accessors,
            explicit_resource_management: es.explicit_resource_management,
        }),
        Syntax::Typescript(ts) => swc_ecma_parser::Syntax::Typescript(swc_ecma_parser::TsSyntax {
            tsx: ts.tsx,
            decorators: ts.decorators,
            dts: ts.dts,
            no_early_errors: ts.no_early_errors,
            disallow_ambiguous_jsx_like: ts.disallow_ambiguous_jsx_like,
        }),
    }
}

fn bench_parse_program_swc_ecma(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);

        b.iter(|| {
            let mut parser = EcmaParser::new(
                convert_syntax_to_ecma(syntax),
                StringInput::from(&*fm),
                None,
            );
            let _ = parser.parse_program();
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("es_parser/swc_es/angular", |b| {
        bench_parse_program_swc_es(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es_parser/swc_ecma/angular", |b| {
        bench_parse_program_swc_ecma(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es_parser/swc_es/typescript-js", |b| {
        bench_parse_program_swc_es(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/typescript.js"),
        )
    });

    c.bench_function("es_parser/swc_ecma/typescript-js", |b| {
        bench_parse_program_swc_ecma(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/typescript.js"),
        )
    });

    c.bench_function("es_parser/swc_es/cal-com", |b| {
        bench_parse_program_swc_es(
            b,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx"),
        )
    });

    c.bench_function("es_parser/swc_ecma/cal-com", |b| {
        bench_parse_program_swc_ecma(
            b,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx"),
        )
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
