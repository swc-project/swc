use crate::swcify::Swcify;
use swc_babel_ast::Expression;
use swc_ecma_ast::Expr;

impl Swcify for Expression {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        match self {
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
        }
    }
}
