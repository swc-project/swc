use crate::swcify::Context;
use crate::swcify::Swcify;
use swc_babel_ast::LVal;
use swc_ecma_ast::Expr;
use swc_ecma_ast::Pat;

impl Swcify for LVal {
    type Output = Pat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            LVal::Id(i) => i.swcify(ctx).into(),
            LVal::MemberExpr(e) => Pat::Expr(Box::new(Expr::from(e.swcify(ctx)))),
            LVal::RestEl(e) => e.swcify(ctx).into(),
            LVal::AssignmentPat(e) => e.swcify(ctx).into(),
            LVal::ArrayPat(e) => e.swcify(ctx).into(),
            LVal::ObjectPat(e) => e.swcify(ctx).into(),
            LVal::TSParamProp(e) => e.swcify(ctx).into(),
        }
    }
}
