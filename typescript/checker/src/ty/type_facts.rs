use super::Type;
use crate::{ty, type_facts::TypeFacts};
use swc_common::Spanned;
use swc_ecma_ast::{TsKeywordType, TsKeywordTypeKind};
use ty::FoldWith;

pub(super) struct TypeFactsHandler {
    pub facts: TypeFacts,
}

impl ty::Fold for TypeFactsHandler {
    fn fold_ts_keyword_type(&mut self, ty: TsKeywordType) -> TsKeywordType {
        let keyword_types = &[
            (
                TypeFacts::TypeofNEString,
                TsKeywordTypeKind::TsStringKeyword,
            ),
            (
                TypeFacts::TypeofNENumber,
                TsKeywordTypeKind::TsNumberKeyword,
            ),
            (
                TypeFacts::TypeofNEBoolean,
                TsKeywordTypeKind::TsBooleanKeyword,
            ),
            (
                TypeFacts::TypeofNEBigInt,
                TsKeywordTypeKind::TsBigIntKeyword,
            ),
            (
                TypeFacts::TypeofNESymbol,
                TsKeywordTypeKind::TsSymbolKeyword,
            ),
        ];

        for (neq, kwd) in keyword_types {
            if self.facts.contains(*neq) {
                return TsKeywordType {
                    span: ty.span,
                    kind: TsKeywordTypeKind::TsNeverKeyword,
                };
            }
        }

        ty
    }

    fn fold_union(&mut self, mut u: ty::Union) -> ty::Union {
        u = u.fold_children_with(self);

        u.types.retain(|v| !v.is_never());

        u
    }

    fn fold_type(&mut self, ty: ty::Type) -> ty::Type {
        let ty = ty.fold_children_with(self);
        let span = ty.span();

        {
            let keyword_types = &[
                (
                    TypeFacts::TypeofEQString,
                    TsKeywordTypeKind::TsStringKeyword,
                ),
                (
                    TypeFacts::TypeofEQNumber,
                    TsKeywordTypeKind::TsNumberKeyword,
                ),
                (
                    TypeFacts::TypeofEQBoolean,
                    TsKeywordTypeKind::TsBooleanKeyword,
                ),
                (
                    TypeFacts::TypeofEQBigInt,
                    TsKeywordTypeKind::TsBigIntKeyword,
                ),
                (
                    TypeFacts::TypeofEQSymbol,
                    TsKeywordTypeKind::TsSymbolKeyword,
                ),
            ];

            let keywords = keyword_types.iter().filter_map(|(eq, kwd)| {
                if self.facts.contains(*eq) {
                    Some(kwd)
                } else {
                    None
                }
            });
            let keywords = keywords
                .map(|&kind| TsKeywordType { span, kind })
                .map(Type::Keyword)
                .map(Box::new)
                .collect::<Vec<_>>();
            if !keywords.is_empty() {
                return *Type::union(keywords);
            }
        }

        match ty {
            Type::Union(ref u) if u.types.is_empty() => return *Type::never(u.span),
            Type::Intersection(ref i) if i.types.iter().any(|ty| ty.is_never()) => {
                return *Type::never(i.span)
            }
            _ => {}
        }

        ty
    }
}
