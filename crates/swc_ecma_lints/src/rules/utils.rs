use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::SyntaxContext;
use swc_ecma_ast::{
    Expr, Lit, MemberExpr, MemberProp, Number, ParenExpr, Regex, SeqExpr, Str, TaggedTpl, Tpl,
};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum QuotesType {
    Single,
    Double,
    Backtick,
}

impl Default for QuotesType {
    fn default() -> Self {
        Self::Double
    }
}

impl QuotesType {
    pub fn get_char(&self) -> char {
        match self {
            QuotesType::Backtick => '`',
            QuotesType::Double => '"',
            QuotesType::Single => '\'',
        }
    }
}

pub fn resolve_string_quote_type(lit_str: &Str) -> Option<QuotesType> {
    lit_str.raw.as_ref().and_then(|raw| {
        let byte = (&*raw).as_bytes()[0];

        match byte {
            b'\'' => Some(QuotesType::Single),
            b'"' => Some(QuotesType::Double),
            b'`' => Some(QuotesType::Backtick),
            _ => None,
        }
    })
}

#[derive(Debug)]
pub enum ArgValue {
    Str(JsWord),
    Number(f64),
    RegExp { exp: JsWord, flags: JsWord },
    Ident,
    Other,
}

pub fn extract_arg_val(unresolved_ctxt: SyntaxContext, expr: &Expr) -> ArgValue {
    match expr {
        Expr::Ident(_) => ArgValue::Ident,
        Expr::Lit(Lit::Str(Str { value, .. })) => ArgValue::Str(value.clone()),
        Expr::Lit(Lit::Num(Number { value, .. })) => ArgValue::Number(*value),
        Expr::Lit(Lit::Regex(Regex { exp, flags, .. })) => ArgValue::RegExp {
            exp: exp.clone(),
            flags: flags.clone(),
        },
        Expr::Tpl(Tpl { exprs, quasis, .. }) => {
            if exprs.is_empty() {
                ArgValue::Str(quasis.first().unwrap().raw.clone())
            } else {
                ArgValue::Other
            }
        }
        Expr::TaggedTpl(TaggedTpl {
            tag,
            tpl: Tpl { exprs, quasis, .. },
            ..
        }) => {
            if exprs.is_empty() {
                if let Expr::Member(MemberExpr { obj, prop, .. }) = tag.as_ref() {
                    if let (Expr::Ident(obj), MemberProp::Ident(prop)) = (obj.as_ref(), prop) {
                        if &*obj.sym != "String" {
                            return ArgValue::Other;
                        }

                        if obj.span.ctxt != unresolved_ctxt {
                            return ArgValue::Other;
                        }

                        if &prop.sym != "raw" {
                            return ArgValue::Other;
                        }

                        return ArgValue::Str(quasis.first().unwrap().raw.clone());
                    }
                }
            }

            ArgValue::Other
        }
        _ => ArgValue::Other,
    }
}

pub fn unwrap_seqs_and_parens(expr: &Expr) -> &Expr {
    match expr {
        Expr::Seq(SeqExpr { exprs, .. }) => unwrap_seqs_and_parens(exprs.last().unwrap()),
        Expr::Paren(ParenExpr { expr, .. }) => unwrap_seqs_and_parens(expr.as_ref()),
        _ => expr,
    }
}
