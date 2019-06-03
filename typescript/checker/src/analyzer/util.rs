use crate::errors::Error;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use swc_common::Spanned;
use swc_ecma_ast::*;

pub(super) trait PatExt {
    fn set_ty(&mut self, ty: Option<Box<TsType>>);
}

impl PatExt for Pat {
    fn set_ty(&mut self, ty: Option<Box<TsType>>) {
        match *self {
            Pat::Array(ArrayPat {
                ref mut type_ann, ..
            })
            | Pat::Assign(AssignPat {
                ref mut type_ann, ..
            })
            | Pat::Ident(Ident {
                ref mut type_ann, ..
            })
            | Pat::Object(ObjectPat {
                ref mut type_ann, ..
            })
            | Pat::Rest(RestPat {
                ref mut type_ann, ..
            }) => {
                *type_ann = ty.map(|type_ann| TsTypeAnn {
                    span: type_ann.span(),
                    type_ann,
                })
            }

            Pat::Expr(ref pat) => {
                unreachable!("Cannot set type annottation for expression\n{:?}", pat)
            }
        }
    }
}

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
                )) => t.types.par_iter().any(|t| t.contains_undefined()),

                TsType::TsThisType(..) => false,
                _ => false,
            },
        }
    }

    fn assign_to(&self, to: &TsType) -> Vec<Error> {
        try_assign(
            to,
            match self.ann() {
                Some(v) => v,
                None => return vec![],
            },
        )
    }
}

fn try_assign(to: &TsType, rhs: &TsType) -> Vec<Error> {
    match *to {
        // let a: any = 'foo'
        TsType::TsKeywordType(TsKeywordType {
            kind: TsKeywordTypeKind::TsAnyKeyword,
            ..
        }) => return vec![],

        TsType::TsThisType(TsThisType { span }) => vec![Error::CannotAssingToThis { span }],

        // let a: string | number = 'string';
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
            TsUnionType { ref types, .. },
        )) => {
            let vs = types
                .par_iter()
                .map(|to| try_assign(&to, rhs))
                .collect::<Vec<_>>();
            if vs.iter().any(|v| v.is_empty()) {
                return vec![];
            }
            return vs.into_iter().flat_map(|v| v).collect();
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
