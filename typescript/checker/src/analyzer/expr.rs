use swc_ecma_ast::*;

pub(super) fn type_of(expr: &Expr) -> Option<TsType> {
    match *expr {
        Expr::This(ThisExpr { span }) => Some(TsType::TsThisType(TsThisType { span })),
        Expr::Lit(Lit::Bool(v)) => Some(TsType::TsLitType(TsLitType {
            span: v.span,
            lit: TsLit::Bool(v),
        })),

        
    }
}
