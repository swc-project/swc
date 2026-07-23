use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_ts_fast_strip::Options;
use swc_ts_fast_strip_binding::transform;

const CASES: &[(&str, &str)] = &[
    (
        "typescript/fast-strip-binding/synthetic",
        include_str!("../../swc_ts_fast_strip/benches/assets/test.ts"),
    ),
    (
        "typescript/fast-strip-binding/docusaurus-config",
        include_str!("../../swc_ts_fast_strip/benches/assets/docusaurus.config.ts"),
    ),
    (
        "typescript/fast-strip-binding/ant-design-config",
        include_str!("../../swc_ts_fast_strip/benches/assets/ant-design.vitest.config.ts"),
    ),
    (
        "typescript/fast-strip-binding/typescript-eslint-generate-configs",
        include_str!(
            "../../swc_ts_fast_strip/benches/assets/typescript-eslint.generate-configs.mts"
        ),
    ),
    (
        "typescript/fast-strip-binding/graphile-config",
        include_str!("../../swc_ts_fast_strip/benches/assets/graphile.config.ts"),
    ),
    (
        "typescript/fast-strip-binding/hono-types-test",
        include_str!("../../swc_ts_fast_strip/benches/assets/hono.types.test.ts"),
    ),
];

fn assets(c: &mut Criterion) {
    for &(name, source) in CASES {
        c.bench_function(name, |b| transform_typescript(b, source));
    }
}

fn transform_typescript(b: &mut Bencher, source: &str) {
    b.iter(|| {
        let result = transform(black_box(source.to_owned()), Options::default())
            .expect("benchmark source should be valid erasable TypeScript");
        black_box(result);
    });
}

criterion_group!(benches, assets);
criterion_main!(benches);
