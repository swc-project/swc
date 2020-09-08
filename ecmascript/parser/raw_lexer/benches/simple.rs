#![feature(test)]

extern crate test;

use std::hint::black_box;
use swc_common::FileName;
use swc_ecma_raw_lexer::DumbLexer;
use test::Bencher;

#[bench]
fn lexer(b: &mut Bencher) {
    bench_module(b, include_str!("../../benches/files/angular-1.2.5.js"));
}

fn bench_module(b: &mut Bencher, src: &'static str) {
    b.bytes = src.len() as _;

    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let mut lexer = DumbLexer::new(fm.start_pos, src);
            while let Some(t) = lexer.cur() {
                black_box(t);
                lexer.bump();
            }
        });
        Ok(())
    });
}
