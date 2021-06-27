use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::BigIntLiteral;
use swc_babel_ast::BooleanLiteral;
use swc_babel_ast::DecimalLiteral;
use swc_babel_ast::Literal;
use swc_babel_ast::NullLiteral;
use swc_babel_ast::NumberLiteral;
use swc_babel_ast::NumericLiteral;
use swc_babel_ast::RegExpLiteral;
use swc_babel_ast::StringLiteral;
use swc_babel_ast::TemplateElement;
use swc_babel_ast::TemplateLiteral;
use swc_babel_ast::TemplateLiteralExpr;
use swc_common::DUMMY_SP;
use swc_ecma_ast::BigInt;
use swc_ecma_ast::Bool;
use swc_ecma_ast::Expr;
use swc_ecma_ast::Lit;
use swc_ecma_ast::Null;
use swc_ecma_ast::Number;
use swc_ecma_ast::Regex;
use swc_ecma_ast::Str;
use swc_ecma_ast::Tpl;
use swc_ecma_ast::TplElement;

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
            cooked: self.value.cooked.map(|value| Str {
                span: DUMMY_SP,
                value,
                has_escape: false,
                kind: Default::default(),
            }),
            raw: Str {
                span: DUMMY_SP,
                value: self.value.raw,
                has_escape: false,
                kind: Default::default(),
            },
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
                .expect("failed to parse the value of BigIntLiteral"),
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
        }
    }
}
