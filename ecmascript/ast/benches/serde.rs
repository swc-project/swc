#![feature(test)]

extern crate serde_json;
extern crate swc_ecma_ast;
extern crate test;

use swc_ecma_ast::Module;

use test::Bencher;


#[bench]
fn module_1(b: &mut Bencher) {
    const SRC: &str = include_str!("module-1.json");
    b.bytes = SRC.len() as _;

    b.iter(|| test::black_box(serde_json::from_str::<Module>(SRC)))
}

#[bench]
fn module_2(b: &mut Bencher) {
    const SRC: &str = include_str!("module-2.json");
    b.bytes = SRC.len() as _;

    b.iter(|| test::black_box(serde_json::from_str::<Module>(SRC)))
}
