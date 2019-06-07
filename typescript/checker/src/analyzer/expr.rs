use super::Analyzer;
use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub(super) fn type_of(&self, expr: &Expr) -> TsType {
        match *expr {
            Expr::This(ThisExpr { span }) => TsType::TsThisType(TsThisType { span }),

            Expr::Lit(Lit::Bool(v)) => TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Bool(v),
            }),
            Expr::Lit(Lit::Str(ref v)) => TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Str(v.clone()),
            }),
            Expr::Lit(Lit::Num(v)) => TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Number(v),
            }),

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => negate(self.type_of(arg)),

            Expr::TsAs(TsAsExpr { ref type_ann, .. }) => *type_ann.clone(),
            Expr::TsTypeCast(TsTypeCastExpr { ref type_ann, .. }) => *type_ann.type_ann.clone(),

            Expr::TsNonNull(TsNonNullExpr { ref expr, .. }) => self.type_of(expr).remove_falsy(),

            Expr::Object(ObjectLit { span, ref props }) => TsType::TsTypeLit(TsTypeLit {
                span,
                members: props
                    .iter()
                    .map(|prop| match *prop {
                        PropOrSpread::Prop(ref prop) => self.type_of_prop(&prop),
                        PropOrSpread::Spread(..) => {
                            unimplemented!("spread element in object literal")
                        }
                    })
                    .collect(),
            }),

            _ => unimplemented!("typeof ({:#?})", expr),
        }
    }

    fn type_of_prop(&self, prop: &Prop) -> TsTypeElement {
        TsPropertySignature {
            span: prop.span(),
            key: prop_key_to_expr(&prop),
            params: Default::default(),
            init: None,
            optional: false,
            readonly: false,
            computed: false,
            type_ann: Default::default(),
            type_params: Default::default(),
        }
        .into()
    }

    /// TODO: Make this return Result<TsType, Error>
    pub(super) fn expand<'a>(&mut self, ty: Cow<'a, TsType>) -> Cow<'a, TsType> {
        match *ty {
            TsType::TsTypeRef(TsTypeRef {
                span,
                ref type_name,
                ref type_params,
            }) => match *type_name {
                TsEntityName::Ident(ref i) => {
                    if let Some(info) = self.find_type(&i.sym) {
                        match info.instantiate(type_params.as_ref()) {
                            Ok(ty) => return Cow::Owned(ty),
                            Err(err) => {
                                self.info.errors.push(err);
                            }
                        }
                    }
                }
                TsEntityName::TsQualifiedName(..) => {
                    // TODO
                }
            },
            _ => {}
        }

        ty
    }
}

fn prop_key_to_expr(p: &Prop) -> Box<Expr> {
    match *p {
        Prop::Shorthand(ref i) => box Expr::Ident(i.clone()),
        Prop::Assign(AssignProp { ref key, .. }) => box Expr::Ident(key.clone()),
        Prop::Getter(GetterProp { ref key, .. })
        | Prop::KeyValue(KeyValueProp { ref key, .. })
        | Prop::Method(MethodProp { ref key, .. })
        | Prop::Setter(SetterProp { ref key, .. }) => match *key {
            PropName::Computed(ref expr) => expr.clone(),
            PropName::Ident(ref ident) => box Expr::Ident(ident.clone()),
            PropName::Str(ref s) => box Expr::Lit(Lit::Str(Str { ..s.clone() })),
            PropName::Num(ref s) => box Expr::Lit(Lit::Num(Number { ..s.clone() })),
        },
    }
}

trait RemoveTypes {
    /// Removes falsy values from `self`.
    fn remove_falsy(self) -> TsType;
}

fn never_ty(span: Span) -> TsType {
    TsType::TsKeywordType(TsKeywordType {
        span,
        kind: TsKeywordTypeKind::TsNeverKeyword,
    })
}

impl RemoveTypes for TsType {
    fn remove_falsy(self) -> TsType {
        match self {
            TsType::TsUnionOrIntersectionType(n) => n.remove_falsy().into(),
            TsType::TsKeywordType(TsKeywordType { kind, span }) => match kind {
                TsKeywordTypeKind::TsUndefinedKeyword | TsKeywordTypeKind::TsNullKeyword => {
                    never_ty(span)
                }
                _ => self,
            },
            _ => self,
        }
    }
}

impl RemoveTypes for TsUnionOrIntersectionType {
    fn remove_falsy(self) -> TsType {
        match self {
            TsUnionOrIntersectionType::TsIntersectionType(n) => n.remove_falsy().into(),
            TsUnionOrIntersectionType::TsUnionType(n) => n.remove_falsy().into(),
        }
    }
}

impl RemoveTypes for TsIntersectionType {
    fn remove_falsy(self) -> TsType {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .map(Box::new)
            .collect::<Vec<_>>();
        if types.iter().any(|ty| is_never(&ty)) {
            return TsType::TsKeywordType(TsKeywordType {
                span: self.span,
                kind: TsKeywordTypeKind::TsNeverKeyword,
            });
        }

        TsType::TsUnionOrIntersectionType(TsIntersectionType { types, ..self }.into())
    }
}

impl RemoveTypes for TsUnionType {
    fn remove_falsy(self) -> TsType {
        let types = self
            .types
            .into_iter()
            .map(|ty| ty.remove_falsy())
            .filter(|ty| !is_never(&ty))
            .map(Box::new)
            .collect();

        TsType::TsUnionOrIntersectionType(TsUnionType { types, ..self }.into())
    }
}

impl RemoveTypes for Box<TsType> {
    fn remove_falsy(self) -> TsType {
        (*self).remove_falsy()
    }
}

fn is_never(ty: &TsType) -> bool {
    match *ty {
        TsType::TsKeywordType(TsKeywordType {
            kind: TsKeywordTypeKind::TsNeverKeyword,
            ..
        }) => false,
        _ => true,
    }
}

fn negate(ty: TsType) -> TsType {
    fn boolean(span: Span) -> TsType {
        TsType::TsKeywordType(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        })
    }

    match ty {
        TsType::TsLitType(TsLitType { lit, span }) => match lit {
            TsLit::Bool(v) => TsType::TsLitType(TsLitType {
                lit: TsLit::Bool(Bool {
                    value: !v.value,
                    ..v
                }),
                span,
            }),
            TsLit::Number(v) => TsType::TsLitType(TsLitType {
                lit: TsLit::Bool(Bool {
                    value: v.value != 0.0,
                    span: v.span,
                }),
                span,
            }),
            TsLit::Str(v) => TsType::TsLitType(TsLitType {
                lit: TsLit::Bool(Bool {
                    value: v.value != js_word!(""),
                    span: v.span,
                }),
                span,
            }),
        },
        _ => boolean(ty.span()),
    }
}
