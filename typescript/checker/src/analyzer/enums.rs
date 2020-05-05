use fxhash::FxHashMap;
use macros::validator;
use swc_atoms::JsWord;
use swc_common::{Span, Spanned, Visit, VisitMutWith, VisitWith};
use swc_ecma_ast::*;

use crate::{
    analyzer::util::ResultExt,
    errors::Error,
    ty::{Enum, EnumMember, Type},
    validator::Validate,
    ValidationResult,
};

use super::Analyzer;
use either::Either;

/// Value does not contain TsLit::Bool
type EnumValues = FxHashMap<JsWord, TsLit>;

/// We don't visit enum variants to allow
///
///        const enum E {
///            a = 10,
///            b = a,
///            c = (a+1),
///            e,
///            d = ~e,
///            f = a << 2 >> 1,
///            g = a << 2 >>> 1,
///            h = a | b
///        }
#[validator]
impl Validate<TsEnumDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<Enum>;
    #[inline(never)]
    fn validate(&mut self, e: &mut TsEnumDecl) -> Self::Output {
        let mut default = 0;
        let mut values = Default::default();
        let ty: Result<_, _> = try {
            let members = e
                .members
                .iter()
                .map(|m| -> Result<_, Error> {
                    let id_span = m.id.span();
                    let val = compute(
                        &e,
                        id_span,
                        &mut values,
                        Some(default),
                        m.init.as_ref().map(|v| &**v),
                    )
                    .map(|val| {
                        match val {
                            TsLit::Number(n) => {
                                default = n.value as i32 + 1;
                            }
                            _ => {}
                        }
                        values.insert(
                            match &m.id {
                                TsEnumMemberId::Ident(i) => i.sym.clone(),
                                TsEnumMemberId::Str(s) => s.value.clone(),
                            },
                            val.clone(),
                        );

                        match val {
                            TsLit::Number(v) => Expr::Lit(Lit::Num(v)),
                            TsLit::Str(v) => Expr::Lit(Lit::Str(v)),
                            TsLit::Bool(v) => Expr::Lit(Lit::Bool(v)),
                        }
                    })
                    .or_else(|err| match &m.init {
                        None => Err(err),
                        Some(v) => Ok(*v.clone()),
                    })?;

                    Ok(EnumMember {
                        id: m.id.clone(),
                        val,
                        span: m.span,
                    })
                })
                .collect::<Result<Vec<_>, _>>()?;

            Enum {
                span: e.span,
                has_num: members.iter().any(|m| match m.val {
                    Expr::Lit(Lit::Num(..)) => true,
                    _ => false,
                }),
                has_str: members.iter().any(|m| match m.val {
                    Expr::Lit(Lit::Str(..)) => true,
                    _ => false,
                }),
                declare: e.declare,
                is_const: e.is_const,
                id: e.id.clone(),
                members,
            }
        };

        let span = e.span;

        self.register_type(
            e.id.sym.clone(),
            match ty {
                Ok(ref ty) => ty.clone().into(),
                Err(..) => Type::any(span),
            },
        )
        .store(&mut self.info.errors);

        // Validate const enums
        if e.is_const {
            for m in &e.members {
                if let Some(init) = &m.init {
                    let mut v = LitValidator {
                        error: false,
                        decl: &e,
                    };
                    init.visit_with(&mut v);
                    if v.error {
                        self.info
                            .errors
                            .push(Error::InvalidInitInConstEnum { span: init.span() })
                    }
                }
            }
        }

        ty
    }
}

/// Called only for enums.
///
/// If both of the default value and the initialization is None, this method
/// returns [Err].
fn compute(
    e: &TsEnumDecl,
    span: Span,
    values: &mut EnumValues,
    default: Option<i32>,
    init: Option<&Expr>,
) -> Result<TsLit, Error> {
    fn compute_bin(
        e: &TsEnumDecl,
        span: Span,
        values: &mut EnumValues,
        expr: &BinExpr,
    ) -> Result<TsLit, Error> {
        let l = compute(e, span, values, None, Some(&expr.left))?;
        let r = compute(e, span, values, None, Some(&expr.right))?;

        Ok(match (l, r) {
            (TsLit::Number(Number { value: l, .. }), TsLit::Number(Number { value: r, .. })) => {
                TsLit::Number(Number {
                    span,
                    value: match expr.op {
                        op!(bin, "+") => l + r,
                        op!(bin, "-") => l - r,
                        op!("*") => l * r,
                        op!("/") => l / r,

                        // TODO
                        op!("&") => ((l.round() as i64) & (r.round() as i64)) as _,
                        op!("|") => ((l.round() as i64) | (r.round() as i64)) as _,
                        op!("^") => ((l.round() as i64) ^ (r.round() as i64)) as _,

                        op!("<<") => ((l.round() as i64) << (r.round() as i64)) as _,
                        op!(">>") => ((l.round() as i64) >> (r.round() as i64)) as _,
                        // TODO: Verify this
                        op!(">>>") => ((l.round() as u64) >> (r.round() as u64)) as _,
                        _ => Err(Error::InvalidEnumInit { span })?,
                    },
                })
            }
            (TsLit::Str(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => TsLit::Str(Str {
                span,
                value: format!("{}{}", l.value, r.value).into(),
                has_escape: l.has_escape || r.has_escape,
            }),
            (TsLit::Number(l), TsLit::Str(r)) if expr.op == op!(bin, "+") => TsLit::Str(Str {
                span,
                value: format!("{}{}", l.value, r.value).into(),
                has_escape: r.has_escape,
            }),
            (TsLit::Str(l), TsLit::Number(r)) if expr.op == op!(bin, "+") => TsLit::Str(Str {
                span,
                value: format!("{}{}", l.value, r.value).into(),
                has_escape: l.has_escape,
            }),
            _ => Err(Error::InvalidEnumInit { span })?,
        })
    }

    fn try_str(e: &Expr) -> Result<Str, ()> {
        match *e {
            Expr::Lit(Lit::Str(ref s)) => return Ok(s.clone()),
            _ => Err(()),
        }
    }

    if let Some(expr) = init {
        match expr {
            Expr::Lit(Lit::Str(s)) => return Ok(TsLit::Str(s.clone())),
            Expr::Lit(Lit::Num(s)) => return Ok(TsLit::Number(*s)),
            Expr::Bin(ref bin) => return compute_bin(e, span, values, &bin),
            Expr::Paren(ref paren) => return compute(e, span, values, default, Some(&paren.expr)),

            Expr::Ident(ref id) => {
                if let Some(v) = values.get(&id.sym) {
                    return Ok(v.clone());
                }
                //
                for m in e.members.iter() {
                    match m.id {
                        TsEnumMemberId::Str(Str { value: ref sym, .. })
                        | TsEnumMemberId::Ident(Ident { ref sym, .. }) => {
                            if *sym == id.sym {
                                return compute(
                                    e,
                                    span,
                                    values,
                                    None,
                                    m.init.as_ref().map(|v| &**v),
                                );
                            }
                        }
                    }
                }
                return Err(Error::InvalidEnumInit { span });
            }
            Expr::Unary(ref expr) => {
                let v = compute(e, span, values, None, Some(&expr.arg))?;
                match v {
                    TsLit::Number(Number { value: v, .. }) => {
                        return Ok(TsLit::Number(Number {
                            span,
                            value: match expr.op {
                                op!(unary, "+") => v,
                                op!(unary, "-") => -v,
                                op!("!") => {
                                    if v == 0.0f64 {
                                        0.0
                                    } else {
                                        1.0
                                    }
                                }
                                op!("~") => (!(v as i32)) as f64,
                                _ => Err(Error::InvalidEnumInit { span })?,
                            },
                        }))
                    }
                    TsLit::Str(_) => {}
                    TsLit::Bool(_) => {}
                }
            }

            Expr::Tpl(ref t) if t.exprs.is_empty() => {
                if let Some(v) = &t.quasis[0].cooked {
                    return Ok(v.clone().into());
                }
            }

            _ => {}
        }
    } else {
        if let Some(value) = default {
            return Ok(TsLit::Number(Number {
                span,
                value: value as _,
            }));
        }
    }

    Err(Error::InvalidEnumInit { span })
}

impl Analyzer<'_, '_> {
    // Check for constant enum in rvalue.
    pub(super) fn check_rvalue(&mut self, rhs_ty: &Type) {
        match *rhs_ty.normalize() {
            Type::Enum(ref e) if e.is_const => {
                self.info
                    .errors
                    .push(Error::ConstEnumUsedAsVar { span: e.span() });
            }
            _ => {}
        }
    }

    pub(super) fn expand_enum_variant(&self, ty: Type) -> Result<Type, Error> {
        match ty.normalize() {
            Type::EnumVariant(ref v) => {
                if let Some(types) = self.find_type(&v.enum_name) {
                    for ty in types {
                        if let Type::Enum(Enum { members, .. }) = ty {
                            if let Some(v) = members.iter().find(|m| match m.id {
                                TsEnumMemberId::Ident(Ident { ref sym, .. })
                                | TsEnumMemberId::Str(Str { value: ref sym, .. }) => *sym == v.name,
                            }) {
                                match v.val {
                                    Expr::Lit(Lit::Str(..)) | Expr::Lit(Lit::Num(..)) => {
                                        return Ok(Type::Lit(TsLitType {
                                            span: v.span,
                                            lit: match v.val.clone() {
                                                Expr::Lit(Lit::Str(s)) => TsLit::Str(s),
                                                Expr::Lit(Lit::Num(n)) => TsLit::Number(n),
                                                _ => unreachable!(),
                                            },
                                        }));
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
            }
            _ => {}
        }

        return Ok(ty);
    }
}

struct LitValidator<'a> {
    decl: &'a TsEnumDecl,
    error: bool,
}

impl Visit<Expr> for LitValidator<'_> {
    fn visit(&mut self, e: &Expr) {
        e.visit_children(self);

        match e {
            Expr::Lit(..) => {}
            Expr::Ident(ref i) => {
                let is_ref = self.decl.members.iter().any(|m| match m.id {
                    TsEnumMemberId::Ident(Ident { ref sym, .. })
                    | TsEnumMemberId::Str(Str { value: ref sym, .. }) => *sym == i.sym,
                });
                if !is_ref {
                    self.error = true;
                    return;
                }
            }
            Expr::Unary(..) | Expr::Bin(..) | Expr::Paren(..) => {}

            _ => {
                self.error = true;
                return;
            }
        }
    }
}
