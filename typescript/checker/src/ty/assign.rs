use super::{Array, Interface, Intersection, Type, TypeLit, TypeRefExt, Union};
use crate::{
    errors::Error,
    util::{EqIgnoreNameAndSpan, EqIgnoreSpan},
};
use swc_common::Span;
use swc_ecma_ast::*;

impl Type<'_> {
    pub fn assign_to(&self, to: &Type, span: Span) -> Result<(), Error> {
        try_assign(to, self, span).map_err(|err| match err {
            Error::AssignFailed { .. } => err,
            _ => Error::AssignFailed {
                span,
                left: to.to_static(),
                right: self.to_static(),
                cause: vec![err],
            },
        })
    }
}

fn try_assign(to: &Type, rhs: &Type, span: Span) -> Result<(), Error> {
    macro_rules! fail {
        () => {{
            return Err(Error::AssignFailed {
                span,
                left: to.to_static(),
                right: rhs.to_static(),
                cause: vec![],
            });
        }};
    }

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

    macro_rules! handle_type_lit {
        ($members:expr) => {{
            let members = $members;
            match rhs {
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
            }
        }};
    }

    match *rhs.as_ref() {
        Type::Union(Union {
            ref types, span, ..
        }) => {
            let errors = types
                .iter()
                .filter_map(|rhs| match try_assign(to, rhs, span) {
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

            fail!();
        }

        _ => {}
    }

    match *to.as_ref() {
        Type::Array(Array { ref elem_type, .. }) => match rhs {
            Type::Array(Array {
                elem_type: ref rhs_elem_type,
                ..
            }) => {
                //
                return try_assign(&elem_type, &rhs_elem_type, span).map_err(|cause| {
                    Error::AssignFailed {
                        span,
                        left: to.to_static(),
                        right: rhs.to_static(),
                        cause: vec![cause],
                    }
                });
            }
            _ => fail!(),
        },

        // let a: string | number = 'string';
        Type::Union(Union { ref types, .. }) => {
            let vs = types
                .iter()
                .map(|to| try_assign(&to, rhs, span))
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
                .map(|to| try_assign(&to, rhs, span))
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

            fail!()
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
                span,
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

                fail!()
            }
            _ => fail!(),
        },

        Type::This(TsThisType { span }) => return Err(Error::CannotAssingToThis { span }),

        // TODO: Handle extends
        Type::Interface(Interface { ref body, .. }) => handle_type_lit!(body),

        Type::TypeLit(TypeLit { ref members, .. }) => handle_type_lit!(members),

        Type::Lit(TsLitType { ref lit, .. }) => match *rhs {
            Type::Lit(TsLitType { lit: ref r_lit, .. }) => {
                if lit.eq_ignore_span(r_lit) {
                    return Ok(());
                }

                fail!()
            }
            // TODO: allow
            // let a: true | false = bool
            _ => fail!(),
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
