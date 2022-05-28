#![allow(clippy::derive_partial_eq_without_eq)]

use ast_node::ast_node;
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use serde::{Deserialize, Serialize};
use swc_common::{Span, DUMMY_SP};

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

fn bench_serde(c: &mut Criterion) {
    let src = Serde::String(SerdeStr {
        span: DUMMY_SP,
        value: String::from("perf-diff"),
    });

    c.bench_function("serialization of serde", |b| {
        b.iter(|| black_box(serde_json::to_string(&src).unwrap()));
    });
    c.bench_function("deserialization of serde", |b| {
        let src = serde_json::to_string(&Serde::String(SerdeStr {
            span: DUMMY_SP,
            value: String::from("perf-diff"),
        }))
        .unwrap();
        println!("{}", src);

        b.iter(|| black_box(serde_json::to_string(&src).unwrap()));
    });
}

fn bench_ast_node(c: &mut Criterion) {
    c.bench_function("serialization of ast node", |b| {
        let src = AstNode::String(Str {
            span: DUMMY_SP,
            value: String::from("perf-diff"),
        });

        b.iter(|| black_box(serde_json::to_string(&src).unwrap()));
    });
    c.bench_function("deserialization of ast node", |b| {
        let src = serde_json::to_string(&AstNode::String(Str {
            span: DUMMY_SP,
            value: String::from("perf-diff"),
        }))
        .unwrap();
        println!("{}", src);

        b.iter(|| {
            let t: AstNode = serde_json::from_str(&src).unwrap();

            black_box(t);
        });
    });
}

criterion_group!(benches, bench_ast_node, bench_serde);
criterion_main!(benches);
