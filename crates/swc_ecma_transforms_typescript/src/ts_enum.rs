use std::mem;

use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{number::ToJsString, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct TsEnumRecordKey {
    pub enum_id: Id,
    pub member_name: JsWord,
}

pub(crate) type TsEnumRecord = AHashMap<TsEnumRecordKey, TsEnumRecordValue>;

#[derive(Debug, Clone)]
pub(crate) enum TsEnumRecordValue {
    String(JsWord),
    Number(f64),
    Opaque(Box<Expr>),
    Void,
}

impl TsEnumRecordValue {
    pub fn inc(&self) -> Self {
        match self {
            Self::Number(num) => Self::Number(num + 1.0),
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
            TsEnumRecordValue::Number(num) if f64::is_nan(num) => Ident {
                span: DUMMY_SP,
                sym: "NaN".into(),
                ..Default::default()
            }
            .into(),
            TsEnumRecordValue::Number(num) if f64::is_infinite(num) => {
                let value = Ident {
                    span: DUMMY_SP,
                    sym: "Infinity".into(),
                    ..Default::default()
                }
                .into();

                if f64::is_sign_negative(num) {
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
                value: num,
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
        Self::Number(value)
    }
}

pub(crate) struct EnumValueComputer<'a> {
    pub enum_id: &'a Id,
    pub top_level_mark: Mark,
    pub record: &'a TsEnumRecord,
}

/// https://github.com/microsoft/TypeScript/pull/50528
impl<'a> EnumValueComputer<'a> {
    pub fn compute(&mut self, mut expr: Box<Expr>) -> TsEnumRecordValue {
        expr.visit_mut_with(self);

        self.compute_rec(expr)
    }

    fn compute_rec(&self, expr: Box<Expr>) -> TsEnumRecordValue {
        match *expr {
            Expr::Lit(Lit::Str(s)) => TsEnumRecordValue::String(s.value),
            Expr::Lit(Lit::Num(n)) => TsEnumRecordValue::Number(n.value),
            Expr::Ident(Ident { ctxt, sym, .. })
                if &*sym == "NaN" && ctxt.has_mark(self.top_level_mark) =>
            {
                TsEnumRecordValue::Number(f64::NAN)
            }
            Expr::Ident(Ident { ctxt, sym, .. })
                if &*sym == "Infinity" && ctxt.has_mark(self.top_level_mark) =>
            {
                TsEnumRecordValue::Number(f64::INFINITY)
            }
            Expr::Ident(ref ident) => self
                .record
                .get(&TsEnumRecordKey {
                    enum_id: self.enum_id.clone(),
                    member_name: ident.sym.clone(),
                })
                .cloned()
                .filter(TsEnumRecordValue::is_const)
                .unwrap_or_else(|| TsEnumRecordValue::Opaque(expr)),
            Expr::Paren(e) => self.compute_rec(e.expr),
            Expr::Unary(e) => self.compute_unary(e),
            Expr::Bin(e) => self.compute_bin(e),
            Expr::Member(e) => self.compute_member(e),
            Expr::Tpl(e) => self.compute_tpl(e),
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
            op!("~") => TsEnumRecordValue::Number(!(num as i32) as f64),
            _ => unreachable!(),
        }
    }

    fn compute_bin(&self, expr: BinExpr) -> TsEnumRecordValue {
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
            return TsEnumRecordValue::Opaque(expr.into());
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
                    op!("**") => left.powf(right),
                    op!("<<") => (left.trunc() as i32).wrapping_shl(right.trunc() as u32) as f64,
                    op!(">>") => (left.trunc() as i32).wrapping_shr(right.trunc() as u32) as f64,
                    op!(">>>") => (left.trunc() as u32).wrapping_shr(right.trunc() as u32) as f64,
                    op!("|") => ((left.trunc() as i32) | (right.trunc() as i32)) as f64,
                    op!("&") => ((left.trunc() as i32) & (right.trunc() as i32)) as f64,
                    op!("^") => ((left.trunc() as i32) ^ (right.trunc() as i32)) as f64,
                    _ => unreachable!(),
                };

                TsEnumRecordValue::Number(value)
            }
            (TsEnumRecordValue::String(left), TsEnumRecordValue::String(right), op!(bin, "+")) => {
                TsEnumRecordValue::String(format!("{}{}", left, right).into())
            }
            (TsEnumRecordValue::Number(left), TsEnumRecordValue::String(right), op!(bin, "+")) => {
                let left = left.to_js_string();

                TsEnumRecordValue::String(format!("{}{}", left, right).into())
            }
            (TsEnumRecordValue::String(left), TsEnumRecordValue::Number(right), op!(bin, "+")) => {
                let right = right.to_js_string();

                TsEnumRecordValue::String(format!("{}{}", left, right).into())
            }
            (left, right, op) => TsEnumRecordValue::Opaque(
                BinExpr {
                    span: expr.span,
                    op,
                    left: Box::new(left.into()),
                    right: Box::new(right.into()),
                }
                .into(),
            ),
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

                s.value
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

impl<'a> VisitMut for EnumValueComputer<'a> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(ident)
                if self.record.contains_key(&TsEnumRecordKey {
                    enum_id: self.enum_id.clone(),
                    member_name: ident.sym.clone(),
                }) =>
            {
                *expr = self
                    .enum_id
                    .clone()
                    .make_member(ident.clone().into())
                    .into();
            }
            Expr::Member(MemberExpr {
                obj,
                // prop,
                ..
            }) => {
                obj.visit_mut_with(self);
            }
            _ => expr.visit_mut_children_with(self),
        }
    }
}

pub(crate) struct InlineEnum {
    record: TsEnumRecord,
    is_lhs: bool,
}

impl InlineEnum {
    pub fn new(record: TsEnumRecord) -> Self {
        Self {
            record,
            is_lhs: false,
        }
    }
}

impl VisitMut for InlineEnum {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        if self.is_lhs {
            return;
        }

        if let Expr::Member(MemberExpr { obj, prop, .. }) = n {
            let Some(enum_id) = Self::get_enum_id(obj) else {
                return;
            };

            let Some(member_name) = Self::get_member_key(prop) else {
                return;
            };

            let key = TsEnumRecordKey {
                enum_id,
                member_name,
            };

            let Some(value) = self.record.get(&key) else {
                return;
            };

            if value.is_const() {
                *n = value.clone().into();
            }
        }
    }

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.left.visit_mut_with(self);
        self.is_lhs = false;
        n.right.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat(&mut self, n: &mut AssignPat) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.left.visit_mut_with(self);
        self.is_lhs = false;
        n.right.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.arg.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.key.visit_mut_with(self);
        let is_lhs = mem::replace(&mut self.is_lhs, false);
        n.value.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, false);
        n.visit_mut_children_with(self);
        self.is_lhs = is_lhs;
    }
}

impl InlineEnum {
    fn get_enum_id(e: &Expr) -> Option<Id> {
        if let Expr::Ident(ident) = e {
            Some(ident.to_id())
        } else {
            None
        }
    }

    fn get_member_key(prop: &MemberProp) -> Option<JsWord> {
        match prop {
            MemberProp::Ident(ident) => Some(ident.sym.clone()),
            MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
                Expr::Lit(Lit::Str(Str { value, .. })) => Some(value.clone()),
                Expr::Tpl(Tpl { exprs, quasis, .. }) => match (exprs.len(), quasis.len()) {
                    (0, 1) => quasis[0].cooked.as_ref().map(|v| JsWord::from(&**v)),
                    _ => None,
                },
                _ => None,
            },
            MemberProp::PrivateName(_) => None,
        }
    }
}
