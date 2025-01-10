use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_fast_ts_strip::{operate, Options};

static SOURCE: &str = include_str!("assets/test.ts");

fn fast_ts(c: &mut Criterion) {
    c.bench_function("typescript/fast-strip", fast_typescript);
}
fn fast_typescript(b: &mut Bencher) {
    b.iter(|| {
        ::testing::run_test(false, |cm, handler| {
            let _result = black_box(operate(
                &cm,
                handler,
                black_box(SOURCE.to_string()),
                Options {
                    ..Default::default()
                },
            ));

            Ok(())
        })
        .unwrap();
    });
}

criterion_group!(benches, fast_ts);
criterion_main!(benches);
