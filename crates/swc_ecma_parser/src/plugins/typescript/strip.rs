#![allow(unused)]

use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;

use crate::plugin::{internal::Sealed, TypeScriptPlugin};

#[derive(Debug, Clone, Default)]
pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {
    type Type = ();

    type TypeAnn = ();

    type TupleElement = ();

    type TypeParam = ();

    type TypeParamDecl = ();

    type TypeParamInstantiation = ();

    fn force_type(&mut self, ty: Self::Type) -> Box<TsType> {
        Box::new(TsType::TsKeywordType(TsKeywordType {
            span: DUMMY_SP,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        }))
    }

    fn build_ts_as_expr(&mut self, span: Span, expr: Box<Expr>, type_ann: Self::Type) -> Box<Expr> {
        expr
    }

    fn build_ts_type_assertion(
        &mut self,
        span: Span,
        expr: Box<Expr>,
        type_ann: Self::Type,
    ) -> Box<Expr> {
        expr
    }

    fn convert_type(&mut self, ty: Self::Type) -> Option<Box<TsType>> {
        None
    }

    fn build_conditional_type(
        &mut self,
        span: Span,
        check_type: Self::Type,
        extends_type: Self::Type,
        true_type: Self::Type,
        false_type: Self::Type,
    ) -> Self::Type {
    }

    fn build_indexed_access_type(
        &mut self,
        span: Span,
        readonly: bool,
        obj_type: Self::Type,
        index_type: Self::Type,
    ) -> Self::Type {
    }

    fn build_rest_type(&mut self, span: Span, arg: Self::Type) -> Self::Type {}

    fn build_union_type(&mut self, span: Span, types: Vec<Self::Type>) -> Self::Type {}

    fn build_intersection_type(&mut self, span: Span, types: Vec<Self::Type>) -> Self::Type {}

    fn build_optional_type(&mut self, span: Span, type_ann: Self::Type) -> Self::Type {}

    fn build_tpl_lit_type(
        &mut self,
        span: Span,
        types: Vec<Self::Type>,
        quasis: Vec<swc_ecma_ast::TplElement>,
    ) -> Self::Type {
    }

    fn build_tuple_type(&mut self, span: Span, elems: Vec<Self::TupleElement>) -> Self::Type {}

    fn deref_type_of_tuple_elem<'a>(&self, ty: &'a Self::TupleElement) -> Option<&'a TsType> {
        None
    }

    fn build_tuple_element(
        &mut self,
        span: Span,
        label: Option<swc_ecma_ast::Pat>,
        ty: Self::Type,
    ) -> Self::TupleElement {
    }

    fn build_mapped_type(
        &mut self,
        span: Span,
        readonly: Option<swc_ecma_ast::TruePlusMinus>,
        optional: Option<swc_ecma_ast::TruePlusMinus>,
        type_param: Self::TypeParam,
        name_type: Option<Self::Type>,
        type_ann: Option<Box<TsType>>,
    ) -> Self::Type {
    }

    fn build_fn_type(
        &mut self,
        span: Span,
        type_params: Option<swc_ecma_ast::TsTypeParamDecl>,
        params: Vec<swc_ecma_ast::TsFnParam>,
        type_ann: Self::TypeAnn,
    ) -> Self::Type {
    }

    fn build_constructor_type(
        &mut self,
        span: Span,
        type_params: Option<swc_ecma_ast::TsTypeParamDecl>,
        params: Vec<swc_ecma_ast::TsFnParam>,
        type_ann: Self::TypeAnn,
        is_abstract: bool,
    ) -> Self::Type {
    }

    fn map_type<F>(&mut self, ty: Self::Type, op: F) -> Self::Type
    where
        F: FnOnce(Box<TsType>) -> Box<TsType>,
    {
    }

    fn build_type_from<F>(&mut self, op: F) -> Self::Type
    where
        F: FnOnce() -> Box<TsType>,
    {
    }

    fn build_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Self::TypeAnn {}

    fn build_opt_ts_type_ann(&mut self, span: Span, ty: Self::Type) -> Option<TsTypeAnn> {
        None
    }

    fn convert_type_ann(&mut self, type_ann: Self::TypeAnn) -> Option<TsTypeAnn> {
        None
    }

    fn build_type_param(
        &mut self,
        span: Span,
        name: swc_ecma_ast::Ident,
        constraint: Option<Box<TsType>>,
        default: Option<Box<TsType>>,
    ) -> Self::TypeParam {
    }

    fn build_type_param_decl(
        &mut self,
        span: Span,
        params: Vec<Self::TypeParam>,
    ) -> Self::TypeParamDecl {
    }

    fn build_type_param_instantiation(
        &mut self,
        span: Span,
        params: Vec<Self::Type>,
    ) -> Self::TypeParamInstantiation {
    }

    fn convert_type_param_instantiation(
        &mut self,
        n: Self::TypeParamInstantiation,
    ) -> Option<TsTypeParamInstantiation> {
        None
    }

    fn convert_type_param_decl(&mut self, n: Self::TypeParamDecl) -> Option<TsTypeParamDecl> {
        None
    }
}

impl Sealed for StripPlugin {}
