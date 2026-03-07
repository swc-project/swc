extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_es_codegen::emit_program;
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};

fn bench_with_parse(b: &mut Bencher, syntax: Syntax, source: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), source);

        b.iter(|| {
            let comments = SingleThreadedComments::default();
            let mut recovered = Vec::new();
            let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
                .expect("fixture should parse for benchmark");
            assert!(recovered.is_empty(), "benchmark fixture should be clean");

            let output = emit_program(&parsed.store, parsed.program)
                .expect("emit should succeed for benchmark fixture");
            black_box(output);
        });

        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    let js_syntax = Syntax::Es(EsSyntax {
        jsx: true,
        decorators: true,
        import_attributes: true,
        explicit_resource_management: true,
        ..Default::default()
    });

    let tsx_syntax = Syntax::Typescript(TsSyntax {
        tsx: true,
        decorators: true,
        ..Default::default()
    });

    c.bench_function("es/codegen/with-parser/js-canonical", |b| {
        bench_with_parse(
            b,
            js_syntax,
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
        )
    });

    c.bench_function("es/codegen/with-parser/tsx-canonical", |b| {
        bench_with_parse(
            b,
            tsx_syntax,
            include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx"),
        )
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
