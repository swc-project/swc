pub use self::Purity::{MayBeImpure, Pure};
pub use self::value::Type::{self, Bool as BoolType, Null as NullType, Num as NumberType,
                            Obj as ObjectType, Str as StringType, Symbol as SymbolType,
                            Undefined as UndefinedType};
pub use self::value::Value::{self, Known, Unknown};
use ast::*;
use std::borrow::Cow;
use std::f64::{INFINITY, NAN};
use std::num::FpCategory;
use std::ops::Add;
use swc_atoms::JsWord;

mod value;

pub type Bool = Value<bool>;

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
impl IsEmpty for StmtKind {
    fn is_empty(&self) -> bool {
        match *self {
            StmtKind::Empty => true,
            StmtKind::Block(ref b) => b.is_empty(),
            _ => false,
        }
    }
}
impl IsEmpty for Stmt {
    fn is_empty(&self) -> bool {
        self.node.is_empty()
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
    fn as_expr_kind(&self) -> &ExprKind;

    /// Checks if `self` is `NaN`.
    fn is_nan(&self) -> bool {
        self.is_ident_ref_to(js_word!("NaN"))
    }
    /// Is `self` an IdentifierReference to `id`?
    fn is_ident_ref_to(&self, id: JsWord) -> bool {
        match *self.as_expr_kind() {
            ExprKind::Ident(Ident { ref sym, .. }) if *sym == id => true,
            _ => false,
        }
    }
    fn as_pure_bool(&self) -> Bool {
        match self.as_bool() {
            (Pure, Known(b)) => Known(b),
            _ => Unknown,
        }
    }

    ///
    /// This method emulates the `Boolean()` JavaScript cast function.
    ///Note: unlike getPureBooleanValue this function does not return `None`
    ///for expressions with side-effects.
    fn as_bool(&self) -> (Purity, Bool) {
        let expr = self.as_expr_kind();
        let val = match *expr {
            ExprKind::Paren(ref e) => return e.as_bool(),
            ExprKind::Seq(SeqExpr { ref exprs }) => return exprs.last().unwrap().as_bool(),
            ExprKind::Assign(AssignExpr { ref right, .. }) => return right.as_bool(),

            ExprKind::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
            }) => {
                let (p, v) = arg.as_bool();
                return (p, !v);
            }

            ExprKind::Bin(BinExpr {
                ref left,
                op: op @ op!("&"),
                ref right,
            })
            | ExprKind::Bin(BinExpr {
                ref left,
                op: op @ op!("|"),
                ref right,
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

            ExprKind::Fn(..)
            | ExprKind::Class(..)
            | ExprKind::New(..)
            | ExprKind::Array(..)
            | ExprKind::Object(..) => Known(true),

            ExprKind::Unary(UnaryExpr {
                op: op!("void"),
                arg: _,
            }) => Known(false),

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
        let expr = self.as_expr_kind();
        let v = match *expr {
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
            ExprKind::Unary(UnaryExpr {
                op: op!(unary, "-"),
                arg:
                    box Expr {
                        span: _,
                        node:
                            ExprKind::Ident(Ident {
                                sym: js_word!("Infinity"),
                                ..
                            }),
                    },
            }) => -INFINITY,
            ExprKind::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
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
            ExprKind::Unary(UnaryExpr {
                op: op!("void"),
                ref arg,
            }) => {
                if arg.may_have_side_effects() {
                    return Unknown;
                } else {
                    NAN
                }
            }

            ExprKind::Tpl(..)
            | ExprKind::Object(ObjectLit { .. })
            | ExprKind::Array(ArrayLit { .. }) => return num_from_str(&*self.as_string()?),

            _ => return Unknown,
        };

        Known(v)
    }

    fn as_string(&self) -> Value<Cow<str>> {
        let expr = self.as_expr_kind();
        match *expr {
            ExprKind::Lit(ref l) => match *l {
                Lit::Str(ref s) => Known(Cow::Borrowed(s)),
                Lit::Num(ref n) => Known(format!("{}", n).into()),
                Lit::Bool(true) => Known(Cow::Borrowed("true")),
                Lit::Bool(false) => Known(Cow::Borrowed("false")),
                Lit::Null => Known(Cow::Borrowed("null")),
                _ => Unknown,
            },
            ExprKind::Tpl(_) => {
                // TODO:
                // Only convert a template literal if all its expressions can be converted.
                unimplemented!("TplLit.as_string()")
            }
            ExprKind::Ident(Ident { ref sym, .. }) => match &**sym {
                "undefined" | "Infinity" | "NaN" => Known(Cow::Borrowed(&**sym)),
                _ => Unknown,
            },
            ExprKind::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => Known(Cow::Borrowed("undefined")),
            ExprKind::Unary(UnaryExpr {
                op: op!("!"),
                ref arg,
            }) => Known(Cow::Borrowed(if arg.as_pure_bool()? {
                "false"
            } else {
                "true"
            })),
            ExprKind::Array(ArrayLit { ref elems }) => {
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
                                _ => e.as_string()?,
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
            ExprKind::Object(ObjectLit { .. }) => Known(Cow::Borrowed("[object Object]")),
            _ => Unknown,
        }
    }

    fn get_type(&self) -> Value<Type> {
        let expr = self.as_expr_kind();

        match *expr {
            ExprKind::Assign(AssignExpr {
                ref right,
                op: op!("="),
                ..
            }) => right.get_type(),
            ExprKind::Seq(SeqExpr { ref exprs }) => exprs
                .last()
                .expect("sequence expression should not be empty")
                .get_type(),
            ExprKind::Bin(BinExpr {
                ref left,
                op: op!("&&"),
                ref right,
            })
            | ExprKind::Bin(BinExpr {
                ref left,
                op: op!("||"),
                ref right,
            })
            | ExprKind::Cond(CondExpr {
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

            ExprKind::Bin(BinExpr {
                ref left,
                op: op!(bin, "+"),
                ref right,
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

            ExprKind::Assign(AssignExpr {
                op: op!("+="),
                ref right,
                ..
            }) => {
                if right.get_type() == Known(StringType) {
                    return Known(StringType);
                }
                return Unknown;
            }

            ExprKind::Ident(Ident { ref sym, .. }) => {
                return Known(match *sym {
                    js_word!("undefined") => UndefinedType,
                    js_word!("NaN") | js_word!("Infinity") => NumberType,
                    _ => return Unknown,
                })
            }

            ExprKind::Lit(Lit::Num(..))
            | ExprKind::Assign(AssignExpr { op: op!("&="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("^="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("|="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("<<="), .. })
            | ExprKind::Assign(AssignExpr { op: op!(">>="), .. })
            | ExprKind::Assign(AssignExpr {
                op: op!(">>>="), ..
            })
            | ExprKind::Assign(AssignExpr { op: op!("-="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("*="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("**="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("/="), .. })
            | ExprKind::Assign(AssignExpr { op: op!("%="), .. })
            | ExprKind::Unary(UnaryExpr { op: op!("~"), .. })
            | ExprKind::Bin(BinExpr { op: op!("|"), .. })
            | ExprKind::Bin(BinExpr { op: op!("^"), .. })
            | ExprKind::Bin(BinExpr { op: op!("&"), .. })
            | ExprKind::Bin(BinExpr { op: op!("<<"), .. })
            | ExprKind::Bin(BinExpr { op: op!(">>"), .. })
            | ExprKind::Bin(BinExpr { op: op!(">>>"), .. })
            | ExprKind::Bin(BinExpr {
                op: op!(bin, "-"), ..
            })
            | ExprKind::Bin(BinExpr { op: op!("*"), .. })
            | ExprKind::Bin(BinExpr { op: op!("%"), .. })
            | ExprKind::Bin(BinExpr { op: op!("/"), .. })
            | ExprKind::Bin(BinExpr { op: op!("**"), .. })
            | ExprKind::Update(UpdateExpr { op: op!("++"), .. })
            | ExprKind::Update(UpdateExpr { op: op!("--"), .. })
            | ExprKind::Unary(UnaryExpr {
                op: op!(unary, "+"),
                ..
            })
            | ExprKind::Unary(UnaryExpr {
                op: op!(unary, "-"),
                ..
            }) => return Known(NumberType),

            // Primitives
            ExprKind::Lit(Lit::Bool(..))
            | ExprKind::Bin(BinExpr { op: op!("=="), .. })
            | ExprKind::Bin(BinExpr { op: op!("!="), .. })
            | ExprKind::Bin(BinExpr { op: op!("==="), .. })
            | ExprKind::Bin(BinExpr { op: op!("!=="), .. })
            | ExprKind::Bin(BinExpr { op: op!("<"), .. })
            | ExprKind::Bin(BinExpr { op: op!("<="), .. })
            | ExprKind::Bin(BinExpr { op: op!(">"), .. })
            | ExprKind::Bin(BinExpr { op: op!(">="), .. })
            | ExprKind::Bin(BinExpr { op: op!("in"), .. })
            | ExprKind::Bin(BinExpr {
                op: op!("instanceof"),
                ..
            })
            | ExprKind::Unary(UnaryExpr { op: op!("!"), .. })
            | ExprKind::Unary(UnaryExpr {
                op: op!("delete"), ..
            }) => return Known(BoolType),

            ExprKind::Unary(UnaryExpr {
                op: op!("typeof"), ..
            })
            | ExprKind::Lit(Lit::Str(..)) => return Known(StringType),

            ExprKind::Lit(Lit::Null) => return Known(NullType),

            ExprKind::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return Known(UndefinedType),

            ExprKind::Fn(..)
            | ExprKind::New(NewExpr { .. })
            | ExprKind::Array(ArrayLit { .. })
            | ExprKind::Object(ObjectLit { .. })
            | ExprKind::Lit(Lit::Regex(..)) => return Known(ObjectType),

            _ => Unknown,
        }
    }

    fn may_have_side_effects(&self) -> bool {
        match *self.as_expr_kind() {
            ExprKind::Lit(..) | ExprKind::Ident(..) | ExprKind::This => false,
            ExprKind::Paren(ref e) => e.may_have_side_effects(),
            // Function expression does not have any side effect if it's not used.
            ExprKind::Fn(..) | ExprKind::Arrow(ArrowExpr { .. }) => false,
            // TODO
            ExprKind::Class(..) => true,
            ExprKind::Array(ArrayLit { ref elems }) => elems
                .iter()
                .filter_map(|e| e.as_ref())
                .map(|e| match *e {
                    ExprOrSpread::Spread(ref e) => e,
                    ExprOrSpread::Expr(ref e) => e,
                })
                .any(|e| e.may_have_side_effects()),
            ExprKind::Unary(UnaryExpr { ref arg, .. }) => arg.may_have_side_effects(),
            ExprKind::Bin(BinExpr {
                ref left,
                ref right,
                ..
            }) => left.may_have_side_effects() || right.may_have_side_effects(),

            //TODO
            ExprKind::Tpl(_) => true,
            ExprKind::MetaProp(_) => true,

            ExprKind::Await(_)
            | ExprKind::Yield(_)
            | ExprKind::Member(_)
            | ExprKind::Update(_)
            | ExprKind::Assign(_) => true,

            // TODO
            ExprKind::New(_) => true,
            // TODO
            ExprKind::Call(_) => true,

            ExprKind::Seq(SeqExpr { ref exprs }) => exprs.iter().any(|e| e.may_have_side_effects()),

            ExprKind::Cond(CondExpr {
                ref test,
                ref cons,
                ref alt,
            }) => {
                test.may_have_side_effects() || cons.may_have_side_effects()
                    || alt.may_have_side_effects()
            }

            ExprKind::Object(ObjectLit { ref props }) => {
                props.iter().any(|&Prop { ref node, .. }| match *node {
                    PropKind::Shorthand(..) => false,
                    PropKind::KeyValue { ref key, ref value } => {
                        let k = match *key {
                            PropName::Computed(ref e) => e.may_have_side_effects(),
                            _ => false,
                        };

                        k || value.may_have_side_effects()
                    }
                    _ => true,
                })
            }
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
    fn as_expr_kind(&self) -> &ExprKind {
        &self.node
    }
}
impl ExprExt for Expr {
    fn as_expr_kind(&self) -> &ExprKind {
        &self.node
    }
}
impl ExprExt for ExprKind {
    fn as_expr_kind(&self) -> &ExprKind {
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
