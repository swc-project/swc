use std::{fmt::Debug, sync::Arc};

use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, SourceMap, Span, SyntaxContext};
use swc_ecma_ast::{
    Expr, Id, Lit, MemberExpr, MemberProp, Number, ParenExpr, Regex, SeqExpr, Str, TaggedTpl, Tpl,
};
use swc_ecma_utils::ident::IdentLike;

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

pub fn extract_arg_val(
    source_map: &Arc<SourceMap>,
    top_level_ctxt: &SyntaxContext,
    top_level_declared_vars: &AHashSet<Id>,
    expr: &Expr,
    check_parens: bool,
) -> ArgValue {
    fn extract_value_from_tpl(source_map: &Arc<SourceMap>, span: &Span) -> JsWord {
        let source = source_map.lookup_byte_offset(span.lo);
        let lo = (span.lo.0 as usize) + 1;
        let hi = (span.hi.0 as usize) - 1;

        JsWord::from(&source.sf.src[lo..hi])
    }

    match expr {
        Expr::Ident(_) => ArgValue::Ident,
        Expr::Paren(ParenExpr { expr, .. }) => {
            if check_parens {
                extract_arg_val(
                    source_map,
                    top_level_ctxt,
                    top_level_declared_vars,
                    expr.as_ref(),
                    check_parens,
                )
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
        Expr::Tpl(Tpl { span, exprs, .. }) => {
            if exprs.is_empty() {
                ArgValue::Str(extract_value_from_tpl(source_map, span))
            } else {
                ArgValue::Other
            }
        }
        Expr::TaggedTpl(TaggedTpl {
            tag,
            tpl: Tpl { span, exprs, .. },
            ..
        }) => {
            if exprs.is_empty() {
                if let Expr::Member(MemberExpr { obj, prop, .. }) = tag.as_ref() {
                    if let (Expr::Ident(obj), MemberProp::Ident(prop)) = (obj.as_ref(), prop) {
                        if &*obj.sym != "String" {
                            return ArgValue::Other;
                        }

                        if obj.span.ctxt != *top_level_ctxt {
                            return ArgValue::Other;
                        }

                        if top_level_declared_vars.contains(&obj.to_id()) {
                            return ArgValue::Other;
                        }

                        if &prop.sym != "raw" {
                            return ArgValue::Other;
                        }

                        return ArgValue::Str(extract_value_from_tpl(source_map, span));
                    }
                }
            }

            ArgValue::Other
        }
        _ => ArgValue::Other,
    }
}

pub fn unwrap_seqs_and_parens(expr: &'_ Expr) -> &'_ Expr {
    match expr {
        Expr::Seq(SeqExpr { exprs, .. }) => unwrap_seqs_and_parens(exprs.last().unwrap()),
        Expr::Paren(ParenExpr { expr, .. }) => unwrap_seqs_and_parens(expr.as_ref()),
        _ => expr,
    }
}
