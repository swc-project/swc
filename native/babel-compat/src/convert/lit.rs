use super::Context;
use crate::ast::lit::BooleanLiteral;
use crate::ast::lit::Literal;
use crate::ast::lit::StringLiteral;
use crate::convert::Babelify;
use swc_ecma_ast::*;

impl Babelify for Lit {
    type Output = Literal;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Lit::Str(s) => Literal::String(s.babelify(ctx)),
            Lit::Bool(b) => Literal::Boolean(b.babelify(ctx)),
            Lit::Null(_) => {}
            Lit::Num(_) => {}
            Lit::BigInt(_) => {}
            Lit::Regex(_) => {}
            Lit::JSXText(_) => {}
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

