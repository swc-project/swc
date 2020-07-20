//! These benchmarks ensures that adding a Noop to chain! does not affect
//! performance.

#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(test)]

extern crate test;

use swc_common::{chain, FoldWith};
use test::{black_box, Bencher};

#[allow(clippy::vec_box)]
fn mk_vec() -> Vec<Box<String>> {
    (0..1000).map(|s| box s.to_string()).collect()
}

struct Noop;

#[bench]
fn bench_vec_chain2(b: &mut Bencher) {
    let mut chain = chain!(Noop, Noop);
    b.iter(|| {
        let v = mk_vec();
        black_box(v.fold_with(&mut chain))
    })
}

#[bench]
fn bench_vec_chain3(b: &mut Bencher) {
    let mut chain = chain!(Noop, Noop, Noop);
    b.iter(|| {
        let v = mk_vec();
        black_box(v.fold_with(&mut chain))
    })
}

#[bench]
fn bench_vec_chain4(b: &mut Bencher) {
    let mut chain = chain!(Noop, Noop, Noop, Noop);
    b.iter(|| {
        let v = mk_vec();
        black_box(v.fold_with(&mut chain))
    })
}

#[bench]
fn bench_vec_chain5(b: &mut Bencher) {
    let mut chain = chain!(Noop, Noop, Noop, Noop, Noop);
    b.iter(|| {
        let v = mk_vec();
        black_box(v.fold_with(&mut chain))
    })
}
#[bench]
fn bench_mk_vec(b: &mut Bencher) {
    b.iter(|| {
        black_box(mk_vec());
    })
}

#[bench]
fn bench_vec_5(b: &mut Bencher) {
    b.iter(|| {
        let v = mk_vec();
        black_box(
            v.fold_with(&mut Noop)
                .fold_with(&mut Noop)
                .fold_with(&mut Noop)
                .fold_with(&mut Noop)
                .fold_with(&mut Noop),
        )
    });
}
