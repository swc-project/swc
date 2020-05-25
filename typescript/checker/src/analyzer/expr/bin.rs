use super::super::{
    util::{Comparator, ResultExt},
    Analyzer,
};
use crate::{
    errors::{Error, Errors},
    ty::{Operator, Type, Union},
    util::{EqIgnoreSpan, RemoveTypes},
    validator::Validate,
    ValidationResult,
};
use macros::validator;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value::Known};

#[validator]
impl Validate<BinExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, e: &mut BinExpr) -> ValidationResult {
        let BinExpr {
            span,
            op,
            ref mut left,
            ref mut right,
        } = *e;

        let mut errors = vec![];

        let lt = self
            .validate(left)
            .store(&mut errors)
            .map(|ty| ty.respan(left.span()));
        let rt = self
            .validate(right)
            .store(&mut errors)
            .map(|ty| ty.respan(right.span()));

        self.validate_bin_inner(span, op, lt.as_ref(), rt.as_ref());

        let (lt, rt): (Type, Type) = match (lt, rt) {
            (Some(l), Some(r)) => (l, r),
            _ => return Err(Error::Errors { span, errors }),
        };

        macro_rules! no_unknown {
            () => {{
                no_unknown!(lt);
                no_unknown!(rt);
            }};
            ($ty:expr) => {{
                match $ty {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsUnknownKeyword,
                        ..
                    }) => {
                        return Err(Error::Unknown { span });
                    }
                    _ => {}
                }
            }};
        }

        match op {
            op!(bin, "+") => {
                no_unknown!();

                let c = Comparator {
                    left: (&**left, &lt),
                    right: (&**right, &rt),
                };

                if let Some(()) = c.take(|(_, lt), (_, _)| match *lt {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsUnknownKeyword,
                        ..
                    }) => Some(()),

                    _ => None,
                }) {
                    return Err(Error::Unknown { span });
                }

                match lt {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNumberKeyword,
                        ..
                    })
                    | Type::Lit(TsLitType {
                        lit: TsLit::Number(..),
                        ..
                    }) => match rt {
                        Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                            ..
                        })
                        | Type::Lit(TsLitType {
                            lit: TsLit::Number(..),
                            ..
                        }) => {
                            return Ok(Type::Keyword(TsKeywordType {
                                span,
                                kind: TsKeywordTypeKind::TsStringKeyword,
                            }));
                        }
                        _ => {}
                    },
                    _ => {}
                }

                if let Some(()) = c.take(|(_, lt), (_, _)| match *lt {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsStringKeyword,
                        ..
                    })
                    | Type::Lit(TsLitType {
                        lit: TsLit::Str(..),
                        ..
                    }) => Some(()),

                    _ => None,
                }) {
                    return Ok(Type::Keyword(TsKeywordType {
                        span,
                        kind: TsKeywordTypeKind::TsStringKeyword,
                    }));
                }

                // Rule:
                //  - any + string is string
                //  - any + other is any
                if let Some(kind) = c.take(|(_, lt), (_, rt)| {
                    if lt.is_any() {
                        if rt.is_str() {
                            return Some(TsKeywordTypeKind::TsStringKeyword);
                        }
                        return Some(TsKeywordTypeKind::TsAnyKeyword);
                    }

                    None
                }) {
                    return Ok(Type::Keyword(TsKeywordType { span, kind }));
                }

                if c.any(|(_, ty)| {
                    ty.is_kwd(TsKeywordTypeKind::TsUndefinedKeyword)
                        || ty.is_kwd(TsKeywordTypeKind::TsNullKeyword)
                }) {
                    return Err(Error::TS2365 { span });
                }

                // Rule:
                //  - null is invalid operand
                //  - undefined is invalid operand
                if c.both(|(_, ty)| match *ty {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsUndefinedKeyword,
                        ..
                    })
                    | Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsNullKeyword,
                        ..
                    }) => true,

                    _ => false,
                }) {
                    return Err(Error::TS2365 { span });
                }

                if let Some(()) = c.take(|(_, lt), (_, rt)| match lt.normalize() {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsBooleanKeyword,
                        ..
                    }) => match rt.normalize() {
                        Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                            ..
                        }) => Some(()),
                        _ => None,
                    },
                    _ => None,
                }) {
                    return Ok(Type::Keyword(TsKeywordType {
                        span,
                        kind: TsKeywordTypeKind::TsBooleanKeyword,
                    }));
                }

                if is_str_lit_or_union(&lt) && is_str_lit_or_union(&rt) {
                    return Ok(Type::Keyword(TsKeywordType {
                        span,
                        kind: TsKeywordTypeKind::TsStringKeyword,
                    }));
                }

                unimplemented!("type_of_bin(+)\nLeft: {:#?}\nRight: {:#?}", lt, rt)
            }
            op!("*") | op!("/") => {
                no_unknown!();

                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                }));
            }

            op!(bin, "-")
            | op!("<<")
            | op!(">>")
            | op!(">>>")
            | op!("%")
            | op!("|")
            | op!("&")
            | op!("^")
            | op!("**") => {
                no_unknown!();

                return Ok(Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    span,
                }));
            }

            op!("===") | op!("!==") | op!("!=") | op!("==") => {
                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsBooleanKeyword,
                }));
            }

            op!("instanceof") => {
                if match lt.normalize() {
                    ty if ty.is_any() || ty.is_kwd(TsKeywordTypeKind::TsObjectKeyword) => false,
                    Type::This(..) | Type::Param(..) | Type::Ref(..) => false,
                    _ => true,
                } {
                    self.info.errors.push(Error::InvalidLhsInInstanceOf {
                        ty: lt.clone(),
                        span: left.span(),
                    })
                }

                // The right-hand side of an 'instanceof' expression must be of type 'any' or of
                // a type assignable to the 'Function' interface type.ts(2359)
                if match rt.normalize() {
                    Type::Param(..) | Type::Infer(..) => true,
                    ty if ty.is_any() => false,
                    ty if ty.is_kwd(TsKeywordTypeKind::TsSymbolKeyword) => true,
                    _ => false,
                } {
                    self.info.errors.push(Error::InvalidRhsInInstanceOf {
                        span: right.span(),
                        ty: rt.clone(),
                    })
                }

                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsBooleanKeyword,
                }));
            }

            op!("<=") | op!("<") | op!(">=") | op!(">") | op!("in") => {
                no_unknown!();

                return Ok(Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsBooleanKeyword,
                }));
            }

            op!("||") | op!("&&") => {
                no_unknown!();

                match lt.normalize() {
                    Type::Keyword(TsKeywordType {
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                        ..
                    }) => return Ok(Type::any(span)),

                    _ => {}
                }

                match op {
                    op!("||") => {
                        if lt.is_never() {
                            return Ok(lt);
                        }

                        if is_str_lit_or_union(&lt) && is_str_lit_or_union(&rt) {
                            return Ok(Type::union(vec![lt, rt]));
                        }

                        if let Known(v) = lt.as_bool() {
                            return Ok(if v { lt } else { rt });
                        }

                        if let (_, Known(v)) = left.as_bool() {
                            return Ok(if v { lt } else { rt });
                        }

                        // Remove falsy types from lhs
                        let lt = lt.remove_falsy();

                        return Ok(Type::union(vec![lt, rt]));
                    }

                    op!("&&") => {
                        if lt.is_never() {
                            return Ok(lt);
                        }

                        if let Known(v) = lt.as_bool() {
                            return Ok(if v { rt } else { lt });
                        }

                        if let (_, Known(v)) = left.as_bool() {
                            return Ok(if v { rt } else { lt });
                        }
                    }

                    _ => unreachable!(),
                }
                return Ok(rt);
            }

            op!("??") => unimplemented!("type_of_bin_expr (`??`)"),
        }
    }
}

impl Analyzer<'_, '_> {
    fn validate_bin_inner(
        &mut self,
        span: Span,
        op: BinaryOp,
        lt: Option<&Type>,
        rt: Option<&Type>,
    ) {
        let ls = lt.span();
        let rs = rt.span();

        let mut errors = Errors::default();

        match op {
            op!("===") | op!("!==") => {
                if lt.is_some() && rt.is_some() {
                    let lt = lt.unwrap();
                    let rt = rt.unwrap();

                    let has_overlap = lt.eq_ignore_span(&rt) || {
                        let c = Comparator {
                            left: &lt,
                            right: &rt,
                        };

                        // Check if type overlaps.
                        c.take(|l, r| {
                            // Returns Some(()) if r may be assignable to l
                            match l {
                                Type::Lit(ref l_lit) => {
                                    // "foo" === "bar" is always false.
                                    match r {
                                        Type::Lit(ref r_lit) => {
                                            if l_lit.eq_ignore_span(&*r_lit) {
                                                Some(())
                                            } else {
                                                None
                                            }
                                        }
                                        _ => Some(()),
                                    }
                                }
                                Type::Union(ref u) => {
                                    // Check if u contains r
                                    for ty in &u.types {
                                        if ty.eq_ignore_span(r) {
                                            return Some(());
                                        }
                                    }

                                    Some(())
                                }
                                _ => None,
                            }
                        })
                        .is_some()
                    };

                    if !has_overlap {
                        errors.push(Error::NoOverlap {
                            span,
                            value: op != op!("==="),
                            left: ls,
                            right: rs,
                        })
                    }
                }
            }
            op!(bin, "+") => {
                // Validation is performed in type_of_bin_expr because
                // validation of types is required to compute type of the
                // expression.
            }
            op!("||") | op!("&&") => {
                if lt.is_some() {
                    match *lt.as_ref().unwrap().normalize() {
                        Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsVoidKeyword,
                            ..
                        }) => errors.push(Error::TS1345 { span }),
                        _ => {}
                    }
                }
            }

            op!("*")
            | op!("/")
            | op!("%")
            | op!(bin, "-")
            | op!("<<")
            | op!(">>")
            | op!(">>>")
            | op!("&")
            | op!("^")
            | op!("|") => {
                if lt.is_some() && rt.is_some() {
                    let lt = lt.unwrap();
                    let rt = rt.unwrap();

                    let mut check = |ty: &Type, is_left| match ty {
                        Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsBigIntKeyword,
                            ..
                        })
                        | Type::Lit(TsLitType {
                            lit: TsLit::Number(..),
                            ..
                        })
                        | Type::Enum(..)
                        | Type::EnumVariant(..) => {}

                        _ => errors.push(if is_left {
                            Error::TS2362 { span: ty.span() }
                        } else {
                            Error::TS2363 { span: ty.span() }
                        }),
                    };

                    if (op == op!("&") || op == op!("^") || op == op!("|"))
                        && match lt.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsBooleanKeyword,
                                ..
                            })
                            | Type::Lit(TsLitType {
                                lit: TsLit::Bool(..),
                                ..
                            }) => true,
                            _ => false,
                        }
                        && match rt.normalize() {
                            Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsBooleanKeyword,
                                ..
                            })
                            | Type::Lit(TsLitType {
                                lit: TsLit::Bool(..),
                                ..
                            }) => true,
                            _ => false,
                        }
                    {
                        errors.push(Error::TS2447 { span });
                    } else {
                        check(&lt, true);
                        check(&rt, false);
                    }
                }
            }

            op!("in") => {
                if lt.is_some() {
                    match lt.unwrap().normalize() {
                        Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsStringKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsNumberKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsBigIntKeyword,
                            ..
                        })
                        | Type::Keyword(TsKeywordType {
                            kind: TsKeywordTypeKind::TsSymbolKeyword,
                            ..
                        })
                        | Type::Lit(TsLitType {
                            lit: TsLit::Number(..),
                            ..
                        })
                        | Type::Lit(TsLitType {
                            lit: TsLit::Str(..),
                            ..
                        })
                        | Type::Enum(..)
                        | Type::EnumVariant(..)
                        | Type::Param(..)
                        | Type::Operator(Operator {
                            op: TsTypeOperatorOp::KeyOf,
                            ..
                        }) => {}

                        _ => errors.push(Error::TS2360 { span: ls }),
                    }
                }

                if rt.is_some() {
                    fn is_ok(ty: &Type) -> bool {
                        if ty.is_any() {
                            return true;
                        }

                        match ty.normalize() {
                            Type::TypeLit(..)
                            | Type::Param(..)
                            | Type::Mapped(..)
                            | Type::Array(..)
                            | Type::Tuple(..)
                            | Type::Interface(..)
                            | Type::Keyword(TsKeywordType {
                                kind: TsKeywordTypeKind::TsObjectKeyword,
                                ..
                            }) => true,
                            Type::Union(ref u) => u.types.iter().all(|ty| is_ok(&ty)),
                            _ => false,
                        }
                    }

                    if !is_ok(&rt.unwrap()) {
                        errors.push(Error::TS2361 { span: rs })
                    }
                }
            }

            _ => {}
        }

        self.info.errors.extend(errors);
    }
}

fn is_str_lit_or_union(t: &Type) -> bool {
    match t {
        Type::Lit(TsLitType {
            lit: TsLit::Str(..),
            ..
        }) => true,
        Type::Union(Union { ref types, .. }) => types.iter().all(is_str_lit_or_union),
        _ => false,
    }
}
