use swc_ecma_ast::*;

impl_struct!(
    PrivateProp,
    [
        span,
        key,
        value,
        type_ann,
        is_static,
        decorators,
        computed,
        accessibility,
        is_abstract,
        is_optional,
        is_override,
        readonly,
        definite
    ]
);

impl_struct!(KeyValuePatProp, [key, value]);

impl_struct!(AssignPatProp, [span, key, value]);

impl_struct!(ComputedPropName, [span, expr]);
