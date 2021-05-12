use crate::swcify::Swcify;
use swc_babel_ast::ArrayExpression;
use swc_babel_ast::AssignmentExpression;
use swc_babel_ast::BinaryExpression;
use swc_babel_ast::CallExpression;
use swc_babel_ast::ConditionalExpression;
use swc_babel_ast::Expression;
use swc_ecma_ast::ArrayLit;
use swc_ecma_ast::AssignExpr;
use swc_ecma_ast::BinExpr;
use swc_ecma_ast::CallExpr;
use swc_ecma_ast::CondExpr;
use swc_ecma_ast::Expr;

impl Swcify for Expression {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        Box::new(match self {
            Expression::Array(e) => e.swcify(ctx).into(),
            Expression::Assignment(e) => e.swcify(ctx).into(),
            Expression::Binary(e) => e.swcify(ctx).into(),
            Expression::Call(e) => e.swcify(ctx).into(),
            Expression::Conditional(e) => e.swcify(ctx).into(),
            Expression::Func(e) => e.swcify(ctx).into(),
            Expression::Id(e) => e.swcify(ctx).into(),
            Expression::StringLiteral(e) => e.swcify(ctx).into(),
            Expression::NumericLiteral(e) => e.swcify(ctx).into(),
            Expression::NullLiteral(e) => e.swcify(ctx).into(),
            Expression::BooleanLiteral(e) => e.swcify(ctx).into(),
            Expression::RegExpLiteral(e) => e.swcify(ctx).into(),
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
            Expression::Super(e) => e.swcify(ctx).into(),
            Expression::TaggedTemplate(e) => e.swcify(ctx).into(),
            Expression::TemplateLiteral(e) => e.swcify(ctx).into(),
            Expression::Yield(e) => e.swcify(ctx).into(),
            Expression::Await(e) => e.swcify(ctx).into(),
            Expression::Import(e) => e.swcify(ctx).into(),
            Expression::BigIntLiteral(e) => e.swcify(ctx).into(),
            Expression::OptionalMember(e) => e.swcify(ctx).into(),
            Expression::OptionalCall(e) => e.swcify(ctx).into(),
            Expression::TypeCast(e) => e.swcify(ctx).into(),
            Expression::JSXElement(e) => e.swcify(ctx).into(),
            Expression::JSXFragment(e) => e.swcify(ctx).into(),
            Expression::Bind(e) => e.swcify(ctx).into(),
            Expression::PipelinePrimaryTopicRef(e) => e.swcify(ctx).into(),
            Expression::Do(e) => e.swcify(ctx).into(),
            Expression::Record(e) => e.swcify(ctx).into(),
            Expression::Tuple(e) => e.swcify(ctx).into(),
            Expression::DecimalLiteral(e) => e.swcify(ctx).into(),
            Expression::Module(e) => e.swcify(ctx).into(),
            Expression::TSAs(e) => e.swcify(ctx).into(),
            Expression::TSTypeAssertion(e) => e.swcify(ctx).into(),
            Expression::TSNonNull(e) => e.swcify(ctx).into(),
        })
    }
}

impl Swcify for ArrayExpression {
    type Output = ArrayLit;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        ArrayLit {
            span: ctx.span(&self.base),
            elems: self.elements.swcify(ctx),
        }
    }
}

impl Swcify for AssignmentExpression {
    type Output = AssignExpr;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        AssignExpr {
            span: ctx.span(&self.base),
            op: (),
            left: (),
            right: (),
        }
    }
}

impl Swcify for BinaryExpression {
    type Output = BinExpr;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        BinExpr {
            span: ctx.span(&self.base),
            op: self.operator.swcify(ctx),
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx),
        }
    }
}

impl Swcify for CallExpression {
    type Output = CallExpr;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        CallExpr {
            span: ctx.span(&self.base),
            callee: self.callee.swcify(ctx),
            args: self.arguments.swcify(ctx),
            type_args: self.type_arguments.swcify(ctx),
        }
    }
}

impl Swcify for ConditionalExpression {
    type Output = CondExpr;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        CondExpr {
            span: ctx.span(&self.base),
            test: self.test.swcify(ctx),
            cons: self.consequent.swcify(ctx),
            alt: self.alternate.swcify(ctx),
        }
    }
}
