use swc_ecma_ast::*;

impl_struct!(
    Class,
    [
        span,
        decorators,
        body,
        super_class,
        is_abstract,
        type_params,
        super_type_params,
        implements
    ]
);
