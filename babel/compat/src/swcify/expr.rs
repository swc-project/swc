use crate::swcify::Swcify;
use swc_atoms::js_word;
use swc_babel_ast::Arg;
use swc_babel_ast::ArrayExprEl;
use swc_babel_ast::ArrayExpression;
use swc_babel_ast::ArrowFuncExprBody;
use swc_babel_ast::ArrowFunctionExpression;
use swc_babel_ast::AssignmentExpression;
use swc_babel_ast::AwaitExpression;
use swc_babel_ast::BinaryExprLeft;
use swc_babel_ast::BinaryExprOp;
use swc_babel_ast::BinaryExpression;
use swc_babel_ast::BindExpression;
use swc_babel_ast::CallExpression;
use swc_babel_ast::Callee;
use swc_babel_ast::ClassExpression;
use swc_babel_ast::ConditionalExpression;
use swc_babel_ast::DoExpression;
use swc_babel_ast::Expression;
use swc_babel_ast::FunctionExpression;
use swc_babel_ast::Identifier;
use swc_babel_ast::Import;
use swc_babel_ast::JSXAttrVal;
use swc_babel_ast::JSXAttribute;
use swc_babel_ast::JSXEmptyExpression;
use swc_babel_ast::JSXExprContainerExpr;
use swc_babel_ast::JSXExpressionContainer;
use swc_babel_ast::JSXMemberExprObject;
use swc_babel_ast::JSXMemberExpression;
use swc_babel_ast::JSXSpreadAttribute;
use swc_babel_ast::LogicalExprOp;
use swc_babel_ast::LogicalExpression;
use swc_babel_ast::MemberExprProp;
use swc_babel_ast::MemberExpression;
use swc_babel_ast::MetaProperty;
use swc_babel_ast::ModuleExpression;
use swc_babel_ast::NewExpression;
use swc_babel_ast::ObjectExprProp;
use swc_babel_ast::ObjectExpression;
use swc_babel_ast::ObjectKey;
use swc_babel_ast::ObjectMethod;
use swc_babel_ast::ObjectPropVal;
use swc_babel_ast::ObjectProperty;
use swc_babel_ast::OptionalCallExpression;
use swc_babel_ast::OptionalMemberExprProp;
use swc_babel_ast::OptionalMemberExpression;
use swc_babel_ast::ParenthesizedExpression;
use swc_babel_ast::PatternLike;
use swc_babel_ast::PipelinePrimaryTopicReference;
use swc_babel_ast::RecordExpression;
use swc_babel_ast::SequenceExpression;
use swc_babel_ast::TSAsExpression;
use swc_babel_ast::TSNonNullExpression;
use swc_babel_ast::TSTypeAssertion;
use swc_babel_ast::TaggedTemplateExprTypeParams;
use swc_babel_ast::TaggedTemplateExpression;
use swc_babel_ast::ThisExpression;
use swc_babel_ast::TupleExpression;
use swc_babel_ast::TypeCastExpression;
use swc_babel_ast::UnaryExprOp;
use swc_babel_ast::UnaryExpression;
use swc_babel_ast::UpdateExprOp;
use swc_babel_ast::UpdateExpression;
use swc_babel_ast::YieldExpression;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::op;
use swc_ecma_ast::ArrayLit;
use swc_ecma_ast::ArrowExpr;
use swc_ecma_ast::AssignExpr;
use swc_ecma_ast::AwaitExpr;
use swc_ecma_ast::BinExpr;
use swc_ecma_ast::BinaryOp;
use swc_ecma_ast::BindingIdent;
use swc_ecma_ast::BlockStmtOrExpr;
use swc_ecma_ast::CallExpr;
use swc_ecma_ast::ClassExpr;
use swc_ecma_ast::ComputedPropName;
use swc_ecma_ast::CondExpr;
use swc_ecma_ast::Expr;
use swc_ecma_ast::ExprOrSpread;
use swc_ecma_ast::ExprOrSuper;
use swc_ecma_ast::FnExpr;
use swc_ecma_ast::Function;
use swc_ecma_ast::Ident;
use swc_ecma_ast::JSXAttr;
use swc_ecma_ast::JSXAttrOrSpread;
use swc_ecma_ast::JSXAttrValue;
use swc_ecma_ast::JSXEmptyExpr;
use swc_ecma_ast::JSXExpr;
use swc_ecma_ast::JSXExprContainer;
use swc_ecma_ast::JSXMemberExpr;
use swc_ecma_ast::JSXObject;
use swc_ecma_ast::KeyValueProp;
use swc_ecma_ast::Lit;
use swc_ecma_ast::MemberExpr;
use swc_ecma_ast::MetaPropExpr;
use swc_ecma_ast::MethodProp;
use swc_ecma_ast::NewExpr;
use swc_ecma_ast::ObjectLit;
use swc_ecma_ast::OptChainExpr;
use swc_ecma_ast::ParenExpr;
use swc_ecma_ast::PatOrExpr;
use swc_ecma_ast::Prop;
use swc_ecma_ast::PropName;
use swc_ecma_ast::PropOrSpread;
use swc_ecma_ast::SeqExpr;
use swc_ecma_ast::SpreadElement;
use swc_ecma_ast::TaggedTpl;
use swc_ecma_ast::ThisExpr;
use swc_ecma_ast::TsAsExpr;
use swc_ecma_ast::TsNonNullExpr;
use swc_ecma_ast::TsTypeAssertion;
use swc_ecma_ast::TsTypeParamInstantiation;
use swc_ecma_ast::UnaryExpr;
use swc_ecma_ast::UnaryOp;
use swc_ecma_ast::UpdateExpr;
use swc_ecma_ast::YieldExpr;

use super::Context;

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
            Expression::StringLiteral(e) => e.swcify(ctx).into(),
            Expression::NumericLiteral(e) => e.swcify(ctx).into(),
            Expression::NullLiteral(e) => Lit::from(e.swcify(ctx)).into(),
            Expression::BooleanLiteral(e) => Lit::from(e.swcify(ctx)).into(),
            Expression::RegExpLiteral(e) => Lit::from(e.swcify(ctx)).into(),
            Expression::Logical(e) => e.swcify(ctx).into(),
            Expression::Member(e) => e.swcify(ctx).into(),
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
            Expression::BigIntLiteral(e) => Expr::Lit(e.swcify(ctx).into()),
            Expression::OptionalMember(e) => e.swcify(ctx).into(),
            Expression::OptionalCall(e) => e.swcify(ctx).into(),
            Expression::JSXElement(e) => Box::new(e.swcify(ctx)).into(),
            Expression::JSXFragment(e) => e.swcify(ctx).into(),
            Expression::DecimalLiteral(e) => e.swcify(ctx).into(),
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
            left: PatOrExpr::Pat(Box::new(self.left.swcify(ctx))),
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

impl Swcify for swc_babel_ast::PrivateName {
    type Output = swc_ecma_ast::PrivateName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateName {
            span: ctx.span(&self.base),
            id: self.id.swcify(ctx).id,
        }
    }
}

impl Swcify for BinaryExprLeft {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            BinaryExprLeft::Private(e) => Box::new(Expr::PrivateName(e.swcify(ctx))),
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

impl Swcify for Callee {
    type Output = ExprOrSuper;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Callee::V8Id(_) => {
                unreachable!("what is v8 id?")
            }
            Callee::Expr(e) => match *e {
                Expression::Super(s) => ExprOrSuper::Super(s.swcify(ctx)),
                _ => ExprOrSuper::Expr(e.swcify(ctx)),
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
            type_args: self.type_parameters.swcify(ctx),
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
                expr: Box::new(Expr::JSXNamespacedName(e.swcify(ctx))),
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
            ident: self.id.swcify(ctx).map(|v| v.id),
            function: Function {
                params: self.params.swcify(ctx),
                decorators: Default::default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: self.generator.unwrap_or(false),
                is_async: self.is_async.unwrap_or(false),
                type_params: self.type_parameters.swcify(ctx).flatten(),
                return_type: self.return_type.swcify(ctx).flatten(),
            },
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
            },
            type_ann: self.type_annotation.swcify(ctx).flatten(),
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
    type Output = MemberExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        MemberExpr {
            span: ctx.span(&self.base),
            obj: match *self.object {
                Expression::Super(s) => ExprOrSuper::Super(s.swcify(ctx)),
                _ => ExprOrSuper::Expr(self.object.swcify(ctx)),
            },
            prop: self.property.swcify(ctx),
            computed: self.computed,
        }
    }
}

impl Swcify for MemberExprProp {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            MemberExprProp::Id(i) => Box::new(Expr::Ident(i.swcify(ctx).id)),
            MemberExprProp::PrivateName(e) => Box::new(Expr::PrivateName(e.swcify(ctx))),
            MemberExprProp::Expr(e) => e.swcify(ctx),
        }
    }
}

impl Swcify for NewExpression {
    type Output = NewExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        NewExpr {
            span: ctx.span(&self.base),
            callee: match self.callee {
                Callee::V8Id(..) => {
                    unreachable!()
                }
                Callee::Expr(e) => e.swcify(ctx),
            },
            args: Some(
                self.arguments
                    .swcify(ctx)
                    .into_iter()
                    .map(|v| v.expect("failed to swcify arguemnts"))
                    .collect(),
            ),
            type_args: self.type_parameters.swcify(ctx),
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
            function: Function {
                params: self.params.swcify(ctx),
                decorators: self.decorator.swcify(ctx).unwrap_or_default(),
                span: ctx.span(&self.base),
                body: Some(self.body.swcify(ctx)),
                is_generator: self.generator.unwrap_or(false),
                is_async: self.is_async.unwrap_or(false),
                type_params: self.type_parameters.swcify(ctx).flatten(),
                return_type: self.return_type.swcify(ctx).flatten(),
            },
        }
    }
}

impl Swcify for swc_babel_ast::Decorator {
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
            ObjectKey::Id(v) => PropName::Ident(v.swcify(ctx).id),
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
                    PatternLike::Id(i) => Box::new(Expr::Ident(i.swcify(ctx).id)),
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
            body: self.body.swcify(ctx),
            is_async: self.is_async,
            is_generator: self.generator,
            type_params: self.type_parameters.swcify(ctx).flatten(),
            return_type: self.return_type.swcify(ctx).flatten(),
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
            ident: self.id.swcify(ctx).map(|v| v.id),
            class: swc_ecma_ast::Class {
                span: ctx.span(&self.base),
                decorators: self.decorators.swcify(ctx).unwrap_or_default(),
                body: self.body.swcify(ctx),
                super_class: self.super_class.swcify(ctx),
                is_abstract: false,
                type_params: self.type_parameters.swcify(ctx).flatten(),
                super_type_params: self.super_type_parameters.swcify(ctx),
                implements: self.implements.swcify(ctx).unwrap_or_default(),
            },
        }
    }
}

impl Swcify for MetaProperty {
    type Output = MetaPropExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        MetaPropExpr {
            meta: self.meta.swcify(ctx).id,
            prop: self.property.swcify(ctx).id,
        }
    }
}

impl Swcify for swc_babel_ast::Super {
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
            type_params: self.type_parameters.swcify(ctx),
            tpl: self.quasi.swcify(ctx),
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

impl Swcify for Import {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("import expression")
    }
}

impl Swcify for OptionalMemberExpression {
    type Output = OptChainExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        OptChainExpr {
            span: ctx.span(&self.base),
            // TODO: Use correct span.
            question_dot_token: DUMMY_SP,
            expr: Box::new(Expr::Member(MemberExpr {
                span: ctx.span(&self.base),
                obj: match *self.object {
                    Expression::Super(s) => ExprOrSuper::Super(s.swcify(ctx)),
                    _ => ExprOrSuper::Expr(self.object.swcify(ctx)),
                },
                prop: self.property.swcify(ctx),
                computed: self.computed,
            })),
        }
    }
}

impl Swcify for OptionalMemberExprProp {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            OptionalMemberExprProp::Id(v) => Box::new(Expr::Ident(v.swcify(ctx).id)),
            OptionalMemberExprProp::Expr(v) => v.swcify(ctx),
        }
    }
}

impl Swcify for OptionalCallExpression {
    type Output = OptChainExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        OptChainExpr {
            span: ctx.span(&self.base),
            // TODO: Use correct span.
            question_dot_token: DUMMY_SP,
            expr: Box::new(Expr::Call(CallExpr {
                span: ctx.span(&self.base),
                callee: match *self.callee {
                    Expression::Super(s) => ExprOrSuper::Super(s.swcify(ctx)),
                    _ => ExprOrSuper::Expr(self.callee.swcify(ctx)),
                },
                args: self.arguments.swcify(ctx).into_iter().flatten().collect(),
                type_args: self.type_parameters.swcify(ctx),
            })),
        }
    }
}

impl Swcify for TypeCastExpression {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        unimplemented!("flow type cast")
    }
}

impl Swcify for swc_babel_ast::JSXElement {
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

impl Swcify for swc_babel_ast::JSXOpeningElement {
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

impl Swcify for swc_babel_ast::JSXElementName {
    type Output = swc_ecma_ast::JSXElementName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::JSXElementName::Id(v) => {
                swc_ecma_ast::JSXElementName::Ident(v.swcify(ctx))
            }
            swc_babel_ast::JSXElementName::Expr(v) => {
                swc_ecma_ast::JSXElementName::JSXMemberExpr(v.swcify(ctx))
            }
            swc_babel_ast::JSXElementName::Name(v) => {
                swc_ecma_ast::JSXElementName::JSXNamespacedName(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for JSXMemberExpression {
    type Output = JSXMemberExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        JSXMemberExpr {
            obj: self.object.swcify(ctx),
            prop: self.property.swcify(ctx),
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

impl Swcify for swc_babel_ast::JSXOpeningElAttr {
    type Output = JSXAttrOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::JSXOpeningElAttr::Attr(v) => JSXAttrOrSpread::JSXAttr(v.swcify(ctx)),
            swc_babel_ast::JSXOpeningElAttr::Spread(v) => {
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

impl Swcify for swc_babel_ast::JSXAttrName {
    type Output = swc_ecma_ast::JSXAttrName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::JSXAttrName::Id(v) => swc_ecma_ast::JSXAttrName::Ident(v.swcify(ctx)),
            swc_babel_ast::JSXAttrName::Name(v) => {
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

impl Swcify for swc_babel_ast::JSXElementChild {
    type Output = swc_ecma_ast::JSXElementChild;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            swc_babel_ast::JSXElementChild::Text(v) => {
                swc_ecma_ast::JSXElementChild::JSXText(v.swcify(ctx))
            }
            swc_babel_ast::JSXElementChild::Expr(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
            swc_babel_ast::JSXElementChild::Spread(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
            swc_babel_ast::JSXElementChild::Element(v) => {
                swc_ecma_ast::JSXElementChild::from(Box::new(v.swcify(ctx)))
            }
            swc_babel_ast::JSXElementChild::Fragment(v) => {
                swc_ecma_ast::JSXElementChild::from(v.swcify(ctx))
            }
        }
    }
}

impl Swcify for swc_babel_ast::JSXText {
    type Output = swc_ecma_ast::JSXText;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXText {
            span: ctx.span(&self.base),
            value: self.value,
            raw: js_word!(""),
        }
    }
}

impl Swcify for swc_babel_ast::JSXSpreadChild {
    type Output = swc_ecma_ast::JSXSpreadChild;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXSpreadChild {
            span: ctx.span(&self.base),
            expr: self.expression.swcify(ctx),
        }
    }
}

impl Swcify for swc_babel_ast::JSXClosingElement {
    type Output = swc_ecma_ast::JSXClosingElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXClosingElement {
            span: ctx.span(&self.base),
            name: self.name.swcify(ctx),
        }
    }
}

impl Swcify for swc_babel_ast::JSXFragment {
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

impl Swcify for swc_babel_ast::JSXOpeningFragment {
    type Output = swc_ecma_ast::JSXOpeningFragment;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXOpeningFragment {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for swc_babel_ast::JSXClosingFragment {
    type Output = swc_ecma_ast::JSXClosingFragment;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::JSXClosingFragment {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for BindExpression {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support bind expressions")
    }
}

impl Swcify for DoExpression {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support do expressions")
    }
}

impl Swcify for PipelinePrimaryTopicReference {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support `PipelinePrimaryTopicReference`")
    }
}

impl Swcify for RecordExpression {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support record expressions")
    }
}

impl Swcify for TupleExpression {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        panic!("swc does not support tuple expressions")
    }
}

impl Swcify for ModuleExpression {
    type Output = !;

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
