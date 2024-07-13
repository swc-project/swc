use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::SyntaxContext;
use swc_ecma_ast::{Expr, Lit, MemberExpr, MemberProp, Number, Regex, Str, TaggedTpl, Tpl};

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
        let byte = raw.as_bytes()[0];

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
    Str(Atom),
    Number(f64),
    RegExp { exp: Atom, flags: Atom },
    Ident,
    Other,
}

pub fn extract_arg_val(unresolved_ctxt: SyntaxContext, expr: &Expr) -> ArgValue {
    match expr {
        Expr::Ident(_) => ArgValue::Ident,
        Expr::Lit(Lit::Str(Str { value, .. })) => ArgValue::Str(Atom::new(&**value)),
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
        Expr::TaggedTpl(TaggedTpl { tag, tpl, .. }) => {
            if tpl.exprs.is_empty() {
                if let Expr::Member(MemberExpr { obj, prop, .. }) = tag.as_ref() {
                    if let (Expr::Ident(obj), MemberProp::Ident(prop)) = (obj.as_ref(), prop) {
                        if &*obj.sym != "String" {
                            return ArgValue::Other;
                        }

                        if obj.ctxt != unresolved_ctxt {
                            return ArgValue::Other;
                        }

                        if &prop.sym != "raw" {
                            return ArgValue::Other;
                        }

                        return ArgValue::Str(tpl.quasis.first().unwrap().raw.clone());
                    }
                }
            }

            ArgValue::Other
        }
        _ => ArgValue::Other,
    }
}
