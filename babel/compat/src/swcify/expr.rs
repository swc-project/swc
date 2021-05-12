use crate::swcify::Swcify;
use swc_babel_ast::Arg;
use swc_babel_ast::ArrayExprEl;
use swc_babel_ast::ArrayExpression;
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
use swc_babel_ast::LVal;
use swc_babel_ast::LogicalExpression;
use swc_babel_ast::MemberExpression;
use swc_babel_ast::MetaProperty;
use swc_babel_ast::ModuleExpression;
use swc_babel_ast::NewExpression;
use swc_babel_ast::ObjectExpression;
use swc_babel_ast::OptionalCallExpression;
use swc_babel_ast::OptionalMemberExpression;
use swc_babel_ast::ParenthesizedExpression;
use swc_babel_ast::PipelinePrimaryTopicReference;
use swc_babel_ast::RecordExpression;
use swc_babel_ast::SequenceExpression;
use swc_babel_ast::Super;
use swc_babel_ast::TSAsExpression;
use swc_babel_ast::TSNonNullExpression;
use swc_babel_ast::TSTypeAssertion;
use swc_babel_ast::TaggedTemplateExpression;
use swc_babel_ast::ThisExpression;
use swc_babel_ast::TupleExpression;
use swc_babel_ast::TypeCastExpression;
use swc_babel_ast::UnaryExpression;
use swc_babel_ast::UpdateExpression;
use swc_babel_ast::YieldExpression;
use swc_ecma_ast::op;
use swc_ecma_ast::ArrayLit;
use swc_ecma_ast::AssignExpr;
use swc_ecma_ast::BinExpr;
use swc_ecma_ast::BinaryOp;
use swc_ecma_ast::BindingIdent;
use swc_ecma_ast::CallExpr;
use swc_ecma_ast::CondExpr;
use swc_ecma_ast::Expr;
use swc_ecma_ast::ExprOrSpread;
use swc_ecma_ast::ExprOrSuper;
use swc_ecma_ast::FnExpr;
use swc_ecma_ast::Function;
use swc_ecma_ast::Ident;
use swc_ecma_ast::Lit;
use swc_ecma_ast::MemberExpr;
use swc_ecma_ast::NewExpr;
use swc_ecma_ast::ObjectLit;
use swc_ecma_ast::Pat;
use swc_ecma_ast::PatOrExpr;
use swc_ecma_ast::PrivateName;
use swc_ecma_ast::TsAsExpr;
use swc_ecma_ast::TsNonNullExpr;
use swc_ecma_ast::TsTypeAssertion;

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

    fn swcify(self, ctx: &Context) -> Self::Output {
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
                Expression::Super(s) => s.swcify(ctx),
                _ => e.swcify(ctx),
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
            args: self.arguments.swcify(ctx),
            type_args: self.type_arguments.swcify(ctx),
        }
    }
}

impl Swcify for Arg {
    type Output = ExprOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Arg::Spread(s) => ExprOrSpread {
                spread: Some(ctx.span(&s.base)),
                expr: s.argument.swcify(ctx),
            },
            Arg::JSXName(e) => e.swcify(ctx),
            Arg::Placeholder(_) => {}
            Arg::Expr(e) => ExprOrSpread {
                spread: None,
                expr: e.swcify(ctx),
            },
        }
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
                body: self.body.swcify(ctx),
                is_generator: self.generator.unwrap_or(false),
                is_async: self.is_async.unwrap_or(false),
                type_params: self.type_parameters.swcify(ctx),
                return_type: self.return_type.swcify(ctx),
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
            type_ann: self.type_annotation.swcify(ctx),
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
            obj: self.object.swcify(ctx),
            prop: self.property.swcify(ctx),
            computed: self.computed,
        }
    }
}

impl Swcify for NewExpression {
    type Output = NewExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {
        NewExpr {
            span: ctx.span(&self.base),
            callee: self.callee.swcify(ctx),
            args: self.arguments.swcify(ctx),
            type_args: self.type_arguments.swcify(ctx),
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

impl Swcify for SequenceExpression {}

impl Swcify for ParenthesizedExpression {}

impl Swcify for ThisExpression {}

impl Swcify for UnaryExpression {}

impl Swcify for UpdateExpression {}

impl Swcify for ArrowFunctionExpression {}

impl Swcify for ClassExpression {}

impl Swcify for MetaProperty {}

impl Swcify for Super {}

impl Swcify for TaggedTemplateExpression {}

impl Swcify for YieldExpression {}

impl Swcify for AwaitExpression {}

impl Swcify for Import {}

impl Swcify for OptionalMemberExpression {}

impl Swcify for OptionalCallExpression {}

impl Swcify for TypeCastExpression {}

impl Swcify for swc_babel_ast::JSXElement {}

impl Swcify for swc_babel_ast::JSXFragment {}

impl Swcify for BindExpression {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support bind expressions")
    }
}

impl Swcify for DoExpression {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support do expressions")
    }
}

impl Swcify for PipelinePrimaryTopicReference {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support `PipelinePrimaryTopicReference`")
    }
}

impl Swcify for RecordExpression {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support record expressions")
    }
}

impl Swcify for TupleExpression {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support tuple expressions")
    }
}

impl Swcify for ModuleExpression {
    type Output = !;

    fn swcify(self, ctx: &Context) -> Self::Output {
        panic!("swc does not support module expressions")
    }
}

impl Swcify for TSAsExpression {
    type Output = TsAsExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for TSTypeAssertion {
    type Output = TsTypeAssertion;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for TSNonNullExpression {
    type Output = TsNonNullExpr;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ArrayExprEl {
    type Output = ExprOrSpread;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}
