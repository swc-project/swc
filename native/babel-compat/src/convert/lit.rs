use super::Context;
use crate::ast::lit::{
    Literal, BooleanLiteral, StringLiteral, NullLiteral, NumericLiteral, BigIntLiteral,
    RegExpLiteral,
};
use crate::ast::jsx::JSXText as BabelJSXText;
use crate::convert::Babelify;
use swc_ecma_ast::{Lit, Str, Bool, Null, Number, BigInt, Regex, JSXText};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LitOutput {
    Lit(Literal),
    JSX(BabelJSXText),
}

impl Babelify for Lit {
    type Output = LitOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Lit::Str(s) => LitOutput::Lit(Literal::String(s.babelify(ctx))),
            Lit::Bool(b) => LitOutput::Lit(Literal::Boolean(b.babelify(ctx))),
            Lit::Null(n) => LitOutput::Lit(Literal::Null(n.babelify(ctx))),
            Lit::Num(n) => LitOutput::Lit(Literal::Numeric(n.babelify(ctx))),
            Lit::BigInt(i) => LitOutput::Lit(Literal::BigInt(i.babelify(ctx))),
            Lit::Regex(r) => LitOutput::Lit(Literal::RegExp(r.babelify(ctx))),
            Lit::JSXText(t) => LitOutput::JSX(t.babelify(ctx)),
        }
    }
}

impl Babelify for Str {
    type Output = StringLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        StringLiteral {
            base: ctx.base(self.span),
            value: self.value.to_string(),
        }
    }
}

impl Babelify for Bool {
    type Output = BooleanLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BooleanLiteral {
            base: ctx.base(self.span),
            value: self.value,
        }
    }
}

impl Babelify for Null {
    type Output = NullLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        NullLiteral {
            base: ctx.base(self.span),
        }
    }
}

impl Babelify for Number {
    type Output = NumericLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        NumericLiteral {
            base: ctx.base(self.span),
            value: self.value,
        }
    }
}

impl Babelify for BigInt {
    type Output = BigIntLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BigIntLiteral {
            base: ctx.base(self.span),
            value: self.value.to_string(),
        }
    }
}

impl Babelify for Regex {
    type Output = RegExpLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        RegExpLiteral {
            base: ctx.base(self.span),
            pattern: self.exp.to_string(),
            flags: self.flags.to_string(),
        }
    }
}

impl Babelify for JSXText {
    type Output = BabelJSXText;

    fn babelify(self, ctx: &Context) -> Self::Output {
        BabelJSXText {
            base: ctx.base(self.span),
            value: self.value.to_string(),
        }
    }
}

