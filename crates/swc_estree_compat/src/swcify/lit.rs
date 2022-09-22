use swc_ecma_ast::{BigInt, Bool, Expr, Lit, Null, Number, Regex, Str, Tpl, TplElement};
use swc_estree_ast::{
    BigIntLiteral, BooleanLiteral, DecimalLiteral, Literal, NullLiteral, NumberLiteral,
    NumericLiteral, RegExpLiteral, StringLiteral, TemplateElement, TemplateLiteral,
    TemplateLiteralExpr,
};

use super::Context;
use crate::swcify::Swcify;

impl Swcify for Literal {
    type Output = Lit;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            Literal::String(v) => v.swcify(ctx).into(),
            Literal::Numeric(v) => v.swcify(ctx).into(),
            Literal::Null(v) => v.swcify(ctx).into(),
            Literal::Boolean(v) => v.swcify(ctx).into(),
            Literal::RegExp(v) => v.swcify(ctx).into(),
            Literal::Template(..) => unreachable!(),
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
            raw: Some(self.raw),
        }
    }
}

impl Swcify for NumberLiteral {
    type Output = Number;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Number {
            span: ctx.span(&self.base),
            value: self.value,
            // TODO improve me
            raw: None,
        }
    }
}

impl Swcify for NumericLiteral {
    type Output = Number;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Number {
            span: ctx.span(&self.base),
            value: self.value,
            // TODO improve me
            raw: None,
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

impl Swcify for RegExpLiteral {
    type Output = Regex;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Regex {
            span: ctx.span(&self.base),
            exp: self.pattern,
            flags: self.flags,
        }
    }
}

impl Swcify for TemplateLiteral {
    type Output = Tpl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Tpl {
            span: ctx.span(&self.base),
            exprs: self.expressions.swcify(ctx),
            quasis: self.quasis.swcify(ctx),
        }
    }
}

impl Swcify for TemplateLiteralExpr {
    type Output = Box<Expr>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TemplateLiteralExpr::TSType(..) => todo!(),
            TemplateLiteralExpr::Expr(v) => v.swcify(ctx),
        }
    }
}

impl Swcify for TemplateElement {
    type Output = TplElement;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TplElement {
            span: ctx.span(&self.base),
            tail: self.tail,
            cooked: self.value.cooked,
            raw: self.value.raw,
        }
    }
}

impl Swcify for BigIntLiteral {
    type Output = BigInt;

    fn swcify(self, ctx: &Context) -> Self::Output {
        BigInt {
            span: ctx.span(&self.base),
            value: self
                .value
                .parse()
                .map(Box::new)
                .expect("failed to parse the value of BigIntLiteral"),
            // TODO improve me
            raw: None,
        }
    }
}

impl Swcify for DecimalLiteral {
    type Output = Number;

    fn swcify(self, ctx: &Context) -> Self::Output {
        Number {
            span: ctx.span(&self.base),
            value: self
                .value
                .parse()
                .expect("failed to parse the value of DecimalLiteral"),
            // TODO improve me
            raw: None,
        }
    }
}
