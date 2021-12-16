use crate::plugin::{internal::Sealed, TypeScriptPlugin};
use swc_ecma_ast::*;

#[derive(Debug, Clone, Default)]
pub struct StripPlugin {}

impl TypeScriptPlugin for StripPlugin {
    type Type = ();

    #[inline(always)]
    fn process_type_element(&mut self, _: TsTypeElement) -> Option<TsTypeElement> {
        None
    }

    #[inline(always)]
    fn process_type_param(&mut self, _: TsTypeParam) -> Option<TsTypeParam> {
        None
    }

    #[inline(always)]
    fn process_enum_member(&mut self, _: TsEnumMember) -> Option<TsEnumMember> {
        None
    }

    #[inline(always)]
    fn process_expr_with_type_args(
        &mut self,
        mut ty: TsExprWithTypeArgs,
    ) -> Option<TsExprWithTypeArgs> {
        ty.type_args = None;
        Some(ty)
    }

    #[inline(always)]
    fn process_tuple_element(&mut self, _: TsTupleElement) -> Option<TsTupleElement> {
        None
    }

    #[inline(always)]
    fn process_type(&mut self, _: Box<TsType>) -> Option<Box<TsType>> {
        None
    }

    #[inline(always)]
    fn process_type_ann(&mut self, _: TsTypeAnn) -> Option<TsTypeAnn> {
        None
    }
}

impl Sealed for StripPlugin {}
