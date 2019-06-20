use crate::{
    errors::Error,
    util::{EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use std::borrow::Cow;
use swc_common::{Fold, FromVariant, Span, Spanned};
use swc_ecma_ast::{
    Bool, Class, Number, Str, TsArrayType, TsEnumDecl, TsFnParam, TsInterfaceDecl,
    TsIntersectionType, TsKeywordType, TsKeywordTypeKind, TsLit, TsLitType, TsModuleDecl,
    TsNamespaceDecl, TsThisType, TsType, TsTypeAliasDecl, TsTypeAnn, TsTypeLit, TsTypeParamDecl,
    TsUnionOrIntersectionType, TsUnionType,
};

pub(crate) type TypeRef<'a> = Cow<'a, Type<'a>>;

#[derive(Debug, Fold, Clone, PartialEq, FromVariant, Spanned)]
pub(crate) enum Type<'a> {
    Simple(Cow<'a, TsType>),
    Array(Array<'a>),
    Union(Union<'a>),
    Intersection(Intersection<'a>),
    Function(Function<'a>),
    Constructor(Constructor<'a>),

    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(Class),
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Array<'a> {
    pub span: Span,
    pub elem_type: Box<TypeRef<'a>>,
}

/// a | b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Union<'a> {
    pub span: Span,
    pub types: Vec<TypeRef<'a>>,
}

/// a & b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Intersection<'a> {
    pub span: Span,
    pub types: Vec<TypeRef<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Function<'a> {
    pub span: Span,
    pub type_params: Option<TsTypeParamDecl>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<TypeRef<'a>>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Constructor<'a> {
    pub span: Span,
    pub type_params: Option<TsTypeParamDecl>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<TypeRef<'a>>,
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

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(ref t)) => t
                .types
                .iter()
                .map(|ty| Type::from(&**ty))
                .any(|t| t.contains_void()),

            TsType::TsThisType(..) => false,
            _ => false,
        }
    }

    pub fn is_any(&self) -> bool {
        match *self {
            Type::Simple(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                    ..
                }) => true,

                TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                    ref t,
                )) => t
                    .types
                    .iter()
                    .map(|ty| Type::from(&**ty))
                    .any(|t| t.is_any()),

                TsType::TsThisType(..) => false,
                _ => false,
            },
        }
    }

    pub fn is_unknown(&self) -> bool {
        match *self {
            Type::Simple(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUnknownKeyword,
                    ..
                }) => true,

                TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                    ref t,
                )) => t
                    .types
                    .iter()
                    .map(|t| Type::from(&**t))
                    .any(|t| t.is_unknown()),

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

            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(ref t)) => t
                .types
                .iter()
                .map(|t| Type::from(&**t))
                .any(|t| t.contains_undefined()),

            TsType::TsThisType(..) => false,
            _ => false,
        }
    }

    pub fn assign_to(&self, to: &Type) -> Option<Error> {
        try_assign(to, self).map(|err| match err {
            Error::AssignFailed { .. } => err,
            _ => Error::AssignFailed {
                left: to.clone().into_owned(),
                right: self.clone().into_owned(),
                cause: vec![err],
            },
        })
    }

    /// Returns generalized type if `self` is a literal type.
    pub fn generalize_lit(self) -> Self {
        match self {
            Type::Simple(ty) => match *ty {
                TsType::TsLitType(TsLitType { span, ref lit }) => {
                    TsType::TsKeywordType(TsKeywordType {
                        span,
                        kind: match *lit {
                            TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                            TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                            TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                        },
                    })
                    .into()
                }
                _ => ty.into(),
            },
            v => v,
        }
    }
}

fn try_assign(to: &Type, rhs: &Type) -> Option<Error> {
    match *rhs {
        Type::Simple(ref r) => match **r {
            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => return None,

            TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => match *to {
                Type::Simple(ref l) => match **l {
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
                            left: to.clone().into_owned(),
                            right: rhs.clone().into_owned(),
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
        Type::Simple(ref l) => match **l {
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
                    Type::Simple(ref rhs) => match **rhs {
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
                Type::Simple(ref ty) => match **ty {
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
                                left: to.clone().into_owned(),
                                right: rhs.clone().into_owned(),
                                cause: vec![cause],
                            })
                    }
                    _ => {
                        return Some(Error::AssignFailed {
                            left: to.clone().into_owned(),
                            right: rhs.clone().into_owned(),
                            cause: vec![],
                        })
                    }
                },
            },

            TsType::TsKeywordType(TsKeywordType { kind, .. }) => {
                match *rhs {
                    Type::Simple(ref rhs) => match **rhs {
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
                        Type::Simple(ref rhs) => match **rhs {
                            TsType::TsLitType(TsLitType {
                                lit: TsLit::Str(..),
                                ..
                            }) => return None,

                            _ => {}
                        },

                        _ => {}
                    },

                    TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                        Type::Simple(ref rhs) => match **rhs {
                            TsType::TsLitType(TsLitType {
                                lit: TsLit::Number(..),
                                ..
                            }) => return None,

                            _ => {}
                        },

                        _ => {}
                    },

                    TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                        Type::Simple(ref rhs) => match **rhs {
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
                    left: to.clone().into_owned(),
                    right: rhs.clone().into_owned(),
                    cause: vec![],
                });
            }

            TsType::TsTypeLit(TsTypeLit { span, ref members }) => match rhs {
                Type::Simple(ref rhs) => match **rhs {
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
    pub fn into_owned(self) -> Type<'static> {
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

    pub fn is_never(&self) -> bool {
        match *self {
            Type::Simple(ref ty) => match **ty {
                TsType::TsKeywordType(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNeverKeyword,
                    ..
                }) => false,
                _ => true,
            },
            _ => false,
        }
    }

    pub fn never(span: Span) -> Type<'static> {
        TsType::TsKeywordType(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsNeverKeyword,
        })
        .into()
    }

    pub const fn undefined(span: Span) -> Type<'static> {
        TsType::TsKeywordType(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUndefinedKeyword,
        })
        .into()
    }

    pub const fn any(span: Span) -> Type<'static> {
        TsType::TsKeywordType(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        })
        .into()
    }
}
