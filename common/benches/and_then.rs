#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]

#[macro_use]
extern crate swc_common;
extern crate test;

use swc_common::{Fold, FoldWith};
use test::{black_box, Bencher};

fn mk_vec() -> Vec<Box<String>> {
    (0..1000).map(|s| box s.to_string()).collect()
}

struct Noop;

#[bench]
fn bench_vec_chain(b: &mut Bencher) {
    let mut chain = chain!(Noop, Noop, Noop, Noop, Noop,);
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
fn bench_vec(b: &mut Bencher) {
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
