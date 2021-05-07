use crate::babelify::{Babelify, Context};
use swc_babel_ast::{
    BigIntLiteral, BooleanLiteral, JSXText as BabelJSXText, Literal, NullLiteral, NumericLiteral,
    RegExpLiteral, StringLiteral,
};

use serde::{Deserialize, Serialize};
use swc_ecma_ast::{BigInt, Bool, Lit, Null, Number, Regex, Str};

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
            value: self.value,
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
            pattern: self.exp,
            flags: self.flags,
        }
    }
}
