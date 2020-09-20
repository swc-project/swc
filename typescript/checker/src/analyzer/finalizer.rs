use super::Analyzer;
use crate::{analyzer::util::ResultExt, ty, ty::Type};
use swc_common::Spanned;
use swc_ts_types::FoldWith as _;

impl Analyzer<'_, '_> {
    pub(super) fn finalize(&mut self, module: ty::Module) -> ty::Module {
        let mut v = ExpandAll { analyzer: self };
        module.fold_with(&mut v)
    }
}

struct ExpandAll<'a, 'b, 'm> {
    analyzer: &'m mut Analyzer<'a, 'b>,
}

impl ty::Fold for ExpandAll<'_, '_, '_> {
    fn fold_type(&mut self, ty: Type) -> Type {
        let ty: Type = ty.fold_children_with(self);

        match ty {
            Type::Ref(..) => *self
                .analyzer
                .expand(ty.span(), box ty.clone())
                .store(&mut self.analyzer.info.errors)
                .unwrap_or_else(|| box ty),
            _ => *ty.freeze(),
        }
    }
}
