use std::any::Any;
use swc_common::AstNode;
use swc_ecma_visit_macros::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T> Node for T where T: Any {}

pub trait Visit<T> {
    fn visit(&mut self, node: &dyn Node, parent: &dyn Node);
}

struct S {
    field: String,
    field2: u64,
}

enum E {
    StructLike { field: String },
    TupleLike(u32, u16),
}

define!(
    S {
        field: String,
        field2: u64
    },
    E(StructLike { field: String }, TupleLike(u32, u16)),
    String,
    u64,
    u32,
    u16
);
