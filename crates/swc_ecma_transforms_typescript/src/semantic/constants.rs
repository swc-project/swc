//! The syntax accepted by TypeScript's constant evaluator, before type erasure.
//!
//! This is a small derived expression tree. It owns computed strings and
//! literal values, but never copies runtime AST subtrees such as functions or
//! calls.

use swc_atoms::{wtf8::Wtf8Buf, Wtf8Atom};
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    number::{JsNumber, ToJsString},
    stack_size::maybe_grow_default,
    ts_bindings::{transparent_expr, TsBindings, TsContainerId, TsMemberResolution, TsValueTarget},
};

use super::enums::EnumValue;

#[derive(Debug)]
pub(super) enum ConstantExpr {
    Literal(EnumValue),
    Reference {
        target: TsValueTarget,
        span: Span,
        deferred: Option<Span>,
    },
    Unary(UnaryOp, Box<ConstantExpr>),
    Binary(BinaryOp, Box<ConstantExpr>, Box<ConstantExpr>),
    Template {
        quasis: Box<[Option<Wtf8Atom>]>,
        expressions: Box<[ConstantExpr]>,
    },
    Unknown,
}

impl ConstantExpr {
    pub(super) fn may_reference_const_binding(&self) -> bool {
        maybe_grow_default(|| match self {
            Self::Reference {
                target: TsValueTarget::Binding(_),
                ..
            } => true,
            Self::Unary(_, operand) => operand.may_reference_const_binding(),
            Self::Binary(_, left, right) => {
                left.may_reference_const_binding() || right.may_reference_const_binding()
            }
            Self::Template { expressions, .. } => {
                expressions.iter().any(Self::may_reference_const_binding)
            }
            Self::Literal(_) | Self::Reference { .. } | Self::Unknown => false,
        })
    }

    pub(super) fn collect(
        expression: &Expr,
        bindings: &TsBindings,
        enum_owner: Option<TsContainerId>,
        unresolved: SyntaxContext,
        deferred: Option<Span>,
    ) -> Self {
        maybe_grow_default(|| {
            Self::collect_inner(expression, bindings, enum_owner, unresolved, deferred)
        })
    }

    fn collect_inner(
        expression: &Expr,
        bindings: &TsBindings,
        enum_owner: Option<TsContainerId>,
        unresolved: SyntaxContext,
        deferred: Option<Span>,
    ) -> Self {
        let expression = transparent_expr(expression);
        let reference = |target, span| Self::Reference {
            target,
            span,
            deferred,
        };
        let child = |expression: &Expr| {
            Self::collect(expression, bindings, enum_owner, unresolved, deferred)
        };
        match expression {
            Expr::Lit(Lit::Num(number)) => Self::Literal(EnumValue::Number(number.clone())),
            Expr::Lit(Lit::Str(string)) => Self::Literal(EnumValue::String(string.value.clone())),
            Expr::Ident(ident) => {
                // Resolver deliberately gives bare enum members its unresolved
                // sentinel. Only this enum's declared member set can interpret it.
                if ident.ctxt == unresolved {
                    let member = enum_owner
                        .and_then(|owner| bindings.named_member(owner, &ident.sym.clone().into()));
                    if let Some(member) =
                        member.filter(|member| bindings.member(*member).is_enum_member())
                    {
                        return reference(TsValueTarget::EnumMember(member), ident.span);
                    }
                    let value = match ident.sym.as_ref() {
                        "Infinity" => f64::INFINITY,
                        "NaN" => f64::NAN,
                        _ => return Self::Unknown,
                    };
                    return Self::Literal(EnumValue::Number(Number {
                        span: ident.span,
                        value,
                        raw: Some(ident.sym.clone()),
                    }));
                }
                bindings
                    .value_target(&ident.to_id())
                    .map_or(Self::Unknown, |target| reference(target, ident.span))
            }
            Expr::Member(_) | Expr::OptChain(_) => bindings
                .expression_target(expression, TsMemberResolution::Constant)
                .map_or(Self::Unknown, |target| reference(target, expression.span())),
            Expr::Unary(unary)
                if matches!(unary.op, UnaryOp::Plus | UnaryOp::Minus | UnaryOp::Tilde) =>
            {
                Self::Unary(unary.op, Box::new(child(&unary.arg)))
            }
            Expr::Bin(binary)
                if matches!(
                    binary.op,
                    BinaryOp::Add
                        | BinaryOp::Sub
                        | BinaryOp::Mul
                        | BinaryOp::Div
                        | BinaryOp::Mod
                        | BinaryOp::Exp
                        | BinaryOp::LShift
                        | BinaryOp::RShift
                        | BinaryOp::ZeroFillRShift
                        | BinaryOp::BitOr
                        | BinaryOp::BitAnd
                        | BinaryOp::BitXor
                ) =>
            {
                Self::Binary(
                    binary.op,
                    Box::new(child(&binary.left)),
                    Box::new(child(&binary.right)),
                )
            }
            Expr::Tpl(template) => Self::Template {
                quasis: template
                    .quasis
                    .iter()
                    .map(|quasi| quasi.cooked.clone())
                    .collect(),
                expressions: template
                    .exprs
                    .iter()
                    .map(|expression| child(expression))
                    .collect(),
            },
            // TS assertions, satisfies, non-null and instantiation syntax are
            // barriers both to constants and to syntactic string knowledge.
            _ => Self::Unknown,
        }
    }

    pub(super) fn evaluate(
        &self,
        resolve: &mut impl FnMut(TsValueTarget, Span, Option<Span>) -> EnumValue,
    ) -> EnumValue {
        maybe_grow_default(|| self.evaluate_inner(resolve))
    }

    fn evaluate_inner(
        &self,
        resolve: &mut impl FnMut(TsValueTarget, Span, Option<Span>) -> EnumValue,
    ) -> EnumValue {
        match self {
            Self::Literal(value) => value.clone(),
            Self::Reference {
                target,
                span,
                deferred,
            } => resolve(*target, *span, *deferred),
            Self::Unknown => EnumValue::Unknown,
            Self::Unary(operator, operand) => {
                let EnumValue::Number(number) = operand.evaluate(resolve) else {
                    return EnumValue::Unknown;
                };
                let value = match operator {
                    UnaryOp::Plus => number.value,
                    UnaryOp::Minus => -number.value,
                    UnaryOp::Tilde => (!JsNumber::from(number.value)).into(),
                    _ => unreachable!("constant IR only contains arithmetic unary operators"),
                };
                EnumValue::number(value)
            }
            Self::Binary(operator, left, right) => {
                let left = left.evaluate(resolve);
                let right = right.evaluate(resolve);
                if *operator == BinaryOp::Add && (left.is_string() || right.is_string()) {
                    let mut string = Wtf8Buf::new();
                    if push_string(&left, &mut string) && push_string(&right, &mut string) {
                        return EnumValue::String(Wtf8Atom::from(&*string));
                    }
                    return EnumValue::StringExpression;
                }
                let (EnumValue::Number(left), EnumValue::Number(right)) = (left, right) else {
                    return EnumValue::Unknown;
                };
                let left = JsNumber::from(left.value);
                let right = JsNumber::from(right.value);
                let value = match operator {
                    BinaryOp::Add => left + right,
                    BinaryOp::Sub => left - right,
                    BinaryOp::Mul => left * right,
                    BinaryOp::Div => left / right,
                    BinaryOp::Mod => left % right,
                    BinaryOp::Exp => left.pow(right),
                    BinaryOp::LShift => left << right,
                    BinaryOp::RShift => left >> right,
                    BinaryOp::ZeroFillRShift => left.unsigned_shr(right),
                    BinaryOp::BitOr => left | right,
                    BinaryOp::BitAnd => left & right,
                    BinaryOp::BitXor => left ^ right,
                    _ => unreachable!("constant IR only contains arithmetic binary operators"),
                };
                EnumValue::number(value)
            }
            Self::Template {
                quasis,
                expressions,
            } => {
                let Some(Some(first)) = quasis.first() else {
                    return EnumValue::StringExpression;
                };
                let mut string = Wtf8Buf::from(first);
                for (expression, quasi) in expressions.iter().zip(&quasis[1..]) {
                    let value = expression.evaluate(resolve);
                    let Some(quasi) = quasi else {
                        return EnumValue::StringExpression;
                    };
                    if !push_string(&value, &mut string) {
                        return EnumValue::StringExpression;
                    }
                    string.push_wtf8(quasi);
                }
                EnumValue::String(Wtf8Atom::from(&*string))
            }
        }
    }
}

fn push_string(value: &EnumValue, output: &mut Wtf8Buf) -> bool {
    match value {
        EnumValue::String(string) => output.push_wtf8(string),
        EnumValue::Number(number) => output.push_str(&number.value.to_js_string()),
        EnumValue::StringExpression | EnumValue::Unknown => return false,
    }
    true
}
