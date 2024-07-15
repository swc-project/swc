extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_allocator::{FastAlloc, SwcAllocator};

fn bench_alloc(c: &mut Criterion) {
    fn direct_alloc_std(b: &mut Bencher, times: usize) {
        b.iter(|| {
            let mut buf = std::vec::Vec::new();
            for i in 0..times {
                let item: std::boxed::Box<usize> = black_box(std::boxed::Box::new(black_box(i)));
                buf.push(item);
            }
        })
    }

    fn direct_alloc_no_scope(b: &mut Bencher, times: usize) {
        b.iter(|| {
            let mut vec = swc_allocator::vec::Vec::new();
            for i in 0..times {
                let item: swc_allocator::boxed::Box<usize> =
                    black_box(swc_allocator::boxed::Box::new(black_box(i)));
                vec.push(item);
            }
        })
    }

    fn fast_alloc_no_scope(b: &mut Bencher, times: usize) {
        b.iter(|| {
            let allocator = FastAlloc::default();

            let mut vec = allocator.vec();
            for i in 0..times {
                let item: swc_allocator::boxed::Box<usize> =
                    black_box(allocator.alloc(black_box(i)));
                vec.push(item);
            }
        })
    }

    fn direct_alloc_scoped(b: &mut Bencher, times: usize) {
        b.iter(|| {
            let allocator = SwcAllocator::default();

            allocator.scope(|| {
                let mut vec = swc_allocator::vec::Vec::new();

                for i in 0..times {
                    let item: swc_allocator::boxed::Box<usize> =
                        black_box(swc_allocator::boxed::Box::new(black_box(i)));
                    vec.push(item);
                }
            });
        })
    }

    fn fast_alloc_scoped(b: &mut Bencher, times: usize) {
        b.iter(|| {
            SwcAllocator::default().scope(|| {
                let allocator = FastAlloc::default();

                let mut vec = allocator.vec();

                for i in 0..times {
                    let item: swc_allocator::boxed::Box<usize> =
                        black_box(allocator.alloc(black_box(i)));
                    vec.push(item);
                }
            });
        })
    }

    c.bench_function("common/allocator/alloc/std/1000000", |b| {
        direct_alloc_std(b, 1000000)
    });
    c.bench_function("common/allocator/alloc/no-scope/1000000", |b| {
        direct_alloc_no_scope(b, 1000000)
    });
    c.bench_function("common/allocator/alloc/scoped/1000000", |b| {
        direct_alloc_scoped(b, 1000000)
    });

    c.bench_function("common/allocator/alloc/cached-no-scope/1000000", |b| {
        fast_alloc_no_scope(b, 1000000)
    });
    c.bench_function("common/allocator/alloc/cached-scoped/1000000", |b| {
        fast_alloc_scoped(b, 1000000)
    });
}

criterion_group!(benches, bench_alloc);
criterion_main!(benches);
