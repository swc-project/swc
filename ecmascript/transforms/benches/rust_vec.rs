#![feature(test)]
#![feature(specialization)]

extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;
extern crate swc_ecma_transforms;
extern crate test;
extern crate testing;

use swc_common::{Fold, FoldWith};
use test::{black_box, Bencher};

fn mk_vec() -> Vec<String> {
    vec![String::from("1"), String::from("2"), String::from("3")]
}

#[bench]
fn bench_move_map(b: &mut Bencher) {
    struct Noop;
    b.iter(|| {
        let vec = mk_vec();

        black_box(vec.fold_with(&mut Noop))
    })
}

#[bench]
fn bench_map_id_closure(b: &mut Bencher) {
    b.iter(|| {
        let vec = mk_vec();

        black_box(vec.into_iter().map(|e| id(e)).collect::<Vec<_>>())
    })
}

#[bench]
fn bench_map_id(b: &mut Bencher) {
    b.iter(|| {
        let vec = mk_vec();

        black_box(vec.into_iter().map(id).collect::<Vec<_>>())
    })
}

#[bench]
fn bench_map_id_inline_closure(b: &mut Bencher) {
    b.iter(|| {
        let vec = mk_vec();

        black_box(vec.into_iter().map(|e| id_inline(e)).collect::<Vec<_>>())
    })
}

#[bench]
fn bench_map_id_inline(b: &mut Bencher) {
    b.iter(|| {
        let vec = mk_vec();

        black_box(vec.into_iter().map(id_inline).collect::<Vec<_>>())
    })
}

#[bench]
fn bench_clone(b: &mut Bencher) {
    let v = mk_vec();
    b.iter(|| black_box(v.clone()))
}

#[bench]
fn bench_alloc(b: &mut Bencher) {
    b.iter(|| black_box(mk_vec()))
}

fn id<T>(t: T) -> T {
    t
}

#[inline]
fn id_inline<T>(t: T) -> T {
    t
}
