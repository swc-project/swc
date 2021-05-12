use crate::swcify::Swcify;
use swc_babel_ast::Expression;
use swc_ecma_ast::Expr;

impl Swcify for Expression {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        match self {
            Expression::Array(e) => e.swcify(ctx),
            Expression::Assignment(e) => e.swcify(ctx),
            Expression::Binary(e) => e.swcify(ctx),
            Expression::Call(e) => e.swcify(ctx),
            Expression::Conditional(e) => e.swcify(ctx),
            Expression::Func(e) => e.swcify(ctx),
            Expression::Id(e) => e.swcify(ctx),
            Expression::StringLiteral(e) => e.swcify(ctx),
            Expression::NumericLiteral(e) => e.swcify(ctx),
            Expression::NullLiteral(e) => e.swcify(ctx),
            Expression::BooleanLiteral(e) => e.swcify(ctx),
            Expression::RegExpLiteral(e) => e.swcify(ctx),
            Expression::Logical(e) => e.swcify(ctx),
            Expression::Member(e) => e.swcify(ctx),
            Expression::New(e) => e.swcify(ctx),
            Expression::Object(e) => e.swcify(ctx),
            Expression::Sequence(e) => e.swcify(ctx),
            Expression::Parenthesized(e) => e.swcify(ctx),
            Expression::This(e) => e.swcify(ctx),
            Expression::Unary(e) => e.swcify(ctx),
            Expression::Update(e) => e.swcify(ctx),
            Expression::ArrowFunc(e) => e.swcify(ctx),
            Expression::Class(e) => e.swcify(ctx),
            Expression::MetaProp(e) => e.swcify(ctx),
            Expression::Super(e) => e.swcify(ctx),
            Expression::TaggedTemplate(e) => e.swcify(ctx),
            Expression::TemplateLiteral(e) => e.swcify(ctx),
            Expression::Yield(e) => e.swcify(ctx),
            Expression::Await(e) => e.swcify(ctx),
            Expression::Import(e) => e.swcify(ctx),
            Expression::BigIntLiteral(e) => e.swcify(ctx),
            Expression::OptionalMember(e) => e.swcify(ctx),
            Expression::OptionalCall(e) => e.swcify(ctx),
            Expression::TypeCast(e) => e.swcify(ctx),
            Expression::JSXElement(e) => e.swcify(ctx),
            Expression::JSXFragment(e) => e.swcify(ctx),
            Expression::Bind(e) => e.swcify(ctx),
            Expression::PipelinePrimaryTopicRef(e) => e.swcify(ctx),
            Expression::Do(e) => e.swcify(ctx),
            Expression::Record(e) => e.swcify(ctx),
            Expression::Tuple(e) => e.swcify(ctx),
            Expression::DecimalLiteral(e) => e.swcify(ctx),
            Expression::Module(e) => e.swcify(ctx),
            Expression::TSAs(e) => e.swcify(ctx),
            Expression::TSTypeAssertion(e) => e.swcify(ctx),
            Expression::TSNonNull(e) => e.swcify(ctx),
        }
    }
}
