extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_es_codegen::{emit_program, Config};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax, TsSyntax};
use swc_es_transforms::{transform_program, TransformOptions, TransformTarget};

fn bench_with_parse(
    b: &mut Bencher,
    syntax: Syntax,
    source: &'static str,
    options: TransformOptions,
) {
    let _ = testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), source.to_string());

        b.iter(|| {
            let comments = SingleThreadedComments::default();
            let mut recovered = Vec::new();
            let parsed = parse_file_as_program(&fm, syntax, Some(&comments), &mut recovered)
                .expect("fixture should parse");
            assert!(recovered.is_empty());

            let mut store = parsed.store;
            let result = transform_program(&mut store, parsed.program, &options);
            let output = emit_program(&store, result.program, Config { minify: true })
                .expect("codegen should succeed");
            black_box(output);
            black_box(result.stats);
        });

        Ok(())
    });
}

fn bench_cases(c: &mut Criterion) {
    let js_syntax = Syntax::Es(EsSyntax {
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

    c.bench_function("es/transforms/with-parser/js", |b| {
        bench_with_parse(
            b,
            js_syntax,
            include_str!("../../swc_ecma_parser/benches/files/angular-1.2.5.js"),
            TransformOptions {
                target: TransformTarget::Es2019,
                ..Default::default()
            },
        )
    });

    c.bench_function("es/transforms/with-parser/tsx", |b| {
        bench_with_parse(
            b,
            tsx_syntax,
            include_str!("../../swc_ecma_parser/benches/files/cal.com.tsx"),
            TransformOptions {
                target: TransformTarget::Es2018,
                ..Default::default()
            },
        )
    });
}

criterion_group!(benches, bench_cases);
criterion_main!(benches);
