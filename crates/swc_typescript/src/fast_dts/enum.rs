use core::f64;

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::{
    BinExpr, BinaryOp, Expr, Lit, Number, Str, TsEnumDecl, TsEnumMemberId, UnaryExpr, UnaryOp,
};
use swc_ecma_utils::number::{JsNumber, ToJsString};

use super::{util::ast_ext::MemberPropExt, FastDts};

#[derive(Debug, Clone)]
enum ConstantValue {
    Number(Number),
    String(String),
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
                let member_name = match &member.id {
                    TsEnumMemberId::Ident(ident) => ident.sym.clone(),
                    TsEnumMemberId::Str(s) => s
                        .value
                        .clone()
                        .try_into_atom()
                        .unwrap_or_else(|wtf8| Atom::from(&*wtf8.to_string_lossy())),
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                };
                prev_members.insert(member_name.clone(), value.clone());
            }

            member.init = value.map(|value| {
                Box::new(match value {
                    ConstantValue::Number(number) => Expr::Lit(Lit::Num(number)),
                    ConstantValue::String(s) => Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: s.clone().into(),
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
        prev_members: &FxHashMap<Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        match expr {
            Expr::Lit(lit) => match lit {
                Lit::Str(s) => Some(ConstantValue::String(s.value.to_string_lossy().to_string())),
                Lit::Num(number) => Some(ConstantValue::Number(number.clone())),
                Lit::Null(_) | Lit::BigInt(_) | Lit::Bool(_) | Lit::Regex(_) | Lit::JSXText(_) => {
                    None
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            Expr::Tpl(tpl) => {
                let mut value = String::new();
                for part in &tpl.quasis {
                    value.push_str(&part.raw);
                }
                Some(ConstantValue::String(value))
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
                    prev_members.get(&ident.sym).cloned()
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
        prev_members: &FxHashMap<Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        let value = self.evaluate(&expr.arg, enum_name, prev_members)?;
        let value = match value {
            ConstantValue::Number(n) => n.value,
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
        prev_members: &FxHashMap<Atom, ConstantValue>,
    ) -> Option<ConstantValue> {
        let left = self.evaluate(&expr.left, enum_name, prev_members)?;
        let right = self.evaluate(&expr.right, enum_name, prev_members)?;

        if expr.op == BinaryOp::Add
            && (matches!(left, ConstantValue::String(_))
                || matches!(right, ConstantValue::String(_)))
        {
            let left_string = match left {
                ConstantValue::Number(number) => number.value.to_js_string(),
                ConstantValue::String(s) => s,
            };

            let right_string = match right {
                ConstantValue::Number(number) => number.value.to_js_string(),
                ConstantValue::String(s) => s,
            };

            return Some(ConstantValue::String(format!(
                "{left_string}{right_string}"
            )));
        }

        let left = JsNumber::from(match left {
            ConstantValue::Number(n) => n.value,
            ConstantValue::String(_) => return None,
        });

        let right = JsNumber::from(match right {
            ConstantValue::Number(n) => n.value,
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
