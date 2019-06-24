use super::{Array, Intersection, Type, TypeLit, TypeRefExt, Union};
use crate::{
    errors::Error,
    util::{EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use swc_common::Spanned;
use swc_ecma_ast::*;

impl Type<'_> {
    pub fn assign_to(&self, to: &Type) -> Result<(), Error> {
        try_assign(to, self).map_err(|err| match err {
            Error::AssignFailed { .. } => err,
            _ => Error::AssignFailed {
                left: to.to_static(),
                right: self.to_static(),
                cause: vec![err],
            },
        })
    }
}

fn try_assign(to: &Type, rhs: &Type) -> Result<(), Error> {
    /// Ensure that $ty is valid.
    /// Type::Array / Type::FnOrConstructor / Type::UnionOrIntersection is
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
                        | TsType::TsUnionOrIntersectionType(..)
                        | TsType::TsTypeLit(..)
                        | TsType::TsThisType(..) => {
                            unreachable!("this type should be converted to `Type`")
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

    match *rhs.as_ref() {
        Type::Union(Union {
            ref types, span, ..
        }) => {
            let errors = types
                .iter()
                .filter_map(|rhs| match try_assign(to, rhs) {
                    Ok(()) => None,
                    Err(err) => Some(err),
                })
                .collect::<Vec<_>>();
            if errors.is_empty() {
                return Ok(());
            }
            return Err(Error::UnionError { span, errors });
        }

        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsAnyKeyword,
            ..
        }) => return Ok(()),

        // Handle unknown on rhs
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsUnknownKeyword,
            ..
        }) => {
            if to.is_keyword(TsKeywordTypeKind::TsAnyKeyword)
                || to.is_keyword(TsKeywordTypeKind::TsUndefinedKeyword)
            {
                return Ok(());
            }

            return Err(Error::AssignFailed {
                left: to.to_static(),
                right: rhs.to_static(),
                cause: vec![],
            });
        }

        _ => {}
    }

    // TODO(kdy1):
    let span = to.span();

    match *to.as_ref() {
        Type::Array(Array { ref elem_type, .. }) => match rhs {
            Type::Array(Array {
                elem_type: ref rhs_elem_type,
                ..
            }) => {
                //
                return try_assign(&elem_type, &rhs_elem_type).map_err(|cause| {
                    Error::AssignFailed {
                        left: to.to_static(),
                        right: rhs.to_static(),
                        cause: vec![cause],
                    }
                });
            }
            _ => {
                return Err(Error::AssignFailed {
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
            if vs.iter().any(Result::is_ok) {
                return Ok(());
            }
            return Err(Error::UnionError {
                span,
                errors: vs.into_iter().map(Result::unwrap_err).collect(),
            });
        }

        Type::Intersection(Intersection { ref types, .. }) => {
            let vs = types
                .iter()
                .map(|to| try_assign(&to, rhs))
                .collect::<Vec<_>>();

            // TODO: Multiple error
            for v in vs {
                if let Err(error) = v {
                    return Err(Error::IntersectionError {
                        span,
                        error: box error,
                    });
                }
            }

            return Ok(());
        }

        // let a: any = 'foo'
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsAnyKeyword,
            ..
        }) => return Ok(()),

        // let a: unknown = undefined
        Type::Keyword(TsKeywordType {
            kind: TsKeywordTypeKind::TsUnknownKeyword,
            ..
        }) => return Ok(()),

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
                | Type::Class(..)
                | Type::TypeLit(..) => return Ok(()),

                _ => {}
            }
        }

        // Handle same keyword type.
        Type::Keyword(TsKeywordType { kind, .. }) => {
            match *rhs {
                Type::Keyword(TsKeywordType { kind: rhs_kind, .. }) if rhs_kind == kind => {
                    return Ok(())
                }
                _ => {}
            }

            match kind {
                TsKeywordTypeKind::TsStringKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Str(..),
                        ..
                    }) => return Ok(()),

                    _ => {}
                },

                TsKeywordTypeKind::TsNumberKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Number(..),
                        ..
                    }) => return Ok(()),

                    _ => {}
                },

                TsKeywordTypeKind::TsBooleanKeyword => match *rhs {
                    Type::Lit(TsLitType {
                        lit: TsLit::Bool(..),
                        ..
                    }) => return Ok(()),

                    _ => {}
                },

                _ => {}
            }

            return Err(Error::AssignFailed {
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
                        return Ok(());
                    }
                }
                _ => {}
            }

            return Err(Error::AssignFailed {
                left: Type::Enum(e.clone()),
                right: rhs.to_static(),
                cause: vec![],
            });
        }

        Type::EnumVariant(ref l) => match *rhs {
            Type::EnumVariant(ref r) => {
                if l.enum_name == r.enum_name && l.name == r.name {
                    return Ok(());
                }

                return Err(Error::AssignFailed {
                    left: Type::EnumVariant(l.clone()),
                    right: rhs.to_static(),
                    cause: vec![],
                });
            }
            _ => {
                return Err(Error::AssignFailed {
                    left: Type::EnumVariant(l.clone()),
                    right: rhs.to_static(),
                    cause: vec![],
                })
            }
        },

        Type::This(TsThisType { span }) => return Err(Error::CannotAssingToThis { span }),

        Type::TypeLit(TypeLit { span, ref members }) => match rhs {
            Type::TypeLit(TypeLit {
                members: ref rhs_members,
                ..
            }) => {
                // TODO: Assign property to proerty, instead of checking equality

                if members
                    .iter()
                    .all(|m| rhs_members.iter().any(|rm| rm.eq_ignore_name_and_span(m)))
                {
                    return Ok(());
                }

                let missing_fields = members
                    .iter()
                    .filter(|m| rhs_members.iter().all(|rm| !rm.eq_ignore_name_and_span(m)))
                    .cloned()
                    .map(|v| v.into_static())
                    .collect();
                return Err(Error::MissingFields {
                    span,
                    fields: missing_fields,
                });
            }

            _ => {}
        },

        Type::Lit(TsLitType { ref lit, .. }) => match *to {
            Type::Lit(TsLitType { lit: ref r_lit, .. }) => {
                if lit.eq_ignore_span(r_lit) {
                    return Ok(());
                }

                {};
            }
            // TODO: allow
            // let a: true | false = bool
            _ => {}
        },

        _ => {}
    }

    // This is slow (at the time of writing)
    if to.eq_ignore_name_and_span(&rhs) {
        return Ok(());
    }

    // Some(Error::Unimplemented {
    //     span,
    //     msg: format!("Not implemented yet"),
    // })
    unimplemented!("assign: \nLeft: {:?}\nRight: {:?}", to, rhs)
}
