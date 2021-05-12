use crate::swcify::Swcify;
use swc_babel_ast::FlowType;
use swc_babel_ast::TSTypeParameter;
use swc_babel_ast::TSTypeParameterDeclaration;
use swc_babel_ast::TypeParamDeclOrNoop;
use swc_babel_ast::TypeParameterInstantiation;
use swc_ecma_ast::Ident;
use swc_ecma_ast::TsType;
use swc_ecma_ast::TsTypeParam;
use swc_ecma_ast::TsTypeParamDecl;
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

impl Swcify for TypeParamDeclOrNoop {
    type Output = Option<TsTypeParamDecl>;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        match self {
            TypeParamDeclOrNoop::Flow(_) => None,
            TypeParamDeclOrNoop::TS(v) => Some(v.swcify(ctx)),
            TypeParamDeclOrNoop::Noop(_) => None,
        }
    }
}

impl Swcify for TSTypeParameterDeclaration {
    type Output = TsTypeParamDecl;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        TsTypeParamDecl {
            span: ctx.span(&self.base),
            params: self.params.swcify(ctx),
        }
    }
}

impl Swcify for TSTypeParameter {
    type Output = TsTypeParam;

    fn swcify(self, ctx: &super::Context) -> Self::Output {
        let span = ctx.span(&self.base);
        TsTypeParam {
            span,
            name: Ident::new(self.name, span),
            constraint: self.constraint.swcify(ctx),
            default: self.default.swcify(ctx),
        }
    }
}
