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
                match (prop.shorthand && !prop.computed, prop.key, prop.value) {
                    (
                        true,
                        swc_estree_ast::ObjectKey::Id(key_id),
                        swc_estree_ast::ObjectPropVal::Pattern(swc_estree_ast::PatternLike::Id(
                            left_id,
                        )),
                    ) if key_id.name == left_id.name => ObjectPatProp::Assign(AssignPatProp {
                        span: ctx.span(&prop.base),
                        key: key_id.swcify(ctx),
                        value: None,
                    }),
                    (
                        true,
                        swc_estree_ast::ObjectKey::Id(key_id),
                        swc_estree_ast::ObjectPropVal::Pattern(
                            swc_estree_ast::PatternLike::AssignmentPat(a),
                        ),
                    ) if matches!(
                        &a.left,
                        swc_estree_ast::AssignmentPatternLeft::Id(left_id)
                            if key_id.name == left_id.name
                    ) =>
                    {
                        ObjectPatProp::Assign(AssignPatProp {
                            span: ctx.span(&prop.base),
                            key: key_id.swcify(ctx),
                            value: Some(a.right.swcify(ctx)),
                        })
                    }
                    (_, key, swc_estree_ast::ObjectPropVal::Pattern(v)) => {
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: crate::swcify::expr::swcify_object_key(key, prop.computed, ctx),
                            value: Box::new(v.swcify(ctx)),
                        })
                    }
                    (
                        _,
                        swc_estree_ast::ObjectKey::Id(key_id),
                        swc_estree_ast::ObjectPropVal::Expr(v),
                    ) => ObjectPatProp::Assign(AssignPatProp {
                        span: ctx.span(&prop.base),
                        key: key_id.swcify(ctx),
                        value: Some(v.swcify(ctx)),
                    }),
                    (_, key, swc_estree_ast::ObjectPropVal::Expr(v)) => {
                        ObjectPatProp::KeyValue(KeyValuePatProp {
                            key: key.swcify(ctx),
                            value: Box::new(Pat::Expr(v.swcify(ctx))),
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

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::{sync::Lrc, FileName, SourceMap};
    use swc_ecma_ast::ObjectPatProp;
    use swc_estree_ast as estree;
    use swc_node_comments::SwcComments;

    use crate::swcify::{Context, Swcify};

    fn base() -> estree::BaseNode {
        estree::BaseNode {
            leading_comments: Default::default(),
            inner_comments: Default::default(),
            trailing_comments: Default::default(),
            start: None,
            end: None,
            loc: None,
            range: None,
        }
    }

    #[test]
    fn test_swcify_object_pattern_shorthand_assignment_pat() {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(Lrc::new(FileName::Anon), String::new());
        let comments = SwcComments::default();
        let ctx = Context::new_without_alloc(cm, comments, fm);

        let prop = estree::ObjectPatternProp::Prop(estree::ObjectProperty {
            base: base(),
            key: estree::ObjectKey::Id(estree::Identifier {
                base: base(),
                name: atom!("x"),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            value: estree::ObjectPropVal::Pattern(estree::PatternLike::AssignmentPat(
                estree::AssignmentPattern {
                    base: base(),
                    left: estree::AssignmentPatternLeft::Id(estree::Identifier {
                        base: base(),
                        name: atom!("x"),
                        type_annotation: None,
                        optional: None,
                        decorators: None,
                    }),
                    right: Box::new(estree::Expression::Literal(estree::Literal::Numeric(
                        estree::NumericLiteral {
                            base: base(),
                            value: 1.0,
                            extra: None,
                        },
                    ))),
                    type_annotation: None,
                    decorators: None,
                },
            )),
            computed: false,
            shorthand: true,
            decorators: None,
        });

        let pat_prop: ObjectPatProp = prop.swcify(&ctx);
        match pat_prop {
            ObjectPatProp::Assign(assign_prop) => {
                assert_eq!(assign_prop.key.id.sym.as_str(), "x");
                assert!(assign_prop.value.is_some());
            }
            _ => panic!("Expected ObjectPatProp::Assign"),
        }

        let mismatched_shorthand = estree::ObjectPatternProp::Prop(estree::ObjectProperty {
            base: base(),
            key: estree::ObjectKey::Id(estree::Identifier {
                base: base(),
                name: atom!("x"),
                type_annotation: None,
                optional: None,
                decorators: None,
            }),
            value: estree::ObjectPropVal::Pattern(estree::PatternLike::Id(estree::Identifier {
                base: base(),
                name: atom!("y"),
                type_annotation: None,
                optional: None,
                decorators: None,
            })),
            computed: false,
            shorthand: true,
            decorators: None,
        });

        let mismatched_pat_prop: ObjectPatProp = mismatched_shorthand.swcify(&ctx);
        assert!(matches!(mismatched_pat_prop, ObjectPatProp::KeyValue(_)));
    }
}
