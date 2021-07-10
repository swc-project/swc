#![feature(test)]

extern crate test;

use ast_node::ast_node;
use serde::{Deserialize, Serialize};
use std::hint::black_box;
use swc_common::{Span, DUMMY_SP};
use test::Bencher;

#[derive(Serialize, Deserialize)]
pub struct SerdeStr {
    span: Span,
    value: String,
}

#[ast_node("String")]
pub struct Str {
    span: Span,
    value: String,
}

#[derive(Serialize, Deserialize)]
pub struct SerdeNum {
    span: Span,
    value: u64,
}

#[ast_node("Number")]
pub struct Num {
    span: Span,
    value: u64,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Serde {
    Number(SerdeNum),
    String(SerdeStr),
}

#[ast_node]
pub enum AstNode {
    #[tag("Number")]
    Number(Num),
    #[tag("String")]
    String(Str),
}

#[bench]
fn ser_serde(b: &mut Bencher) {
    let src = Serde::String(SerdeStr {
        span: DUMMY_SP,
        value: String::from("perf-diff"),
    });

    b.iter(|| black_box(serde_json::to_string(&src).unwrap()));
}

#[bench]
fn de_serde(b: &mut Bencher) {
    let src = serde_json::to_string(&Serde::String(SerdeStr {
        span: DUMMY_SP,
        value: String::from("perf-diff"),
    }))
    .unwrap();
    println!("{}", src);
    b.bytes = src.len() as _;

    b.iter(|| {
        let t: Serde = serde_json::from_str(&src).unwrap();

        black_box(t);
    });
}

#[bench]
fn ser_ast_node(b: &mut Bencher) {
    let src = AstNode::String(Str {
        span: DUMMY_SP,
        value: String::from("perf-diff"),
    });

    b.iter(|| black_box(serde_json::to_string(&src).unwrap()));
}

#[bench]
fn de_ast_node(b: &mut Bencher) {
    let src = serde_json::to_string(&AstNode::String(Str {
        span: DUMMY_SP,
        value: String::from("perf-diff"),
    }))
    .unwrap();
    println!("{}", src);
    b.bytes = src.len() as _;

    b.iter(|| {
        let t: AstNode = serde_json::from_str(&src).unwrap();

        black_box(t);
    });
}
