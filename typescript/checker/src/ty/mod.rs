use crate::{
    errors::Error,
    util::{CowUtil, EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use std::borrow::Cow;
use swc_atoms::JsWord;
use swc_common::{Fold, Span, Spanned};
use swc_ecma_ast::{
    Bool, Class, Number, Str, TsArrayType, TsConstructorType, TsEnumDecl, TsFnOrConstructorType,
    TsFnParam, TsFnType, TsInterfaceDecl, TsIntersectionType, TsKeywordType, TsKeywordTypeKind,
    TsLit, TsLitType, TsModuleDecl, TsNamespaceDecl, TsThisType, TsType, TsTypeAliasDecl,
    TsTypeAnn, TsTypeLit, TsTypeParamDecl, TsUnionOrIntersectionType, TsUnionType,
};

pub type TypeRef<'a> = Cow<'a, Type>;

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub enum Type {
    Lit(TsLitType),
    Keyword(TsKeywordType),
    Simple(TsType),
    Array(Array),
    Union(Union),
    Intersection(Intersection),
    Function(Function),
    Constructor(Constructor),

    EnumVariant(EnumVariant),

    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(Class),
}

macro_rules! impl_from {
    ($i:ident) => {
        impl_from!($i, $i);
    };

    ($i:ident, $T:ty) => {
        impl From<$T> for Type {
            fn from(v: $T) -> Self {
                Type::$i(v)
            }
        }
    };
}

impl_from!(Lit, TsLitType);
impl_from!(Keyword, TsKeywordType);
impl_from!(Array);
impl_from!(Union);
impl_from!(Intersection);
impl_from!(EnumVariant);
impl_from!(Function);
impl_from!(Constructor);

impl_from!(Interface, TsInterfaceDecl);
impl_from!(Alias, TsTypeAliasDecl);
impl_from!(Enum, TsEnumDecl);
impl_from!(Namespace, TsNamespaceDecl);
impl_from!(Module, TsModuleDecl);
impl_from!(Class);

impl From<TsType> for Type {
    fn from(ty: TsType) -> Self {
        match ty {
            TsType::TsLitType(ty) => ty.into(),
            TsType::TsKeywordType(ty) => ty.into(),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                TsUnionType { span, types },
            )) => Union {
                span,
                types: types.into_iter().map(From::from).collect(),
            }
            .into(),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(
                TsIntersectionType { span, types },
            )) => Intersection {
                span,
                types: types.into_iter().map(From::from).collect(),
            }
            .into(),
            TsType::TsArrayType(TsArrayType {
                span,
                box elem_type,
            }) => Type::Array(Array {
                span,
                elem_type: box elem_type.into(),
            }),
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
                span,
                params,
                type_params,
                type_ann,
            })) => Type::Function(Function {
                span,
                params,
                type_params,
                ret_ty: box type_ann.type_ann.into(),
            }),
            TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(
                TsConstructorType {
                    span,
                    params,
                    type_params,
                    type_ann,
                },
            )) => Type::Constructor(Constructor {
                span,
                params,
                type_params,
                ret_ty: box type_ann.type_ann.into(),
            }),
            _ => Type::Simple(ty),
        }
    }
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Array {
    pub span: Span,
    pub elem_type: Box<Type>,
}

/// a | b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Union {
    pub span: Span,
    pub types: Vec<Type>,
}

/// a & b
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Intersection {
    pub span: Span,
    pub types: Vec<Type>,
}

/// FooEnum.A
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct EnumVariant {
    pub span: Span,
    pub enum_name: JsWord,
    pub name: JsWord,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Function {
    pub span: Span,
    pub type_params: Option<TsTypeParamDecl>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<Type>,
}

#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct Constructor {
    pub span: Span,
    pub type_params: Option<TsTypeParamDecl>,
    pub params: Vec<TsFnParam>,
    pub ret_ty: Box<Type>,
}

impl Type {
    pub fn contains_void(&self) -> bool {
        match *self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsVoidKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_void()),

            _ => false,
        }
    }

    pub fn is_any(&self) -> bool {
        match *self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_any()),

            _ => false,
        }
    }

    pub fn is_unknown(&self) -> bool {
        match *self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.is_unknown()),

            _ => false,
        }
    }

    pub fn contains_undefined(&self) -> bool {
        match *self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUndefinedKeyword,
                ..
            }) => true,

            Type::Union(ref t) => t.types.iter().any(|t| t.contains_undefined()),

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
            Type::Lit(TsLitType { span, ref lit }) => Type::Keyword(TsKeywordType {
                span,
                kind: match *lit {
                    TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                    TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                    TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                },
            })
            .into(),
            Type::Simple(ty) => ty.into(),
            v => v,
        }
    }
}

fn try_assign(to: &Type, rhs: &Type) -> Option<Error> {
    for (i, ty) in [to, rhs].iter().enumerate() {
        match *ty {
            Type::Simple(ref ty) => match *ty {
                TsType::TsFnOrConstructorType(..)
                | TsType::TsArrayType(..)
                | TsType::TsUnionOrIntersectionType(..) => unreachable!("i = ({})", i),
                _ => {}
            },
            _ => {}
        }
    }

    match *rhs {
        Type::Union(Union {
            ref types, span, ..
        }) => {
            let errors = types
                .iter()
                .filter_map(|rhs| try_assign(to, rhs))
                .collect::<Vec<_>>();
            if errors.is_empty() {
                return None;
            }
            return Some(Error::UnionError { span, errors });
        }

        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsAnyKeyword,
            ..
        }) => return None,

        // Handle unknown on rhs
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsUnknownKeyword,
            ..
        }) => match *to {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsAnyKeyword,
                ..
            })
            | Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            }) => return None,
            _ => {
                return Some(Error::AssignFailed {
                    left: to.clone(),
                    right: rhs.clone(),
                    cause: vec![],
                })
            }
        },

        _ => {}
    }

    // TODO(kdy1):
    let span = to.span();

    match *to {
        Type::Array(Array { ref elem_type, .. }) => match rhs {
            Type::Array(Array {
                elem_type: ref rhs_elem_type,
                ..
            }) => {
                return try_assign(&elem_type, &rhs_elem_type).map(|cause| Error::AssignFailed {
                    left: to.clone(),
                    right: rhs.clone(),
                    cause: vec![cause],
                })
            }
            _ => {
                return Some(Error::AssignFailed {
                    left: to.clone(),
                    right: rhs.clone(),
                    cause: vec![],
                })
            }
        },

        // let a: string | number = 'string';
        Type::Union(Union { ref types, .. }) => {
            let vs = types
                .iter()
                .map(|to| try_assign(&to, rhs))
                .collect::<Vec<_>>();
            if vs.iter().any(Option::is_none) {
                return None;
            }
            return Some(Error::UnionError {
                span,
                errors: vs.into_iter().map(Option::unwrap).collect(),
            });
        }

        Type::Intersection(Intersection { ref types, .. }) => {
            let vs = types
                .iter()
                .map(|to| try_assign(&to, rhs))
                .collect::<Vec<_>>();

            // TODO: Multiple error
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

        // let a: any = 'foo'
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsAnyKeyword,
            ..
        }) => return None,

        // let a: unknown = undefined
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsUnknownKeyword,
            ..
        }) => return None,

        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsObjectKeyword,
            ..
        }) => {
            // let a: object = {};
            match *rhs {
                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    ..
                })
                | Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsStringKeyword,
                    ..
                })
                | Type::Function(..)
                | Type::Constructor(..) => return None,

                Type::Simple(ref rhs) => match *rhs {
                    TsType::TsTypeLit(..) => return None,

                    _ => {}
                },
                _ => {}
            }
        }

        // Handle same keyword type.
        Type::Keyword(TsKeywordType { kind, .. }) => {
            match *rhs {
                Type::Keyword(TsKeywordType { kind: rhs_kind, .. }) if rhs_kind == kind => {
                    return None
                }
                _ => {}
            }

            match kind {
                TsKeywordTypeKind::TsStringKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Str(..),
                        ..
                    }) => return None,

                    _ => {}
                },

                TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Number(..),
                        ..
                    }) => return None,

                    _ => {}
                },

                TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Bool(..),
                        ..
                    }) => return None,

                    _ => {}
                },

                _ => {}
            }

            return Some(Error::AssignFailed {
                left: to.clone(),
                right: rhs.clone(),
                cause: vec![],
            });
        }

        Type::Enum(ref e) => {
            //
            match *rhs {
                Type::EnumVariant(ref r) => {
                    if r.enum_name == e.id.sym {
                        return None;
                    }
                }
                _ => {}
            }

            return Some(Error::AssignFailed {
                left: Type::Enum(e.clone()),
                right: rhs.clone(),
                cause: vec![],
            });
        }

        Type::EnumVariant(ref l) => match *rhs {
            Type::EnumVariant(ref r) => {
                if l.enum_name == r.enum_name && l.name == r.name {
                    return None;
                }

                return Some(Error::AssignFailed {
                    left: Type::EnumVariant(l.clone()),
                    right: rhs.clone(),
                    cause: vec![],
                });
            }
            _ => {
                return Some(Error::AssignFailed {
                    left: Type::EnumVariant(l.clone()),
                    right: rhs.clone(),
                    cause: vec![],
                })
            }
        },

        Type::Simple(ref l) => match *l {
            TsType::TsThisType(TsThisType { span }) => {
                return Some(Error::CannotAssingToThis { span })
            }

            TsType::TsTypeLit(TsTypeLit { span, ref members }) => match rhs {
                Type::Simple(ref rhs) => match *rhs {
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

        Type::Lit(TsLitType { ref lit, .. }) => match *to {
            Type::Lit(TsLitType { lit: ref r_lit, .. }) => {
                if lit.eq_ignore_span(r_lit) {
                    return None;
                }
            }
            // TODO: allow
            // let a: true | false = bool
            _ => {}
        },

        _ => {}
    }

    // This is slow (at the time of writing)
    if to.eq_ignore_name_and_span(&rhs) {
        return None;
    }

    // Some(Error::Unimplemented {
    //     span,
    //     msg: format!("Not implemented yet"),
    // })
    unimplemented!("assign: \nLeft: {:?}\nRight: {:?}", to, rhs)
}

impl From<TsTypeAnn> for Type {
    fn from(ann: TsTypeAnn) -> Self {
        ann.type_ann.into()
    }
}

impl<T> From<Box<T>> for Type
where
    T: Into<Self>,
{
    fn from(ty: Box<T>) -> Self {
        (*ty).into()
    }
}

impl Type {
    pub fn is_never(&self) -> bool {
        match &self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsNeverKeyword,
                ..
            }) => true,
            _ => false,
        }
    }

    pub const fn never(span: Span) -> Type {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsNeverKeyword,
        })
    }

    pub const fn undefined(span: Span) -> Type {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUndefinedKeyword,
        })
    }

    pub const fn any(span: Span) -> Type {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        })
    }
}

impl CowUtil<'_> for Type {}
