use super::{util::TypeExt, Analyzer};
use crate::errors::Error;
use std::borrow::Cow;
use swc_atoms::js_word;
use swc_common::{Fold, FoldWith, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

impl Analyzer<'_, '_> {
    pub(super) fn type_of<'a>(&self, expr: &'a Expr) -> Result<Cow<'a, TsType>, Error> {
        let span = expr.span();

        Ok(match *expr {
            Expr::This(ThisExpr { span }) => Cow::Owned(TsType::TsThisType(TsThisType { span })),

            Expr::Ident(ref i) => {
                if let Some(ty) = self.find_var_type(&i.sym) {
                    Cow::Owned(ty.clone())
                } else {
                    unimplemented!("typeof(undefined ident: {:?})", i)
                }
            }

            Expr::Array(ArrayLit { ref elems, .. }) => {
                let mut types: Vec<TsType> = vec![];

                for elem in elems {
                    match elem {
                        Some(ExprOrSpread {
                            spread: None,
                            ref expr,
                        }) => {
                            let ty = self.type_of(expr)?.into_owned().generalize_lit();
                            if types.iter().all(|l| !l.eq_ignore_span(&ty)) {
                                types.push(ty)
                            }
                        }
                        Some(ExprOrSpread {
                            spread: Some(..), ..
                        }) => unimplemented!("type of array spread"),
                        None => {
                            let ty = undefined(span);
                            if types.iter().all(|l| !l.eq_ignore_span(&ty)) {
                                types.push(ty.clone())
                            }
                        }
                    }
                }

                Cow::Owned(TsType::TsArrayType(TsArrayType {
                    span,
                    elem_type: match types.len() {
                        0 => box any(span),
                        1 => box types.into_iter().next().unwrap(),
                        _ => box TsType::TsUnionOrIntersectionType(
                            TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                                span,
                                types: types.into_iter().map(Box::new).collect(),
                            }),
                        ),
                    },
                }))
            }

            Expr::Lit(Lit::Bool(v)) => Cow::Owned(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Bool(v),
            })),
            Expr::Lit(Lit::Str(ref v)) => Cow::Owned(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Str(v.clone()),
            })),
            Expr::Lit(Lit::Num(v)) => Cow::Owned(TsType::TsLitType(TsLitType {
                span: v.span,
                lit: TsLit::Number(v),
            })),

            Expr::Paren(ParenExpr { ref expr, .. }) => return self.type_of(expr),

            Expr::Tpl(..) => Cow::Owned(TsType::TsKeywordType(TsKeywordType {
                span,
                kind: TsKeywordTypeKind::TsStringKeyword,
            })),

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => negate(self.type_of(arg)?),

            Expr::TsAs(TsAsExpr { ref type_ann, .. }) => Cow::Borrowed(type_ann),
            Expr::TsTypeCast(TsTypeCastExpr { ref type_ann, .. }) => {
                Cow::Borrowed(&*type_ann.type_ann)
            }

            Expr::TsNonNull(TsNonNullExpr { ref expr, .. }) => {
                return self
                    .type_of(expr)
                    .map(|ty| {
                        // TODO: Optimize

                        ty.into_owned().remove_falsy()
                    })
                    .map(Cow::Owned);
            }

            Expr::Object(ObjectLit { span, ref props }) => {
                Cow::Owned(TsType::TsTypeLit(TsTypeLit {
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
                }))
            }

            // https://github.com/Microsoft/TypeScript/issues/26959
            Expr::Yield(..) => Cow::Owned(any(span)),

            Expr::Update(..) => Cow::Owned(TsType::TsKeywordType(TsKeywordType {
                kind: TsKeywordTypeKind::TsNumberKeyword,
                span,
            })),

            Expr::Cond(CondExpr {
                ref cons, ref alt, ..
            }) => {
                let cons_ty = self.type_of(cons)?;
                let alt_ty = self.type_of(alt)?;
                if cons_ty.eq_ignore_span(&alt_ty) {
                    cons_ty
                } else {
                    Cow::Owned(TsType::TsUnionOrIntersectionType(
                        TsUnionOrIntersectionType::TsUnionType(TsUnionType {
                            span,
                            types: vec![box cons_ty.into_owned(), box alt_ty.into_owned()],
                        }),
                    ))
                }
            }

            Expr::New(NewExpr { ref callee, .. }) => {
                let callee_type = self.type_of(callee).map(|ty| {
                    extract_type(ty, |ty| match *ty {
                        TsType::TsFnOrConstructorType(
                            TsFnOrConstructorType::TsConstructorType(..),
                        ) => true,
                        _ => false,
                    })
                })?;
                match callee_type.into_owned() {
                    TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsConstructorType(
                        TsConstructorType {
                            params,
                            type_params,
                            type_ann,
                            ..
                        },
                    )) => {
                        //
                        unimplemented!("typeof(NewExpr)")

                        // Cow::Owned(*type_ann.type_ann)
                    }
                    _ => unimplemented!("error: no constructor signature"),
                }
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref callee),
                ..
            }) => {
                let callee_type = self.type_of(callee).map(|ty| {
                    extract_type(ty, |ty| match *ty {
                        TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(..)) => true,
                        _ => false,
                    })
                })?;
                match callee_type.into_owned() {
                    TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
                        params,
                        type_params,
                        type_ann,
                        ..
                    })) => {
                        //

                        Cow::Owned(*type_ann.type_ann)
                    }
                    _ => unimplemented!("error: no constructor signature"),
                }
            }

            Expr::Seq(SeqExpr { ref exprs, .. }) => {
                assert!(exprs.len() >= 1);

                return self.type_of(&exprs.last().unwrap());
            }

            Expr::Await(AwaitExpr { .. }) => unimplemented!("typeof(AwaitExpr)"),

            Expr::Class(ClassExpr { .. }) => unimplemented!("typeof(ClassExpr)"),

            Expr::Arrow(ArrowExpr { .. }) => unimplemented!("typeof(ArrowExpr)"),
            Expr::Fn(FnExpr { .. }) => unimplemented!("typeof(FnExpr)"),

            Expr::Member(MemberExpr { .. }) => unimplemented!("typeof(MemberExpr)"),

            Expr::MetaProp(..) => unimplemented!("typeof(MetaProp)"),

            Expr::Assign(AssignExpr { ref right, .. }) => return self.type_of(right),

            _ => unimplemented!("typeof ({:#?})", expr),
        })
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
                ref type_name,
                ref type_params,
                ..
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

fn negate(ty: Cow<TsType>) -> Cow<TsType> {
    fn boolean(span: Span) -> TsType {
        TsType::TsKeywordType(TsKeywordType {
            span,
            kind: TsKeywordTypeKind::TsBooleanKeyword,
        })
    }

    Cow::Owned(match *ty {
        TsType::TsLitType(TsLitType { ref lit, span }) => match *lit {
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
            TsLit::Str(ref v) => TsType::TsLitType(TsLitType {
                lit: TsLit::Bool(Bool {
                    value: v.value != js_word!(""),
                    span: v.span,
                }),
                span,
            }),
        },
        _ => boolean(ty.span()),
    })
}

fn undefined(span: Span) -> TsType {
    TsType::TsKeywordType(TsKeywordType {
        span,
        kind: TsKeywordTypeKind::TsUndefinedKeyword,
    })
}

fn any(span: Span) -> TsType {
    TsType::TsKeywordType(TsKeywordType {
        span,
        kind: TsKeywordTypeKind::TsAnyKeyword,
    })
}

trait EqIgnoreSpan {
    fn eq_ignore_span(&self, to: &Self) -> bool;
}

impl EqIgnoreSpan for TsType {
    fn eq_ignore_span(&self, to: &TsType) -> bool {
        struct SpanRemover;
        impl Fold<Span> for SpanRemover {
            fn fold(&mut self, _: Span) -> Span {
                DUMMY_SP
            }
        }

        self.clone().fold_with(&mut SpanRemover) == to.clone().fold_with(&mut SpanRemover)
    }
}

impl<T> EqIgnoreSpan for Box<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        (**self).eq_ignore_span(&**to)
    }
}

impl<T> EqIgnoreSpan for Option<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        match (self.as_ref(), to.as_ref()) {
            (Some(l), Some(r)) => l.eq_ignore_span(r),
            (None, None) => true,
            _ => false,
        }
    }
}

impl<T> EqIgnoreSpan for Vec<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, to: &Self) -> bool {
        if self.len() != to.len() {
            return false;
        }

        self.iter()
            .zip(to.iter())
            .all(|(l, r)| l.eq_ignore_span(&r))
    }
}

fn extract_type<F: Fn(&TsType) -> bool>(ty: Cow<TsType>, pred: F) -> Cow<TsType> {
    if pred(&ty) {
        return ty;
    }

    match *ty {
        TsType::TsUnionOrIntersectionType(TsUnionOrIntersectionType::TsUnionType(
            TsUnionType { ref types, .. },
        )) => {
            for ty in types {
                if pred(ty) {
                    // TODO: Optimize
                    return Cow::Owned(*ty.clone());
                }
            }
        }

        _ => return ty,
    }

    ty
}
