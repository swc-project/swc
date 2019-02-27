pub use self::{
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
use ast::*;
use std::{
    borrow::Cow,
    f64::{INFINITY, NAN},
    num::FpCategory,
    ops::Add,
    sync::Arc,
};
use swc_atoms::JsWord;
use swc_common::{
    errors::{ColorConfig, Handler},
    FilePathMapping, Fold, FoldWith, Mark, SourceMap, Span, Spanned, Visit, VisitWith, DUMMY_SP,
};
use swc_ecma_parser::Session;
use unicode_xid::UnicodeXID;

pub(crate) mod constructor;
mod factory;
mod value;
pub(crate) mod var;

pub(crate) struct ThisVisitor {
    found: bool,
}

impl Visit<ThisExpr> for ThisVisitor {
    fn visit(&mut self, _: &ThisExpr) {
        self.found = true;
    }
}

impl Visit<FnExpr> for ThisVisitor {
    /// Don't recurse into fn
    fn visit(&mut self, _: &FnExpr) {}
}

impl Visit<FnDecl> for ThisVisitor {
    /// Don't recurse into fn
    fn visit(&mut self, _: &FnDecl) {}
}

pub(crate) fn contains_this_expr<N>(body: &N) -> bool
where
    ThisVisitor: Visit<N>,
{
    let mut visitor = ThisVisitor { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}

pub trait ModuleItemLike: StmtLike {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        Err(self)
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Err(decl)
    }
}

pub trait StmtLike: Sized {
    fn try_into_stmt(self) -> Result<Stmt, Self>;
    fn as_stmt(&self) -> Option<&Stmt>;
    fn from_stmt(stmt: Stmt) -> Self;
}

impl ModuleItemLike for Stmt {}

impl StmtLike for Stmt {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        Ok(self)
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        Some(&self)
    }
    fn from_stmt(stmt: Stmt) -> Self {
        stmt
    }
}

impl ModuleItemLike for ModuleItem {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        match self {
            ModuleItem::ModuleDecl(decl) => Ok(decl),
            _ => Err(self),
        }
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Ok(ModuleItem::ModuleDecl(decl))
    }
}
impl StmtLike for ModuleItem {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        match self {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            _ => Err(self),
        }
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        match *self {
            ModuleItem::Stmt(ref stmt) => Some(stmt),
            _ => None,
        }
    }
    fn from_stmt(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}

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

impl<T> IsEmpty for Vec<T> {
    fn is_empty(&self) -> bool {
        self.is_empty()
    }
}

/// Extension methods for [Expr].
pub trait ExprExt {
    fn as_expr_kind(&self) -> &Expr;

    fn is_number(&self) -> bool {
        match *self.as_expr_kind() {
            Expr::Lit(Lit::Num(..)) => true,
            _ => false,
        }
    }

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

    /// Get bool value of `self` if it does not have any side effects.
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
                        Lit::JSXText(..) => unreachable!("as_bool() for JSXText"),
                    }),
                );
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
            Expr::Ident(Ident { ref sym, .. }) => match *sym {
                js_word!("undefined") | js_word!("NaN") => NAN,
                js_word!("Infinity") => INFINITY,
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
                return num_from_str(&*self.as_string()?);
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
            Expr::Ident(Ident { ref sym, .. }) => match *sym {
                js_word!("undefined") | js_word!("Infinity") | js_word!("NaN") => {
                    Known(Cow::Borrowed(&**sym))
                }
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

    /// Apply the supplied predicate against all possible result Nodes of the
    /// expression.
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
            }) => return and(left.get_type(), right.get_type()),

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

                // There are some pretty weird cases for object types:
                //   {} + [] === "0"
                //   [] + {} ==== "[object Object]"
                if lt == Known(ObjectType) || rt == Known(ObjectType) {
                    return Unknown;
                }

                if !may_be_str(lt) && !may_be_str(rt) {
                    // ADD used with compilations of null, undefined, boolean and number always
                    // result in numbers.
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
                });
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
            | Expr::Lit(Lit::Str { .. })
            | Expr::Tpl(..) => return Known(StringType),

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
            Expr::Lit(..) | Expr::Ident(..) | Expr::This(..) | Expr::PrivateName(..) => false,
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
            Expr::TaggedTpl(_) => true,
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

            Expr::Object(ObjectLit { ref props, .. }) => props.iter().any(|node| match node {
                PropOrSpread::Prop(box node) => match *node {
                    Prop::Shorthand(..) => false,
                    Prop::KeyValue(KeyValueProp { ref key, ref value }) => {
                        let k = match *key {
                            PropName::Computed(ref e) => e.may_have_side_effects(),
                            _ => false,
                        };

                        k || value.may_have_side_effects()
                    }
                    _ => true,
                },
                PropOrSpread::Spread(SpreadElement { expr, .. }) => expr.may_have_side_effects(),
            }),

            Expr::JSXMebmer(..)
            | Expr::JSXNamespacedName(..)
            | Expr::JSXEmpty(..)
            | Expr::JSXElement(..)
            | Expr::JSXFragment(..) => unreachable!("simplifying jsx"),

            Expr::TsAs(TsAsExpr { ref expr, .. })
            | Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { ref expr, .. })
            | Expr::TsTypeCast(TsTypeCastExpr { ref expr, .. }) => expr.may_have_side_effects(),
        }
    }
}
fn and(lt: Value<Type>, rt: Value<Type>) -> Value<Type> {
    if lt == rt {
        return lt;
    }
    return Unknown;
}

/// Return if the node is possibly a string.
fn may_be_str(ty: Value<Type>) -> bool {
    match ty {
        Known(BoolType) | Known(NullType) | Known(NumberType) | Known(UndefinedType) => false,
        Known(ObjectType) | Known(StringType) | Unknown => true,
        // TODO: Check if this is correct
        Known(SymbolType) => true,
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
    /// May have some side effects.
    MayBeImpure,
    /// Does not have any side effect.
    Pure,
}
impl Purity {
    /// Returns true if it's pure.
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

/// Cast to javascript's int32
pub(crate) fn to_int32(d: f64) -> i32 {
    let id = d as i32;
    if id as f64 == d {
        // This covers -0.0 as well
        return id;
    }

    if d.is_nan() || d.is_infinite() {
        return 0;
    }

    let d = if d >= 0.0 { d.floor() } else { d.ceil() };

    const TWO32: f64 = 4294967296.0;
    let d = d % TWO32;
    // (double)(long)d == d should hold here

    let l = d as i64;
    // returning (int)d does not work as d can be outside int range
    // but the result must always be 32 lower bits of l
    return l as i32;
}

// pub(crate) fn to_u32(_d: f64) -> u32 {
//     //   if (Double.isNaN(d) || Double.isInfinite(d) || d == 0) {
//     //   return 0;
//     // }

//     // d = Math.signum(d) * Math.floor(Math.abs(d));

//     // double two32 = 4294967296.0;
//     // // this ensures that d is positive
//     // d = ((d % two32) + two32) % two32;
//     // // (double)(long)d == d should hold here

//     // long l = (long) d;
//     // // returning (int)d does not work as d can be outside int range
//     // // but the result must always be 32 lower bits of l
//     // return (int) l;
//     unimplemented!("to_u32")
// }

/// Used to determine super_class_ident
pub fn alias_ident_for(expr: &Expr, default: &str) -> Ident {
    fn sym(expr: &Expr, default: &str) -> JsWord {
        match *expr {
            Expr::Ident(ref ident) => format!("_{}", ident.sym).into(),
            Expr::Member(ref member) => sym(&member.prop, default),
            _ => default.into(),
        }
    }
    let span = expr.span().apply_mark(Mark::fresh(Mark::root()));
    quote_ident!(span, sym(expr, default))
}

pub(crate) fn prop_name_to_expr(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Ident(i),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::Computed(expr) => *expr,
    }
}
/// Simillar to `prop_name_to_expr`, but used for value position.
///
/// e.g. value from `{ key: value }`
pub(crate) fn prop_name_to_expr_value(p: PropName) -> Expr {
    match p {
        PropName::Ident(i) => Expr::Lit(Lit::Str(Str {
            span: i.span,
            value: i.sym,
            has_escape: false,
        })),
        PropName::Str(s) => Expr::Lit(Lit::Str(s)),
        PropName::Num(n) => Expr::Lit(Lit::Num(n)),
        PropName::Computed(expr) => *expr,
    }
}

pub fn default_constructor(has_super: bool) -> Constructor {
    let span = DUMMY_SP;

    Constructor {
        span: DUMMY_SP,
        key: PropName::Ident(quote_ident!("constructor")),
        accessibility: Default::default(),
        is_optional: false,
        params: if has_super {
            vec![PatOrTsParamProp::Pat(Pat::Rest(RestPat {
                dot3_token: DUMMY_SP,
                arg: box Pat::Ident(quote_ident!(span, "args")),
                type_ann: Default::default(),
            }))]
        } else {
            vec![]
        },
        body: Some(BlockStmt {
            span: DUMMY_SP,
            stmts: if has_super {
                vec![Stmt::Expr(box Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ExprOrSuper::Super(DUMMY_SP),
                    args: vec![ExprOrSpread {
                        spread: Some(DUMMY_SP),
                        expr: box Expr::Ident(quote_ident!(span, "args")),
                    }],
                    type_args: Default::default(),
                }))]
            } else {
                vec![]
            },
        }),
    }
}

/// Check if `e` is `...arguments`
pub(crate) fn is_rest_arguments(e: &ExprOrSpread) -> bool {
    match *e {
        ExprOrSpread {
            spread: Some(..),
            expr:
                box Expr::Ident(Ident {
                    sym: js_word!("arguments"),
                    ..
                }),
        } => true,
        _ => false,
    }
}

pub(crate) fn undefined(span: Span) -> Box<Expr> {
    box Expr::Unary(UnaryExpr {
        span,
        op: op!("void"),
        arg: box Expr::Lit(Lit::Num(Number { value: 0.0, span })),
    })
}

/// inject `stmt` after directives
pub(crate) fn prepend<T: StmtLike>(stmts: &mut Vec<T>, stmt: T) {
    let idx = stmts
        .iter()
        .position(|item| match item.as_stmt() {
            Some(&Stmt::Expr(box Expr::Lit(Lit::Str(..)))) => false,
            _ => true,
        })
        .unwrap_or(stmts.len());

    stmts.insert(idx, stmt);
}

/// inject `stmts` after directives
pub(crate) fn prepend_stmts<T: StmtLike>(
    to: &mut Vec<T>,
    stmts: impl Iterator + ExactSizeIterator<Item = T>,
) {
    let idx = to
        .iter()
        .position(|item| match item.as_stmt() {
            Some(&Stmt::Expr(box Expr::Lit(Lit::Str(..)))) => false,
            _ => true,
        })
        .unwrap_or(to.len());

    let mut buf = Vec::with_capacity(to.len() + stmts.len());
    // TODO: Optimze (maybe unsafe)

    buf.extend(to.drain(..idx));
    buf.extend(stmts);
    buf.extend(to.drain(..));
    debug_assert!(to.is_empty());

    *to = buf
}

pub trait IdentExt {
    fn prefix(&self, prefix: &str) -> Ident;

    fn private(self) -> Ident;
}

impl IdentExt for Ident {
    fn prefix(&self, prefix: &str) -> Ident {
        Ident::new(format!("{}{}", prefix, self.sym).into(), self.span)
    }

    fn private(self) -> Ident {
        let span = self.span.apply_mark(Mark::fresh(Mark::root()));

        Ident::new(self.sym, span)
    }
}

/// Finds all idents of variable
pub(crate) struct DestructuringFinder<'a> {
    pub found: &'a mut Vec<(JsWord, Span)>,
}

impl<'a> Visit<Expr> for DestructuringFinder<'a> {
    /// No-op (we don't care about expressions)
    fn visit(&mut self, _: &Expr) {}
}

impl<'a> Visit<PropName> for DestructuringFinder<'a> {
    /// No-op (we don't care about expressions)
    fn visit(&mut self, _: &PropName) {}
}

impl<'a> Visit<Ident> for DestructuringFinder<'a> {
    fn visit(&mut self, i: &Ident) {
        self.found.push((i.sym.clone(), i.span));
    }
}

pub(crate) fn is_valid_ident(s: &JsWord) -> bool {
    if s.len() == 0 {
        return false;
    }
    let first = s.chars().next().unwrap();
    UnicodeXID::is_xid_start(first) && s.chars().skip(1).all(UnicodeXID::is_xid_continue)
}

pub(crate) fn drop_span<T>(t: T) -> T
where
    T: FoldWith<DropSpan>,
{
    t.fold_with(&mut DropSpan)
}

pub(crate) struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        DUMMY_SP
    }
}

lazy_static! {
    pub(crate) static ref CM: Arc<SourceMap> =
        { Arc::new(SourceMap::new(FilePathMapping::empty())) };
    pub(crate) static ref HANDLER: Handler =
        { Handler::with_tty_emitter(ColorConfig::Always, false, true, Some(CM.clone())) };
    pub(crate) static ref SESSION: Session<'static> = { Session { handler: &*HANDLER } };
}
