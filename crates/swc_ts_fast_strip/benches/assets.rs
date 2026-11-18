use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_ts_fast_strip::{operate, Options};

const CASES: &[(&str, &str)] = &[
    ("typescript/fast-strip", include_str!("assets/test.ts")),
    (
        "typescript/fast-strip/docusaurus-config",
        include_str!("assets/docusaurus.config.ts"),
    ),
    (
        "typescript/fast-strip/ant-design-config",
        include_str!("assets/ant-design.vitest.config.ts"),
    ),
    (
        "typescript/fast-strip/typescript-eslint-generate-configs",
        include_str!("assets/typescript-eslint.generate-configs.mts"),
    ),
    (
        "typescript/fast-strip/graphile-config",
        include_str!("assets/graphile.config.ts"),
    ),
    (
        "typescript/fast-strip/hono-types-test",
        include_str!("assets/hono.types.test.ts"),
    ),
];

fn fast_ts(c: &mut Criterion) {
    for &(name, source) in CASES {
        c.bench_function(name, |b| fast_typescript(b, source));
    }
}

fn fast_typescript(b: &mut Bencher, source: &str) {
    b.iter(|| {
        ::testing::run_test(false, |cm, handler| {
            let result = operate(
                &cm,
                handler,
                black_box(source.to_string()),
                Options {
                    ..Default::default()
                },
            )
            .expect("benchmark source should be valid erasable TypeScript");

            black_box(result);

            Ok(())
        })
        .unwrap();
    });
}

criterion_group!(benches, fast_ts);
criterion_main!(benches);
