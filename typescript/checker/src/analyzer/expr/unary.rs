use super::super::Analyzer;
use crate::{
    analyzer::{expr::TypeOfMode, util::ResultExt},
    errors::Error,
    ty::Type,
    validator::{Validate, ValidateWith},
    ValidationResult,
};
use swc_atoms::js_word;
use swc_common::{Span, Spanned};
use swc_ecma_ast::*;

impl Validate<UnaryExpr> for Analyzer<'_, '_> {
    type Output = ValidationResult;

    fn validate(&mut self, e: &mut UnaryExpr) -> Self::Output {
        let UnaryExpr {
            span,
            op,
            ref mut arg,
        } = *e;

        if let op!("delete") = op {
            // `delete foo` returns bool

            match **arg {
                Expr::Member(ref mut e) => {
                    self.type_of_member_expr(e, TypeOfMode::LValue)
                        .store(&mut self.info.errors);

                    return Ok(box Type::Keyword(TsKeywordType {
                        span,
                        kind: TsKeywordTypeKind::TsBooleanKeyword,
                    }));
                }

                _ => {}
            }
        }

        let arg: Option<Box<Type>> =
            arg.validate_with(self)
                .store(&mut self.info.errors)
                .map(|mut ty| {
                    ty.respan(arg.span());
                    ty
                });

        if let Some(ref arg) = arg {
            self.validate_unary_expr_inner(span, op, arg);
        }

        match op {
            op!(unary, "+") | op!(unary, "-") | op!("~") => {
                if let Some(arg) = &arg {
                    if arg.is_kwd(TsKeywordTypeKind::TsSymbolKeyword) {
                        self.info.errors.push(Error::NumericUnaryOpToSymbol {
                            span: arg.span(),
                            op,
                        })
                    }
                }
            }

            _ => {}
        }

        match op {
            op!("typeof") => {
                return Ok(box Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsStringKeyword,
                }));
            }

            op!("void") => return Ok(Type::undefined(span)),

            op!(unary, "-") | op!(unary, "+") => {
                if let Some(arg) = &arg {
                    match &**arg {
                        Type::Lit(TsLitType {
                            lit: TsLit::Number(Number { span, value }),
                            ..
                        }) => {
                            let span = *span;

                            return Ok(box Type::Lit(TsLitType {
                                span,
                                lit: TsLit::Number(Number {
                                    span,
                                    value: if op == op!(unary, "-") {
                                        -(*value)
                                    } else {
                                        *value
                                    },
                                }),
                            }));
                        }
                        _ => {}
                    }
                }

                return Ok(box Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                }));
            }

            op!("~") => {
                return Ok(box Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                }));
            }
            _ => {}
        }

        match arg {
            Some(box Type::Keyword(TsKeywordType {
                kind: TsKeywordTypeKind::TsUnknownKeyword,
                ..
            })) => return Err(Error::Unknown { span: arg.span() }),
            _ => {}
        }

        if let Some(arg) = arg {
            match op {
                op!("!") => return Ok(negate(arg)),

                op!("typeof") | op!("void") => unreachable!(),

                _ => {}
            }
        }

        // This is a worst case. We only return the type without good error reporting.
        match op {
            op!("!") | op!("delete") => {
                return Ok(box Type::Keyword(TsKeywordType {
                    span,
                    kind: TsKeywordTypeKind::TsBooleanKeyword,
                }))
            }

            _ => {}
        }

        unimplemented!("validate(UnaryExpr)\n{:?}", e)
    }
}

impl Analyzer<'_, '_> {
    fn validate_unary_expr_inner(&mut self, span: Span, op: UnaryOp, arg: &Type) {
        let mut errors = vec![];

        match op {
            op!("typeof") | op!("delete") | op!("void") => match arg.normalize() {
                Type::EnumVariant(..) if op == op!("delete") => {
                    errors.push(Error::TS2704 { span: arg.span() })
                }

                _ => {}
            },

            op!("~") | op!(unary, "-") | op!(unary, "+") => match arg.normalize() {
                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNumberKeyword,
                    ..
                }) => {}

                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsNullKeyword,
                    ..
                }) => errors.push(Error::TS2531 { span: arg.span() }),

                Type::Keyword(TsKeywordType {
                    kind: TsKeywordTypeKind::TsUndefinedKeyword,
                    ..
                }) => errors.push(Error::TS2532 { span: arg.span() }),

                _ => {
                    //
                }
            },

            _ => {}
        }

        self.info.errors.extend(errors);
    }
}

fn negate(ty: Box<Type>) -> Box<Type> {
    match *ty {
        Type::Lit(TsLitType { ref lit, span }) => match *lit {
            TsLit::Bool(v) => {
                return box Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: !v.value,
                        ..v
                    }),
                    span,
                });
            }
            TsLit::Number(v) => {
                return box Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: v.value != 0.0,
                        span: v.span,
                    }),
                    span,
                });
            }
            TsLit::Str(ref v) => {
                return box Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: v.value != js_word!(""),
                        span: v.span,
                    }),
                    span,
                });
            }
            TsLit::Tpl(ref v) => {
                return box Type::Lit(TsLitType {
                    lit: TsLit::Bool(Bool {
                        value: v.quasis.iter().next().as_ref().unwrap().raw.value != js_word!(""),
                        span: v.span,
                    }),
                    span,
                });
            }
            TsLit::BigInt(ref v) => {
                return box Type::Lit(TsLitType {
                    lit: TsLit::BigInt(BigInt {
                        value: -v.value.clone(),
                        span: v.span,
                    }),
                    span,
                });
            }
        },

        _ => {}
    }

    box TsKeywordType {
        span: ty.span(),
        kind: TsKeywordTypeKind::TsBooleanKeyword,
    }
    .into()
}
