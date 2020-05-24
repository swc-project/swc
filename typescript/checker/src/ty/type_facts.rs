use super::Type;
use crate::{ty::Union, type_facts::TypeFacts};
use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::{TsKeywordType, TsKeywordTypeKind};

impl Type {
    pub(crate) fn apply_type_facts(self, facts: TypeFacts) -> Type {
        self.fold_with(&mut Handler { facts })
    }
}

struct Handler {
    facts: TypeFacts,
}

impl Fold<TsKeywordType> for Handler {
    fn fold(&mut self, ty: TsKeywordType) -> TsKeywordType {
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
}

impl Fold<Union> for Handler {
    fn fold(&mut self, u: Union) -> Union {
        let mut u: Union = u.fold_children(self);

        u.types.retain(|v| !v.is_never());

        u
    }
}

impl Fold<Type> for Handler {
    fn fold(&mut self, ty: Type) -> Type {
        let ty = ty.fold_children(self);
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
                .collect::<Vec<_>>();
            if !keywords.is_empty() {
                return Type::union(keywords);
            }
        }

        match ty {
            Type::Union(ref u) if u.types.is_empty() => return Type::never(u.span),
            Type::Intersection(ref i) if i.types.iter().any(|ty| ty.is_never()) => {
                return Type::never(i.span)
            }
            _ => {}
        }

        ty
    }
}
