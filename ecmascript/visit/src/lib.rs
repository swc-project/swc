use swc_ecma_visit_macros::define;

define!(
    S { field, field2 },
    E(StructLike { field }, TupelLike(a, b))
);
