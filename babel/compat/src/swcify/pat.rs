use crate::swcify::Context;
use crate::swcify::Swcify;
use swc_babel_ast::ArrayPattern;
use swc_babel_ast::AssignmentPattern;
use swc_babel_ast::LVal;
use swc_babel_ast::ObjectPattern;
use swc_babel_ast::RestElement;
use swc_ecma_ast::*;

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
            LVal::TSParamProp(..) => todo!(),
        }
    }
}

impl Swcify for RestElement {
    type Output = RestPat;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for AssignmentPattern {
    type Output = AssignPat;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ArrayPattern {
    type Output = ArrayPat;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for ObjectPattern {
    type Output = ObjectPat;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}

impl Swcify for swc_babel_ast::Param {
    type Output = swc_ecma_ast::Param;

    fn swcify(self, ctx: &Context) -> Self::Output {}
}
