use std::{fmt::Debug, sync::Arc};

use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_common::SourceMap;
use swc_ecma_ast::{Expr, Lit, Number, ParenExpr, Regex, Str, TaggedTpl, Tpl};

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

pub fn resolve_string_quote_type(source_map: &Arc<SourceMap>, lit_str: &Str) -> Option<QuotesType> {
    let quote = source_map.lookup_byte_offset(lit_str.span.lo);
    let quote_index = quote.pos.0;
    let src = &quote.sf.src;
    let byte = src.as_bytes()[quote_index as usize];

    match byte {
        b'\'' => Some(QuotesType::Single),
        b'"' => Some(QuotesType::Double),
        b'`' => Some(QuotesType::Backtick),
        _ => None,
    }
}

#[derive(Debug)]
pub enum ArgValue {
    Str(JsWord),
    Number(f64),
    RegExp { exp: JsWord, flags: JsWord },
    Ident,
    Other,
}

pub fn extract_arg_val(expr: &Expr, check_parens: bool) -> ArgValue {
    match expr {
        Expr::Ident(_) => ArgValue::Ident,
        Expr::Paren(ParenExpr { expr, .. }) => {
            if check_parens {
                extract_arg_val(expr.as_ref(), check_parens)
            } else {
                ArgValue::Other
            }
        }
        Expr::Lit(Lit::Str(Str { value, .. })) => ArgValue::Str(value.clone()),
        Expr::Lit(Lit::Num(Number { value, .. })) => ArgValue::Number(*value),
        Expr::Lit(Lit::Regex(Regex { exp, flags, .. })) => ArgValue::RegExp {
            exp: exp.clone(),
            flags: flags.clone(),
        },
        Expr::Tpl(Tpl { exprs, .. }) => {
            if exprs.is_empty() {
                // TODO: extract text from tpl
                ArgValue::Str(js_word!(""))
            } else {
                ArgValue::Other
            }
        }
        Expr::TaggedTpl(TaggedTpl {
            tpl: Tpl { exprs, .. },
            ..
        }) => {
            if exprs.is_empty() {
                // TODO: extract text from tpl
                ArgValue::Str(js_word!(""))
            } else {
                ArgValue::Other
            }
        }
        _ => ArgValue::Other,
    }
}
