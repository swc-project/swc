extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};

fn bench_alloc(c: &mut Criterion) {
    fn direct_alloc(b: &mut Bencher, times: usize) {
        b.iter(|| {
            for _ in 0..times {
                let _: swc_allocator::boxed::Box<usize> =
                    black_box(swc_allocator::boxed::Box::new(black_box(1234)));
            }
        })
    }

    c.bench_function("common/allocator/alloc/1000_000_000", |b| {
        direct_alloc(b, 1000 * 1000 * 1000)
    });
}

criterion_group!(benches, bench_alloc);
criterion_main!(benches);
