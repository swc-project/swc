use super::Analyzer;
use swc_ecma_ast::*;

impl Analyzer {
    pub(super) fn type_of(&self, expr: &Expr) -> Option<TsType> {
        match *expr {
            Expr::This(ThisExpr { span }) => Some(TsType::TsThisType(TsThisType { span })),

            Expr::Lit(Lit::Bool(v)) => Some(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Bool(v),
            })),
            Expr::Lit(Lit::Str(ref v)) => Some(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Str(v.clone()),
            })),
            Expr::Lit(Lit::Num(v)) => Some(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Number(v),
            })),

            _ => None,
        }
    }
}
