use swc_common::Spanned;
use swc_ecma_ast::{
    op, ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BinaryOp, BindingIdent,
    BlockStmtOrExpr, CallExpr, Callee, ClassExpr, ComputedPropName, CondExpr, Expr, ExprOrSpread,
    FnExpr, Function, Ident, Import, JSXAttr, JSXAttrOrSpread, JSXAttrValue, JSXEmptyExpr, JSXExpr,
    JSXExprContainer, JSXMemberExpr, JSXObject, KeyValueProp, Lit, MemberExpr, MemberProp,
    MetaPropExpr, MetaPropKind, MethodProp, NewExpr, ObjectLit, OptCall, OptChainBase,
    OptChainExpr, ParenExpr, Prop, PropName, PropOrSpread, SeqExpr, SpreadElement, SuperProp,
    SuperPropExpr, TaggedTpl, ThisExpr, TsAsExpr, TsNonNullExpr, TsTypeAssertion,
    TsTypeParamInstantiation, UnaryExpr, UnaryOp, UpdateExpr, YieldExpr,
};
use swc_estree_ast::{
    Arg, ArrayExprEl, ArrayExpression, ArrowFuncExprBody, ArrowFunctionExpression,
    AssignmentExpression, AwaitExpression, BinaryExprLeft, BinaryExprOp, BinaryExpression,
    BindExpression, CallExpression, Callee as BabelCallee, ClassExpression, ConditionalExpression,
    DoExpression, Expression, FunctionExpression, Identifier, Import as BabelImport, JSXAttrVal,
    JSXAttribute, JSXEmptyExpression, JSXExprContainerExpr, JSXExpressionContainer,
    JSXMemberExprObject, JSXMemberExpression, JSXSpreadAttribute, Literal, LogicalExprOp,
    LogicalExpression, MemberExprProp, MemberExpression, MetaProperty, ModuleExpression,
    NewExpression, ObjectExprProp, ObjectExpression, ObjectKey, ObjectMethod, ObjectPropVal,
    ObjectProperty, OptionalCallExpression, OptionalMemberExprProp, OptionalMemberExpression,
    ParenthesizedExpression, PatternLike, PipelinePrimaryTopicReference, RecordExpression,
    SequenceExpression, TSAsExpression, TSNonNullExpression, TSTypeAssertion,
    TaggedTemplateExprTypeParams, TaggedTemplateExpression, ThisExpression, TupleExpression,
    TypeCastExpression, UnaryExprOp, UnaryExpression, UpdateExprOp, UpdateExpression,
    YieldExpression,
};

use super::Context;
use crate::{swcify::Swcify, Never};

impl Swcify for Expression {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Box::new(match self {
            Expression::Array(e) => e.swcify(ctx).into(),
            Expression::Assignment(e) => e.swcify(ctx).into(),
            Expression::Binary(e) => e.swcify(ctx).into(),
            Expression::Call(e) => e.swcify(ctx).into(),
            Expression::Conditional(e) => e.swcify(ctx).into(),
            Expression::Func(e) => e.swcify(ctx).into(),
            Expression::Id(e) => e.swcify(ctx).id.into(),
            Expression::Literal(Literal::String(e)) => e.swcify(ctx).into(),
            Expression::Literal(Literal::Numeric(e)) => e.swcify(ctx).into(),
            Expression::Literal(Literal::Null(e)) => Lit::from(e.swcify(ctx)).into(),
            Expression::Literal(Literal::Boolean(e)) => Lit::from(e.swcify(ctx)).into(),
            Expression::Literal(Literal::RegExp(e)) => Lit::from(e.swcify(ctx)).into(),
            Expression::Logical(e) => e.swcify(ctx).into(),
            Expression::Member(e) => e.swcify(ctx),
            Expression::New(e) => e.swcify(ctx).into(),
            Expression::Object(e) => e.swcify(ctx).into(),
            Expression::Sequence(e) => e.swcify(ctx).into(),
            Expression::Parenthesized(e) => e.swcify(ctx).into(),
            Expression::This(e) => e.swcify(ctx).into(),
            Expression::Unary(e) => e.swcify(ctx).into(),
            Expression::Update(e) => e.swcify(ctx).into(),
            Expression::ArrowFunc(e) => e.swcify(ctx).into(),
            Expression::Class(e) => e.swcify(ctx).into(),
            Expression::MetaProp(e) => e.swcify(ctx).into(),
            Expression::Super(..) => unreachable!(),
            Expression::TaggedTemplate(e) => e.swcify(ctx).into(),
            Expression::TemplateLiteral(e) => e.swcify(ctx).into(),
            Expression::Yield(e) => e.swcify(ctx).into(),
            Expression::Await(e) => e.swcify(ctx).into(),
            Expression::Literal(Literal::BigInt(e)) => e.swcify(ctx).into(),
            Expression::OptionalMember(e) => e.swcify(ctx).into(),
            Expression::OptionalCall(e) => e.swcify(ctx).into(),
            Expression::JSXElement(e) => return e.swcify(ctx).into(),
            Expression::JSXFragment(e) => e.swcify(ctx).into(),
            Expression::Literal(Literal::Decimal(e)) => e.swcify(ctx).into(),
            Expression::TSAs(e) => e.swcify(ctx).into(),
            Expression::TSTypeAssertion(e) => e.swcify(ctx).into(),
            Expression::TSNonNull(e) => e.swcify(ctx).into(),
            _ => {
                unimplemented!("swcify: {:?}", self)
            }
        })
    }
}

impl Swcify for ArrayExpression {
    type Output = ArrayLit;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ArrayLit {
            span: ctx.span(&self.base),
            elems: self.elements.swcify(ctx),
        }
    }
}

impl Swcify for AssignmentExpression {
    type Output = AssignExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        AssignExpr {
            span: ctx.span(&self.base),
            op: self.operator.parse().unwrap_or_else(|_| {
                panic!(
                    "failed to convert `AssignmentExpression` of babel: Unknown assignment \
                     operator {}",
                    self.operator,
                )
            }),
            left: self.left.swcify(ctx).try_into().unwrap(),
            right: self.right.swcify(ctx),
        }
    }
}

impl Swcify for BinaryExpression {
    type Output = BinExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BinExpr {
            span: ctx.span(&self.base),
            op: self.operator.swcify(ctx),
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::PrivateName {
    type Output = swc_ecma_ast::PrivateName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateName {
            span: ctx.span(&self.base),
            name: self.id.swcify(ctx).sym.clone(),
        }
    }
}

impl Swcify for BinaryExprLeft {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            BinaryExprLeft::Private(e) => e.swcify(ctx).into(),
            BinaryExprLeft::Expr(e) => e.swcify(ctx),
        }
    }
}

impl Swcify for BinaryExprOp {
    type Output = BinaryOp;

    fn swcify(self, _: &Context) -> Self::Output {
        match self {
            BinaryExprOp::Addition => {
                op!(bin, "+")
            }
            BinaryExprOp::Subtraction => {
                op!(bin, "-")
            }
            BinaryExprOp::Division => {
                op!("/")
            }
            BinaryExprOp::Remainder => {
                op!("%")
            }
            BinaryExprOp::Multiplication => {
                op!("*")
            }
            BinaryExprOp::Exponentiation => {
                op!("**")
            }
            BinaryExprOp::And => {
                op!("&")
            }
            BinaryExprOp::Or => {
                op!("|")
            }
            BinaryExprOp::RightShift => {
                op!(">>")
            }
            BinaryExprOp::UnsignedRightShift => {
                op!(">>>")
            }
            BinaryExprOp::LeftShift => {
                op!("<<")
            }
            BinaryExprOp::Xor => {
                op!("^")
            }
            BinaryExprOp::Equal => {
                op!("==")
            }
            BinaryExprOp::StrictEqual => {
                op!("===")
            }
            BinaryExprOp::NotEqual => {
                op!("!=")
            }
            BinaryExprOp::StrictNotEqual => {
                op!("!==")
            }
            BinaryExprOp::In => {
                op!("in")
            }
            BinaryExprOp::Instanceof => {
                op!("instanceof")
            }
            BinaryExprOp::GreaterThan => {
                op!(">")
            }
            BinaryExprOp::LessThan => {
                op!("<")
            }
            BinaryExprOp::GreaterThanOrEqual => {
                op!(">=")
            }
            BinaryExprOp::LessThanOrEqual => {
                op!("<=")
            }
        }
    }
}

impl Swcify for BabelCallee {
    type Output = Callee;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            BabelCallee::V8Id(_) => {
                unreachable!("what is v8 id?")
            }
            BabelCallee::Expr(e) => match *e {
                Expression::Super(s) => Callee::Super(s.swcify(ctx)),
                Expression::Import(s) => Callee::Import(s.swcify(ctx)),
                _ => Callee::Expr(e.swcify(ctx)),
            },
        }
    }
}

impl Swcify for CallExpression {
    type Output = CallExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        CallExpr {
            span: ctx.span(&self.base),
            callee: self.callee.swcify(ctx),
            args: self
                .arguments
                .swcify(ctx)
                .into_iter()
                .map(|v| v.expect("failed to swcify arguments"))
                .collect(),
            type_args: self.type_parameters.swcify(ctx).map(Box::new),
            ..Default::default()
        }
    }
}

impl Swcify for Arg {
    type Output = Option<ExprOrSpread>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Some(match self {
            Arg::Spread(s) => ExprOrSpread {
                spread: Some(ctx.span(&s.base)),
                expr: s.argument.swcify(ctx),
            },
            Arg::JSXName(e) => ExprOrSpread {
                spread: None,
                expr: e.swcify(ctx).into(),
            },
            Arg::Placeholder(_) => return None,
            Arg::Expr(e) => ExprOrSpread {
                spread: None,
                expr: e.swcify(ctx),
            },
        })
    }
}

impl Swcify for ConditionalExpression {
    type Output = CondExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        CondExpr {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            cons: self.consequent.swcify(ctx),
            alt: self.alternate.swcify(ctx),
        }
    }
}

impl Swcify for FunctionExpression {
    type Output = FnExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        FnExpr {
            ident: self.id.swcify(ctx).map(|v| v.into()),
            function: Box::new(Function {
                params: self.params.swcify(ctx),
                decorators: Default::default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: self.generator.unwrap_or(false),
                is_async: self.is_async.unwrap_or(false),
                type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                ..Default::default()
            }),
        }
    }
}

impl Swcify for Identifier {
    type Output = BindingIdent;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BindingIdent {
            id: Ident {
                span: ctx.span(&self.base),
                sym: self.name,
                optional: self.optional.unwrap_or(false),
                ctxt: Default::default(),
            },
            type_ann: self.type_annotation.swcify(ctx).flatten().map(Box::new),
        }
    }
}

impl Swcify for LogicalExprOp {
    type Output = BinaryOp;

    fn swcify(self, _: &Context) -> Self::Output {
        match self {
            LogicalExprOp::Or => {
                op!("||")
            }
            LogicalExprOp::And => {
                op!("&&")
            }
            LogicalExprOp::Nullish => {
                op!("??")
            }
        }
    }
}

impl Swcify for LogicalExpression {
    type Output = BinExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BinExpr {
            span: ctx.span(&self.base),
            op: self.operator.swcify(ctx),
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx),
        }
    }
}

impl Swcify for MemberExpression {
    type Output = Expr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match *self.object {
            Expression::Super(s) => SuperPropExpr {
                span: ctx.span(&self.base),
                obj: s.swcify(ctx),
                prop: match (*self.property, self.computed) {
                    (MemberExprProp::Id(i), false) => SuperProp::Ident(i.swcify(ctx).into()),
                    (MemberExprProp::Expr(e), true) => {
                        let expr = e.swcify(ctx);
                        SuperProp::Computed(ComputedPropName {
                            span: expr.span(),
                            expr,
                        })
                    }
                    _ => unreachable!(),
                },
            }
            .into(),
            _ => MemberExpr {
                span: ctx.span(&self.base),
                obj: self.object.swcify(ctx),
                prop: match (*self.property, self.computed) {
                    (MemberExprProp::Id(i), false) => MemberProp::Ident(i.swcify(ctx).into()),
                    (MemberExprProp::PrivateName(e), false) => {
                        MemberProp::PrivateName(e.swcify(ctx))
                    }
                    (MemberExprProp::Expr(e), true) => {
                        let expr = e.swcify(ctx);
                        MemberProp::Computed(ComputedPropName {
                            span: expr.span(),
                            expr,
                        })
                    }
                    _ => unreachable!(),
                },
            }
            .into(),
        }
    }
}

impl Swcify for NewExpression {
    type Output = NewExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        NewExpr {
            span: ctx.span(&self.base),
            callee: match self.callee {
                BabelCallee::V8Id(..) => {
                    unreachable!()
                }
                BabelCallee::Expr(e) => e.swcify(ctx),
            },
            args: Some(
                self.arguments
                    .swcify(ctx)
                    .into_iter()
                    .map(|v| v.expect("failed to swcify arguments"))
                    .collect(),
            ),
            type_args: self.type_parameters.swcify(ctx).map(From::from),
            ..Default::default()
        }
    }
}

impl Swcify for ObjectExpression {
    type Output = ObjectLit;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ObjectLit {
            span: ctx.span(&self.base),
            props: self.properties.swcify(ctx),
        }
    }
}

impl Swcify for ObjectExprProp {
    type Output = PropOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ObjectExprProp::Method(m) => PropOrSpread::Prop(Box::new(Prop::Method(m.swcify(ctx)))),
            ObjectExprProp::Prop(p) => PropOrSpread::Prop(Box::new(Prop::KeyValue(p.swcify(ctx)))),
            ObjectExprProp::Spread(p) => PropOrSpread::Spread(SpreadElement {
                // TODO: Use exact span
                dot3_token: ctx.span(&p.base),
                expr: p.argument.swcify(ctx),
            }),
        }
    }
}

impl Swcify for ObjectMethod {
    type Output = MethodProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        MethodProp {
            key: self.key.swcify(ctx),
            function: Box::new(Function {
                params: self.params.swcify(ctx),
                decorators: self.decorator.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: self.generator.unwrap_or(false),
                is_async: self.is_async.unwrap_or(false),
                type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
                ..Default::default()
            }),
        }
    }
}

impl Swcify for swc_estree_ast::Decorator {
    type Output = swc_ecma_ast::Decorator;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::Decorator {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for ObjectKey {
    type Output = PropName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ObjectKey::Id(v) => PropName::Ident(v.swcify(ctx).into()),
            ObjectKey::String(v) => PropName::Str(v.swcify(ctx)),
            ObjectKey::Numeric(v) => PropName::Num(v.swcify(ctx)),
            ObjectKey::Expr(v) => {
                let expr = v.swcify(ctx);
                PropName::Computed(ComputedPropName {
                    span: expr.span(),
                    expr,
                })
            }
        }
    }
}

impl Swcify for ObjectProperty {
    type Output = KeyValueProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        KeyValueProp {
            key: self.key.swcify(ctx),
            value: match self.value {
                ObjectPropVal::Pattern(pat) => match pat {
                    PatternLike::Id(i) => i.swcify(ctx).into(),
                    _ => {
                        panic!("swc does not support ObjectPropVal::Pattern({:?})", pat)
                    }
                },
                ObjectPropVal::Expr(e) => e.swcify(ctx),
            },
        }
    }
}

impl Swcify for SequenceExpression {
    type Output = SeqExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        SeqExpr {
            span: ctx.span(&self.base),
            exprs: self.expressions.swcify(ctx),
        }
    }
}

impl Swcify for ParenthesizedExpression {
    type Output = ParenExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ParenExpr {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for ThisExpression {
    type Output = ThisExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ThisExpr {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for UnaryExpression {
    type Output = UnaryExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        UnaryExpr {
            span: ctx.span(&self.base),
            op: self.operator.swcify(ctx),
            arg: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for UnaryExprOp {
    type Output = UnaryOp;

    fn swcify(self, _: &Context) -> Self::Output {
        match self {
            UnaryExprOp::Void => {
                op!("void")
            }
            UnaryExprOp::Throw => {
                panic!("swc does not support throw expressions")
            }
            UnaryExprOp::Delete => {
                op!("delete")
            }
            UnaryExprOp::LogicalNot => {
                op!("!")
            }
            UnaryExprOp::Plus => {
                op!(unary, "+")
            }
            UnaryExprOp::Negation => {
                op!(unary, "-")
            }
            UnaryExprOp::BitwiseNot => {
                op!("~")
            }
            UnaryExprOp::Typeof => {
                op!("typeof")
            }
        }
    }
}

impl Swcify for UpdateExpression {
    type Output = UpdateExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        UpdateExpr {
            span: ctx.span(&self.base),
            op: match self.operator {
                UpdateExprOp::Increment => {
                    op!("++")
                }
                UpdateExprOp::Decrement => {
                    op!("--")
                }
            },
            prefix: self.prefix,
            arg: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for ArrowFunctionExpression {
    type Output = ArrowExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ArrowExpr {
            span: ctx.span(&self.base),
            params: self.params.into_iter().map(|v| v.swcify(ctx).pat).collect(),
            body: Box::new(self.body.swcify(ctx)),
            is_async: self.is_async,
            is_generator: self.generator,
            type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
            return_type: self.return_type.swcify(ctx).flatten().map(Box::new),
            ..Default::default()
        }
    }
}

impl Swcify for ArrowFuncExprBody {
    type Output = BlockStmtOrExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ArrowFuncExprBody::Block(v) => BlockStmtOrExpr::BlockStmt(v.swcify(ctx)),
            ArrowFuncExprBody::Expr(v) => BlockStmtOrExpr::Expr(v.swcify(ctx)),
        }
    }
}

impl Swcify for ClassExpression {
    type Output = ClassExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        ClassExpr {
            ident: self.id.swcify(ctx).map(|v| v.into()),
            class: Box::new(swc_ecma_ast::Class {
                span: ctx.span(&self.base),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                body: self.body.swcify(ctx),
                super_class: self.super_class.swcify(ctx),
                is_abstract: false,
                type_params: self.type_parameters.swcify(ctx).flatten().map(Box::new),
                super_type_params: self.super_type_parameters.swcify(ctx).map(Box::new),
                implements: self.implements.swcify(ctx).unwrap_or_default(),
                ..Default::default()
            }),
        }
    }
}

impl Swcify for MetaProperty {
    type Output = MetaPropExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let meta: Ident = self.meta.swcify(ctx).into();
        let prop: Ident = self.property.swcify(ctx).into();
        match (&*meta.sym, &*prop.sym) {
            ("new", "target") => MetaPropExpr {
                kind: MetaPropKind::NewTarget,
                span: ctx.span(&self.base),
            },
            ("import", "meta") => MetaPropExpr {
                kind: MetaPropKind::NewTarget,
                span: ctx.span(&self.base),
            },
            _ => unreachable!("there are only two kind of meta prop"),
        }
    }
}

impl Swcify for swc_estree_ast::Super {
    type Output = swc_ecma_ast::Super;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::Super {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for TaggedTemplateExpression {
    type Output = TaggedTpl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TaggedTpl {
            span: ctx.span(&self.base),
            tag: self.tag.swcify(ctx),
            type_params: self.type_parameters.swcify(ctx).map(From::from),
            tpl: Box::new(self.quasi.swcify(ctx)),
            ..Default::default()
        }
    }
}

impl Swcify for TaggedTemplateExprTypeParams {
    type Output = TsTypeParamInstantiation;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TaggedTemplateExprTypeParams::Flow(_) => unimplemented!("flow types"),
            TaggedTemplateExprTypeParams::TS(v) => v.swcify(ctx),
        }
    }
}

impl Swcify for YieldExpression {
    type Output = YieldExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        YieldExpr {
            span: ctx.span(&self.base),
            arg: self.argument.swcify(ctx),
            delegate: self.delegate,
        }
    }
}

impl Swcify for AwaitExpression {
    type Output = AwaitExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        AwaitExpr {
            span: ctx.span(&self.base),
            arg: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for BabelImport {
    type Output = Import;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Import {
            span: ctx.span(&self.base),
            // TODO
            phase: Default::default(),
        }
    }
}

impl Swcify for OptionalMemberExpression {
    type Output = OptChainExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        OptChainExpr {
            span: ctx.span(&self.base),
            // TODO: Use correct span.
            optional: self.optional,
            base: Box::new(OptChainBase::Member(MemberExpr {
                span: ctx.span(&self.base),
                obj: self.object.swcify(ctx),
                prop: match (self.property, self.computed) {
                    (OptionalMemberExprProp::Id(i), false) => {
                        MemberProp::Ident(i.swcify(ctx).into())
                    }
                    (OptionalMemberExprProp::Expr(e), true) => {
                        let expr = e.swcify(ctx);
                        MemberProp::Computed(ComputedPropName {
                            span: expr.span(),
                            expr,
                        })
                    }
                    _ => unreachable!(),
                },
            })),
        }
    }
}

impl Swcify for OptionalMemberExprProp {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            OptionalMemberExprProp::Id(v) => v.swcify(ctx).into(),
            OptionalMemberExprProp::Expr(v) => v.swcify(ctx),
        }
    }
}

impl Swcify for OptionalCallExpression {
    type Output = OptChainExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        OptChainExpr {
            span: ctx.span(&self.base),
            optional: self.optional,
            base: Box::new(OptChainBase::Call(OptCall {
                span: ctx.span(&self.base),
                callee: self.callee.swcify(ctx),
                args: self.arguments.swcify(ctx).into_iter().flatten().collect(),
                type_args: self.type_parameters.swcify(ctx).map(From::from),
                ..Default::default()
            })),
        }
    }
}

impl Swcify for TypeCastExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow type cast")
    }
}

impl Swcify for swc_estree_ast::JSXElement {
    type Output = swc_ecma_ast::JSXElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXElement {
            span: ctx.span(&self.base),
            opening: self.opening_element.swcify(ctx),
            children: self.children.swcify(ctx),
            closing: self.closing_element.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXOpeningElement {
    type Output = swc_ecma_ast::JSXOpeningElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXOpeningElement {
            span: ctx.span(&self.base),
            name: self.name.swcify(ctx),
            attrs: self.attributes.swcify(ctx),
            self_closing: self.self_closing,
            type_args: None,
        }
    }
}

impl Swcify for swc_estree_ast::JSXElementName {
    type Output = swc_ecma_ast::JSXElementName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::JSXElementName::Id(v) => {
                swc_ecma_ast::JSXElementName::Ident(v.swcify(ctx))
            }
            swc_estree_ast::JSXElementName::Expr(v) => {
                swc_ecma_ast::JSXElementName::JSXMemberExpr(v.swcify(ctx))
            }
            swc_estree_ast::JSXElementName::Name(v) => {
                swc_ecma_ast::JSXElementName::JSXNamespacedName(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for JSXMemberExpression {
    type Output = JSXMemberExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        JSXMemberExpr {
            span: ctx.span(&self.base),
            obj: self.object.swcify(ctx),
            prop: self.property.swcify(ctx).into(),
        }
    }
}

impl Swcify for JSXMemberExprObject {
    type Output = JSXObject;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXMemberExprObject::Expr(e) => JSXObject::JSXMemberExpr(Box::new(e.swcify(ctx))),
            JSXMemberExprObject::Id(e) => JSXObject::Ident(e.swcify(ctx)),
        }
    }
}

impl Swcify for swc_estree_ast::JSXOpeningElAttr {
    type Output = JSXAttrOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::JSXOpeningElAttr::Attr(v) => JSXAttrOrSpread::JSXAttr(v.swcify(ctx)),
            swc_estree_ast::JSXOpeningElAttr::Spread(v) => {
                JSXAttrOrSpread::SpreadElement(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for JSXAttribute {
    type Output = JSXAttr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        JSXAttr {
            span: ctx.span(&self.base),
            name: self.name.swcify(ctx),
            value: self.value.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXAttrName {
    type Output = swc_ecma_ast::JSXAttrName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::JSXAttrName::Id(v) => {
                swc_ecma_ast::JSXAttrName::Ident(v.swcify(ctx).into())
            }
            swc_estree_ast::JSXAttrName::Name(v) => {
                swc_ecma_ast::JSXAttrName::JSXNamespacedName(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for JSXAttrVal {
    type Output = JSXAttrValue;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXAttrVal::Element(v) => JSXAttrValue::JSXElement(Box::new(v.swcify(ctx))),
            JSXAttrVal::Fragment(v) => JSXAttrValue::JSXFragment(v.swcify(ctx)),
            JSXAttrVal::String(v) => JSXAttrValue::Lit(Lit::Str(v.swcify(ctx))),
            JSXAttrVal::Expr(v) => JSXAttrValue::JSXExprContainer(v.swcify(ctx)),
        }
    }
}

impl Swcify for JSXExpressionContainer {
    type Output = JSXExprContainer;

    fn swcify(self, ctx: &Context) -> Self::Output {
        JSXExprContainer {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for JSXExprContainerExpr {
    type Output = JSXExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            JSXExprContainerExpr::Empty(v) => JSXExpr::JSXEmptyExpr(v.swcify(ctx)),
            JSXExprContainerExpr::Expr(v) => JSXExpr::Expr(v.swcify(ctx)),
        }
    }
}

impl Swcify for JSXEmptyExpression {
    type Output = JSXEmptyExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        JSXEmptyExpr {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for JSXSpreadAttribute {
    type Output = SpreadElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        SpreadElement {
            dot3_token: ctx.span(&self.base),
            expr: self.argument.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXElementChild {
    type Output = swc_ecma_ast::JSXElementChild;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_estree_ast::JSXElementChild::Text(v) => {
                swc_ecma_ast::JSXElementChild::JSXText(v.swcify(ctx))
            }
            swc_estree_ast::JSXElementChild::Expr(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
            swc_estree_ast::JSXElementChild::Spread(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
            swc_estree_ast::JSXElementChild::Element(v) => {
                swc_ecma_ast::JSXElementChild::from(Box::new(v.swcify(ctx)))
            }
            swc_estree_ast::JSXElementChild::Fragment(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for swc_estree_ast::JSXText {
    type Output = swc_ecma_ast::JSXText;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXText {
            span: ctx.span(&self.base),
            value: self.value,
            // TODO fix me
            raw: Default::default(),
        }
    }
}

impl Swcify for swc_estree_ast::JSXSpreadChild {
    type Output = swc_ecma_ast::JSXSpreadChild;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXSpreadChild {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXClosingElement {
    type Output = swc_ecma_ast::JSXClosingElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXClosingElement {
            span: ctx.span(&self.base),
            name: self.name.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXFragment {
    type Output = swc_ecma_ast::JSXFragment;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXFragment {
            span: ctx.span(&self.base),
            opening: self.opening_fragment.swcify(ctx),
            children: self.children.swcify(ctx),
            closing: self.closing_fragment.swcify(ctx),
        }
    }
}

impl Swcify for swc_estree_ast::JSXOpeningFragment {
    type Output = swc_ecma_ast::JSXOpeningFragment;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXOpeningFragment {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for swc_estree_ast::JSXClosingFragment {
    type Output = swc_ecma_ast::JSXClosingFragment;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXClosingFragment {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for BindExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support bind expressions")
    }
}

impl Swcify for DoExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support do expressions")
    }
}

impl Swcify for PipelinePrimaryTopicReference {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support `PipelinePrimaryTopicReference`")
    }
}

impl Swcify for RecordExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support record expressions")
    }
}

impl Swcify for TupleExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support tuple expressions")
    }
}

impl Swcify for ModuleExpression {
    type Output = Never;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support module expressions")
    }
}

impl Swcify for TSAsExpression {
    type Output = TsAsExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsAsExpr {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx),
        }
    }
}

impl Swcify for TSTypeAssertion {
    type Output = TsTypeAssertion;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsTypeAssertion {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
            type_ann: self.type_annotation.swcify(ctx),
        }
    }
}

impl Swcify for TSNonNullExpression {
    type Output = TsNonNullExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsNonNullExpr {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for ArrayExprEl {
    type Output = ExprOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ArrayExprEl::Spread(s) => ExprOrSpread {
                // TODO: Use correct span
                spread: Some(ctx.span(&s.base)),
                expr: s.argument.swcify(ctx),
            },
            ArrayExprEl::Expr(e) => ExprOrSpread {
                spread: None,
                expr: e.swcify(ctx),
            },
        }
    }
}
