use serde::{Deserialize, Serialize};
use swc_atoms::atom;
use swc_ecma_ast::{BigInt, Bool, Lit, Null, Number, Regex, Str};
use swc_estree_ast::{
    BigIntLiteral, BigIntLiteralExtra, BooleanLiteral, JSXText as BabelJSXText, Literal,
    NullLiteral, NumericLiteral, NumericLiteralExtra, RegExpLiteral, StringLiteral,
    StringLiteralExtra,
};

use crate::babelify::{Babelify, Context};

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
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Babelify for Str {
    type Output = StringLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let raw = match self.raw {
            Some(value) => value,
            None => serde_json::to_string(&self.value)
                .map(Into::into)
                .unwrap_or_else(|_| atom!("")),
        };
        let extra = Some(StringLiteralExtra {
            raw: raw.clone(),
            raw_value: self.value.clone(),
        });
        StringLiteral {
            base: ctx.base(self.span),
            value: self.value,
            raw,
            extra,
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
        let raw = match self.raw {
            Some(value) => value,
            None => self.value.to_string().into(),
        };
        let extra = Some(NumericLiteralExtra {
            raw,
            raw_value: self.value,
        });
        NumericLiteral {
            base: ctx.base(self.span),
            value: self.value,
            extra,
        }
    }
}

impl Babelify for BigInt {
    type Output = BigIntLiteral;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let value = self.value.to_string();
        let raw = match self.raw {
            Some(raw) => raw,
            None => format!("{}n", value).into(),
        };
        let extra = Some(BigIntLiteralExtra {
            raw: raw.clone(),
            raw_value: value.clone(),
        });
        BigIntLiteral {
            base: ctx.base(self.span),
            value,
            raw,
            extra,
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
