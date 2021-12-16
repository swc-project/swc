use self::internal::Sealed;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

/// This trait is sealed for now because the author (@kdy1) is not sure what is
/// possible with parser plugin api.
pub trait Plugin: Sized + Clone + Sealed {
    type TypeScript: TypeScriptPlugin;

    fn typescript(&mut self) -> &mut Self::TypeScript;
}

pub(crate) mod internal {
    pub trait Sealed {}
}

/// Used to avoid memory allocation.
pub trait TypeScriptPlugin: Sized + Clone + Sealed {
    /// Used as return type of parse_ts_type().
    type Type;
    type TypeAnn;
    type MappedType;
    type InferType;
    type TypeParam;
    type TypeParamDecl;
    type TypeRef;
    type ThisType;
    type ImportType;
    type TypeQuery;
    type TypePredicate;
    type TypeLit;
    type TupleType;
    type LitType;
    type TplLitType;
    type TypeOperator;

    fn build_ts_as_expr(&mut self, span: Span, expr: Box<Expr>, type_ann: Self::Type) -> Box<Expr>;

    fn build_ts_type_assertion(
        &mut self,
        span: Span,
        expr: Box<Expr>,
        type_ann: Self::Type,
    ) -> Box<Expr>;

    fn convert_type(&mut self, ty: Self::Type) -> Option<Box<TsType>>;

    fn build_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Self::TypeAnn;

    fn build_opt_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Option<TsTypeAnn>;

    fn convert_type_ann(&mut self, type_ann: Self::TypeAnn) -> Option<TsTypeAnn>;

    fn convert_type_param_decl(&mut self, n: Self::TypeParamDecl) -> Option<TsTypeParamDecl>;
}

/// Implements all `*Plugin` traits.
#[derive(Debug, Default, Clone, Copy)]
pub struct NoopPlugin;

impl Plugin for NoopPlugin {
    type TypeScript = Self;

    fn typescript(&mut self) -> &mut Self::TypeScript {
        self
    }
}

impl TypeScriptPlugin for NoopPlugin {
    type Type = Box<TsType>;
    type TypeAnn = TsTypeAnn;
    type MappedType = TsMappedType;
    type InferType = TsInferType;
    type TypeParam = TsTypeParam;
    type TypeParamDecl = TsTypeParamDecl;

    fn build_ts_as_expr(&mut self, span: Span, expr: Box<Expr>, type_ann: Self::Type) -> Box<Expr> {
        Box::new(Expr::TsAs(TsAsExpr {
            span,
            expr,
            type_ann,
        }))
    }

    fn build_ts_type_assertion(
        &mut self,
        span: Span,
        expr: Box<Expr>,
        type_ann: Self::Type,
    ) -> Box<Expr> {
        Box::new(Expr::TsTypeAssertion(TsTypeAssertion {
            span,
            expr,
            type_ann,
        }))
    }

    fn convert_type(&mut self, ty: Self::Type) -> Option<Box<TsType>> {
        Some(ty)
    }

    fn build_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Self::TypeAnn {
        TsTypeAnn { span, type_ann: ty }
    }

    fn build_opt_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Option<TsTypeAnn> {
        Some(TsTypeAnn { span, type_ann: ty })
    }

    fn convert_type_ann(&mut self, type_ann: Self::TypeAnn) -> Option<TsTypeAnn> {
        Some(type_ann)
    }

    fn convert_type_param_decl(&mut self, n: Self::TypeParamDecl) -> Option<TsTypeParamDecl> {}
}

impl Sealed for NoopPlugin {}

#[derive(Debug, Clone, Default)]
pub struct Plugins<T> {
    pub typescript: T,
}

impl<T> Plugin for Plugins<T>
where
    T: TypeScriptPlugin,
{
    type TypeScript = T;

    fn typescript(&mut self) -> &mut Self::TypeScript {
        &mut self.typescript
    }
}

impl<T> Sealed for Plugins<T> {}
