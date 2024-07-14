extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_allocator::Allocator;

fn bench_alloc(c: &mut Criterion) {
    fn direct_alloc(b: &mut Bencher, times: usize) {
        b.iter(|| {
            for _ in 0..times {
                let _: swc_allocator::boxed::Box<usize> =
                    black_box(swc_allocator::boxed::Box::new(black_box(1234)));
            }
        })
    }

    fn direct_alloc_in_scope(b: &mut Bencher, times: usize) {
        b.iter(|| {
            let allocator = Allocator::default();

            allocator.scope(|| {
                for _ in 0..times {
                    let _: swc_allocator::boxed::Box<usize> =
                        black_box(swc_allocator::boxed::Box::new(black_box(1234)));
                }
            });
        })
    }

    c.bench_function("common/allocator/alloc/no-scope/1000", |b| {
        direct_alloc(b, 1000)
    });
    c.bench_function("common/allocator/alloc/scoped/1000", |b| {
        direct_alloc_in_scope(b, 1000)
    });
}

criterion_group!(benches, bench_alloc);
criterion_main!(benches);
