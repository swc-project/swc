use swc_ecma_ast::*;

impl_struct!(
    Class,
    [
        span,
        ctxt,
        decorators,
        body,
        super_class,
        is_abstract,
        type_params,
        super_type_params,
        implements
    ]
);

impl_struct!(
    Constructor,
    [span, ctxt, key, params, body, accessibility, is_optional]
);

impl_struct!(
    ClassMethod,
    [
        span,
        key,
        function,
        kind,
        is_static,
        accessibility,
        is_abstract,
        is_optional,
        is_override
    ]
);

impl_struct!(
    PrivateMethod,
    [
        span,
        key,
        function,
        kind,
        is_static,
        accessibility,
        is_abstract,
        is_optional,
        is_override
    ]
);

impl_struct!(
    ClassProp,
    [
        span,
        key,
        value,
        type_ann,
        is_static,
        decorators,
        accessibility,
        is_abstract,
        is_optional,
        is_override,
        readonly,
        declare,
        definite
    ]
);

impl_struct!(StaticBlock, [span, body]);

impl_struct!(
    AutoAccessor,
    [
        span,
        is_abstract,
        is_override,
        definite,
        key,
        value,
        type_ann,
        is_static,
        decorators,
        accessibility
    ]
);
