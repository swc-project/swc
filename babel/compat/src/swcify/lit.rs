use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::BooleanLiteral;
use swc_babel_ast::Literal;
use swc_babel_ast::NullLiteral;
use swc_babel_ast::NumberLiteral;
use swc_babel_ast::NumericLiteral;
use swc_babel_ast::StringLiteral;
use swc_ecma_ast::Bool;
use swc_ecma_ast::Lit;
use swc_ecma_ast::Null;
use swc_ecma_ast::Number;
use swc_ecma_ast::Str;

impl Swcify for Literal {
    type Output = Lit;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Literal::String(v) => v.swcify(ctx).into(),
            Literal::Numeric(v) => v.swcify(ctx).into(),
            Literal::Null(v) => v.swcify(ctx).into(),
            Literal::Boolean(v) => v.swcify(ctx).into(),
            Literal::RegExp(v) => v.swcify(ctx).into(),
            Literal::Template(v) => v.swcify(ctx).into(),
            Literal::BigInt(v) => v.swcify(ctx).into(),
            Literal::Decimal(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for StringLiteral {
    type Output = Str;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Str {
            span: ctx.span(&self.base),
            value: self.value,
            has_escape: false,
            kind: Default::default(),
        }
    }
}

impl Swcify for NumberLiteral {
    type Output = Number;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Number {
            span: ctx.span(&self.base),
            value: self.value,
        }
    }
}

impl Swcify for NumericLiteral {
    type Output = Number;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Number {
            span: ctx.span(&self.base),
            value: self.value,
        }
    }
}

impl Swcify for NullLiteral {
    type Output = Null;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Null {
            span: ctx.span(&self.base),
        }
    }
}

impl Swcify for BooleanLiteral {
    type Output = Bool;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Bool {
            span: ctx.span(&self.base),
            value: self.value,
        }
    }
}
