use swc_ecma_visit_macros::define;

define!(
    Struct { field, field2 },
    Vars {},
    Enum(StructLiek { field })
);
