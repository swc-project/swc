extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_arena::{Arena, Id};

const N: usize = 100_000;

fn bench_insert(b: &mut Bencher) {
    b.iter(|| {
        let mut arena = Arena::with_capacity(N);
        for i in 0..N {
            black_box(arena.insert(black_box(i)));
        }

        black_box(arena.len());
    });
}

fn bench_lookup(b: &mut Bencher) {
    let mut arena = Arena::with_capacity(N);
    let mut ids: Vec<Id<usize>> = Vec::with_capacity(N);
    for i in 0..N {
        ids.push(arena.insert(i));
    }

    b.iter(|| {
        let mut sum = 0usize;
        for &id in &ids {
            sum = sum.wrapping_add(*black_box(arena.get(id).expect("id should be valid")));
        }

        black_box(sum);
    });
}

fn bench_remove_and_reuse(b: &mut Bencher) {
    b.iter(|| {
        let mut arena = Arena::with_capacity(N);
        let mut ids: Vec<Id<usize>> = Vec::with_capacity(N);

        for i in 0..N {
            ids.push(arena.insert(i));
        }

        for id in ids {
            black_box(arena.remove(id).expect("id should be valid"));
        }

        for i in 0..N {
            black_box(arena.insert(black_box(i)));
        }

        black_box(arena.len());
    });
}

fn bench_iter_sparse(b: &mut Bencher) {
    let mut arena = Arena::with_capacity(N);
    let mut ids = Vec::with_capacity(N);
    for i in 0..N {
        ids.push(arena.insert(i));
    }

    for (index, id) in ids.into_iter().enumerate() {
        if index % 2 == 0 {
            black_box(arena.remove(id).expect("id should be valid"));
        }
    }

    b.iter(|| {
        let mut sum = 0usize;
        for (_, value) in arena.iter() {
            sum = sum.wrapping_add(*black_box(value));
        }

        black_box(sum);
    });
}

fn bench_arena(c: &mut Criterion) {
    c.bench_function("common/arena/insert/100000", bench_insert);
    c.bench_function("common/arena/lookup/100000", bench_lookup);
    c.bench_function(
        "common/arena/remove-and-reuse/100000",
        bench_remove_and_reuse,
    );
    c.bench_function("common/arena/iter-sparse/100000", bench_iter_sparse);
}

criterion_group!(benches, bench_arena);
criterion_main!(benches);
