use super::Context;
use crate::swcify::Swcify;
use swc_babel_ast::Access;
use swc_babel_ast::FlowType;
use swc_babel_ast::SuperTypeParams;
use swc_babel_ast::TSEntityName;
use swc_babel_ast::TSQualifiedName;
use swc_babel_ast::TSType;
use swc_babel_ast::TSTypeAnnotation;
use swc_babel_ast::TSTypeParameter;
use swc_babel_ast::TSTypeParameterDeclaration;
use swc_babel_ast::TSTypeParameterInstantiation;
use swc_babel_ast::TypeAnnotOrNoop;
use swc_babel_ast::TypeParamDeclOrNoop;
use swc_ecma_ast::Accessibility;
use swc_ecma_ast::Ident;
use swc_ecma_ast::TsEntityName;
use swc_ecma_ast::TsQualifiedName;
use swc_ecma_ast::TsType;
use swc_ecma_ast::TsTypeAnn;
use swc_ecma_ast::TsTypeParam;
use swc_ecma_ast::TsTypeParamDecl;
use swc_ecma_ast::TsTypeParamInstantiation;

impl Swcify for TSTypeParameterInstantiation {
    type Output = TsTypeParamInstantiation;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsTypeParamInstantiation {
            span: ctx.span(&self.base),
            params: self.params.swcify(ctx),
        }
    }
}

impl Swcify for FlowType {
    type Output = !;

    fn swcify(self, _: &Context) -> Self::Output {
        unreachable!("swc does not support flow types")
    }
}

impl Swcify for TypeParamDeclOrNoop {
    type Output = Option<TsTypeParamDecl>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TypeParamDeclOrNoop::Flow(_) => None,
            TypeParamDeclOrNoop::TS(v) => Some(v.swcify(ctx)),
            TypeParamDeclOrNoop::Noop(_) => None,
        }
    }
}

impl Swcify for TSTypeParameterDeclaration {
    type Output = TsTypeParamDecl;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsTypeParamDecl {
            span: ctx.span(&self.base),
            params: self.params.swcify(ctx),
        }
    }
}

impl Swcify for TSTypeParameter {
    type Output = TsTypeParam;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let span = ctx.span(&self.base);
        TsTypeParam {
            span,
            name: Ident::new(self.name, span),
            constraint: self.constraint.swcify(ctx),
            default: self.default.swcify(ctx),
        }
    }
}

impl Swcify for TypeAnnotOrNoop {
    type Output = Option<TsTypeAnn>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TypeAnnotOrNoop::Flow(_) => None,
            TypeAnnotOrNoop::TS(v) => Some(v.swcify(ctx)),
            TypeAnnotOrNoop::Noop(_) => None,
        }
    }
}

impl Swcify for TSTypeAnnotation {
    type Output = TsTypeAnn;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsTypeAnn {
            span: ctx.span(&self.base),
            type_ann: self.type_annotation.swcify(ctx),
        }
    }
}

impl Swcify for TSType {
    type Output = Box<TsType>;

    fn swcify(self, _: &Context) -> Self::Output {
        todo!("swc currently does not support importing typescript module from babel")
    }
}

impl Swcify for SuperTypeParams {
    type Output = TsTypeParamInstantiation;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            SuperTypeParams::Flow(_) => unimplemented!("flow type"),
            SuperTypeParams::TS(v) => v.swcify(ctx),
        }
    }
}

impl Swcify for Access {
    type Output = Accessibility;

    fn swcify(self, _: &Context) -> Self::Output {
        match self {
            Access::Public => Accessibility::Public,
            Access::Private => Accessibility::Private,
            Access::Protected => Accessibility::Protected,
        }
    }
}

impl Swcify for TSEntityName {
    type Output = TsEntityName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        match self {
            TSEntityName::Id(v) => TsEntityName::Ident(v.swcify(ctx).id),
            TSEntityName::Qualified(v) => TsEntityName::TsQualifiedName(Box::new(v.swcify(ctx))),
        }
    }
}

impl Swcify for TSQualifiedName {
    type Output = TsQualifiedName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsQualifiedName {
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx).id,
        }
    }
}
