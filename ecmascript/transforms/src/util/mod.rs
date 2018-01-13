pub use self::Purity::{MayBeImpure, Pure};
pub use self::Value::{Known, Unknown};
use ast::*;
use std::borrow::Cow;
use std::f64::{INFINITY, NAN};
use std::num::FpCategory;
use std::ops::{Add, Not};

pub trait ExprExt: Sized + AsRef<Expr> {
    ///
    /// This method emulates the `Boolean()` JavaScript cast function.
    ///Note: unlike getPureBooleanValue this function does not return `None`
    ///for expressions with side-effects.
    fn as_bool(&self) -> (Purity, Bool) {
        let expr = self.as_ref();
        let val = match expr.node {
            ExprKind::Paren(ref e) => return e.as_bool(),
            ExprKind::Seq { ref exprs } => return exprs.last().unwrap().as_bool(),
            ExprKind::Assign { ref right, .. } => return right.as_bool(),

            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Bang,
                ref arg,
            } => {
                let (p, v) = arg.as_bool();
                return (p, !v);
            }

            ExprKind::Binary {
                ref left,
                op: op @ BinaryOp::LogicalAnd,
                ref right,
            }
            | ExprKind::Binary {
                ref left,
                op: op @ BinaryOp::LogicalOr,
                ref right,
            } => {
                // TODO: Ignore purity if value cannot be reached.

                let (lp, lv) = left.as_bool();
                let (rp, rv) = right.as_bool();

                if lp + rp == Pure {
                    return (Pure, lv.and(rv));
                }
                if op == BinaryOp::LogicalAnd {
                    lv.and(rv)
                } else {
                    lv.or(rv)
                }
            }

            ExprKind::Function(..)
            | ExprKind::Class(..)
            | ExprKind::New { .. }
            | ExprKind::Array { .. }
            | ExprKind::Object { .. } => Known(true),

            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Void,
                arg: _,
            } => Known(false),

            ExprKind::Lit(ref lit) => {
                return (
                    Pure,
                    Known(match *lit {
                        Lit::Num(Number(n)) => match n.classify() {
                            FpCategory::Nan | FpCategory::Zero => false,
                            _ => true,
                        },
                        Lit::Bool(b) => b,
                        Lit::Str(ref s) => !s.is_empty(),
                        Lit::Null => false,
                        Lit::Regex(..) => true,
                    }),
                )
            }

            //TODO?
            _ => Unknown,
        };

        (MayBeImpure, val)
    }

    /// Emulates javascript Number() cast function.
    fn as_number(&self) -> Value<f64> {
        let expr = self.as_ref();
        let v = match expr.node {
            ExprKind::Lit(ref l) => match *l {
                Lit::Bool(true) => 1.0,
                Lit::Bool(false) | Lit::Null => 0.0,
                Lit::Num(Number(n)) => n,
                Lit::Str(ref s) => return num_from_str(s),
                _ => return Unknown,
            },
            ExprKind::Ident(Ident { ref sym, .. }) => match &**sym {
                "undefined" | "NaN" => NAN,
                "Infinity" => INFINITY,
                _ => return Unknown,
            },
            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Minus,
                arg:
                    box Expr {
                        span: _,
                        node:
                            ExprKind::Ident(Ident {
                                sym: js_word!("Infinity"),
                                ..
                            }),
                    },
            } => -INFINITY,
            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Bang,
                ref arg,
            } => match arg.as_bool() {
                (Pure, Known(v)) => {
                    if v {
                        0.0
                    } else {
                        1.0
                    }
                }
                _ => return Unknown,
            },
            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Void,
                ref arg,
            } => {
                if arg.may_have_side_effects() {
                    return Unknown;
                } else {
                    NAN
                }
            }

            ExprKind::Tpl(..) | ExprKind::Object { .. } | ExprKind::Array { .. } => {
                match self.as_string() {
                    Some(ref s) => return num_from_str(s),
                    None => return Unknown,
                }
            }

            _ => return Unknown,
        };

        Known(v)
    }

    fn as_string(&self) -> Option<Cow<str>> {
        let expr = self.as_ref();
        match expr.node {
            ExprKind::Lit(ref l) => match *l {
                Lit::Str(ref s) => Some(Cow::Borrowed(s)),
                Lit::Num(n) => Some(format!("{}", n).into()),
                Lit::Bool(true) => Some(Cow::Borrowed("true")),
                Lit::Bool(false) => Some(Cow::Borrowed("false")),
                Lit::Null => Some(Cow::Borrowed("null")),
                _ => None,
            },
            ExprKind::Tpl(_) => {
                // TODO:
                // Only convert a template literal if all its expressions can be converted.
                unimplemented!("TplLit.as_string()")
            }
            ExprKind::Ident(Ident { ref sym, .. }) => match &**sym {
                "undefined" | "Infinity" | "NaN" => Some(Cow::Borrowed(&**sym)),
                _ => None,
            },
            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Void,
                ..
            } => Some(Cow::Borrowed("undefined")),
            ExprKind::Unary {
                prefix: true,
                op: UnaryOp::Bang,
                ref arg,
            } => match arg.as_bool() {
                (Pure, Known(v)) => Some(Cow::Borrowed(if v { "false" } else { "true" })),
                _ => None,
            },
            ExprKind::Array { ref elems } => {
                let mut first = true;
                let mut buf = String::new();
                // null, undefined is "" in array literl.
                for elem in elems {
                    let e = match *elem {
                        Some(ref elem) => match *elem {
                            ExprOrSpread::Expr(ref e) | ExprOrSpread::Spread(ref e) => match e.node
                            {
                                ExprKind::Lit(Lit::Null)
                                | ExprKind::Ident(Ident {
                                    sym: js_word!("undefined"),
                                    ..
                                }) => Cow::Borrowed(""),
                                _ => match e.as_string() {
                                    Some(s) => s,
                                    None => return None,
                                },
                            },
                        },
                        None => Cow::Borrowed(""),
                    };
                    buf.push_str(&e);

                    if first {
                        first = false;
                    } else {
                        buf.push(',');
                    }
                }
                Some(buf.into())
            }
            ExprKind::Object { .. } => Some(Cow::Borrowed("[object Object]")),
            _ => None,
        }
    }
}

fn num_from_str(s: &str) -> Value<f64> {
    if s.contains('\u{000b}') {
        return Unknown;
    }

    // TODO: Check if this is correct
    let s = s.trim();

    if s.is_empty() {
        return Known(0.0);
    }

    if s.starts_with("0x") || s.starts_with("0X") {
        return match s[2..4].parse() {
            Ok(n) => Known(n),
            Err(_) => Known(NAN),
        };
    }

    if (s.starts_with('-') || s.starts_with('+'))
        && (s[1..].starts_with("0x") || s[1..].starts_with("0X"))
    {
        // hex numbers with explicit signs vary between browsers.
        return Unknown;
    }

    // Firefox and IE treat the "Infinity" differently. Firefox is case
    // insensitive, but IE treats "infinity" as NaN.  So leave it alone.
    match s {
        "infinity" | "+infinity" | "-infinity" => return Unknown,
        _ => {}
    }

    Known(s.parse().ok().unwrap_or(NAN))
}

impl<T: AsRef<Expr>> ExprExt for T {}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Purity {
    MayBeImpure,
    Pure,
}
impl Purity {
    pub fn is_pure(self) -> bool {
        self == Pure
    }
}

impl Add for Purity {
    type Output = Self;
    fn add(self, rhs: Self) -> Self {
        match (self, rhs) {
            (Pure, Pure) => Pure,
            _ => MayBeImpure,
        }
    }
}

/// Value.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Value<T> {
    Known(T),
    Unknown,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Type {
    Str,
    Obj,
    Undetermined,
}

pub type Bool = Value<bool>;

impl Value<bool> {
    pub fn and(self, other: Self) -> Self {
        match self {
            Known(true) => other,
            Known(false) => Known(false),
            Unknown => match other {
                Known(false) => Known(false),
                _ => Unknown,
            },
        }
    }

    pub fn or(self, other: Self) -> Self {
        match self {
            Known(true) => Known(true),
            Known(false) => other,
            Unknown => match other {
                Known(true) => Known(true),
                _ => Unknown,
            },
        }
    }
}

impl Not for Value<bool> {
    type Output = Self;
    fn not(self) -> Self {
        match self {
            Value::Known(b) => Value::Known(!b),
            Value::Unknown => Value::Unknown,
        }
    }
}
