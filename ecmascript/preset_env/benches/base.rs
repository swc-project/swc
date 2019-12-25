#![feature(test)]

extern crate test;

use fxhash::FxHashMap;
use std::{io::repeat, iter::once};
use test::Bencher;

fn datas(len: usize) -> Vec<(String, String)> {
    for i in 0..len {}
}

macro_rules! t {
    ($vn:ident, $hn:ident, $cnt:expr) => {
        #[bench]
        fn $vn(b: &mut Bencher) {
            let mut vec = vec![];
            vec.extend(datas($cnt));

            b.iter(|| {})
        }

        #[bench]
        fn $hn(b: &mut Bencher) {
            let mut map: FxHashMap = Default::default();
            map.extend(datas($cnt));

            b.iter(|| {})
        }
    };
}

#[bench]
fn vec_5() {}
