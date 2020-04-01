use std::any::Any;
use swc_common::AstNode;
use swc_ecma_visit_macros::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

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
