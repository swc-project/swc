use self::internal::Sealed;
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

pub trait TypeScriptPlugin: Sized + Clone + Sealed {
    fn process_type_element(&mut self, el: TsTypeElement) -> Option<TsTypeElement> {
        Some(el)
    }

    fn process_type_param(&mut self, el: TsTypeParam) -> Option<TsTypeParam> {
        Some(el)
    }

    fn process_enum_member(&mut self, el: TsEnumMember) -> Option<TsEnumMember> {
        Some(el)
    }

    fn process_expr_with_type_args(
        &mut self,
        el: TsExprWithTypeArgs,
    ) -> Option<TsExprWithTypeArgs> {
        Some(el)
    }

    fn process_tuple_element(&mut self, el: TsTupleElement) -> Option<TsTupleElement> {
        Some(el)
    }

    fn process_type(&mut self, el: Box<TsType>) -> Option<Box<TsType>> {
        Some(el)
    }

    fn process_type_ann(&mut self, n: TsTypeAnn) -> Option<TsTypeAnn> {
        Some(n)
    }
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

impl TypeScriptPlugin for NoopPlugin {}

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
        todo!()
    }
}

impl<T> Sealed for Plugins<T> {}
