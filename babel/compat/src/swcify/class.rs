use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::ClassBody;
use swc_babel_ast::ClassBodyEl;
use swc_ecma_ast::ClassMember;

impl Swcify for ClassBody {
    type Output = Vec<ClassMember>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        self.body.swcify(ctx)
    }
}

impl Swcify for ClassBodyEl {
    type Output = ClassMember;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            ClassBodyEl::Method(v) => ClassMember::Method(v.swcify(ctx)),
            ClassBodyEl::PrivateMethod(v) => v.swcify(ctx).into(),
            ClassBodyEl::Prop(v) => v.swcify(ctx).into(),
            ClassBodyEl::PrivateProp(v) => v.swcify(ctx).into(),
            ClassBodyEl::TSMethod(v) => v.swcify(ctx).into(),
            ClassBodyEl::TSIndex(v) => v.swcify(ctx).into(),
        }
    }
}

impl Swcify for swc_babel_ast::ClassMethod {
    type Output = swc_ecma_ast::ClassMethod;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ClassMethod {}
    }
}

impl Swcify for swc_babel_ast::ClassPrivateMethod {
    type Output = swc_ecma_ast::PrivateMethod;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateMethod {}
    }
}

impl Swcify for swc_babel_ast::ClassProperty {
    type Output = swc_ecma_ast::ClassProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::ClassProp {}
    }
}

impl Swcify for swc_babel_ast::ClassPrivateProperty {
    type Output = swc_ecma_ast::PrivateProp;

    fn swcify(self, ctx: &Context) -> Self::Output {
        swc_ecma_ast::PrivateProp {}
    }
}
