pub(crate) use self::{
    factory::ExprFactory,
    value::{
        Type::{
            self, Bool as BoolType, Null as NullType, Num as NumberType, Obj as ObjectType,
            Str as StringType, Symbol as SymbolType, Undefined as UndefinedType,
        },
        Value::{self, Known, Unknown},
    },
    Purity::{MayBeImpure, Pure},
};
use std::{
    borrow::Cow,
    f64::{INFINITY, NAN},
    num::FpCategory,
    ops::Add,
};
use swc_atoms::JsWord;
use swc_ecma_ast::*;

mod factory;
mod value;

pub type BoolValue = Value<bool>;

pub trait IsEmpty {
    fn is_empty(&self) -> bool;
}

impl IsEmpty for BlockStmt {
    fn is_empty(&self) -> bool {
        self.stmts.is_empty()
    }
}
impl IsEmpty for CatchClause {
    fn is_empty(&self) -> bool {
        self.body.stmts.is_empty()
    }
}
impl IsEmpty for Stmt {
    fn is_empty(&self) -> bool {
        match *self {
            Stmt::Empty(_) => true,
            Stmt::Block(ref b) => b.is_empty(),
            _ => false,
        }
    }
}

impl<T: IsEmpty> IsEmpty for Option<T> {
    fn is_empty(&self) -> bool {
        match *self {
            Some(ref node) => node.is_empty(),
            None => true,
        }
    }
}
impl<T: IsEmpty> IsEmpty for Box<T> {
    fn is_empty(&self) -> bool {
        <T as IsEmpty>::is_empty(&*self)
    }
}

pub trait ExprExt: Sized {
    fn as_expr_kind(&self) -> &Expr;

    /// Checks if `self` is `NaN`.
    fn is_nan(&self) -> bool {
        self.is_ident_ref_to(js_word!("NaN"))
    }
    /// Is `self` an IdentifierReference to `id`?
    fn is_ident_ref_to(&self, id: JsWord) -> bool {
        match *self.as_expr_kind() {
            Expr::Ident(Ident { ref sym, .. }) if *sym == id => true,
            _ => false,
        }
    }
    fn as_pure_bool(&self) -> BoolValue {
        match self.as_bool() {
            (Pure, Known(b)) => Known(b),
            _ => Unknown,
        }
    }

    ///
    /// This method emulates the `Boolean()` JavaScript cast function.
    ///Note: unlike getPureBooleanValue this function does not return `None`
    ///for expressions with side-effects.
    fn as_bool(&self) -> (Purity, BoolValue) {
        let expr = self.as_expr_kind();
        let val = match *expr {
            Expr::Paren(ref e) => return e.expr.as_bool(),
            Expr::Seq(SeqExpr { ref exprs, .. }) => return exprs.last().unwrap().as_bool(),
            Expr::Assign(AssignExpr { ref right, .. }) => return right.as_bool(),

            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => {
                let (p, v) = arg.as_bool();
                return (p, !v);
            }

            Expr::Bin(BinExpr {
                ref left,
                op: op @ op!("&"),
                ref right,
                ..
            })
            | Expr::Bin(BinExpr {
                ref left,
                op: op @ op!("|"),
                ref right,
                ..
            }) => {
                // TODO: Ignore purity if value cannot be reached.

                let (lp, lv) = left.as_bool();
                let (rp, rv) = right.as_bool();

                if lp + rp == Pure {
                    return (Pure, lv.and(rv));
                }
                if op == op!("&") {
                    lv.and(rv)
                } else {
                    lv.or(rv)
                }
            }

            Expr::Fn(..) | Expr::Class(..) | Expr::New(..) | Expr::Array(..) | Expr::Object(..) => {
                Known(true)
            }

            Expr::Unary(UnaryExpr {
                op: op!("void"),
                arg: _,
                ..
            }) => Known(false),

            Expr::Lit(ref lit) => {
                return (
                    Pure,
                    Known(match *lit {
                        Lit::Num(Number { value: n, .. }) => match n.classify() {
                            FpCategory::Nan | FpCategory::Zero => false,
                            _ => true,
                        },
                        Lit::Bool(b) => b.value,
                        Lit::Str(Str { ref value, .. }) => !value.is_empty(),
                        Lit::Null(..) => false,
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
        let expr = self.as_expr_kind();
        let v = match *expr {
            Expr::Lit(ref l) => match *l {
                Lit::Bool(Bool { value: true, .. }) => 1.0,
                Lit::Bool(Bool { value: false, .. }) | Lit::Null(..) => 0.0,
                Lit::Num(Number { value: n, .. }) => n,
                Lit::Str(Str { ref value, .. }) => return num_from_str(value),
                _ => return Unknown,
            },
            Expr::Ident(Ident { ref sym, .. }) => match &**sym {
                "undefined" | "NaN" => NAN,
                "Infinity" => INFINITY,
                _ => return Unknown,
            },
            Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                arg:
                    box Expr::Ident(Ident {
                        sym: js_word!("Infinity"),
                        ..
                    }),
                span: _,
            }) => -INFINITY,
            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                span: _,
            }) => match arg.as_bool() {
                (Pure, Known(v)) => {
                    if v {
                        0.0
                    } else {
                        1.0
                    }
                }
                _ => return Unknown,
            },
            Expr::Unary(UnaryExpr {
                op: op!("void"),
                ref arg,
                span: _,
            }) => {
                if arg.may_have_side_effects() {
                    return Unknown;
                } else {
                    NAN
                }
            }

            Expr::Tpl(..) | Expr::Object(ObjectLit { .. }) | Expr::Array(ArrayLit { .. }) => {
                return num_from_str(&*self.as_string()?)
            }

            _ => return Unknown,
        };

        Known(v)
    }

    fn as_string(&self) -> Value<Cow<str>> {
        let expr = self.as_expr_kind();
        match *expr {
            Expr::Lit(ref l) => match *l {
                Lit::Str(Str { ref value, .. }) => Known(Cow::Borrowed(value)),
                Lit::Num(ref n) => Known(format!("{}", n).into()),
                Lit::Bool(Bool { value: true, .. }) => Known(Cow::Borrowed("true")),
                Lit::Bool(Bool { value: false, .. }) => Known(Cow::Borrowed("false")),
                Lit::Null(..) => Known(Cow::Borrowed("null")),
                _ => Unknown,
            },
            Expr::Tpl(_) => {
                // TODO:
                // Only convert a template literal if all its expressions can be converted.
                unimplemented!("TplLit.as_string()")
            }
            Expr::Ident(Ident { ref sym, .. }) => match &**sym {
                "undefined" | "Infinity" | "NaN" => Known(Cow::Borrowed(&**sym)),
                _ => Unknown,
            },
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Known(Cow::Borrowed("undefined")),
            Expr::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
                ..
            }) => Known(Cow::Borrowed(if arg.as_pure_bool()? {
                "false"
            } else {
                "true"
            })),
            Expr::Array(ArrayLit { ref elems, .. }) => {
                let mut first = true;
                let mut buf = String::new();
                // null, undefined is "" in array literl.
                for elem in elems {
                    let e = match *elem {
                        Some(ref elem) => match *elem {
                            ExprOrSpread { ref expr, .. } => match **expr {
                                Expr::Lit(Lit::Null(..))
                                | Expr::Ident(Ident {
                                    sym: js_word!("undefined"),
                                    ..
                                }) => Cow::Borrowed(""),
                                _ => expr.as_string()?,
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
                Known(buf.into())
            }
            Expr::Object(ObjectLit { .. }) => Known(Cow::Borrowed("[object Object]")),
            _ => Unknown,
        }
    }

    fn get_type(&self) -> Value<Type> {
        let expr = self.as_expr_kind();

        match *expr {
            Expr::Assign(AssignExpr {
                ref right,
                op: op!("="),
                ..
            }) => right.get_type(),
            Expr::Seq(SeqExpr { ref exprs, .. }) => exprs
                .last()
                .expect("sequence expression should not be empty")
                .get_type(),
            Expr::Bin(BinExpr {
                ref left,
                op: op!("&&"),
                ref right,
                ..
            })
            | Expr::Bin(BinExpr {
                ref left,
                op: op!("||"),
                ref right,
                ..
            })
            | Expr::Cond(CondExpr {
                cons: ref left,
                alt: ref right,
                ..
            }) => {
                let (lt, rt) = (left.get_type(), right.get_type());

                if lt == rt {
                    return lt;
                }
                return Unknown;
            }

            Expr::Bin(BinExpr {
                ref left,
                op: op!(bin, "+"),
                ref right,
                ..
            }) => {
                let rt = right.get_type();
                if rt == Known(StringType) {
                    return Known(StringType);
                }

                let lt = left.get_type();
                if lt == Known(StringType) {
                    return Known(StringType);
                }

                match (lt, rt) {
                    // There are some pretty weird cases for object types:
                    //   {} + [] === "0"
                    //   [] + {} ==== "[object Object]"
                    (Known(ObjectType), _) | (_, Known(ObjectType)) => return Unknown,
                    _ => {}
                }

                // ADD used with compilations of null, undefined, boolean and number always
                // result in numbers.
                if lt.casted_to_number_on_add() && rt.casted_to_number_on_add() {
                    return Known(NumberType);
                }

                // There are some pretty weird cases for object types:
                //   {} + [] === "0"
                //   [] + {} ==== "[object Object]"

                return Unknown;
            }

            Expr::Assign(AssignExpr {
                op: op!("+="),
                ref right,
                ..
            }) => {
                if right.get_type() == Known(StringType) {
                    return Known(StringType);
                }
                return Unknown;
            }

            Expr::Ident(Ident { ref sym, .. }) => {
                return Known(match *sym {
                    js_word!("undefined") => UndefinedType,
                    js_word!("NaN") | js_word!("Infinity") => NumberType,
                    _ => return Unknown,
                })
            }

            Expr::Lit(Lit::Num(..))
            | Expr::Assign(AssignExpr { op: op!("&="), .. })
            | Expr::Assign(AssignExpr { op: op!("^="), .. })
            | Expr::Assign(AssignExpr { op: op!("|="), .. })
            | Expr::Assign(AssignExpr { op: op!("<<="), .. })
            | Expr::Assign(AssignExpr { op: op!(">>="), .. })
            | Expr::Assign(AssignExpr {
                op: op!(">>>="), ..
            })
            | Expr::Assign(AssignExpr { op: op!("-="), .. })
            | Expr::Assign(AssignExpr { op: op!("*="), .. })
            | Expr::Assign(AssignExpr { op: op!("**="), .. })
            | Expr::Assign(AssignExpr { op: op!("/="), .. })
            | Expr::Assign(AssignExpr { op: op!("%="), .. })
            | Expr::Unary(UnaryExpr { op: op!("~"), .. })
            | Expr::Bin(BinExpr { op: op!("|"), .. })
            | Expr::Bin(BinExpr { op: op!("^"), .. })
            | Expr::Bin(BinExpr { op: op!("&"), .. })
            | Expr::Bin(BinExpr { op: op!("<<"), .. })
            | Expr::Bin(BinExpr { op: op!(">>"), .. })
            | Expr::Bin(BinExpr { op: op!(">>>"), .. })
            | Expr::Bin(BinExpr {
                op: op!(bin, "-"), ..
            })
            | Expr::Bin(BinExpr { op: op!("*"), .. })
            | Expr::Bin(BinExpr { op: op!("%"), .. })
            | Expr::Bin(BinExpr { op: op!("/"), .. })
            | Expr::Bin(BinExpr { op: op!("**"), .. })
            | Expr::Update(UpdateExpr { op: op!("++"), .. })
            | Expr::Update(UpdateExpr { op: op!("--"), .. })
            | Expr::Unary(UnaryExpr {
                op: op!(unary, "+"),
                ..
            })
            | Expr::Unary(UnaryExpr {
                op: op!(unary, "-"),
                ..
            }) => return Known(NumberType),

            // Primitives
            Expr::Lit(Lit::Bool(..))
            | Expr::Bin(BinExpr { op: op!("=="), .. })
            | Expr::Bin(BinExpr { op: op!("!="), .. })
            | Expr::Bin(BinExpr { op: op!("==="), .. })
            | Expr::Bin(BinExpr { op: op!("!=="), .. })
            | Expr::Bin(BinExpr { op: op!("<"), .. })
            | Expr::Bin(BinExpr { op: op!("<="), .. })
            | Expr::Bin(BinExpr { op: op!(">"), .. })
            | Expr::Bin(BinExpr { op: op!(">="), .. })
            | Expr::Bin(BinExpr { op: op!("in"), .. })
            | Expr::Bin(BinExpr {
                op: op!("instanceof"),
                ..
            })
            | Expr::Unary(UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => return Known(BoolType),

            Expr::Unary(UnaryExpr {
                op: op!("typeof"), ..
            })
            | Expr::Lit(Lit::Str { .. }) => return Known(StringType),

            Expr::Lit(Lit::Null(..)) => return Known(NullType),

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return Known(UndefinedType),

            Expr::Fn(..)
            | Expr::New(NewExpr { .. })
            | Expr::Array(ArrayLit { .. })
            | Expr::Object(ObjectLit { .. })
            | Expr::Lit(Lit::Regex(..)) => return Known(ObjectType),

            _ => Unknown,
        }
    }

    fn may_have_side_effects(&self) -> bool {
        match *self.as_expr_kind() {
            Expr::Lit(..) | Expr::Ident(..) | Expr::This(..) => false,
            Expr::Paren(ref e) => e.expr.may_have_side_effects(),
            // Function expression does not have any side effect if it's not used.
            Expr::Fn(..) | Expr::Arrow(ArrowExpr { .. }) => false,
            // TODO
            Expr::Class(..) => true,
            Expr::Array(ArrayLit { ref elems, .. }) => elems
                .iter()
                .filter_map(|e| e.as_ref())
                .any(|e| e.expr.may_have_side_effects()),
            Expr::Unary(UnaryExpr { ref arg, .. }) => arg.may_have_side_effects(),
            Expr::Bin(BinExpr {
                ref left,
                ref right,
                ..
            }) => left.may_have_side_effects() || right.may_have_side_effects(),

            //TODO
            Expr::Tpl(_) => true,
            Expr::MetaProp(_) => true,

            Expr::Await(_)
            | Expr::Yield(_)
            | Expr::Member(_)
            | Expr::Update(_)
            | Expr::Assign(_) => true,

            // TODO
            Expr::New(_) => true,
            // TODO
            Expr::Call(_) => true,

            Expr::Seq(SeqExpr { ref exprs, .. }) => exprs.iter().any(|e| e.may_have_side_effects()),

            Expr::Cond(CondExpr {
                ref test,
                ref cons,
                ref alt,
                ..
            }) => {
                test.may_have_side_effects()
                    || cons.may_have_side_effects()
                    || alt.may_have_side_effects()
            }

            Expr::Object(ObjectLit { ref props, .. }) => props.iter().any(|node| match *node {
                Prop::Shorthand(..) => false,
                Prop::KeyValue(KeyValueProp { ref key, ref value }) => {
                    let k = match *key {
                        PropName::Computed(ref e) => e.may_have_side_effects(),
                        _ => false,
                    };

                    k || value.may_have_side_effects()
                }
                _ => true,
            }),
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

impl ExprExt for Box<Expr> {
    fn as_expr_kind(&self) -> &Expr {
        &self
    }
}

impl ExprExt for Expr {
    fn as_expr_kind(&self) -> &Expr {
        &self
    }
}

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
