use crate::swcify::Swcify;
use swc_babel_ast::FlowType;
use swc_babel_ast::TypeParameterInstantiation;
use swc_ecma_ast::TsType;
use swc_ecma_ast::TsTypeParamInstantiation;

impl Swcify for TypeParameterInstantiation {
    type Output = TsTypeParamInstantiation;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        TsTypeParamInstantiation {
            span: ctx.span(&self.base),
            params: self.params.swcify(ctx),
        }
    }
}

impl Swcify for FlowType {
    type Output = Box<TsType>;

    fn swcify(self, ctx: &super::Context) -> Self::Output {}
}
