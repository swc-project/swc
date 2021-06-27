use crate::swcify::Context;
use crate::swcify::Swcify;
use swc_babel_ast::LVal;
use swc_babel_ast::RestElement;
use swc_ecma_ast::Expr;
use swc_ecma_ast::Pat;
use swc_ecma_ast::RestPat;

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

impl Swcify for RestElement {
    type Output = RestPat;

    fn swcify(self, ctx: &Context) -> Self::Output {
        todo!()
    }
}

impl Swcify for swc_babel_ast::Param {
    type Output = swc_ecma_ast::Param;

    fn swcify(self, ctx: &Context) -> Self::Output {
        todo!()
    }
}
