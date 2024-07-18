use swc_ecma_ast::*;

impl_enum!(Prop, [Shorthand, KeyValue, Assign, Getter, Setter, Method]);

impl_struct!(
    PrivateProp,
    [
        span,
        ctxt,
        definite,
        key,
        value,
        type_ann,
        is_static,
        decorators,
        accessibility,
        is_optional,
        is_override,
        readonly
    ]
);

impl_struct!(KeyValueProp, [key, value]);

impl_struct!(AssignProp, [span, key, value]);

impl_struct!(GetterProp, [span, key, type_ann, body]);
impl_struct!(SetterProp, [span, key, param, this_param, body]);

impl_struct!(MethodProp, [key, function]);

impl_struct!(KeyValuePatProp, [key, value]);

impl_struct!(AssignPatProp, [span, key, value]);

impl_struct!(ComputedPropName, [span, expr]);

impl_enum!(Key, [Private, Public]);
