use swc_common::DUMMY_SP;
use swc_ecma_ast::{Expr, Str, Tpl, TsType};

use super::FastDts;

impl FastDts {
    pub(crate) fn transform_expr_to_ts_type(&mut self, expr: &Expr) -> Option<TsType> {
        None
    }

    pub(crate) fn tpl_to_string(&mut self, tpl: &Tpl) -> Option<Str> {
        if !tpl.exprs.is_empty() {
            return None;
        }

        tpl.quasis.first().map(|element| Str {
            span: DUMMY_SP,
            value: element.cooked.as_ref().unwrap_or(&element.raw).clone(),
            raw: None,
        })
    }

    pub(crate) fn is_literal(expr: &Expr) -> bool {
        match expr {
            Expr::Lit(_) => true,
            Expr::Unary(unary) => Self::can_infer_unary_expr(unary),
            _ => false,
        }
    }
}
