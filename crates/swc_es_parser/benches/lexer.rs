extern crate swc_malloc;

use codspeed_criterion_compat::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_es_parser::{lexer::Lexer, EsSyntax, Syntax, TokenKind, TsSyntax};

fn bench_lex(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);

        b.iter(|| {
            let mut lexer = Lexer::new(syntax, StringInput::from(&*fm), None);
            loop {
                let token = lexer.next_token();
                if token.kind == TokenKind::Eof {
                    break;
                }
                std::hint::black_box(token);
            }
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("es_parser/lexer/angular", |b| {
        bench_lex(
            b,
            Syntax::Es(EsSyntax::default()),
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es_parser/lexer/typescript", |b| {
        bench_lex(
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
