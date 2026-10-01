use copyless::BoxHelper;
use swc_common::Spanned;
use swc_ecma_ast::{
    AssignProp, ComputedPropName, Function, GetterProp, KeyValueProp, MethodProp, Prop, PropName,
    SetterProp,
};
use swc_estree_ast::{
    AssignmentPattern, AssignmentPatternLeft, Expression, FunctionExpression, Literal, ObjectKey,
    ObjectMember, ObjectMethod, ObjectMethodKind, ObjectPropVal, ObjectProperty,
};

use crate::babelify::{Babelify, Context};

fn babelify_object_method(
    key: PropName,
    function: Box<Function>,
    kind: ObjectMethodKind,
    ctx: &Context,
) -> ObjectMethod {
    let computed = key.is_computed();
    let func: FunctionExpression = function.babelify(ctx);

    ObjectMethod {
        base: func.base,
        kind,
        key: key.babelify(ctx),
        params: func.params,
        body: func.body,
        return_type: func.return_type,
        computed,
        generator: func.generator,
        is_async: func.is_async,
        decorator: Default::default(),
        type_parameters: func.type_parameters,
    }
}

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
        let computed = self.key.is_computed();
        ObjectProperty {
            base: ctx.base(self.span()),
            key: self.key.babelify(ctx),
            value: ObjectPropVal::Expr(Box::alloc().init(self.value.babelify(ctx).into())),
            computed,
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
        babelify_object_method(self.key, self.function, ObjectMethodKind::Get, ctx)
    }
}

impl Babelify for SetterProp {
    type Output = ObjectMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        babelify_object_method(self.key, self.function, ObjectMethodKind::Set, ctx)
    }
}

impl Babelify for MethodProp {
    type Output = ObjectMethod;

    fn babelify(self, ctx: &Context) -> Self::Output {
        babelify_object_method(self.key, self.function, ObjectMethodKind::Method, ctx)
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
            PropName::BigInt(b) => ObjectKey::Expr(
                Box::alloc().init(Expression::Literal(Literal::BigInt(b.babelify(ctx)))),
            ),
            #[cfg(swc_ast_unknown)]
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

#[cfg(test)]
mod tests {
    use swc_common::{sync::Lrc, FileName, SourceMap, DUMMY_SP};
    use swc_ecma_ast::{BigInt, PropName};
    use swc_estree_ast as estree;
    use swc_node_comments::SwcComments;

    use crate::babelify::{Babelify, Context};

    #[test]
    fn test_bigint_prop_name() {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(Lrc::new(FileName::Anon), String::new());
        let ctx = Context {
            fm,
            cm,
            comments: SwcComments::default(),
        };

        let prop_name = PropName::BigInt(BigInt {
            span: DUMMY_SP,
            value: Box::new(123u64.into()),
            raw: Some("123n".into()),
        });

        let key = prop_name.babelify(&ctx);
        match key {
            estree::ObjectKey::Expr(expr) => match *expr {
                estree::Expression::Literal(estree::Literal::BigInt(bi)) => {
                    assert_eq!(bi.value.as_str(), "123");
                }
                _ => panic!("Expected Literal::BigInt"),
            },
            _ => panic!("Expected ObjectKey::Expr"),
        }
    }
}
