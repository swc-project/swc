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
            ClassBodyEl::Method(v) => {}
            ClassBodyEl::PrivateMethod(v) => {}
            ClassBodyEl::Prop(v) => {}
            ClassBodyEl::PrivateProp(v) => {}
            ClassBodyEl::TSMethod(v) => {}
            ClassBodyEl::TSIndex(v) => {}
        }
    }
}

impl Swcify for swc_babel_ast::ClassMethod {}

impl Swcify for swc_babel_ast::ClassPrivateMethod {}

impl Swcify for swc_babel_ast::ClassProperty {}

impl Swcify for swc_babel_ast::ClassPrivateProperty {}
