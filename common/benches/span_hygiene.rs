#![feature(test)]

extern crate test;

use std::hint::black_box;
use swc_common::Globals;
use swc_common::Mark;
use swc_common::DUMMY_SP;
use swc_common::GLOBALS;
use test::Bencher;

#[bench]
fn apply(b: &mut Bencher) {
    let globals = Globals::new();
    b.iter(|| {

        GLOBALS.set(&globals, || {
            let mark = Mark::fresh(Mark::root());
            black_box(DUMMY_SP.apply_mark(mark))
        })
    });
}

#[bench]
fn apply_remove(b: &mut Bencher) {
    let globals = Globals::new();
    b.iter(|| {

        GLOBALS.set(&globals, || {
            let mark = Mark::fresh(Mark::root());
            let mut sp = black_box(DUMMY_SP.apply_mark(mark));
            black_box(sp.remove_mark());
        })
    });
}
