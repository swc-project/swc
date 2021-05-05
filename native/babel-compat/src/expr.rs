use crate::{Babelify, Context};
use swc_babel_ast::{
    ArrayExprEl, ArrayExpression, ArrowFuncExprBody, ArrowFunctionExpression, AssignmentExpression,
    AwaitExpression, BinaryExprLeft, BinaryExpression, CallExpression, Callee, ClassExpression,
    ConditionalExpression, Expression, FunctionExpression, LVal, LogicalExpression, MemberExprProp,
    MemberExpression, MetaProperty, NewExpression, ObjectExprProp, ObjectExpression, ObjectKey,
    ObjectMember, ParenthesizedExpression, PrivateName, SequenceExpression,
    SpreadElement as BabelSpreadElement, Super as BabelSuper, TaggedTemplateExprTypeParams,
    TaggedTemplateExpression, TemplateElVal, TemplateElement, TemplateLiteral, TemplateLiteralExpr,
    ThisExpression, UnaryExpression, UpdateExpression, YieldExpression,
};

use serde::{Deserialize, Serialize};
use swc_common::Spanned;
use swc_ecma_ast::{
    ArrayLit, ArrowExpr, AssignExpr, AwaitExpr, BinExpr, BinaryOp, BlockStmtOrExpr, CallExpr,
    ClassExpr, CondExpr, Expr, ExprOrSpread, ExprOrSuper, FnExpr, Lit, MemberExpr, MetaPropExpr,
    NewExpr, ObjectLit, ParenExpr, PatOrExpr, PropOrSpread, SeqExpr, SpreadElement, Super,
    TaggedTpl, ThisExpr, Tpl, TplElement, UnaryExpr, UpdateExpr, YieldExpr,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExprOutput {
    Expr(Box<Expression>),
    Private(PrivateName),
}

impl Babelify for Expr {
    type Output = ExprOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Expr::This(t) => ExprOutput::Expr(Box::new(Expression::This(t.babelify(ctx)))),
            Expr::Array(a) => ExprOutput::Expr(Box::new(Expression::Array(a.babelify(ctx)))),
            Expr::Object(o) => ExprOutput::Expr(Box::new(Expression::Object(o.babelify(ctx)))),
            Expr::Fn(f) => ExprOutput::Expr(Box::new(Expression::Func(f.babelify(ctx)))),
            Expr::Unary(u) => ExprOutput::Expr(Box::new(Expression::Unary(u.babelify(ctx)))),
            Expr::Update(u) => ExprOutput::Expr(Box::new(Expression::Update(u.babelify(ctx)))),
            Expr::Bin(b) => match b.babelify(ctx) {
                BinaryOrLogicalExpr::Binary(bin) => {
                    ExprOutput::Expr(Box::new(Expression::Binary(bin)))
                }
                BinaryOrLogicalExpr::Logical(log) => {
                    ExprOutput::Expr(Box::new(Expression::Logical(log)))
                }
            },
            Expr::Assign(a) => ExprOutput::Expr(Box::new(Expression::Assignment(a.babelify(ctx)))),
            Expr::Member(m) => ExprOutput::Expr(Box::new(Expression::Member(m.babelify(ctx)))),
            Expr::Cond(c) => ExprOutput::Expr(Box::new(Expression::Conditional(c.babelify(ctx)))),
            Expr::Call(c) => ExprOutput::Expr(Box::new(Expression::Call(c.babelify(ctx)))),
            Expr::New(n) => ExprOutput::Expr(Box::new(Expression::New(n.babelify(ctx)))),
            Expr::Seq(s) => ExprOutput::Expr(Box::new(Expression::Sequence(s.babelify(ctx)))),
            Expr::Ident(i) => ExprOutput::Expr(Box::new(Expression::Id(i.babelify(ctx)))),
            Expr::Lit(lit) => {
                match lit {
                    Lit::Str(s) => {
                        ExprOutput::Expr(Box::new(Expression::StringLiteral(s.babelify(ctx))))
                    }
                    Lit::Bool(b) => {
                        ExprOutput::Expr(Box::new(Expression::BooleanLiteral(b.babelify(ctx))))
                    }
                    Lit::Null(n) => {
                        ExprOutput::Expr(Box::new(Expression::NullLiteral(n.babelify(ctx))))
                    }
                    Lit::Num(n) => {
                        ExprOutput::Expr(Box::new(Expression::NumericLiteral(n.babelify(ctx))))
                    }
                    Lit::BigInt(i) => {
                        ExprOutput::Expr(Box::new(Expression::BigIntLiteral(i.babelify(ctx))))
                    }
                    Lit::Regex(r) => {
                        ExprOutput::Expr(Box::new(Expression::RegExpLiteral(r.babelify(ctx))))
                    }
                    Lit::JSXText(_) => panic!(
                        "illegal conversion: Cannot convert {:?} to ExprOutput",
                        &lit
                    ), // TODO(dwoznicki): is this really illegal?
                }
            }
            Expr::Tpl(t) => {
                ExprOutput::Expr(Box::new(Expression::TemplateLiteral(t.babelify(ctx))))
            }
            Expr::TaggedTpl(t) => {
                ExprOutput::Expr(Box::new(Expression::TaggedTemplate(t.babelify(ctx))))
            }
            Expr::Arrow(a) => ExprOutput::Expr(Box::new(Expression::ArrowFunc(a.babelify(ctx)))),
            Expr::Class(c) => ExprOutput::Expr(Box::new(Expression::Class(c.babelify(ctx)))),
            Expr::Yield(y) => ExprOutput::Expr(Box::new(Expression::Yield(y.babelify(ctx)))),
            Expr::MetaProp(m) => ExprOutput::Expr(Box::new(Expression::MetaProp(m.babelify(ctx)))),
            Expr::Await(a) => ExprOutput::Expr(Box::new(Expression::Await(a.babelify(ctx)))),
            Expr::Paren(p) => {
                ExprOutput::Expr(Box::new(Expression::Parenthesized(p.babelify(ctx))))
            }
            Expr::JSXElement(e) => {
                ExprOutput::Expr(Box::new(Expression::JSXElement(e.babelify(ctx))))
            }
            Expr::JSXFragment(f) => {
                ExprOutput::Expr(Box::new(Expression::JSXFragment(f.babelify(ctx))))
            }
            Expr::TsTypeAssertion(a) => {
                ExprOutput::Expr(Box::new(Expression::TSTypeAssertion(a.babelify(ctx))))
            }
            Expr::TsNonNull(n) => {
                ExprOutput::Expr(Box::new(Expression::TSNonNull(n.babelify(ctx))))
            }
            Expr::TsAs(a) => ExprOutput::Expr(Box::new(Expression::TSAs(a.babelify(ctx)))),
            Expr::PrivateName(p) => ExprOutput::Private(p.babelify(ctx)),

            // TODO(dwoznicki): how does babel handle these?
            Expr::JSXMember(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivelent",
                &self
            ),
            Expr::JSXNamespacedName(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivelent",
                &self
            ),
            Expr::JSXEmpty(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivelent",
                &self
            ),
            Expr::TsConstAssertion(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivelent",
                &self
            ),
            Expr::OptChain(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivelent",
                &self
            ),
            Expr::Invalid(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ExprOutput - babel has no equivilent",
                &self
            ),
        }
    }
}

impl From<ExprOutput> for Expression {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Expr(expr) => *expr,
            ExprOutput::Private(_) => panic!(
                "illegal conversion: Cannot convert {:?} to Expression - babel has no equivilent",
                &o
            ),
        }
    }
}

impl From<ExprOutput> for BinaryExprLeft {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Expr(e) => BinaryExprLeft::Expr(e),
            ExprOutput::Private(p) => BinaryExprLeft::Private(p),
        }
    }
}

impl From<ExprOutput> for ObjectKey {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Expr(e) => match *e {
                Expression::Id(i) => ObjectKey::Id(i),
                Expression::StringLiteral(s) => ObjectKey::String(s),
                Expression::NumericLiteral(n) => ObjectKey::Numeric(n),
                _ => ObjectKey::Expr(e),
            },
            ExprOutput::Private(_) => panic!(
                "illegal conversion: Cannot convert {:?} to ObjectKey - babel has no equivilent",
                &o
            ),
        }
    }
}

impl From<ExprOutput> for MemberExprProp {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Private(p) => MemberExprProp::PrivateName(p),
            ExprOutput::Expr(e) => match *e {
                Expression::Id(i) => MemberExprProp::Id(i),
                _ => MemberExprProp::Expr(e),
            },
        }
    }
}

impl Babelify for ThisExpr {
    type Output = ThisExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ThisExpression {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for ArrayLit {
    type Output = ArrayExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrayExpression {
            base: ctx.base(self.span),
            elements: self
                .elems
                .iter()
                .map(|opt| opt.as_ref().map(|el| el.clone().babelify(ctx)))
                .collect(),
        }
    }
}

impl Babelify for ObjectLit {
    type Output = ObjectExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectExpression {
            base: ctx.base(self.span),
            properties: self
                .props
                .iter()
                .map(|prop| prop.clone().babelify(ctx))
                .collect(),
        }
    }
}

impl Babelify for PropOrSpread {
    type Output = ObjectExprProp;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            PropOrSpread::Spread(s) => ObjectExprProp::Spread(s.babelify(ctx)),
            PropOrSpread::Prop(prop) => {
                let memb = prop.babelify(ctx);
                match memb {
                    ObjectMember::Method(m) => ObjectExprProp::Method(m),
                    ObjectMember::Prop(p) => ObjectExprProp::Prop(p),
                }
            }
        }
    }
}

impl Babelify for SpreadElement {
    type Output = BabelSpreadElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelSpreadElement {
            base: ctx.base(self.span()),
            argument: Box::new(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for UnaryExpr {
    type Output = UnaryExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        UnaryExpression {
            base: ctx.base(self.span),
            operator: self.op.babelify(ctx),
            argument: Box::new(self.arg.babelify(ctx).into()),
            prefix: true,
        }
    }
}

impl Babelify for UpdateExpr {
    type Output = UpdateExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        UpdateExpression {
            base: ctx.base(self.span),
            operator: self.op.babelify(ctx),
            prefix: self.prefix,
            argument: Box::new(self.arg.babelify(ctx).into()),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum BinaryOrLogicalExpr {
    Binary(BinaryExpression),
    Logical(LogicalExpression),
}

impl Babelify for BinExpr {
    type Output = BinaryOrLogicalExpr;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self.op {
            BinaryOp::LogicalOr | BinaryOp::LogicalAnd | BinaryOp::NullishCoalescing => {
                BinaryOrLogicalExpr::Logical(LogicalExpression {
                    base: ctx.base(self.span),
                    operator: self.op.babelify(ctx).into(),
                    left: Box::new(self.left.babelify(ctx).into()),
                    right: Box::new(self.right.babelify(ctx).into()),
                })
            }
            _ => BinaryOrLogicalExpr::Binary(BinaryExpression {
                base: ctx.base(self.span),
                operator: self.op.babelify(ctx).into(),
                left: Box::new(self.left.babelify(ctx).into()),
                right: Box::new(self.right.babelify(ctx).into()),
            }),
        }

        // BinaryExpression {
        //     base: ctx.base(self.span),
        //     operator: self.op.babelify(ctx).into(),
        //     left: Box::new(self.left.babelify(ctx).into()),
        //     right: Box::new(self.right.babelify(ctx).into()),
        // }
    }
}

impl Babelify for FnExpr {
    type Output = FunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        FunctionExpression {
            id: self.ident.map(|id| id.babelify(ctx)),
            ..self.function.babelify(ctx)
        }
    }
}

impl Babelify for ClassExpr {
    type Output = ClassExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ClassExpression {
            id: self.ident.map(|id| id.babelify(ctx)),
            ..self.class.babelify(ctx)
        }
    }
}

impl Babelify for AssignExpr {
    type Output = AssignmentExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        AssignmentExpression {
            base: ctx.base(self.span),
            operator: self.op.as_str().into(),
            left: Box::new(self.left.babelify(ctx)),
            right: Box::new(self.right.babelify(ctx).into()),
        }
    }
}

impl Babelify for MemberExpr {
    type Output = MemberExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        MemberExpression {
            base: ctx.base(self.span),
            object: Box::new(self.obj.babelify(ctx)),
            property: Box::new(self.prop.babelify(ctx).into()),
            computed: self.computed,
            optional: Default::default(),
        }
    }
}

impl Babelify for CondExpr {
    type Output = ConditionalExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ConditionalExpression {
            base: ctx.base(self.span),
            test: Box::new(self.test.babelify(ctx).into()),
            consequent: Box::new(self.cons.babelify(ctx).into()),
            alternate: Box::new(self.alt.babelify(ctx).into()),
        }
    }
}

impl Babelify for CallExpr {
    type Output = CallExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        CallExpression {
            base: ctx.base(self.span),
            callee: Box::new(self.callee.babelify(ctx).into()),
            arguments: self
                .args
                .iter()
                .map(|arg| arg.clone().babelify(ctx).into())
                .collect(),
            type_parameters: self.type_args.map(|t| t.babelify(ctx)),
            type_arguments: Default::default(),
            optional: Default::default(),
        }
    }
}

impl Babelify for NewExpr {
    type Output = NewExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        NewExpression {
            base: ctx.base(self.span),
            callee: Callee::Expr(Box::new(self.callee.babelify(ctx).into())),
            arguments: match self.args {
                Some(args) => args
                    .iter()
                    .map(|arg| arg.clone().babelify(ctx).into())
                    .collect(),
                None => vec![],
            },
            type_parameters: self.type_args.map(|t| t.babelify(ctx)),
            type_arguments: Default::default(),
            optional: Default::default(),
        }
    }
}

impl Babelify for SeqExpr {
    type Output = SequenceExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        SequenceExpression {
            base: ctx.base(self.span),
            expressions: self
                .exprs
                .iter()
                .map(|expr| Box::new(expr.clone().babelify(ctx).into()))
                .collect(),
        }
    }
}

impl Babelify for ArrowExpr {
    type Output = ArrowFunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrowFunctionExpression {
            base: ctx.base(self.span),
            params: self
                .params
                .iter()
                .map(|p| p.clone().babelify(ctx).into())
                .collect(),
            body: Box::new(self.body.babelify(ctx)),
            is_async: self.is_async,
            generator: self.is_generator,
            expression: Default::default(),
            type_parameters: self.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.return_type.map(|t| Box::new(t.babelify(ctx).into())),
        }
    }
}

impl Babelify for YieldExpr {
    type Output = YieldExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        YieldExpression {
            base: ctx.base(self.span),
            argument: self.arg.map(|a| Box::new(a.babelify(ctx).into())),
            delegate: self.delegate,
        }
    }
}

impl Babelify for MetaPropExpr {
    type Output = MetaProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        MetaProperty {
            base: ctx.base(self.span()),
            meta: self.meta.babelify(ctx),
            property: self.prop.babelify(ctx),
        }
    }
}

impl Babelify for AwaitExpr {
    type Output = AwaitExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        AwaitExpression {
            base: ctx.base(self.span),
            argument: Box::new(self.arg.babelify(ctx).into()),
        }
    }
}

impl Babelify for Tpl {
    type Output = TemplateLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TemplateLiteral {
            base: ctx.base(self.span),
            expressions: self
                .exprs
                .iter()
                .map(|e| TemplateLiteralExpr::Expr(Box::new(e.clone().babelify(ctx).into())))
                .collect(),
            quasis: self
                .quasis
                .iter()
                .map(|q| q.clone().babelify(ctx))
                .collect(),
        }
    }
}

impl Babelify for TaggedTpl {
    type Output = TaggedTemplateExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TaggedTemplateExpression {
            base: ctx.base(self.span),
            tag: Box::new(self.tag.babelify(ctx).into()),
            quasi: self.tpl.babelify(ctx),
            type_parameters: self
                .type_params
                .map(|t| TaggedTemplateExprTypeParams::TS(t.babelify(ctx))),
        }
    }
}

impl Babelify for TplElement {
    type Output = TemplateElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        TemplateElement {
            base: ctx.base(self.span),
            tail: self.tail,
            value: TemplateElVal {
                raw: self.raw.value,
                cooked: self.cooked.map(|s| s.value),
            },
        }
    }
}

impl Babelify for ParenExpr {
    type Output = ParenthesizedExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ParenthesizedExpression {
            base: ctx.base(self.span),
            expression: Box::new(self.expr.babelify(ctx).into()),
        }
    }
}

impl Babelify for ExprOrSuper {
    type Output = Expression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ExprOrSuper::Expr(e) => e.babelify(ctx).into(),
            ExprOrSuper::Super(s) => Expression::Super(s.babelify(ctx)),
        }
    }
}

impl Babelify for Super {
    type Output = BabelSuper;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelSuper {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for ExprOrSpread {
    type Output = ArrayExprEl;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self.spread {
            Some(_) => ArrayExprEl::Spread(BabelSpreadElement {
                base: ctx.base(self.span()),
                argument: Box::new(self.expr.babelify(ctx).into()),
            }),
            None => ArrayExprEl::Expr(Box::new(self.expr.babelify(ctx).into())),
        }
    }
}

impl Babelify for BlockStmtOrExpr {
    type Output = ArrowFuncExprBody;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            BlockStmtOrExpr::BlockStmt(b) => ArrowFuncExprBody::Block(b.babelify(ctx)),
            BlockStmtOrExpr::Expr(e) => ArrowFuncExprBody::Expr(Box::new(e.babelify(ctx).into())),
        }
    }
}

impl Babelify for PatOrExpr {
    type Output = LVal;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            PatOrExpr::Expr(e) => match *e {
                Expr::Ident(i) => LVal::Id(i.babelify(ctx)),
                Expr::Member(me) => LVal::MemberExpr(me.babelify(ctx)),
                _ => panic!("illegal conversion: Cannot convert {:?} to LVal", &e),
            },
            PatOrExpr::Pat(p) => p.babelify(ctx).into(),
        }
    }
}

// NOTE: OptChainExpr does not appear to have an official Babel AST node yet.

// #[ast_node("OptionalChainingExpression")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct OptChainExpr {
//     pub span: Span,
//     pub question_dot_token: Span,
//     pub expr: Box<Expr>,
// }
//
