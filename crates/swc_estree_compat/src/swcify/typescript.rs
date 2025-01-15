use swc_ecma_ast::{
    Accessibility, Ident, TsEntityName, TsQualifiedName, TsType, TsTypeAnn, TsTypeParam,
    TsTypeParamDecl, TsTypeParamInstantiation,
};
use swc_estree_ast::{
    Access, FlowType, SuperTypeParams, TSEntityName, TSQualifiedName, TSType, TSTypeAnnotation,
    TSTypeParameter, TSTypeParameterDeclaration, TSTypeParameterInstantiation, TypeAnnotOrNoop,
    TypeParamDeclOrNoop,
};

use super::Context;
use crate::{swcify::Swcify, Never};

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
    type Output = Never;

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
            name: Ident::new_no_ctxt(self.name, span),
            is_in: self.is_in,
            is_out: self.is_out,
            is_const: self.is_const,
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
            TSEntityName::Id(v) => TsEntityName::Ident(v.swcify(ctx).into()),
            TSEntityName::Qualified(v) => TsEntityName::TsQualifiedName(Box::new(v.swcify(ctx))),
        }
    }
}

impl Swcify for TSQualifiedName {
    type Output = TsQualifiedName;

    fn swcify(self, ctx: &Context) -> Self::Output {
        TsQualifiedName {
            span: ctx.span(&self.base),
            left: self.left.swcify(ctx),
            right: self.right.swcify(ctx).into(),
        }
    }
}
