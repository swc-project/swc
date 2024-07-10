use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_estree_ast::{
    ArrayPattern, AssignmentPattern, AssignmentPatternLeft, LVal, ObjectPattern, ObjectPatternProp,
    PatternLike, RestElement,
};

use crate::swcify::{Context, Swcify};

impl Swcify for LVal {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            LVal::Id(i) => i.swcify(ctx).into(),
            LVal::MemberExpr(e) => Box::new(e.swcify(ctx)).into(),
            LVal::RestEl(e) => e.swcify(ctx).into(),
            LVal::AssignmentPat(e) => e.swcify(ctx).into(),
            LVal::ArrayPat(e) => e.swcify(ctx).into(),
            LVal::ObjectPat(e) => e.swcify(ctx).into(),
            LVal::TSParamProp(..) => todo!(),
        }
    }
}

impl Swcify for RestElement {
    type Output = RestPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let span = ctx.span(&self.base);

        RestPat {
            span,
            dot3_token: span,
            arg: Box::new(self.argument.swcify(ctx)),
            type_ann: None,
        }
    }
}

impl Swcify for AssignmentPattern {
    type Output = AssignPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        AssignPat {
            span: ctx.span(&self.base),
            left: Box::new(self.left.swcify(ctx)),
            right: self.right.swcify(ctx),
        }
    }
}

impl Swcify for AssignmentPatternLeft {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            AssignmentPatternLeft::Id(v) => v.swcify(ctx).into(),
            AssignmentPatternLeft::Object(v) => v.swcify(ctx).into(),
            AssignmentPatternLeft::Array(v) => v.swcify(ctx).into(),
            AssignmentPatternLeft::Member(v) => Box::new(v.swcify(ctx)).into(),
        }
    }
}

impl Swcify for ArrayPattern {
    type Output = ArrayPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ArrayPat {
            span: ctx.span(&self.base),
            elems: self.elements.swcify(ctx),
            optional: false,
            type_ann: None,
        }
    }
}

impl Swcify for PatternLike {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            PatternLike::Id(v) => v.swcify(ctx).into(),
            PatternLike::RestEl(v) => v.swcify(ctx).into(),
            PatternLike::AssignmentPat(v) => v.swcify(ctx).into(),
            PatternLike::ArrayPat(v) => v.swcify(ctx).into(),
            PatternLike::ObjectPat(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for ObjectPattern {
    type Output = ObjectPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ObjectPat {
            span: ctx.span(&self.base),
            props: self.properties.swcify(ctx),
            optional: false,
            type_ann: None,
        }
    }
}

impl Swcify for ObjectPatternProp {
    type Output = ObjectPatProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ObjectPatternProp::Rest(v) => ObjectPatProp::Rest(v.swcify(ctx)),
            ObjectPatternProp::Prop(prop) => {
                if prop.shorthand {
                    return ObjectPatProp::Assign(AssignPatProp {
                        span: ctx.span(&prop.base),
                        key: prop.key.swcify(ctx).expect_ident().into(),
                        value: None,
                    });
                }

                match prop.value {
                    swc_estree_ast::ObjectPropVal::Pattern(v) => {
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: prop.key.swcify(ctx),
                            value: Box::new(v.swcify(ctx)),
                        })
                    }
                    swc_estree_ast::ObjectPropVal::Expr(v) => {
                        ObjectPatProp::Assign(AssignPatProp {
                            span: ctx.span(&prop.base),
                            key: prop.key.swcify(ctx).expect_ident().into(),
                            value: Some(v.swcify(ctx)),
                        })
                    }
                }
            }
        }
    }
}

impl Swcify for swc_estree_ast::Pattern {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::Pattern::Assignment(v) => v.swcify(ctx).into(),
            swc_estree_ast::Pattern::Array(v) => v.swcify(ctx).into(),
            swc_estree_ast::Pattern::Object(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_estree_ast::Param {
    type Output = swc_ecma_ast::Param;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::Param::Id(v) => {
                let pat = v.swcify(ctx);

                swc_ecma_ast::Param {
                    span: pat.span(),
                    decorators: Default::default(),
                    pat: pat.into(),
                }
            }
            swc_estree_ast::Param::Pat(v) => {
                let pat = v.swcify(ctx);

                swc_ecma_ast::Param {
                    span: pat.span(),
                    decorators: Default::default(),
                    pat,
                }
            }
            swc_estree_ast::Param::Rest(v) => swc_ecma_ast::Param {
                span: ctx.span(&v.base),
                decorators: v.decorators.swcify(ctx).unwrap_or_default(),
                pat: v.argument.swcify(ctx),
            },
            swc_estree_ast::Param::TSProp(..) => todo!(),
        }
    }
}
