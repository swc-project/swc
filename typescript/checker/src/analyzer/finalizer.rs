use super::Analyzer;
use crate::{analyzer::util::ResultExt, ty, ty::Type};
use swc_common::{Fold, FoldWith, Spanned};

impl Analyzer<'_, '_> {
    pub(super) fn finalize(&mut self, module: ty::Module) -> ty::Module {
        let mut v = ExpandAll { analyzer: self };
        module.fold_with(&mut v)
    }
}

struct ExpandAll<'a, 'b, 'm> {
    analyzer: &'m mut Analyzer<'a, 'b>,
}

impl Fold<Type> for ExpandAll<'_, '_, '_> {
    fn fold(&mut self, ty: Type) -> Type {
        let ty: Type = ty.fold_children(self);

        match ty {
            Type::Ref(..) => self
                .analyzer
                .expand(ty.span(), ty.clone())
                .store(&mut self.analyzer.info.errors)
                .unwrap_or(ty),
            _ => ty.freeze(),
        }
    }
}
