#![feature(bench_black_box)]
#![feature(test)]

extern crate swc_node_base;
extern crate test;

use rkyv::Deserialize;
use rplugin::StableAst;
use std::{hint::black_box, path::Path};
use swc_common::input::SourceFileInput;
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{lexer::Lexer, Parser};
use test::Bencher;

fn input() -> Program {
    testing::run_test(false, |cm, _handler| {
        let fm = cm.load_file(Path::new("benches/input.js")).unwrap();

        let lexer = Lexer::new(
            Default::default(),
            EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let program = parser.parse_program().unwrap();

        Ok(program)
    })
    .unwrap()
}

#[bench]
fn rkyv_serialize(b: &mut Bencher) {
    let program = input();

    b.iter(|| {
        let v = rkyv::to_bytes::<_, 512>(&program).unwrap();
        black_box(v);
    })
}

#[bench]
fn rkyv_deserialize(b: &mut Bencher) {
    let program = input();
    let bytes = rkyv::to_bytes::<_, 512>(&program).unwrap();

    b.iter(|| {
        let archived = unsafe { rkyv::archived_root::<Program>(&bytes[..]) };

        let v: Program = archived.deserialize(&mut rkyv::Infallible).unwrap();

        black_box(v);
    })
}

#[bench]
fn json_serialize(b: &mut Bencher) {
    let program = input();

    b.iter(|| {
        let v = serde_json::to_string(&program).unwrap();
        black_box(v);
    })
}

#[bench]
fn json_deserialize(b: &mut Bencher) {
    let program = input();
    let json_str = serde_json::to_string(&program).unwrap();

    eprintln!("json: {}", json_str);

    b.iter(|| {
        let v: Program = serde_json::from_str(&json_str).unwrap();
        black_box(v);
    })
}

#[bench]
fn ast_clone(b: &mut Bencher) {
    let program = input();

    b.iter(|| {
        let program = program.clone();
        black_box(program);
    })
}

#[bench]
fn ast_clone_to_stable(b: &mut Bencher) {
    let program = input();

    b.iter(|| {
        let program = program.clone();
        let v = swc_ecma_plugin_ast::Program::from_unstable(program);
        black_box(v);
    })
}

#[bench]
fn ast_clone_to_stable_then_to_unstable(b: &mut Bencher) {
    let program = input();
    b.iter(|| {
        let program = program.clone();
        let stable = swc_ecma_plugin_ast::Program::from_unstable(program);

        let v = stable.into_unstable();

        black_box(v);
    })
}
