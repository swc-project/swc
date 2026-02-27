extern crate swc_malloc;

use codspeed_criterion_compat::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_es_parser::{lexer::Lexer, EsSyntax, Parser, Syntax, TsSyntax};

fn bench_parse_program(b: &mut Bencher, syntax: Syntax, src: &'static str) {
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

fn bench_files(c: &mut Criterion) {
    c.bench_function("es_parser/bootstrap/angular", |b| {
        bench_parse_program(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es_parser/bootstrap/typescript", |b| {
        bench_parse_program(
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
