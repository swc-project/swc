#![feature(test)]

extern crate test;

use std::hint::black_box;
use swc_common::FileName;
use swc_ecma_parser::{lexer::Lexer, StringInput, Syntax};
use test::Bencher;

#[bench]
fn colors(b: &mut Bencher) {
    // Copied from ratel-rust
    bench_module(b, Default::default(), include_str!("../colors.js"))
}

#[bench]
fn angular(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/angular-1.2.5.js"),
    )
}

#[bench]
fn backbone(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/backbone-1.1.0.js"),
    )
}

#[bench]
fn jquery(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/jquery-1.9.1.js"),
    )
}

#[bench]
fn jquery_mobile(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/jquery.mobile-1.4.2.js"),
    )
}

#[bench]
fn mootools(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/mootools-1.4.5.js"),
    )
}

#[bench]
fn underscore(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/underscore-1.5.2.js"),
    )
}

#[bench]
fn yui(b: &mut Bencher) {
    bench_module(b, Default::default(), include_str!("./files/yui-3.12.0.js"))
}

fn bench_module(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    b.bytes = src.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let lexer = Lexer::new(syntax, Default::default(), StringInput::from(&*fm), None);
            for t in lexer {
                black_box(t);
            }
        });
        Ok(())
    });
}
