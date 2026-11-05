use copyless::BoxHelper;
use serde::{Deserialize, Serialize};
use swc_common::Spanned;
use swc_ecma_ast::{
    ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
};
use swc_estree_ast::{
    ArrayPattern, AssignmentPattern, AssignmentPatternLeft, CatchClauseParam, Expression,
    Identifier, LVal, ObjectKey, ObjectPattern, ObjectPatternProp, ObjectPropVal, ObjectProperty,
    Param, Pattern, PatternLike, RestElement,
};

use crate::babelify::{Babelify, Context};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PatOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
    Assign(AssignmentPattern),
    Expr(Box<Expression>),
}

impl Babelify for Pat {
    type Output = PatOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Pat::Ident(i) => PatOutput::Id(i.babelify(ctx)),
            Pat::Array(a) => PatOutput::Array(a.babelify(ctx)),
            Pat::Rest(r) => PatOutput::Rest(r.babelify(ctx)),
            Pat::Object(o) => PatOutput::Object(o.babelify(ctx)),
            Pat::Assign(a) => PatOutput::Assign(a.babelify(ctx)),
            Pat::Expr(e) => PatOutput::Expr(Box::alloc().init(e.babelify(ctx).into())),
            Pat::Invalid(_) => panic!(
                "illegal conversion: Cannot convert {:?} to PatOutput",
                &self
            ),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl From<PatOutput> for Pattern {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Assign(a) => Pattern::Assignment(a),
            PatOutput::Array(a) => Pattern::Array(a),
            PatOutput::Object(o) => Pattern::Object(o),
            _ => panic!("illegal conversion: Cannot convert {:?} to Pattern", &pat),
        }
    }
}

impl From<PatOutput> for ObjectPropVal {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Expr(e) => ObjectPropVal::Expr(e),
            PatOutput::Id(p) => ObjectPropVal::Pattern(PatternLike::Id(p)),
            PatOutput::Array(p) => ObjectPropVal::Pattern(PatternLike::ArrayPat(p)),
            PatOutput::Rest(p) => ObjectPropVal::Pattern(PatternLike::RestEl(p)),
            PatOutput::Object(p) => ObjectPropVal::Pattern(PatternLike::ObjectPat(p)),
            PatOutput::Assign(p) => ObjectPropVal::Pattern(PatternLike::AssignmentPat(p)),
        }
    }
}

impl From<PatOutput> for LVal {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => LVal::Id(i),
            PatOutput::Array(a) => LVal::ArrayPat(a),
            PatOutput::Rest(r) => LVal::RestEl(r),
            PatOutput::Object(o) => LVal::ObjectPat(o),
            PatOutput::Assign(a) => LVal::AssignmentPat(a),
            PatOutput::Expr(expr) => match *expr {
                Expression::Member(e) => LVal::MemberExpr(e),
                _ => panic!("illegal conversion: Cannot convert {:?} to LVal", &expr),
            },
        }
    }
}

impl From<PatOutput> for PatternLike {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => PatternLike::Id(i),
            PatOutput::Array(a) => PatternLike::ArrayPat(a),
            PatOutput::Rest(r) => PatternLike::RestEl(r),
            PatOutput::Object(o) => PatternLike::ObjectPat(o),
            PatOutput::Assign(a) => PatternLike::AssignmentPat(a),
            PatOutput::Expr(_) => panic!("illegal conversion: Cannot convert {:?} to LVal", &pat),
        }
    }
}

impl From<PatOutput> for AssignmentPatternLeft {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => AssignmentPatternLeft::Id(i),
            PatOutput::Array(a) => AssignmentPatternLeft::Array(a),
            PatOutput::Object(o) => AssignmentPatternLeft::Object(o),
            PatOutput::Expr(expr) => match *expr {
                Expression::Member(e) => AssignmentPatternLeft::Member(e),
                _ => panic!(
                    "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                    &expr
                ),
            },
            PatOutput::Rest(_) => panic!(
                "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                &pat
            ),
            PatOutput::Assign(_) => panic!(
                "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                &pat
            ),
        }
    }
}

impl From<PatOutput> for Param {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => Param::Id(i),
            PatOutput::Rest(r) => Param::Rest(r),
            PatOutput::Array(p) => Param::Pat(Pattern::Array(p)),
            PatOutput::Object(p) => Param::Pat(Pattern::Object(p)),
            PatOutput::Assign(p) => Param::Pat(Pattern::Assignment(p)),
            PatOutput::Expr(p) => panic!("Cannot convert {p:?} to Param"),
        }
    }
}

impl From<PatOutput> for CatchClauseParam {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => CatchClauseParam::Id(i),
            PatOutput::Array(a) => CatchClauseParam::Array(a),
            PatOutput::Object(o) => CatchClauseParam::Object(o),
            _ => panic!(
                "illegal conversion: Cannot convert {:?} to CatchClauseParam",
                &pat
            ),
        }
    }
}

impl Babelify for ArrayPat {
    type Output = ArrayPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrayPattern {
            base: ctx.base(self.span),
            elements: self
                .elems
                .into_iter()
                .map(|opt| opt.map(|e| e.babelify(ctx).into()))
                .collect(),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
            decorators: Default::default(),
        }
    }
}

impl Babelify for ObjectPat {
    type Output = ObjectPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectPattern {
            base: ctx.base(self.span),
            properties: self.props.babelify(ctx),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
            decorators: Default::default(),
        }
    }
}

impl Babelify for ObjectPatProp {
    type Output = ObjectPatternProp;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ObjectPatProp::KeyValue(p) => ObjectPatternProp::Prop(p.babelify(ctx)),
            ObjectPatProp::Rest(r) => ObjectPatternProp::Rest(r.babelify(ctx)),
            ObjectPatProp::Assign(a) => ObjectPatternProp::Prop(a.babelify(ctx)),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Babelify for KeyValuePatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let computed = self.key.is_computed();
        ObjectProperty {
            base: ctx.base(self.span()),
            key: self.key.babelify(ctx),
            value: self.value.babelify(ctx).into(),
            computed,
            shorthand: Default::default(),
            decorators: Default::default(),
        }
    }
}

impl Babelify for RestPat {
    type Output = RestElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        RestElement {
            base: ctx.base(self.span),
            argument: Box::alloc().init(self.arg.babelify(ctx).into()),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
            decorators: Default::default(),
        }
    }
}

impl Babelify for AssignPat {
    type Output = AssignmentPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        AssignmentPattern {
            base: ctx.base(self.span),
            left: self.left.babelify(ctx).into(),
            right: Box::alloc().init(self.right.babelify(ctx).into()),
            type_annotation: None,
            decorators: Default::default(),
        }
    }
}

impl Babelify for AssignPatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let base = ctx.base(self.span);
        let key_id = self.key.babelify(ctx);
        let mut value_id = key_id.clone();
        value_id.base.leading_comments.clear();
        value_id.base.inner_comments.clear();
        value_id.base.trailing_comments.clear();
        let value = match self.value {
            Some(default_expr) => {
                let right = default_expr.babelify(ctx).into();
                ObjectPropVal::Pattern(PatternLike::AssignmentPat(AssignmentPattern {
                    base: ctx.base(self.span),
                    left: AssignmentPatternLeft::Id(value_id),
                    right: Box::alloc().init(right),
                    decorators: Default::default(),
                    type_annotation: Default::default(),
                }))
            }
            None => ObjectPropVal::Pattern(PatternLike::Id(value_id)),
        };
        ObjectProperty {
            base,
            key: ObjectKey::Id(key_id),
            value,
            shorthand: true,
            computed: Default::default(),
            decorators: Default::default(),
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::atom;
    use swc_common::{
        comments::{Comment, CommentKind, Comments},
        sync::Lrc,
        BytePos, FileName, SourceMap, Span, SyntaxContext, DUMMY_SP,
    };
    use swc_ecma_ast::{AssignPatProp, BindingIdent, Expr, Ident, Lit, Number};
    use swc_estree_ast::{AssignmentPatternLeft, ObjectPropVal, PatternLike};
    use swc_node_comments::SwcComments;

    use crate::babelify::{Babelify, Context};

    #[test]
    fn test_babelify_assign_pat_prop_with_default() {
        let cm = Lrc::new(SourceMap::default());
        let fm = cm.new_source_file(Lrc::new(FileName::Anon), "x = 1");
        let comments = SwcComments::default();
        let prop_span = Span::new(BytePos(1), BytePos(6));
        comments.add_leading(
            prop_span.lo,
            Comment {
                kind: CommentKind::Block,
                span: DUMMY_SP,
                text: atom!(" prop comment "),
            },
        );
        let ctx = Context { fm, cm, comments };

        let assign_pat_prop = AssignPatProp {
            span: prop_span,
            key: BindingIdent {
                id: Ident::new(atom!("x"), DUMMY_SP, SyntaxContext::empty()),
                type_ann: None,
            },
            value: Some(Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 1.0,
                raw: None,
            })))),
        };

        let obj_prop = assign_pat_prop.babelify(&ctx);
        assert!(obj_prop.shorthand);
        assert_eq!(obj_prop.base.leading_comments.len(), 1);
        match obj_prop.value {
            ObjectPropVal::Pattern(PatternLike::AssignmentPat(assign_pat)) => {
                assert!(assign_pat.base.leading_comments.is_empty());
                match assign_pat.left {
                    AssignmentPatternLeft::Id(id) => assert_eq!(id.name.as_str(), "x"),
                    _ => panic!("Expected AssignmentPatternLeft::Id"),
                }
            }
            _ => panic!("Expected ObjectPropVal::Pattern(AssignmentPat)"),
        }
    }
}
