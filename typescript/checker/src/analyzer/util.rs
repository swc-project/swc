use swc_ecma_ast::*;

pub(super) trait TypeExt {
    /// Returns type annotation.
    fn ann(&self) -> Option<&TsType>;
    fn contains_undefined(&self) -> bool {
        match self.ann() {
            None => true,
            Some(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                    ..
                }) => true,

                TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                    ref t,
                )) => t.types.iter().any(|t| t.contains_undefined()),

                TsType::TsThisType(..) => false,
            },
        }
    }
}

impl TypeExt for TsType {
    fn ann(&self) -> Option<&TsType> {
        Some(self)
    }
}

impl TypeExt for Option<TsType> {
    fn ann(&self) -> Option<&TsType> {
        self.as_ref()
    }
}

impl TypeExt for Option<&'_ TsType> {
    fn ann(&self) -> Option<&TsType> {
        *self
    }
}
