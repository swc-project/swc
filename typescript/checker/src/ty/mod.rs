use crate::{
    errors::Error,
    util::{CowUtil, EqIgnoreNameAndSpan, EqIgnoreSpan, IntoCow},
};
use std::{borrow::Cow, mem::transmute};
use swc_atoms::JsWord;
use swc_common::{Fold, FromVariant, Span, Spanned};
use swc_ecma_ast::{
    Bool, Class, Number, Str, TsArrayType, TsConstructorType, TsEnumDecl, TsFnOrConstructorType,
    TsFnParam, TsFnType, TsInterfaceDecl, TsIntersectionType, TsKeywordType, TsKeywordTypeKind,
    TsLit, TsLitType, TsModuleDecl, TsNamespaceDecl, TsThisType, TsType, TsTypeAliasDecl,
    TsTypeAnn, TsTypeLit, TsTypeParamDecl, TsUnionOrIntersectionType, TsUnionType,
};

pub trait TypeRefExt<'a>: Sized + Clone {
    fn into_type_ref(self) -> TypeRef<'a>;
    fn to_type_ref(&'a self) -> TypeRef<'a>;

    /// Returns generalized type if `self` is a literal type.
    fn generalize_lit(self) -> TypeRef<'a> {
        let ty = self.into_type_ref();
        match *ty {
            Type::Lit(TsLitType { span, ref lit }) => Type::Keyword(TsKeywordType {
                span,
                kind: match *lit {
                    TsLit::Bool(Bool { .. }) => TsKeywordTypeKind::TsBooleanKeyword,
                    TsLit::Number(Number { .. }) => TsKeywordTypeKind::TsNumberKeyword,
                    TsLit::Str(Str { .. }) => TsKeywordTypeKind::TsStringKeyword,
                },
            })
            .into_cow(),
            _ => return ty,
        }
    }

    fn to_static(&self) -> Type<'static> {
        self.clone().into_type_ref().into_owned().into_static()
    }

    fn cast<'b>(&'a self) -> TypeRef<'b>
    where
        'a: 'b,
    {
        // 'a lives longer than 'b, so this is ok
        unsafe { transmute::<TypeRef<'a>, TypeRef<'b>>(self.to_type_ref()) }
    }
}

impl<'a> TypeRefExt<'a> for TypeRef<'a> {
    #[inline(always)]
    fn into_type_ref(self) -> TypeRef<'a> {
        self
    }

    fn to_type_ref(&'a self) -> TypeRef<'a> {
        match *self {
            Cow::Borrowed(b) => Cow::Borrowed(b),
            Cow::Owned(ref o) => Cow::Borrowed(o),
        }
    }
}

impl<'a> TypeRefExt<'a> for Type<'a> {
    #[inline(always)]
    fn into_type_ref(self) -> TypeRef<'a> {
        Cow::Owned(self)
    }

    fn to_type_ref(&'a self) -> TypeRef<'a> {
        Cow::Borrowed(self)
    }
}

pub type TypeRef<'a> = Cow<'a, Type<'a>>;

#[derive(Debug, Fold, Clone, PartialEq, Spanned, FromVariant)]
pub enum Type<'a> {
    Lit(TsLitType),
    Keyword(TsKeywordType),
    Simple(Cow<'a, TsType>),
    Array(Array<'a>),
    Union(Union<'a>),
    Intersection(Intersection<'a>),
    Function(Function<'a>),
    Constructor(Constructor<'a>),

    EnumVariant(EnumVariant),

    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(Class),
}

// macro_rules! impl_from {
//     ($i:ident, $T:ty) => {
//         impl From<$T> for Type<'_> {
//             fn from(v: $T) -> Self {
//                 Type::$i(v)
//             }
//         }
//     };
//     ($i:ident, $T:path, $lt:lifetime) => {
//         impl From<$T<$lt>> for Type<$lt> {
//             fn from(v: $T) -> Self {
//                 Type::$i(v)
//             }
//         }
//     };
// }

// impl_from!(Lit, TsLitType);
// impl_from!(Keyword, TsKeywordType);
// impl_from!(Array, Array, 'a);
// impl_from!(Union, Union, 'a);
// impl_from!(Intersection, Intersection, 'a);
// impl_from!(EnumVariant, EnumVariant, 'a);
// impl_from!(Function, Function, 'a);
// impl_from!(Constructor, Constructor, 'a);
// impl_from!(Interface, TsInterfaceDecl);
// impl_from!(Alias, TsTypeAliasDecl);
// impl_from!(Enum, TsEnumDecl);
// impl_from!(Namespace, TsNamespaceDecl);
// impl_from!(Module, TsModuleDecl);
// impl_from!(Class);

impl From<TsType> for Type<'_> {
    fn from(ty: TsType) -> Self {
        match ty {
            TsType::TsLitType(ty) => ty.into(),
            TsType::TsKeywordType(ty) => ty.into(),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
                TsUnionType { span, types },
            )) => Union {
                span,
                types: types.into_iter().map(|v| v.into_cow()).collect(),
            }
            .into(),
            TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsIntersectionType(
                TsIntersectionType { span, types },
            )) => Intersection {
                span,
                types: types.into_iter().map(|v| v.into_cow()).collect(),
            }
            .into(),
            TsType::TsArrayType(TsArrayType {
                span,
                box elem_type,
            }) => Type::Array(Array {
                span,
                elem_type: box elem_type.into_cow(),
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
                ret_ty: box type_ann.type_ann.into_cow(),
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
                ret_ty: box type_ann.type_ann.into_cow(),
            }),
            _ => Type::Simple(ty.into_cow()),
        }
    }
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

/// FooEnum.A
#[derive(Debug, Fold, Clone, PartialEq, Spanned)]
pub struct EnumVariant {
    pub span: Span,
    pub enum_name: JsWord,
    pub name: JsWord,
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

impl Type<'_> {
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
                left: to.to_static(),
                right: self.to_static(),
                cause: vec![err],
            },
        })
    }
}

fn try_assign(to: &Type, rhs: &Type) -> Option<Error> {
    /// Ensure that $ty is valid.
    /// TsType::Array / TsType::FnOrConstructor / TsType::UnionOrIntersection is
    /// considered invalid
    macro_rules! verify {
        ($ty:expr) => {{
            if cfg!(debug_assertions) {
                match $ty {
                    Type::Simple(ref ty) => match **ty {
                        TsType::TsFnOrConstructorType(..)
                        | TsType::TsArrayType(..)
                        | TsType::TsKeywordType(..)
                        | TsType::TsLitType(..)
                        | TsType::TsUnionOrIntersectionType(..) => {
                            unreachable!("this type should be changed into `Type`")
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
        }};
    }
    verify!(to);
    verify!(rhs);

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
                    left: to.to_static(),
                    right: rhs.to_static(),
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
                    left: to.to_static(),
                    right: rhs.to_static(),
                    cause: vec![cause],
                })
            }
            _ => {
                return Some(Error::AssignFailed {
                    left: to.to_static(),
                    right: rhs.to_static(),
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
                | Type::Constructor(..)
                | Type::Enum(..)
                | Type::Class(..) => return None,

                Type::Simple(ref rhs) => match **rhs {
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
                left: to.to_static(),
                right: rhs.to_static(),
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
                right: rhs.to_static(),
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
                    right: rhs.to_static(),
                    cause: vec![],
                });
            }
            _ => {
                return Some(Error::AssignFailed {
                    left: Type::EnumVariant(l.clone()),
                    right: rhs.to_static(),
                    cause: vec![],
                })
            }
        },

        Type::Simple(ref l) => match **l {
            TsType::TsThisType(TsThisType { span }) => {
                return Some(Error::CannotAssingToThis { span })
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

impl From<TsTypeAnn> for Type<'_> {
    #[inline(always)]
    fn from(ann: TsTypeAnn) -> Self {
        ann.type_ann.into()
    }
}

impl<T> From<Box<T>> for Type<'_>
where
    T: Into<Self>,
{
    #[inline(always)]
    fn from(ty: Box<T>) -> Self {
        (*ty).into()
    }
}

impl Type<'_> {
    pub fn is_never(&self) -> bool {
        match &self {
            Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsNeverKeyword,
                ..
            }) => true,
            _ => false,
        }
    }

    pub const fn never<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsNeverKeyword,
        })
    }

    pub const fn undefined<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsUndefinedKeyword,
        })
    }

    pub const fn any<'any>(span: Span) -> Type<'any> {
        Type::Keyword(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsAnyKeyword,
        })
    }
}

fn static_type(ty: Cow<Type>) -> TypeRef<'static> {
    ty.into_owned().into_static().into_cow()
}

fn map_types<'a, 'b, F>(types: Vec<TypeRef<'a>>, map: F) -> Vec<TypeRef<'b>>
where
    F: Fn(TypeRef<'a>) -> TypeRef<'b>,
{
    types.into_iter().map(map).collect()
}

macro_rules! fix_lt {
    ($ty:expr, $map:expr, $map_simple:expr) => {
        match $ty {
            Type::Lit(lit) => Type::Lit(lit),
            Type::Keyword(lit) => Type::Keyword(lit),
            Type::Simple(s) => Type::Simple(s.into_owned().into_cow()),
            Type::Array(Array { span, elem_type }) => Type::Array(Array {
                span,
                elem_type: box $map(*elem_type),
            }),

            Type::Union(Union { span, types }) => Type::Union(Union {
                span,
                types: map_types(types, $map),
            }),
            Type::Intersection(Intersection { span, types }) => Type::Intersection(Intersection {
                span,
                types: map_types(types, $map),
            }),

            Type::Function(Function {
                span,
                type_params,
                params,
                ret_ty,
            }) => Type::Function(Function {
                span,
                type_params,
                params,
                ret_ty: box $map(*ret_ty),
            }),

            Type::Constructor(Constructor {
                span,
                type_params,
                params,
                ret_ty,
            }) => Type::Constructor(Constructor {
                span,
                type_params,
                params,
                ret_ty: box $map(*ret_ty),
            }),

            Type::Enum(e) => Type::Enum(e),
            Type::EnumVariant(e) => Type::EnumVariant(e),
            Type::Interface(t) => Type::Interface(t),
            Type::Class(c) => Type::Class(c),
            Type::Alias(a) => Type::Alias(a),
            Type::Namespace(n) => Type::Namespace(n),
            Type::Module(m) => Type::Module(m),
        }
    };
}

impl Type<'_> {
    pub fn into_static(self) -> Type<'static> {
        fix_lt!(self, static_type, |v: Cow<TsType>| v.into_owned())
    }
}

impl Type<'static> {
    /// Converts `Type<'static>` into `Type<'a>`.
    #[inline(always)]
    pub fn static_cast(&self) -> TypeRef {
        unsafe { transmute::<Cow<'_, Type<'static>>, TypeRef<'_>>(Cow::Borrowed(self)) }
    }
}

impl<'a> CowUtil<'a> for Type<'a> {}
