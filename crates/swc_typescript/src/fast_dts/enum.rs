use core::f64;
use std::borrow::Borrow;

use rustc_hash::FxHashMap;
use swc_atoms::{wtf8::Wtf8Buf, Atom, Wtf8Atom};
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{
    BinExpr, BinaryOp, Expr, Lit, Number, Str, TsEnumDecl, TsEnumMemberId, UnaryExpr, UnaryOp,
};
use swc_ecma_utils::number::{JsNumber, ToJsString};

use super::{util::ast_ext::MemberPropExt, FastDts};

#[derive(Debug, Clone)]
enum ConstantValue {
    Number(Number),
    String(Wtf8Atom),
}

impl ConstantValue {
    /// Creates a computed number. Computations intentionally discard source
    /// spelling so code generation can choose the canonical representation.
    fn number(value: f64) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        })
    }

    /// Creates a number converted directly from an AST value.
    fn converted_number(value: f64, raw: Option<Atom>) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value,
            raw,
        })
    }

    fn push_to(self, output: &mut Wtf8Buf) {
        match self {
            Self::Number(number) => output.push_str(&number.value.to_js_string()),
            Self::String(string) => output.push_wtf8(&string),
        }
    }
}

impl FastDts {
    pub(crate) fn transform_enum(&mut self, decl: &mut TsEnumDecl) {
        let mut prev_init_value = Some(ConstantValue::number(-1.0));
        let mut prev_members = FxHashMap::default();
        for member in &mut decl.members {
            let value = if let Some(init_expr) = &member.init {
                let computed_value = self.evaluate(init_expr, &decl.id.sym, &prev_members);
                if computed_value.is_none() {
                    self.enum_member_initializers(member.id.span());
                }
                computed_value
            } else if let Some(ConstantValue::Number(v)) = prev_init_value {
                Some(ConstantValue::number(v.value + 1.0))
            } else {
                None
            };

            prev_init_value = value.clone();
            if let Some(value) = &value {
                prev_members.insert(enum_member_name(&member.id), value.clone());
            }

            member.init = value.map(|value| {
                Box::new(match value {
                    ConstantValue::Number(number) => Expr::Lit(Lit::Num(number)),
                    ConstantValue::String(value) => Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value,
                        raw: None,
                    })),
                })
            });
        }
    }

    fn evaluate(
        &self,
        expr: &Expr,
        enum_name: &Atom,
        prev_members: &FxHashMap<Wtf8Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        match expr {
            Expr::Lit(lit) => match lit {
                Lit::Str(string) => Some(ConstantValue::String(string.value.clone())),
                Lit::Num(number) => Some(ConstantValue::Number(number.clone())),
                Lit::Null(_) | Lit::BigInt(_) | Lit::Bool(_) | Lit::Regex(_) | Lit::JSXText(_) => {
                    None
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            Expr::Tpl(template) => {
                let mut quasis = template.quasis.iter();
                let first = quasis.next()?.cooked.as_ref()?;
                let mut value = Wtf8Buf::from(first);

                for (expr, quasi) in template.exprs.iter().zip(quasis) {
                    self.evaluate(expr, enum_name, prev_members)?
                        .push_to(&mut value);
                    value.push_wtf8(quasi.cooked.as_ref()?);
                }

                Some(ConstantValue::String(Wtf8Atom::from(&*value)))
            }
            Expr::Paren(expr) => self.evaluate(&expr.expr, enum_name, prev_members),
            Expr::Bin(bin_expr) => self.evaluate_binary_expr(bin_expr, enum_name, prev_members),
            Expr::Unary(unary_expr) => {
                self.evaluate_unary_expr(unary_expr, enum_name, prev_members)
            }
            Expr::Ident(ident) => {
                if ident.sym == "Infinity" {
                    Some(ConstantValue::converted_number(
                        f64::INFINITY,
                        Some(ident.sym.clone()),
                    ))
                } else if ident.sym == "NaN" {
                    Some(ConstantValue::converted_number(
                        f64::NAN,
                        Some(ident.sym.clone()),
                    ))
                } else {
                    prev_members.get(ident.sym.borrow()).cloned()
                }
            }
            Expr::Member(member) => {
                let ident = member.obj.as_ident()?;
                if &ident.sym == enum_name {
                    let name = member.prop.static_name()?;
                    prev_members.get(name).cloned()
                } else {
                    None
                }
            }
            Expr::OptChain(opt_chain) => {
                let member = opt_chain.base.as_member()?;
                let ident = member.obj.as_ident()?;
                if &ident.sym == enum_name {
                    let name = member.prop.static_name()?;
                    prev_members.get(name).cloned()
                } else {
                    None
                }
            }
            _ => None,
        }
    }

    fn evaluate_unary_expr(
        &self,
        expr: &UnaryExpr,
        enum_name: &Atom,
        prev_members: &FxHashMap<Wtf8Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        let value = self.evaluate(&expr.arg, enum_name, prev_members)?;
        let value = match value {
            ConstantValue::Number(number) => number.value,
            ConstantValue::String(_) => {
                let value = if expr.op == UnaryOp::Minus {
                    ConstantValue::number(f64::NAN)
                } else if expr.op == UnaryOp::Tilde {
                    ConstantValue::number(-1.0)
                } else {
                    value
                };
                return Some(value);
            }
        };

        match expr.op {
            UnaryOp::Minus => Some(ConstantValue::number(-value)),
            UnaryOp::Plus => Some(ConstantValue::number(value)),
            UnaryOp::Tilde => Some(ConstantValue::number((!JsNumber::from(value)).into())),
            _ => None,
        }
    }

    fn evaluate_binary_expr(
        &self,
        expr: &BinExpr,
        enum_name: &Atom,
        prev_members: &FxHashMap<Wtf8Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        let left = self.evaluate(&expr.left, enum_name, prev_members)?;
        let right = self.evaluate(&expr.right, enum_name, prev_members)?;

        if expr.op == BinaryOp::Add
            && (matches!(left, ConstantValue::String(_))
                || matches!(right, ConstantValue::String(_)))
        {
            let mut value = Wtf8Buf::new();
            left.push_to(&mut value);
            right.push_to(&mut value);
            return Some(ConstantValue::String(Wtf8Atom::from(&*value)));
        }

        let left = JsNumber::from(match left {
            ConstantValue::Number(number) => number.value,
            ConstantValue::String(_) => return None,
        });

        let right = JsNumber::from(match right {
            ConstantValue::Number(number) => number.value,
            ConstantValue::String(_) => return None,
        });

        match expr.op {
            BinaryOp::LShift => Some(left << right),
            BinaryOp::RShift => Some(left >> right),
            BinaryOp::ZeroFillRShift => Some(left.unsigned_shr(right)),
            BinaryOp::Add => Some(left + right),
            BinaryOp::Sub => Some(left - right),
            BinaryOp::Mul => Some(left * right),
            BinaryOp::Div => Some(left / right),
            BinaryOp::Mod => Some(left % right),
            BinaryOp::BitOr => Some(left | right),
            BinaryOp::BitXor => Some(left ^ right),
            BinaryOp::BitAnd => Some(left & right),
            BinaryOp::Exp => Some(left.pow(right)),
            _ => None,
        }
        .map(|number| ConstantValue::number(number.into()))
    }
}

fn enum_member_name(member: &TsEnumMemberId) -> Wtf8Atom {
    match member {
        TsEnumMemberId::Ident(ident) => ident.sym.clone().into(),
        TsEnumMemberId::Str(string) => string.value.clone(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
