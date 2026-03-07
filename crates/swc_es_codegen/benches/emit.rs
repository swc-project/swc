extern crate swc_malloc;

use codspeed_criterion_compat::{criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_es_codegen::emit_program;
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};

fn bench_emit_source(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src);
        let comments = SingleThreadedComments::default();
        let mut recovered = Vec::new();
        let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
            .expect("fixture should parse for benchmark");
        assert!(recovered.is_empty(), "benchmark fixture should be clean");

        b.iter(|| {
            let output = emit_program(&parsed.store, parsed.program)
                .expect("emit should succeed for benchmark fixture");
            std::hint::black_box(output);
        });

        Ok(())
    });
}

fn bench_emit(c: &mut Criterion) {
    c.bench_function("es_codegen/emit/js", |b| {
        bench_emit_source(
            b,
            Syntax::Es(EsSyntax {
                jsx: true,
                decorators: true,
                import_attributes: true,
                explicit_resource_management: true,
                ..Default::default()
            }),
            include_str!("../tests/fixture/bench/input.js"),
        )
    });

    c.bench_function("es_codegen/emit/ts", |b| {
        bench_emit_source(
            b,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                decorators: true,
                ..Default::default()
            }),
            include_str!("../tests/fixture/bench/input.tsx"),
        )
    });
}

criterion_group!(benches, bench_emit);
criterion_main!(benches);
