use crate::babelify::{Babelify, Context};
use copyless::BoxHelper;
use swc_babel_ast::{
    AssignmentPattern, AssignmentPatternLeft, Expression, FunctionExpression, ObjectKey,
    ObjectMember, ObjectMethod, ObjectMethodKind, ObjectPropVal, ObjectProperty,
};
use swc_common::Spanned;
use swc_ecma_ast::{
    AssignProp, ComputedPropName, GetterProp, KeyValueProp, MethodProp, Prop, PropName, SetterProp,
};

impl Babelify for Prop {
    type Output = ObjectMember;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Prop::Shorthand(i) => {
                let id = i.babelify(ctx);
                ObjectMember::Prop(ObjectProperty {
                    base: id.base.clone(),
                    key: ObjectKey::Id(id.clone()),
                    value: ObjectPropVal::Expr(Box::alloc().init(Expression::Id(id))),
                    computed: Default::default(),
                    shorthand: true,
                    decorators: Default::default(),
                })
            }
            Prop::KeyValue(k) => ObjectMember::Prop(k.babelify(ctx)),
            Prop::Getter(g) => ObjectMember::Method(g.babelify(ctx)),
            Prop::Setter(s) => ObjectMember::Method(s.babelify(ctx)),
            Prop::Method(m) => ObjectMember::Method(m.babelify(ctx)),
            _ => panic!(
                "illegal conversion: Cannot convert {:?} to ObjectMember",
                &self
            ),
        }
    }
}

impl Babelify for KeyValueProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectProperty {
            base: ctx.base(self.span()),
            key: self.key.babelify(ctx),
            value: ObjectPropVal::Expr(Box::alloc().init(self.value.babelify(ctx).into())),
            computed: Default::default(),
            shorthand: Default::default(),
            decorators: Default::default(),
        }
    }
}

// TODO(dwoznicki): What is AssignProp used for? Should it babelify into
// AssignmentPattern or AssignmentExpression?
impl Babelify for AssignProp {
    type Output = AssignmentPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        AssignmentPattern {
            base: ctx.base(self.span()),
            left: AssignmentPatternLeft::Id(self.key.babelify(ctx)),
            right: Box::alloc().init(self.value.babelify(ctx).into()),
            decorators: Default::default(),
            type_annotation: Default::default(),
        }
    }
}

impl Babelify for GetterProp {
    type Output = ObjectMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectMethod {
            base: ctx.base(self.span),
            kind: ObjectMethodKind::Get,
            key: self.key.babelify(ctx),
            return_type: self
                .type_ann
                .map(|ann| Box::alloc().init(ann.babelify(ctx).into())),
            body: self.body.unwrap().babelify(ctx),
            params: Default::default(),
            computed: Default::default(),
            generator: Default::default(),
            is_async: Default::default(),
            decorator: Default::default(),
            type_parameters: Default::default(),
        }
    }
}

impl Babelify for SetterProp {
    type Output = ObjectMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectMethod {
            base: ctx.base(self.span),
            kind: ObjectMethodKind::Set,
            key: self.key.babelify(ctx),
            params: vec![self.param.babelify(ctx).into()],
            body: self.body.unwrap().babelify(ctx),
            return_type: Default::default(),
            computed: Default::default(),
            generator: Default::default(),
            is_async: Default::default(),
            decorator: Default::default(),
            type_parameters: Default::default(),
        }
    }
}

impl Babelify for MethodProp {
    type Output = ObjectMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let func: FunctionExpression = self.function.babelify(ctx);
        ObjectMethod {
            base: func.base,
            kind: ObjectMethodKind::Method,
            key: self.key.babelify(ctx).into(),
            params: func.params,
            body: func.body,
            computed: Default::default(),
            generator: func.generator,
            is_async: func.is_async,
            decorator: Default::default(),
            return_type: func.return_type,
            type_parameters: func.type_parameters,
        }
    }
}

impl Babelify for PropName {
    type Output = ObjectKey;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            PropName::Ident(i) => ObjectKey::Id(i.babelify(ctx)),
            PropName::Str(s) => ObjectKey::String(s.babelify(ctx)),
            PropName::Num(n) => ObjectKey::Numeric(n.babelify(ctx)),
            PropName::Computed(e) => ObjectKey::Expr(Box::alloc().init(e.babelify(ctx))),
            _ => panic!(
                "illegal conversion: Cannot convert {:?} to ObjectKey",
                &self
            ),
        }
    }
}

impl Babelify for ComputedPropName {
    type Output = Expression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        self.expr.babelify(ctx).into()
    }
}
