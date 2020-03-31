use swc_ecma_visit_macros::define;

struct S {
    field: String,
    field2: u64,
}

enum E {
    StructLike { field: String },
    TupleLike(u32, u16),
}

define!(
    S { field, field2 },
    E(StructLike { field }, TupleLike(a, b)),
    String,
    u64,
    u32,
    u16
);
