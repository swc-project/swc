use std::mem::replace;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
/// Helper for migration from [Fold] to [VisitMut]
pub(crate) trait MapWithMut: Sized {
    fn dummy() -> Self;

    fn take(&mut self) -> Self {
        replace(self, Self::dummy())
    }

    #[inline]
    fn map_with_mut<F>(&mut self, op: F)
    where
        F: FnOnce(Self) -> Self,
    {
        let dummy = Self::dummy();
        let v = replace(self, dummy);
        let v = op(v);
        let _dummy = replace(self, v);
    }
}

impl MapWithMut for ModuleItem {
    #[inline(always)]
    fn dummy() -> Self {
        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
    }
}

impl MapWithMut for Stmt {
    #[inline(always)]
    fn dummy() -> Self {
        Stmt::Empty(EmptyStmt { span: DUMMY_SP })
    }
}

impl MapWithMut for Expr {
    #[inline(always)]
    fn dummy() -> Self {
        Expr::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl MapWithMut for Pat {
    #[inline(always)]
    fn dummy() -> Self {
        Pat::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl<T> MapWithMut for Option<T> {
    #[inline(always)]
    fn dummy() -> Self {
        None
    }
}

impl<T> MapWithMut for Vec<T> {
    #[inline(always)]
    fn dummy() -> Self {
        Vec::new()
    }
}

impl<T> MapWithMut for Box<T>
where
    T: MapWithMut,
{
    #[inline(always)]
    fn dummy() -> Self {
        Box::new(T::dummy())
    }
}

impl MapWithMut for Ident {
    fn dummy() -> Self {
        Ident::new(js_word!(""), DUMMY_SP)
    }
}

impl MapWithMut for ObjectPatProp {
    fn dummy() -> Self {
        ObjectPatProp::Assign(AssignPatProp {
            span: DUMMY_SP,
            key: Ident::dummy(),
            value: None,
        })
    }
}
