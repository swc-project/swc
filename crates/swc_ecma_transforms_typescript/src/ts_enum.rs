use rustc_hash::FxHashMap;
use swc_atoms::{atom, Atom, Wtf8Atom};
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    number::{JsNumber, ToJsString},
    ExprFactory,
};

#[inline]
fn atom_from_wtf8_atom(value: &Wtf8Atom) -> Atom {
    value
        .as_str()
        .map(Atom::from)
        .unwrap_or_else(|| Atom::from(value.to_string_lossy()))
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct TsEnumRecordKey {
    pub enum_id: Id,
    pub member_name: Atom,
}

pub(crate) type TsEnumRecord = FxHashMap<TsEnumRecordKey, TsEnumRecordValue>;

#[derive(Debug, Clone)]
pub(crate) enum TsEnumRecordValue {
    String(Atom),
    Number(JsNumber),
    Opaque(Box<Expr>),
    Void,
}

impl TsEnumRecordValue {
    pub fn inc(&self) -> Self {
        match self {
            Self::Number(num) => Self::Number((**num + 1.0).into()),
            _ => Self::Void,
        }
    }

    pub fn is_const(&self) -> bool {
        matches!(
            self,
            TsEnumRecordValue::String(..) | TsEnumRecordValue::Number(..)
        )
    }

    pub fn is_string(&self) -> bool {
        matches!(self, TsEnumRecordValue::String(..))
    }

    pub fn has_value(&self) -> bool {
        !matches!(self, TsEnumRecordValue::Void)
    }
}

impl From<TsEnumRecordValue> for Expr {
    fn from(value: TsEnumRecordValue) -> Self {
        match value {
            TsEnumRecordValue::String(string) => Lit::Str(string.into()).into(),
            TsEnumRecordValue::Number(num) if num.is_nan() => Ident {
                span: DUMMY_SP,
                sym: atom!("NaN"),
                ..Default::default()
            }
            .into(),
            TsEnumRecordValue::Number(num) if num.is_infinite() => {
                let value: Expr = Ident {
                    span: DUMMY_SP,
                    sym: atom!("Infinity"),
                    ..Default::default()
                }
                .into();

                if num.is_sign_negative() {
                    UnaryExpr {
                        span: DUMMY_SP,
                        op: op!(unary, "-"),
                        arg: value.into(),
                    }
                    .into()
                } else {
                    value
                }
            }
            TsEnumRecordValue::Number(num) => Lit::Num(Number {
                span: DUMMY_SP,
                value: *num,
                raw: None,
            })
            .into(),
            TsEnumRecordValue::Void => *Expr::undefined(DUMMY_SP),
            TsEnumRecordValue::Opaque(expr) => *expr,
        }
    }
}

impl From<f64> for TsEnumRecordValue {
    fn from(value: f64) -> Self {
        Self::Number(value.into())
    }
}

pub(crate) struct EnumValueComputer<'a> {
    pub enum_id: &'a Id,
    pub unresolved_ctxt: SyntaxContext,
    pub record: &'a TsEnumRecord,
}

/// https://github.com/microsoft/TypeScript/pull/50528
impl EnumValueComputer<'_> {
    pub fn compute(&self, expr: Box<Expr>) -> TsEnumRecordValue {
        self.compute_rec(expr)
    }

    fn compute_rec(&self, expr: Box<Expr>) -> TsEnumRecordValue {
        match *expr {
            Expr::Lit(Lit::Str(s)) => TsEnumRecordValue::String(atom_from_wtf8_atom(&s.value)),
            Expr::Lit(Lit::Num(n)) => TsEnumRecordValue::Number(n.value.into()),
            Expr::Ident(ref ident) if ident.ctxt == self.unresolved_ctxt => {
                if let Some(value) = self.record.get(&TsEnumRecordKey {
                    enum_id: self.enum_id.clone(),
                    member_name: ident.sym.clone(),
                }) {
                    if value.is_const() {
                        value.clone()
                    } else {
                        TsEnumRecordValue::Opaque(
                            self.enum_id
                                .clone()
                                .make_member(ident.clone().into())
                                .into(),
                        )
                    }
                } else {
                    match ident.sym.as_ref() {
                        "Infinity" => TsEnumRecordValue::Number(f64::INFINITY.into()),
                        "NaN" => TsEnumRecordValue::Number(f64::NAN.into()),
                        _ => TsEnumRecordValue::Opaque(expr),
                    }
                }
            }
            Expr::Paren(e) => self.compute_rec(e.expr),
            Expr::Unary(e) => self.compute_unary(e),
            Expr::Bin(e) => self.compute_bin(e),
            Expr::Member(e) => self.compute_member(e),
            Expr::Tpl(e) => self.compute_tpl(e),
            // Handle TypeScript type expressions by stripping them
            // and computing the inner expression
            Expr::TsAs(TsAsExpr { expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
            | Expr::TsInstantiation(TsInstantiation { expr, .. })
            | Expr::TsSatisfies(TsSatisfiesExpr { expr, .. }) => self.compute_rec(expr),
            _ => TsEnumRecordValue::Opaque(expr),
        }
    }

    fn compute_unary(&self, expr: UnaryExpr) -> TsEnumRecordValue {
        if !matches!(expr.op, op!(unary, "+") | op!(unary, "-") | op!("~")) {
            return TsEnumRecordValue::Opaque(expr.into());
        }

        let inner = self.compute_rec(expr.arg);

        let TsEnumRecordValue::Number(num) = inner else {
            return TsEnumRecordValue::Opaque(
                UnaryExpr {
                    span: expr.span,
                    op: expr.op,
                    arg: Box::new(inner.into()),
                }
                .into(),
            );
        };

        match expr.op {
            op!(unary, "+") => TsEnumRecordValue::Number(num),
            op!(unary, "-") => TsEnumRecordValue::Number(-num),
            op!("~") => TsEnumRecordValue::Number(!num),
            _ => unreachable!(),
        }
    }

    fn compute_bin(&self, expr: BinExpr) -> TsEnumRecordValue {
        let origin_expr = expr.clone();
        if !matches!(
            expr.op,
            op!(bin, "+")
                | op!(bin, "-")
                | op!("*")
                | op!("/")
                | op!("%")
                | op!("**")
                | op!("<<")
                | op!(">>")
                | op!(">>>")
                | op!("|")
                | op!("&")
                | op!("^"),
        ) {
            return TsEnumRecordValue::Opaque(origin_expr.into());
        }

        let left = self.compute_rec(expr.left);
        let right = self.compute_rec(expr.right);

        match (left, right, expr.op) {
            (TsEnumRecordValue::Number(left), TsEnumRecordValue::Number(right), op) => {
                let value = match op {
                    op!(bin, "+") => left + right,
                    op!(bin, "-") => left - right,
                    op!("*") => left * right,
                    op!("/") => left / right,
                    op!("%") => left % right,
                    op!("**") => left.pow(right),
                    op!("<<") => left << right,
                    op!(">>") => left >> right,
                    op!(">>>") => left.unsigned_shr(right),
                    op!("|") => left | right,
                    op!("&") => left & right,
                    op!("^") => left ^ right,
                    _ => unreachable!(),
                };

                TsEnumRecordValue::Number(value)
            }
            (TsEnumRecordValue::String(left), TsEnumRecordValue::String(right), op!(bin, "+")) => {
                TsEnumRecordValue::String(format!("{left}{right}").into())
            }
            (TsEnumRecordValue::Number(left), TsEnumRecordValue::String(right), op!(bin, "+")) => {
                let left = left.to_js_string();

                TsEnumRecordValue::String(format!("{left}{right}").into())
            }
            (TsEnumRecordValue::String(left), TsEnumRecordValue::Number(right), op!(bin, "+")) => {
                let right = right.to_js_string();

                TsEnumRecordValue::String(format!("{left}{right}").into())
            }
            (left, right, _) => {
                let mut origin_expr = origin_expr;

                if left.is_const() {
                    origin_expr.left = Box::new(left.into());
                }

                if right.is_const() {
                    origin_expr.right = Box::new(right.into());
                }

                TsEnumRecordValue::Opaque(origin_expr.into())
            }
        }
    }

    fn compute_member(&self, expr: MemberExpr) -> TsEnumRecordValue {
        if matches!(expr.prop, MemberProp::PrivateName(..)) {
            return TsEnumRecordValue::Opaque(expr.into());
        }

        let opaque_expr = TsEnumRecordValue::Opaque(expr.clone().into());

        let member_name = match expr.prop {
            MemberProp::Ident(ident) => ident.sym,
            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                let Expr::Lit(Lit::Str(s)) = *expr else {
                    return opaque_expr;
                };

                atom_from_wtf8_atom(&s.value)
            }
            _ => return opaque_expr,
        };

        let Expr::Ident(ident) = *expr.obj else {
            return opaque_expr;
        };

        self.record
            .get(&TsEnumRecordKey {
                enum_id: ident.to_id(),
                member_name,
            })
            .cloned()
            .filter(TsEnumRecordValue::has_value)
            .unwrap_or(opaque_expr)
    }

    fn compute_tpl(&self, expr: Tpl) -> TsEnumRecordValue {
        let opaque_expr = TsEnumRecordValue::Opaque(expr.clone().into());

        let Tpl { exprs, quasis, .. } = expr;

        let mut quasis_iter = quasis.into_iter();

        let Some(mut string) = quasis_iter.next().map(|q| q.raw.to_string()) else {
            return opaque_expr;
        };

        for (q, expr) in quasis_iter.zip(exprs) {
            let expr = self.compute_rec(expr);

            let expr = match expr {
                TsEnumRecordValue::String(s) => s.to_string(),
                TsEnumRecordValue::Number(n) => n.to_js_string(),
                _ => return opaque_expr,
            };

            string.push_str(&expr);
            string.push_str(&q.raw);
        }

        TsEnumRecordValue::String(string.into())
    }
}
