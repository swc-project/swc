use super::Context;
use crate::ast::{
    common::{
        SpreadElement as BabelSpreadElement, PrivateName, LVal, Arg, MetaProperty,
    },
    expr::{
        Expression, ThisExpression, ArrayExpression, ArrayExprEl, ObjectExpression, ObjectExprProp,
        UnaryExpression, UpdateExpression, BinaryExpression, BinaryExprLeft, FunctionExpression,
        ClassExpression, AssignmentExpression, MemberExpression, Super as BabelSuper,
        MemberExprProp, ConditionalExpression, CallExpression, NewExpression, SequenceExpression,
        ArrowFunctionExpression, ArrowFuncExprBody, YieldExpression, AwaitExpression,
        TaggedTemplateExpression, TaggedTemplateExprTypeParams, ParenthesizedExpression, Callee,
    },
    jsx::{JSXSpreadAttribute},
    lit::{TemplateLiteral, TemplateLiteralExpr, TemplateElement, TemplateElVal},
    object::{ObjectKey, ObjectMember},
};
use crate::convert::Babelify;
use swc_ecma_ast::{
    Expr, ThisExpr, ArrayLit, ObjectLit, FnExpr, UnaryExpr, UpdateExpr, BinExpr, AssignExpr,
    MemberExpr, CondExpr, CallExpr, NewExpr, SeqExpr, Tpl, TaggedTpl, ArrowExpr, ClassExpr,
    YieldExpr, AwaitExpr, ParenExpr, ExprOrSpread, PropOrSpread, SpreadElement, PatOrExpr,
    ExprOrSuper, Super, BlockStmtOrExpr, MetaPropExpr, TplElement, Lit,
};
use swc_common::Spanned;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ExprOutput {
    Expr(Expression),
    Private(PrivateName),
}

impl Babelify for Expr {
    type Output = ExprOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Expr::This(t) => ExprOutput::Expr(Expression::This(t.babelify(ctx))),
            Expr::Array(a) => ExprOutput::Expr(Expression::Array(a.babelify(ctx))),
            Expr::Object(o) => ExprOutput::Expr(Expression::Object(o.babelify(ctx))),
            Expr::Fn(f) => ExprOutput::Expr(Expression::Func(f.babelify(ctx))),
            Expr::Unary(u) => ExprOutput::Expr(Expression::Unary(u.babelify(ctx))),
            Expr::Update(u) => ExprOutput::Expr(Expression::Update(u.babelify(ctx))),
            Expr::Bin(b) => ExprOutput::Expr(Expression::Binary(b.babelify(ctx))),
            Expr::Assign(a) => ExprOutput::Expr(Expression::Assignment(a.babelify(ctx))),
            Expr::Member(m) => ExprOutput::Expr(Expression::Member(m.babelify(ctx))),
            Expr::Cond(c) => ExprOutput::Expr(Expression::Conditional(c.babelify(ctx))),
            Expr::Call(c) => ExprOutput::Expr(Expression::Call(c.babelify(ctx))),
            Expr::New(n) => ExprOutput::Expr(Expression::New(n.babelify(ctx))),
            Expr::Seq(s) => ExprOutput::Expr(Expression::Sequence(s.babelify(ctx))),
            Expr::Ident(i) => ExprOutput::Expr(Expression::Id(i.babelify(ctx))),
            Expr::Lit(lit) => {
                match lit {
                    Lit::Str(s) => ExprOutput::Expr(Expression::StringLiteral(s.babelify(ctx))),
                    Lit::Bool(b) => ExprOutput::Expr(Expression::BooleanLiteral(b.babelify(ctx))),
                    Lit::Null(n) => ExprOutput::Expr(Expression::NullLiteral(n.babelify(ctx))),
                    Lit::Num(n) => ExprOutput::Expr(Expression::NumericLiteral(n.babelify(ctx))),
                    Lit::BigInt(i) => ExprOutput::Expr(Expression::BigIntLiteral(i.babelify(ctx))),
                    Lit::Regex(r) => ExprOutput::Expr(Expression::RegExpLiteral(r.babelify(ctx))),
                    Lit::JSXText(_) => panic!("illegal conversion"), // TODO(dwoznicki): is this really illegal?
                }
            },
            Expr::Tpl(t) => ExprOutput::Expr(Expression::TemplateLiteral(t.babelify(ctx))),
            Expr::TaggedTpl(t) => ExprOutput::Expr(Expression::TaggedTemplate(t.babelify(ctx))),
            Expr::Arrow(a) => ExprOutput::Expr(Expression::ArrowFunc(a.babelify(ctx))),
            Expr::Class(c) => ExprOutput::Expr(Expression::Class(c.babelify(ctx))),
            Expr::Yield(y) => ExprOutput::Expr(Expression::Yield(y.babelify(ctx))),
            Expr::MetaProp(m) => ExprOutput::Expr(Expression::MetaProp(m.babelify(ctx))),
            Expr::Await(a) => ExprOutput::Expr(Expression::Await(a.babelify(ctx))),
            Expr::Paren(p) => ExprOutput::Expr(Expression::Parenthesized(p.babelify(ctx))),
            // TODO(dwoznicki): how does babel handle these?
            Expr::JSXMember(_) => panic!("unimplemented"), // MemberExpression?
            Expr::JSXNamespacedName(_) => panic!("unimplemented"), // ?
            Expr::JSXEmpty(_) => panic!("unimplemented"), // ?
            Expr::JSXElement(e) => ExprOutput::Expr(Expression::JSXElement(e.babelify(ctx))),
            Expr::JSXFragment(f) => ExprOutput::Expr(Expression::JSXFragment(f.babelify(ctx))),
            Expr::TsTypeAssertion(a) => ExprOutput::Expr(Expression::TSTypeAssertion(a.babelify(ctx))),
            Expr::TsConstAssertion(_) => panic!("unimplemented"), // Babel has no equivilent
            Expr::TsNonNull(n) => ExprOutput::Expr(Expression::TSNonNull(n.babelify(ctx))),
            Expr::TsAs(a) => ExprOutput::Expr(Expression::TSAs(a.babelify(ctx))),
            Expr::PrivateName(p) => ExprOutput::Private(p.babelify(ctx)),
            Expr::OptChain(_) => panic!("unimplemented"), // Babel has no equivilent
            Expr::Invalid(_) => panic!("illegal conversion"), // Babel has no equivilent
        }
    }
}

impl From<ExprOutput> for Expression {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Private(_) => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
            ExprOutput::Expr(expr) => expr,
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
            ExprOutput::Expr(e) => ObjectKey::Expr(e),
            _ => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
        }
    }
}

impl From<ExprOutput> for MemberExprProp {
    fn from(o: ExprOutput) -> Self {
        match o {
            ExprOutput::Private(p) => MemberExprProp::PrivateName(p),
            ExprOutput::Expr(e) => {
                match e {
                    Expression::Id(i) => MemberExprProp::Id(i),
                    _ => MemberExprProp::Expr(e),
                }
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
            elements: self.elems.iter().map(|opt| opt.as_ref().map(|el| el.clone().babelify(ctx))).collect(), // TODO(dwoznicki): is clone() best solution?
        }
    }
}

impl Babelify for ObjectLit {
    type Output = ObjectExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectExpression {
            base: ctx.base(self.span),
            properties: self.props.iter().map(|prop| prop.clone().babelify(ctx)).collect(),
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
            },
        }
    }
}

impl Babelify for SpreadElement {
    type Output = BabelSpreadElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelSpreadElement {
            base: ctx.base(self.span()),
            argument: self.expr.babelify(ctx).into(),
        }
    }
}

impl From<BabelSpreadElement> for JSXSpreadAttribute {
    fn from(spread: BabelSpreadElement) -> Self {
        JSXSpreadAttribute {
            base: spread.base.clone(),
            argument: spread.argument.clone(),
        }
    }
}

impl Babelify for UnaryExpr {
    type Output = UnaryExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        UnaryExpression {
            base: ctx.base(self.span),
            operator: self.op.babelify(ctx), // TODO(dwoznicki): missing `throw` op
            argument: Box::new(self.arg.babelify(ctx).into()),
            prefix: Default::default(),
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

impl Babelify for BinExpr {
    type Output = BinaryExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BinaryExpression {
            base: ctx.base(self.span),
            operator: self.op.babelify(ctx).into(),
            left: Box::new(self.left.babelify(ctx).into()),
            right: Box::new(self.right.babelify(ctx).into()),
        }
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
            operator: self.op.to_string(),
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
            arguments: self.args.iter().map(|arg| arg.clone().babelify(ctx).into()).collect(),
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
            callee: Box::new(Callee::Expr(self.callee.babelify(ctx).into())),
            arguments: match self.args {
                Some(args) => args.iter().map(|arg| arg.clone().babelify(ctx).into()).collect(),
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
            expressions: self.exprs.iter().map(|expr| expr.clone().babelify(ctx).into()).collect(),
        }
    }
}

impl Babelify for ArrowExpr {
    type Output = ArrowFunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrowFunctionExpression {
            base: ctx.base(self.span),
            params: self.params.iter().map(|p| p.clone().babelify(ctx).into()).collect(),
            body: Box::new(self.body.babelify(ctx)),
            is_async: self.is_async,
            generator: self.is_generator,
            expression: Default::default(),
            type_parameters: self.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.return_type.map(|t| t.babelify(ctx).into()),
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
            expressions: self.exprs.iter().map(|e| {
                TemplateLiteralExpr::Expr(e.clone().babelify(ctx).into())
            }).collect(),
            quasis: self.quasis.iter().map(|q| q.clone().babelify(ctx)).collect(),
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
            // quasi: TemplateLiteral {
            //     base: ctx.base(self.span), // TODO(dwoznicki): is this right?
            //     expressions: self.exprs.iter().map(|e| {
            //         TemplateLiteralExpr::Expr(e.clone().babelify(ctx).into())
            //     }).collect(),
            //     quasis: self.quasis.iter().map(|q| q.clone().babelify(ctx)).collect(),
            // },
            type_parameters: self.type_params.map(|t| {
                TaggedTemplateExprTypeParams::TS(t.babelify(ctx))
            }),
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
                raw: self.raw.value.to_string(),
                cooked: self.cooked.map(|s| s.value.to_string()),
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

impl From<Expression> for Callee {
    fn from(expr: Expression) -> Self {
        Callee::Expr(expr)
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
                argument: self.expr.babelify(ctx).into(),
            }),
            None => ArrayExprEl::Expr(self.expr.babelify(ctx).into()),
        }
    }
}

impl From<ArrayExprEl> for Arg {
    fn from(el: ArrayExprEl) -> Self {
        match el {
            ArrayExprEl::Expr(e) => Arg::Expr(e),
            ArrayExprEl::Spread(s) => Arg::Spread(s),
        }
    }
}

impl Babelify for BlockStmtOrExpr {
    type Output = ArrowFuncExprBody;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            BlockStmtOrExpr::BlockStmt(b) => ArrowFuncExprBody::Block(b.babelify(ctx)),
            BlockStmtOrExpr::Expr(e) => ArrowFuncExprBody::Expr(e.babelify(ctx).into()),
        }
    }
}

impl Babelify for PatOrExpr {
    type Output = LVal;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            PatOrExpr::Expr(e) => {
                match *e {
                    Expr::Member(me) => LVal::MemberExpr(me.babelify(ctx)),
                    _ => panic!("illegal conversion"), // TODO(dwoznicki): really illegal?
                }
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
