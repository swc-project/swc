use crate::{
    errors::Error,
    util::{EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use std::borrow::Cow;
use swc_common::{Fold, FromVariant, Spanned};
use swc_ecma_ast::*;

#[derive(Debug, Fold, Clone, PartialEq, FromVariant, Spanned)]
pub(crate) enum Type<'a> {
    Simple(Cow<'a, TsType>),
    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(ClassDecl),
}

impl<'a> From<&'a TsType> for Type<'a> {
    fn from(ty: &'a TsType) -> Self {
        Type::Simple(Cow::Borrowed(ty))
    }
}

impl<'a> From<TsType> for Type<'a> {
    fn from(ty: TsType) -> Self {
        Type::Simple(Cow::Owned(ty))
    }
}

impl<'a> Type<'a> {
    pub fn contains_void(&self) -> bool {
        let ty = match *self {
            Type::Simple(ref ty) => ty,
            _ => return false,
        };

        match **ty {
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsVoidKeyword,
                ..
            }) => true,

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(ref t)) => {
                t.types.iter().any(|t| t.contains_void())
            }

            TsType::TsThisType(..) => false,
            _ => false,
        }
    }

    pub fn is_any(&self) -> bool {
        match self.ann() {
            None => true,
            Some(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                    ..
                }) => true,

                TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                    ref t,
                )) => t.types.iter().any(|t| t.is_any()),

                TsType::TsThisType(..) => false,
                _ => false,
            },
        }
    }

    pub fn is_unknown(&self) -> bool {
        match self.ann() {
            None => true,
            Some(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUnknownKeyword,
                    ..
                }) => true,

                TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                    ref t,
                )) => t.types.iter().any(|t| t.is_unknown()),

                TsType::TsThisType(..) => false,
                _ => false,
            },
        }
    }

    pub fn contains_undefined(&self) -> bool {
        let ty = match *self {
            Type::Simple(ref ty) => ty,
            _ => return false,
        };
        match **ty {
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            }) => true,

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(ref t)) => {
                t.types.iter().any(|t| t.contains_undefined())
            }

            TsType::TsThisType(..) => false,
            _ => false,
        }
    }

    pub fn assign_to(&self, to: &Type) -> Option<Error> {
        try_assign(to, self).map(|err| match err {
            Error::AssignFailed { .. } => err,
            _ => Error::AssignFailed {
                left: to.clone(),
                right: self.clone(),
                cause: vec![err],
            },
        })
    }

    /// Returns generalized type if `self` is a literal type.
    pub fn generalize_lit(self) -> Self {
        match self {
            Type::Simple(ty) => match *ty {
                TsType::TsLitType(TsLitType { span, ref lit }) => TsKeywordType {
                    span,
                    kind: match *lit {
                        TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                        TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                        TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                    },
                }
                .into(),
                _ => self,
            },
            _ => self,
        }
    }
}

fn try_assign(to: &Type, rhs: &Type) -> Option<Error> {
    match *rhs {
        Type::Simple(r) => match *r {
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return None,

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => match *to {
                Type::Simple(l) => match *l {
                    TsType::TsKeywordType(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    })
                    | TsType::TsKeywordType(TsKeywordType {
                        kind: TsKeywordTypeKind::TsUnknownKeyword,
                        ..
                    }) => return None,
                    _ => {
                        return Some(Error::AssignFailed {
                            left: to.into_owned(),
                            right: rhs.into_owned(),
                            cause: vec![],
                        })
                    }
                },
            },

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                TsUnionType {
                    span, ref types, ..
                },
            )) => {
                let errors = types
                    .iter()
                    .filter_map(|rhs| try_assign(to, &Type::from(&**rhs)))
                    .collect::<Vec<_>>();
                if errors.is_empty() {
                    return None;
                }
                return Some(Error::UnionError { span, errors });
            }
        },
        _ => {}
    }

    // TODO(kdy1):
    let span = to.span();

    match *to {
        Type::Simple(l) => match *l {
            // let a: any = 'foo'
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return None,

            // let a: unknown = undefined
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => return None,

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsObjectKeyword,
                ..
            }) => {
                // let a: object = {};
                match *rhs {
                    Type::Simple(rhs) => match *rhs {
                        TsType::TsTypeLit(..)
                        | TsType::TsKeywordType(TsKeywordType {
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                            ..
                        })
                        | TsType::TsKeywordType(TsKeywordType {
                            kind: TsKeywordTypeKind::TsStringKeyword,
                            ..
                        })
                        | TsType::TsFnOrConstructorType(..) => return None,

                        _ => {}
                    },
                    _ => {}
                }
            }

            TsType::TsLitType(TsLitType { ref lit, .. }) => match *to {
                Type::Simple(ty) => match *ty {
                    TsType::TsLitType(TsLitType { lit: ref r_lit, .. }) => {
                        if lit.eq_ignore_span(r_lit) {
                            return None;
                        }
                    }
                },
                // TODO: allow
                // let a: true | false = bool
                _ => {}
            },

            TsType::TsThisType(TsThisType { span }) => {
                return Some(Error::CannotAssingToThis { span })
            }

            // let a: string | number = 'string';
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                TsUnionType { ref types, .. },
            )) => {
                let vs = types
                    .iter()
                    .map(|to| try_assign(&Type::from(&**to), rhs))
                    .collect::<Vec<_>>();
                if vs.iter().any(Option::is_none) {
                    return None;
                }
                return Some(Error::UnionError {
                    span,
                    errors: vs.into_iter().map(Option::unwrap).collect(),
                });
            }

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(
                TsIntersectionType { ref types, .. },
            )) => {
                let vs = types
                    .iter()
                    .map(|to| try_assign(&Type::from(&**to), rhs))
                    .collect::<Vec<_>>();

                for v in vs {
                    if let Some(error) = v {
                        return Some(Error::IntersectionError {
                            span,
                            error: box error,
                        });
                    }
                }

                return None;
            }

            TsType::TsArrayType(TsArrayType { ref elem_type, .. }) => match rhs {
                Type::Simple(rty) => match **rty {
                    TsType::TsArrayType(TsArrayType {
                        elem_type: ref rhs_elem_type,
                        ..
                    }) => {
                        return try_assign(&Type::from(&**elem_type), &Type::from(&**rhs_elem_type))
                            .map(|cause| Error::AssignFailed {
                                left: to.into_owned(),
                                right: rhs.into_owned(),
                                cause: vec![cause],
                            })
                    }
                    _ => {
                        return Some(Error::AssignFailed {
                            left: to.into_owned(),
                            right: rhs.into_owned(),
                            cause: vec![],
                        })
                    }
                },
            },

            TsType::TsKeywordType(TsKeywordType { kind, .. }) => {
                match *rhs {
                    Type::Simple(rhs) => match *rhs {
                        TsType::TsKeywordType(TsKeywordType { kind: rhs_kind, .. })
                            if rhs_kind == kind =>
                        {
                            return None
                        }
                    },
                    _ => {}
                }

                match kind {
                    TsKeywordTypeKind::TsStringKeyword => match *rhs {
                        Type::Simple(rhs) => match *rhs {
                            TsType::TsLitType(TsLitType {
                                lit: TsLit::Str(..),
                                ..
                            }) => return None,

                            _ => {}
                        },

                        _ => {}
                    },

                    TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                        Type::Simple(rhs) => match *rhs {
                            TsType::TsLitType(TsLitType {
                                lit: TsLit::Number(..),
                                ..
                            }) => return None,

                            _ => {}
                        },

                        _ => {}
                    },

                    TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                        Type::Simple(rhs) => match *rhs {
                            TsType::TsLitType(TsLitType {
                                lit: TsLit::Bool(..),
                                ..
                            }) => return None,

                            _ => {}
                        },

                        _ => {}
                    },

                    _ => {}
                }

                return Some(Error::AssignFailed {
                    left: to.into_owned(),
                    right: rhs.into_owned(),
                    cause: vec![],
                });
            }

            TsType::TsTypeLit(TsTypeLit { span, ref members }) => match rhs {
                Type::Simple(rhs) => match **rhs {
                    TsType::TsTypeLit(TsTypeLit {
                        members: ref rhs_members,
                        ..
                    }) => {
                        if members
                            .iter()
                            .all(|m| rhs_members.iter().any(|rm| rm.eq_ignore_name_and_span(m)))
                        {
                            return None;
                        }

                        let missing_fields = members
                            .iter()
                            .filter(|m| rhs_members.iter().all(|rm| !rm.eq_ignore_name_and_span(m)))
                            .cloned()
                            .collect();
                        return Some(Error::MissingFields {
                            span,
                            fields: missing_fields,
                        });
                    }

                    _ => {}
                },
                _ => {}
            },

            _ => {}
        },
    }

    // This is slow (at the time of writing)
    if to.eq_ignore_name_and_span(&rhs) {
        return None;
    }

    unimplemented!("assign: \nLeft: {:?}\nRight: {:?}", to, rhs)
}

impl From<TsTypeAnn> for Type<'_> {
    fn from(ann: TsTypeAnn) -> Self {
        Type::Simple(Cow::Owned(*ann.type_ann))
    }
}

impl<'a> Type<'a> {
    fn into_owned(self) -> Type<'static> {
        match self {
            Type::Simple(c) => Type::Simple(Cow::Owned(c.into_owned())),
            Type::Alias(a) => Type::Alias(a),
            Type::Interface(i) => Type::Interface(i),
            Type::Enum(e) => Type::Enum(e),
            Type::Namespace(ns) => Type::Namespace(ns),
            Type::Module(m) => Type::Module(m),
            Type::Class(c) => Type::Class(c),
        }
    }
}
