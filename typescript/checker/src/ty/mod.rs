use crate::{
    errors::Error,
    util::{CowUtil, EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use std::borrow::Cow;
use swc_common::{Fold, FromVariant, Span, Spanned};
use swc_ecma_ast::{
    Bool, Class, Number, Str, TsEnumDecl, TsFnParam, TsInterfaceDecl, TsKeywordType,
    TsKeywordTypeKind, TsLit, TsLitType, TsModuleDecl, TsNamespaceDecl, TsThisType, TsType,
    TsTypeAliasDecl, TsTypeAnn, TsTypeLit, TsTypeParamDecl,
};

pub type TypeRef<'a> = Cow<'a, Type>;

#[derive(Debug, Fold, Clone, PartialEq, FromVariant, Spanned)]
pub enum Type {
    Lit(TsLitType),
    Keyword(TsKeywordType),
    Simple(TsType),
    Array(Array),
    Union(Union),
    Intersection(Intersection),
    Function(Function),
    Constructor(Constructor),

    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
    Namespace(TsNamespaceDecl),
    Module(TsModuleDecl),
    Class(Class),
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
            Type::Simple(ty) => match ty {
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

        Type::Keyword(TsKeywordType { kind, .. }) => {
            match *rhs {
                Type::Keyword(TsKeywordType { kind: rhs_kind, .. }) if rhs_kind == kind => {
                    return None
                }
                _ => {}
            }

            match kind {
                TsKeywordTypeKind::TsStringKeyword => match *rhs {
                    Type::Simple(ref rhs) => match *rhs {
                        TsType::TsLitType(TsLitType {
                            lit: TsLit::Str(..),
                            ..
                        }) => return None,

                        _ => {}
                    },

                    _ => {}
                },

                TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                    Type::Simple(ref rhs) => match *rhs {
                        TsType::TsLitType(TsLitType {
                            lit: TsLit::Number(..),
                            ..
                        }) => return None,

                        _ => {}
                    },

                    _ => {}
                },

                TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                    Type::Simple(ref rhs) => match *rhs {
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
                left: to.clone(),
                right: rhs.clone(),
                cause: vec![],
            });
        }

        Type::Simple(ref l) => match *l {
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
                    Type::Simple(ref rhs) => match *rhs {
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
