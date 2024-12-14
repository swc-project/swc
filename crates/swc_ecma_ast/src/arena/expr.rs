#![allow(clippy::vec_box)]
use std::{borrow::Cow, mem::transmute};

use is_macro::Is;
use string_enum::StringEnum;
use swc_allocator::arena::{Allocator, Box, Vec};
use swc_atoms::Atom;
use swc_common::{
    arena::{ast_node, CloneIn, Take},
    BytePos, EqIgnoreSpan, Span, Spanned, SyntaxContext, DUMMY_SP,
};

use super::{
    class::Class,
    function::Function,
    ident::{Ident, PrivateName},
    jsx::{JSXElement, JSXEmptyExpr, JSXFragment, JSXMemberExpr, JSXNamespacedName},
    lit::Lit,
    pat::Pat,
    prop::Prop,
    stmt::BlockStmt,
    typescript::{
        TsAsExpr, TsConstAssertion, TsInstantiation, TsNonNullExpr, TsSatisfiesExpr, TsTypeAnn,
        TsTypeAssertion, TsTypeParamDecl, TsTypeParamInstantiation,
    },
    ArrayPat, AssignOp, BinaryOp, BindingIdent, ComputedPropName, Id, IdentName, ImportPhase,
    Invalid, KeyValueProp, Number, ObjectPat, PropName, Str, UnaryOp, UpdateOp,
};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Expr<'a> {
    // #[tag("ThisExpression")]
    This(Box<'a, ThisExpr>),

    // #[tag("ArrayExpression")]
    Array(Box<'a, ArrayLit<'a>>),

    // #[tag("ObjectExpression")]
    Object(Box<'a, ObjectLit<'a>>),

    // #[tag("FunctionExpression")]
    #[is(name = "fn_expr")]
    Fn(Box<'a, FnExpr<'a>>),

    // #[tag("UnaryExpression")]
    Unary(Box<'a, UnaryExpr<'a>>),

    /// `++v`, `--v`, `v++`, `v--`
    // #[tag("UpdateExpression")]
    Update(Box<'a, UpdateExpr<'a>>),

    // #[tag("BinaryExpression")]
    Bin(Box<'a, BinExpr<'a>>),

    // #[tag("AssignmentExpression")]
    Assign(Box<'a, AssignExpr<'a>>),

    //
    // Logical {
    //
    //     op: LogicalOp,
    //     left: Box<Expr>,
    //     right: Box<Expr>,
    // },
    /// A member expression. If computed is true, the node corresponds to a
    /// computed (a[b]) member expression and property is an Expression. If
    /// computed is false, the node corresponds to a static (a.b) member
    /// expression and property is an Identifier.
    // #[tag("MemberExpression")]
    Member(Box<'a, MemberExpr<'a>>),

    // #[tag("SuperPropExpression")]
    SuperProp(Box<'a, SuperPropExpr<'a>>),

    /// true ? 'a' : 'b'
    // #[tag("ConditionalExpression")]
    Cond(Box<'a, CondExpr<'a>>),

    // #[tag("CallExpression")]
    Call(Box<'a, CallExpr<'a>>),

    /// `new Cat()`
    // #[tag("NewExpression")]
    New(Box<'a, NewExpr<'a>>),

    // #[tag("SequenceExpression")]
    Seq(Box<'a, SeqExpr<'a>>),

    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),

    // #[tag("StringLiteral")]
    // #[tag("BooleanLiteral")]
    // #[tag("NullLiteral")]
    // #[tag("NumericLiteral")]
    // #[tag("RegExpLiteral")]
    // #[tag("JSXText")]
    // #[tag("BigIntLiteral")]
    Lit(Box<'a, Lit<'a>>),

    // #[tag("TemplateLiteral")]
    Tpl(Box<'a, Tpl<'a>>),

    // #[tag("TaggedTemplateExpression")]
    TaggedTpl(Box<'a, TaggedTpl<'a>>),

    // #[tag("ArrowFunctionExpression")]
    Arrow(Box<'a, ArrowExpr<'a>>),

    // #[tag("ClassExpression")]
    Class(Box<'a, ClassExpr<'a>>),

    // #[tag("YieldExpression")]
    #[is(name = "yield_expr")]
    Yield(Box<'a, YieldExpr<'a>>),

    // #[tag("MetaProperty")]
    MetaProp(Box<'a, MetaPropExpr>),

    // #[tag("AwaitExpression")]
    #[is(name = "await_expr")]
    Await(Box<'a, AwaitExpr<'a>>),

    // #[tag("ParenthesisExpression")]
    Paren(Box<'a, ParenExpr<'a>>),

    // #[tag("JSXMemberExpression")]
    JSXMember(Box<'a, JSXMemberExpr<'a>>),

    // #[tag("JSXNamespacedName")]
    JSXNamespacedName(Box<'a, JSXNamespacedName>),

    // #[tag("JSXEmptyExpression")]
    JSXEmpty(Box<'a, JSXEmptyExpr>),

    // #[tag("JSXElement")]
    JSXElement(Box<'a, JSXElement<'a>>),

    // #[tag("JSXFragment")]
    JSXFragment(Box<'a, JSXFragment<'a>>),

    // #[tag("TsTypeAssertion")]
    TsTypeAssertion(Box<'a, TsTypeAssertion<'a>>),

    // #[tag("TsConstAssertion")]
    TsConstAssertion(Box<'a, TsConstAssertion<'a>>),

    // #[tag("TsNonNullExpression")]
    TsNonNull(Box<'a, TsNonNullExpr<'a>>),

    // #[tag("TsAsExpression")]
    TsAs(Box<'a, TsAsExpr<'a>>),

    // #[tag("TsInstantiation")]
    TsInstantiation(Box<'a, TsInstantiation<'a>>),

    // #[tag("TsSatisfiesExpression")]
    TsSatisfies(Box<'a, TsSatisfiesExpr<'a>>),

    // #[tag("PrivateName")]
    PrivateName(Box<'a, PrivateName>),

    // #[tag("OptionalChainingExpression")]
    OptChain(Box<'a, OptChainExpr<'a>>),

    // #[tag("Invalid")]
    Invalid(Box<'a, Invalid>),
}

// Memory layout depends on the version of rustc.
// #[cfg(target_pointer_width = "64")]
// assert_eq_size!(Expr, [u8; 80]);

impl<'a> Expr<'a> {
    //     /// Creates `void 0`.
    //     #[inline]
    //     pub fn undefined(span: Span) -> Box<Expr> {
    //         UnaryExpr {
    //             span,
    //             op: op!("void"),
    //             arg: Lit::Num(Number {
    //                 span,
    //                 value: 0.0,
    //                 raw: None,
    //             })
    //             .into(),
    //         }
    //         .into()
    //     }

    //     pub fn leftmost(&self) -> Option<&Ident> {
    //         match self {
    //             Expr::Ident(i) => Some(i),
    //             Expr::Member(MemberExpr { obj, .. }) => obj.leftmost(),
    //             Expr::OptChain(opt) => opt.base.as_member()?.obj.leftmost(),
    //             _ => None,
    //         }
    //     }

    pub fn is_ident_ref_to(&self, ident: &str) -> bool {
        match self {
            Expr::Ident(i) => i.sym == ident,
            _ => false,
        }
    }

    /// Unwraps an expression with a given function.
    ///
    /// If the provided function returns [Some], the function is called again
    /// with the returned value. If the provided functions returns [None],
    /// the last expression is returned.
    pub fn unwrap_with<F>(&self, mut op: F) -> &Expr<'a>
    where
        F: for<'b> FnMut(&'b Expr<'a>) -> Option<&'b Expr<'a>>,
    {
        let mut cur = self;
        loop {
            match op(cur) {
                Some(next) => cur = next,
                None => return cur,
            }
        }
    }

    /// Unwraps an expression with a given function.
    ///
    /// If the provided function returns [Some], the function is called again
    /// with the returned value. If the provided functions returns [None],
    /// the last expression is returned.
    pub fn unwrap_mut_with<F>(&'a mut self, mut op: F) -> &'a mut Expr<'a>
    where
        F: FnMut(&'a mut Expr<'a>) -> Option<&'a mut Expr<'a>>,
    {
        let mut cur = self;
        loop {
            match unsafe {
                // Safety: Polonius is not yet stable
                op(transmute::<&mut _, &mut _>(cur))
            } {
                Some(next) => cur = next,
                None => {
                    return cur;
                }
            }
        }
    }

    /// Normalize parenthesized expressions.
    ///
    /// This will normalize `(foo)`, `((foo))`, ... to `foo`.
    ///
    /// If `self` is not a parenthesized expression, it will be returned as is.
    pub fn unwrap_parens(&self) -> &Expr<'a> {
        self.unwrap_with(|e| {
            if let Expr::Paren(expr) = e {
                Some(&expr.expr)
            } else {
                None
            }
        })
    }

    /// Normalize parenthesized expressions.
    ///
    /// This will normalize `(foo)`, `((foo))`, ... to `foo`.
    ///
    /// If `self` is not a parenthesized expression, it will be returned as is.
    pub fn unwrap_parens_mut(&'a mut self) -> &mut Expr<'a> {
        self.unwrap_mut_with(|e| {
            if let Expr::Paren(expr) = e {
                Some(&mut expr.expr)
            } else {
                None
            }
        })
    }

    //     /// Normalize sequences and parenthesized expressions.
    //     ///
    //     /// This returns the last expression of a sequence expression or the
    //     /// expression of a parenthesized expression.
    //     pub fn unwrap_seqs_and_parens(&self) -> &Self {
    //         self.unwrap_with(|expr| match expr {
    //             Expr::Seq(SeqExpr { exprs, .. }) => exprs.last().map(|v| &**v),
    //             Expr::Paren(ParenExpr { expr, .. }) => Some(expr),
    //             _ => None,
    //         })
    //     }

    //     /// Creates an expression from `exprs`. This will return first element if
    //     /// the length is 1 and a sequential expression otherwise.
    //     ///
    //     /// # Panics
    //     ///
    //     /// Panics if `exprs` is empty.
    //     pub fn from_exprs(mut exprs: Vec<Box<Expr>>) -> Box<Expr> {
    //         debug_assert!(!exprs.is_empty(), "`exprs` must not be empty");

    //         if exprs.len() == 1 {
    //             exprs.remove(0)
    //         } else {
    //             SeqExpr {
    //                 span: DUMMY_SP,
    //                 exprs,
    //             }
    //             .into()
    //         }
    //     }

    //     /// Returns true for `eval` and member expressions.
    //     pub fn directness_maters(&self) -> bool {
    //         self.is_ident_ref_to("eval") || matches!(self, Expr::Member(..))
    //     }

    //     pub fn with_span(mut self, span: Span) -> Expr {
    //         self.set_span(span);
    //         self
    //     }

    //     pub fn set_span(&mut self, span: Span) {
    //         match self {
    //             Expr::Ident(i) => {
    //                 i.span = span;
    //             }
    //             Expr::This(e) => e.span = span,
    //             Expr::Array(e) => e.span = span,
    //             Expr::Object(e) => e.span = span,
    //             Expr::Fn(e) => e.function.span = span,
    //             Expr::Unary(e) => e.span = span,
    //             Expr::Update(e) => e.span = span,
    //             Expr::Bin(e) => e.span = span,
    //             Expr::Assign(e) => e.span = span,
    //             Expr::Member(e) => e.span = span,
    //             Expr::SuperProp(e) => e.span = span,
    //             Expr::Cond(e) => e.span = span,
    //             Expr::Call(e) => e.span = span,
    //             Expr::New(e) => e.span = span,
    //             Expr::Seq(e) => e.span = span,
    //             Expr::Tpl(e) => e.span = span,
    //             Expr::TaggedTpl(e) => e.span = span,
    //             Expr::Arrow(e) => e.span = span,
    //             Expr::Class(e) => e.class.span = span,
    //             Expr::Yield(e) => e.span = span,
    //             Expr::Invalid(e) => e.span = span,
    //             Expr::TsAs(e) => e.span = span,
    //             Expr::TsTypeAssertion(e) => e.span = span,
    //             Expr::TsConstAssertion(e) => e.span = span,
    //             Expr::TsSatisfies(e) => e.span = span,
    //             Expr::TsNonNull(e) => e.span = span,
    //             Expr::TsInstantiation(e) => e.span = span,
    //             Expr::MetaProp(e) => e.span = span,
    //             Expr::Await(e) => e.span = span,
    //             Expr::Paren(e) => e.span = span,
    //             Expr::JSXMember(e) => e.span = span,
    //             Expr::JSXNamespacedName(e) => e.span = span,
    //             Expr::JSXEmpty(e) => e.span = span,
    //             Expr::JSXElement(e) => e.span = span,
    //             Expr::JSXFragment(e) => e.span = span,
    //             Expr::PrivateName(e) => e.span = span,
    //             Expr::OptChain(e) => e.span = span,
    //             Expr::Lit(e) => e.set_span(span),
    //         }
    //     }
}

// Implement Clone without inline to avoid multiple copies of the
// implementation.
// impl Clone for Expr {
//     fn clone(&self) -> Self {
//         use Expr::*;
//         match self {
//             This(e) => This(e.clone()),
//             Array(e) => Array(e.clone()),
//             Object(e) => Object(e.clone()),
//             Fn(e) => Fn(e.clone()),
//             Unary(e) => Unary(e.clone()),
//             Update(e) => Update(e.clone()),
//             Bin(e) => Bin(e.clone()),
//             Assign(e) => Assign(e.clone()),
//             Member(e) => Member(e.clone()),
//             SuperProp(e) => SuperProp(e.clone()),
//             Cond(e) => Cond(e.clone()),
//             Call(e) => Call(e.clone()),
//             New(e) => New(e.clone()),
//             Seq(e) => Seq(e.clone()),
//             Ident(e) => Ident(e.clone()),
//             Lit(e) => Lit(e.clone()),
//             Tpl(e) => Tpl(e.clone()),
//             TaggedTpl(e) => TaggedTpl(e.clone()),
//             Arrow(e) => Arrow(e.clone()),
//             Class(e) => Class(e.clone()),
//             Yield(e) => Yield(e.clone()),
//             MetaProp(e) => MetaProp(e.clone()),
//             Await(e) => Await(e.clone()),
//             Paren(e) => Paren(e.clone()),
//             JSXMember(e) => JSXMember(e.clone()),
//             JSXNamespacedName(e) => JSXNamespacedName(e.clone()),
//             JSXEmpty(e) => JSXEmpty(e.clone()),
//             JSXElement(e) => JSXElement(e.clone()),
//             JSXFragment(e) => JSXFragment(e.clone()),
//             TsTypeAssertion(e) => TsTypeAssertion(e.clone()),
//             TsConstAssertion(e) => TsConstAssertion(e.clone()),
//             TsNonNull(e) => TsNonNull(e.clone()),
//             TsAs(e) => TsAs(e.clone()),
//             TsInstantiation(e) => TsInstantiation(e.clone()),
//             PrivateName(e) => PrivateName(e.clone()),
//             OptChain(e) => OptChain(e.clone()),
//             Invalid(e) => Invalid(e.clone()),
//             TsSatisfies(e) => TsSatisfies(e.clone()),
//         }
//     }
// }

impl<'a> Take<'a> for Expr<'a> {
    fn dummy(alloc: &'a Allocator) -> Self {
        Expr::Invalid(Box::new_in(Invalid { span: DUMMY_SP }, alloc))
    }
}

// impl Default for Expr {
//     fn default() -> Self {
//         Expr::Invalid(Default::default())
//     }
// }

// bridge_expr_from!(Ident, IdentName);
// bridge_expr_from!(Ident, Id);
// bridge_expr_from!(FnExpr<'a>, Function<'a>);
// bridge_expr_from!(ClassExpr<'a>, Class<'a>);

// macro_rules! boxed_expr {
//     ($T:ty) => {
//         bridge_from!(Expr<'a>, Box<'a, $T>, $T);
//         bridge_from!(Box<'a, Expr<'a>>, Expr, $T);
//     };
// }

// boxed_expr!(ThisExpr);
// boxed_expr!(ArrayLit<'a>);
// boxed_expr!(ObjectLit<'a>);
// boxed_expr!(FnExpr<'a>);
// boxed_expr!(UnaryExpr<'a>);
// boxed_expr!(UpdateExpr<'a>);
// boxed_expr!(BinExpr<'a>);
// boxed_expr!(AssignExpr<'a>);
// boxed_expr!(MemberExpr<'a>);
// boxed_expr!(SuperPropExpr<'a>);
// boxed_expr!(CondExpr<'a>);
// boxed_expr!(CallExpr<'a>);
// boxed_expr!(NewExpr<'a>);
// boxed_expr!(SeqExpr<'a>);
// // bridge_from!(Box<'a, Expr<'a>>, Expr<'a>, Ident);
// boxed_expr!(Lit<'a>);
// boxed_expr!(Tpl<'a>);
// boxed_expr!(TaggedTpl<'a>);
// boxed_expr!(ArrowExpr<'a>);
// boxed_expr!(ClassExpr<'a>);
// boxed_expr!(YieldExpr<'a>);
// boxed_expr!(MetaPropExpr);
// boxed_expr!(AwaitExpr<'a>);
// boxed_expr!(ParenExpr<'a>);
// boxed_expr!(JSXMemberExpr<'a>);
// boxed_expr!(JSXNamespacedName);
// boxed_expr!(JSXEmptyExpr);
// boxed_expr!(JSXElement<'a>);
// boxed_expr!(JSXFragment<'a>);
// boxed_expr!(TsTypeAssertion<'a>);
// boxed_expr!(TsSatisfiesExpr<'a>);
// boxed_expr!(TsConstAssertion<'a>);
// boxed_expr!(TsNonNullExpr<'a>);
// boxed_expr!(TsAsExpr<'a>);
// boxed_expr!(TsInstantiation<'a>);
// boxed_expr!(PrivateName);
// boxed_expr!(OptChainExpr<'a>);
// boxed_expr!(Invalid);

#[ast_node("ThisExpression")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ThisExpr {
    pub span: Span,
}

// impl Take for ThisExpr {
//     fn dummy() -> Self {
//         ThisExpr { span: DUMMY_SP }
//     }
// }

/// Array literal.
#[ast_node("ArrayExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ArrayLit<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "elements"))]
    pub elems: Vec<'a, Option<ExprOrSpread<'a>>>,
}

// impl Take for ArrayLit {
//     fn dummy() -> Self {
//         ArrayLit {
//             span: DUMMY_SP,
//             elems: Default::default(),
//         }
//     }
// }

/// Object literal.
#[ast_node("ObjectExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ObjectLit<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "properties"))]
    pub props: Vec<'a, PropOrSpread<'a>>,
}

// impl ObjectLit {
//     /// See [ImportWith] for details.
//     ///
//     /// Returns [None] if this is not a valid for `with` of
// [crate::ImportDecl].     pub fn as_import_with(&self) -> Option<ImportWith> {
//         let mut values = Vec::new();
//         for prop in &self.props {
//             match prop {
//                 PropOrSpread::Spread(..) => return None,
//                 PropOrSpread::Prop(prop) => match &**prop {
//                     Prop::KeyValue(kv) => {
//                         let key = match &kv.key {
//                             PropName::Ident(i) => i.clone(),
//                             PropName::Str(s) =>
// IdentName::new(s.value.clone(), s.span),                             _ =>
// return None,                         };

//                         values.push(ImportWithItem {
//                             key,
//                             value: match &*kv.value {
//                                 Expr::Lit(Lit::Str(s)) => s.clone(),
//                                 _ => return None,
//                             },
//                         });
//                     }
//                     _ => return None,
//                 },
//             }
//         }

//         Some(ImportWith {
//             span: self.span,
//             values,
//         })
//     }
// }

// impl<'a> FromWith<'a, ImportWith<'a>> for ObjectLit<'a> {
//     fn from_with(v: ImportWith<'a>, allocator: &'a swc_allocator::Allocator)
// -> Self {         ObjectLit {
//             span: v.span,
//             props: Vec::from_iter_in(
//                 v.values.into_iter().map(|item| {
//                     PropOrSpread::Prop(Box::new_in(
//                         Prop::KeyValue(
//                             KeyValueProp {
//                                 key:
// PropName::Ident(item.key.into_with(allocator)),
// value: Lit::Str(item.value.into_with(allocator))
// .into_with(allocator),                             }
//                             .into_with(allocator),
//                         ),
//                         allocator,
//                     ))
//                 }),
//                 allocator,
//             ),
//         }
//     }
// }

/// According to the current spec `with` of [crate::ImportDecl] can only have
/// strings or idents as keys, can't be nested, can only have string literals as
/// values:

#[derive(Debug, CloneIn, PartialEq, Eq, Hash, EqIgnoreSpan)]
pub struct ImportWith<'a> {
    pub span: Span,
    pub values: Vec<'a, ImportWithItem>,
}

// impl ImportWith {
//     pub fn get(&self, key: &str) -> Option<&Str> {
//         self.values.iter().find_map(|item| {
//             if item.key.sym == key {
//                 Some(&item.value)
//             } else {
//                 None
//             }
//         })
//     }
// }

#[derive(Debug, CloneIn, PartialEq, Eq, Hash, EqIgnoreSpan)]
pub struct ImportWithItem {
    pub key: IdentName,
    pub value: Str,
}

// impl Take for ObjectLit {
//     fn dummy() -> Self {
//         ObjectLit {
//             span: DUMMY_SP,
//             props: Default::default(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum PropOrSpread<'a> {
    /// Spread properties, e.g., `{a: 1, ...obj, b: 2}`.
    // #[tag("SpreadElement")]
    Spread(Box<'a, SpreadElement<'a>>),

    // #[tag("*")]
    Prop(Box<'a, Prop<'a>>),
}

// bridge_from!(PropOrSpread<'a>, Box<'a, Prop<'a>>, Prop<'a>);

// impl Take for PropOrSpread {
//     fn dummy() -> Self {
//         PropOrSpread::Spread(SpreadElement {
//             dot3_token: DUMMY_SP,
//             expr: Take::dummy(),
//         })
//     }
// }

#[ast_node("SpreadElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SpreadElement<'a> {
    #[cfg_attr(feature = "serde-impl", serde(rename = "spread"))]
    #[span(lo)]
    pub dot3_token: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "arguments"))]
    #[span(hi)]
    pub expr: Expr<'a>,
}

// impl Take for SpreadElement {
//     fn dummy() -> Self {
//         SpreadElement {
//             dot3_token: DUMMY_SP,
//             expr: Take::dummy(),
//         }
//     }
// }

#[ast_node("UnaryExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct UnaryExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "operator"))]
    pub op: UnaryOp,

    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Expr<'a>,
}

// impl Take for UnaryExpr {
//     fn dummy() -> Self {
//         UnaryExpr {
//             span: DUMMY_SP,
//             op: op!("!"),
//             arg: Take::dummy(),
//         }
//     }
// }

#[ast_node("UpdateExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct UpdateExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "operator"))]
    pub op: UpdateOp,

    pub prefix: bool,

    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Expr<'a>,
}

// impl Take for UpdateExpr {
//     fn dummy() -> Self {
//         UpdateExpr {
//             span: DUMMY_SP,
//             op: op!("++"),
//             prefix: false,
//             arg: Take::dummy(),
//         }
//     }
// }

#[ast_node("BinaryExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BinExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "operator"))]
    pub op: BinaryOp,

    pub left: Expr<'a>,

    pub right: Expr<'a>,
}

// impl Take for BinExpr {
//     fn dummy() -> Self {
//         BinExpr {
//             span: DUMMY_SP,
//             op: op!("*"),
//             left: Take::dummy(),
//             right: Take::dummy(),
//         }
//     }
// }

/// Function expression.
#[ast_node("FunctionExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct FnExpr<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "identifier"))]
    pub ident: Option<Ident>,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub function: Box<'a, Function<'a>>,
}

// impl Take for FnExpr {
//     fn dummy() -> Self {
//         FnExpr {
//             ident: None,
//             function: Take::dummy(),
//         }
//     }
// }

// impl<'a> FromWith<'a, Box<'a, Function<'a>>> for FnExpr<'a> {
//     fn from_with(value: Box<'a, Function<'a>>, _: &'a
// swc_allocator::Allocator) -> Self {         Self {
//             ident: None,
//             function: value,
//         }
//     }
// }

// bridge_from!(FnExpr<'a>, Box<'a, Function<'a>>, Function<'a>);

/// Class expression.
#[ast_node("ClassExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassExpr<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "identifier"))]
    pub ident: Option<Ident>,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub class: Box<'a, Class<'a>>,
}

// impl Take for ClassExpr {
//     fn dummy() -> Self {
//         ClassExpr {
//             ident: None,
//             class: Take::dummy(),
//         }
//     }
// }

impl<'a> From<Box<'a, Class<'a>>> for ClassExpr<'a> {
    fn from(class: Box<'a, Class<'a>>) -> Self {
        Self { ident: None, class }
    }
}

// bridge_from!(ClassExpr<'a>, Box<'a, Class<'a>>, Class<'a>);

#[ast_node("AssignmentExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "operator"))]
    pub op: AssignOp,

    pub left: AssignTarget<'a>,

    pub right: Expr<'a>,
}

// impl Take for AssignExpr {
//     fn dummy() -> Self {
//         AssignExpr {
//             span: DUMMY_SP,
//             op: op!("="),
//             left: Take::dummy(),
//             right: Take::dummy(),
//         }
//     }
// }

// impl AssignExpr {
//     pub fn is_simple_assign(&self) -> bool {
//         self.op == op!("=") && self.left.as_ident().is_some()
//     }
// }

#[ast_node("MemberExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MemberExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "object"))]
    pub obj: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "property"))]
    pub prop: MemberProp<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum MemberProp<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, IdentName>),
    // #[tag("PrivateName")]
    PrivateName(PrivateName),
    // #[tag("Computed")]
    Computed(Box<'a, ComputedPropName<'a>>),
}

// impl MemberProp {
//     pub fn is_ident_with(&self, sym: &str) -> bool {
//         matches!(self, MemberProp::Ident(i) if i.sym == sym)
//     }
// }

#[ast_node("SuperPropExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SuperPropExpr<'a> {
    pub span: Span,

    pub obj: Super,

    #[cfg_attr(feature = "serde-impl", serde(rename = "property"))]
    pub prop: SuperProp<'a>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum SuperProp<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, IdentName>),
    // #[tag("Computed")]
    Computed(Box<'a, ComputedPropName<'a>>),
}

// impl Take for MemberExpr {
//     fn dummy() -> Self {
//         MemberExpr {
//             span: DUMMY_SP,
//             obj: Take::dummy(),
//             prop: Take::dummy(),
//         }
//     }
// }

// impl Take for MemberProp {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

// impl Default for MemberProp {
//     fn default() -> Self {
//         MemberProp::Ident(Default::default())
//     }
// }

// impl Take for SuperProp {
//     fn dummy() -> Self {
//         SuperProp::Ident(Default::default())
//     }
// }

// impl Default for SuperProp {
//     fn default() -> Self {
//         SuperProp::Ident(Default::default())
//     }
// }

#[ast_node("ConditionalExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CondExpr<'a> {
    pub span: Span,

    pub test: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "consequent"))]
    pub cons: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "alternate"))]
    pub alt: Expr<'a>,
}

// impl Take for CondExpr {
//     fn dummy() -> Self {
//         CondExpr {
//             span: DUMMY_SP,
//             test: Take::dummy(),
//             cons: Take::dummy(),
//             alt: Take::dummy(),
//         }
//     }
// }

#[ast_node("CallExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct CallExpr<'a> {
    pub span: Span,
    pub ctxt: SyntaxContext,

    pub callee: Callee<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "arguments"))]
    pub args: Vec<'a, ExprOrSpread<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

// impl Take for CallExpr {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("NewExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct NewExpr<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub callee: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "arguments"))]
    pub args: Option<Vec<'a, ExprOrSpread<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

// impl Take for NewExpr {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("SequenceExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SeqExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expressions"))]
    pub exprs: Vec<'a, Expr<'a>>,
}

// impl Take for SeqExpr {
//     fn dummy() -> Self {
//         SeqExpr {
//             span: DUMMY_SP,
//             exprs: Take::dummy(),
//         }
//     }
// }

#[ast_node("ArrowFunctionExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ArrowExpr<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub params: Vec<'a, Pat<'a>>,

    pub body: BlockStmtOrExpr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "async"))]
    pub is_async: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "generator"))]
    pub is_generator: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeParameters"))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub return_type: Option<Box<'a, TsTypeAnn<'a>>>,
}

// impl Take for ArrowExpr {
//     fn dummy() -> Self {
//         ArrowExpr {
//             ..Default::default()
//         }
//     }
// }

#[ast_node("YieldExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct YieldExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "argument"))]
    pub arg: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub delegate: bool,
}

// impl Take for YieldExpr {
//     fn dummy() -> Self {
//         YieldExpr {
//             span: DUMMY_SP,
//             arg: Take::dummy(),
//             delegate: false,
//         }
//     }
// }

#[ast_node("MetaProperty")]
#[derive(Eq, Hash, EqIgnoreSpan, Copy, Clone)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MetaPropExpr {
    pub span: Span,
    pub kind: MetaPropKind,
}

#[derive(StringEnum, Clone, CloneIn, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
pub enum MetaPropKind {
    /// `new.target`
    NewTarget,
    /// `import.meta`
    ImportMeta,
}

#[ast_node("AwaitExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AwaitExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "argument"))]
    pub arg: Expr<'a>,
}

#[ast_node("TemplateLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Tpl<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expressions"))]
    pub exprs: Vec<'a, Expr<'a>>,

    pub quasis: Vec<'a, TplElement>,
}

// impl Take for Tpl {
//     fn dummy() -> Self {
//         Tpl {
//             span: DUMMY_SP,
//             exprs: Take::dummy(),
//             quasis: Take::dummy(),
//         }
//     }
// }

#[ast_node("TaggedTemplateExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct TaggedTpl<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub tag: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeParameters"))]
    pub type_params: Option<Box<'a, TsTypeParamInstantiation<'a>>>,

    /// This is boxed to reduce the type size of [Expr].
    #[cfg_attr(feature = "serde-impl", serde(rename = "template"))]
    pub tpl: Box<'a, Tpl<'a>>,
}

// impl Take for TaggedTpl {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("TemplateElement")]
#[derive(Eq, Hash, EqIgnoreSpan, Default)]
pub struct TplElement {
    pub span: Span,
    pub tail: bool,

    /// This value is never used by `swc_ecma_codegen`, and this fact is
    /// considered as a public API.
    ///
    /// If you are going to use codegen right after creating a [TplElement], you
    /// don't have to worry about this value.
    pub cooked: Option<Atom>,

    /// You may need to perform. `.replace("\r\n", "\n").replace('\r', "\n")` on
    /// this value.
    pub raw: Atom,
}

// impl Take for TplElement {
//     fn dummy() -> Self {
//         TplElement {
//             span: DUMMY_SP,
//             tail: Default::default(),
//             cooked: None,
//             raw: Default::default(),
//         }
//     }
// }

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for TplElement {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let cooked = Some(u.arbitrary::<String>()?.into());
        let raw = u.arbitrary::<String>()?.into();

        Ok(Self {
            span,
            tail: false,
            cooked,
            raw,
        })
    }
}

#[ast_node("ParenthesisExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ParenExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}
// impl Take for ParenExpr {
//     fn dummy() -> Self {
//         ParenExpr {
//             span: DUMMY_SP,
//             expr: Take::dummy(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Callee<'a> {
    // #[tag("Super")]
    #[is(name = "super_")]
    Super(Box<'a, Super>),

    // #[tag("Import")]
    Import(Box<'a, Import>),

    // #[tag("*")]
    Expr(Expr<'a>),
}

// impl Default for Callee {
//     fn default() -> Self {
//         Callee::Super(Default::default())
//     }
// }

// impl Take for Callee {
//     fn dummy() -> Self {
//         Callee::Super(Take::dummy())
//     }
// }

#[ast_node("Super")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Super {
    pub span: Span,
}

// impl Take for Super {
//     fn dummy() -> Self {
//         Super { span: DUMMY_SP }
//     }
// }

#[ast_node("Import")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Import {
    pub span: Span,
    pub phase: ImportPhase,
}

// impl Take for Import {
//     fn dummy() -> Self {
//         Import {
//             span: DUMMY_SP,
//             phase: ImportPhase::default(),
//         }
//     }
// }

#[derive(CloneIn, Debug, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(any(feature = "rkyv-impl"), derive(rkyv::Archive, rkyv::Serialize))]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(
                    feature = "rkyv-impl",
                    rkyv(bytecheck(bounds(
                        __C: rkyv::validation::ArchiveContext,
                        __C::Error: rkyv::rancor::Source
                    )))
                )]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize))]
pub struct ExprOrSpread<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    #[cfg_attr(feature = "__rkyv", rkyv(omit_bounds))]
    pub spread: Option<Span>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    #[cfg_attr(feature = "__rkyv", rkyv(omit_bounds))]
    pub expr: Expr<'a>,
}

impl Spanned for ExprOrSpread<'_> {
    #[inline]
    fn span(&self) -> Span {
        let expr = self.expr.span();
        match self.spread {
            Some(spread) => expr.with_lo(spread.lo()),
            None => expr,
        }
    }

    #[inline]
    fn span_lo(&self) -> BytePos {
        match self.spread {
            Some(s) => s.lo,
            None => self.expr.span_lo(),
        }
    }

    #[inline]
    fn span_hi(&self) -> BytePos {
        self.expr.span_hi()
    }
}

// impl<'a> From<Box<'a, Expr<'a>>> for ExprOrSpread<'a> {
//     fn from(expr: Expr<'a>) -> Self {
//         Self { expr, spread: None }
//     }
// }

// bridge_from!(ExprOrSpread<'a>, Box<'a, Expr<'a>>, Expr<'a>);

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum BlockStmtOrExpr<'a> {
    // #[tag("BlockStatement")]
    BlockStmt(Box<'a, BlockStmt<'a>>),
    // #[tag("*")]
    Expr(Expr<'a>),
}

// impl Default for BlockStmtOrExpr {
//     fn default() -> Self {
//         BlockStmtOrExpr::BlockStmt(Default::default())
//     }
// }

// impl<T> From<T> for BlockStmtOrExpr
// where
//     T: Into<Expr>,
// {
//     fn from(e: T) -> Self {
//         Self::Expr(Box::new(e.into()))
//     }
// }

// impl Take for BlockStmtOrExpr {
//     fn dummy() -> Self {
//         BlockStmtOrExpr::Expr(Take::dummy())
//     }
// }

#[ast_node]
#[derive(Is, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum AssignTarget<'a> {
    // #[tag("Identifier")]
    // #[tag("MemberExpression")]
    // #[tag("SuperPropExpression")]
    // #[tag("OptionalChainingExpression")]
    // #[tag("ParenthesisExpression")]
    // #[tag("TsAsExpression")]
    // #[tag("TsSatisfiesExpression")]
    // #[tag("TsNonNullExpression")]
    // #[tag("TsTypeAssertion")]
    // #[tag("TsInstantiation")]
    Simple(SimpleAssignTarget<'a>),
    // #[tag("ArrayPattern")]
    // #[tag("ObjectPattern")]
    Pat(AssignTargetPat<'a>),
}

impl<'a> AssignTarget<'a> {
    pub fn try_from_pat(p: Pat<'a>, alloc: &'a Allocator) -> Result<Self, Pat<'a>> {
        Ok(match p {
            Pat::Array(a) => AssignTargetPat::Array(a).into(),
            Pat::Object(o) => AssignTargetPat::Object(o).into(),
            Pat::Ident(i) => SimpleAssignTarget::Ident(i).into(),
            Pat::Invalid(i) => SimpleAssignTarget::Invalid(i).into(),
            Pat::Expr(e) => match Self::try_from_expr(e, alloc) {
                Ok(v) => v,
                Err(e) => return Err(e.into()),
            },
            _ => return Err(p),
        })
    }

    pub fn try_from_expr(e: Expr<'a>, alloc: &'a Allocator) -> Result<Self, Expr<'a>> {
        Ok(Self::Simple(SimpleAssignTarget::try_from_expr(e, alloc)?))
    }
}

#[ast_node]
#[derive(Is, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum AssignTargetPat<'a> {
    // #[tag("ArrayPattern")]
    Array(Box<'a, ArrayPat<'a>>),
    // #[tag("ObjectPattern")]
    Object(Box<'a, ObjectPat<'a>>),
    // #[tag("Invalid")]
    Invalid(Box<'a, Invalid>),
}

// impl Take for AssignTargetPat {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

// impl Default for AssignTargetPat {
//     fn default() -> Self {
//         AssignTargetPat::Invalid(Take::dummy())
//     }
// }

impl<'a> From<AssignTargetPat<'a>> for Pat<'a> {
    fn from(pat: AssignTargetPat<'a>) -> Self {
        match pat {
            AssignTargetPat::Array(a) => a.into(),
            AssignTargetPat::Object(o) => o.into(),
            AssignTargetPat::Invalid(i) => i.into(),
        }
    }
}

impl<'a> TryFrom<Pat<'a>> for AssignTargetPat<'a> {
    type Error = Pat<'a>;

    fn try_from(p: Pat<'a>) -> Result<Self, Self::Error> {
        Ok(match p {
            Pat::Array(a) => AssignTargetPat::Array(a),
            Pat::Object(o) => AssignTargetPat::Object(o),
            Pat::Invalid(i) => AssignTargetPat::Invalid(i),

            _ => return Err(p),
        })
    }
}

#[ast_node]
#[derive(Is, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum SimpleAssignTarget<'a> {
    /// Note: This type is to help implementing visitor and the field `type_ann`
    /// is always [None].
    // #[tag("Identifier")]
    Ident(Box<'a, BindingIdent<'a>>),
    // #[tag("MemberExpression")]
    Member(Box<'a, MemberExpr<'a>>),
    // #[tag("SuperPropExpression")]
    SuperProp(Box<'a, SuperPropExpr<'a>>),
    // #[tag("ParenthesisExpression")]
    Paren(Box<'a, ParenExpr<'a>>),
    // #[tag("OptionalChainingExpression")]
    OptChain(Box<'a, OptChainExpr<'a>>),
    // #[tag("TsAsExpression")]
    TsAs(Box<'a, TsAsExpr<'a>>),
    // #[tag("TsSatisfiesExpression")]
    TsSatisfies(Box<'a, TsSatisfiesExpr<'a>>),
    // #[tag("TsNonNullExpression")]
    TsNonNull(Box<'a, TsNonNullExpr<'a>>),
    // #[tag("TsTypeAssertion")]
    TsTypeAssertion(Box<'a, TsTypeAssertion<'a>>),
    // #[tag("TsInstantiation")]
    TsInstantiation(Box<'a, TsInstantiation<'a>>),

    // #[tag("Invaliid")]
    Invalid(Box<'a, Invalid>),
}

impl<'a> SimpleAssignTarget<'a> {
    pub fn try_from_expr(e: Expr<'a>, alloc: &'a Allocator) -> Result<Self, Expr<'a>> {
        Ok(match e {
            Expr::Ident(i) => SimpleAssignTarget::Ident(Box::new_in(i.into_inner().into(), alloc)),
            Expr::Member(m) => SimpleAssignTarget::Member(m),
            Expr::SuperProp(s) => SimpleAssignTarget::SuperProp(s),
            Expr::OptChain(s) => SimpleAssignTarget::OptChain(s),
            Expr::Paren(s) => SimpleAssignTarget::Paren(s),
            Expr::TsAs(a) => SimpleAssignTarget::TsAs(a),
            Expr::TsSatisfies(s) => SimpleAssignTarget::TsSatisfies(s),
            Expr::TsNonNull(n) => SimpleAssignTarget::TsNonNull(n),
            Expr::TsTypeAssertion(a) => SimpleAssignTarget::TsTypeAssertion(a),
            Expr::TsInstantiation(a) => SimpleAssignTarget::TsInstantiation(a),
            _ => return Err(e),
        })
    }

    pub fn into_expr(self, alloc: &'a Allocator) -> Expr<'a> {
        match self {
            SimpleAssignTarget::Ident(binding_ident) => {
                Expr::Ident(Box::new_in(binding_ident.into_inner().into(), alloc))
            }
            SimpleAssignTarget::Member(member_expr) => Expr::Member(member_expr),
            SimpleAssignTarget::SuperProp(super_prop_expr) => Expr::SuperProp(super_prop_expr),
            SimpleAssignTarget::Paren(paren_expr) => Expr::Paren(paren_expr),
            SimpleAssignTarget::OptChain(opt_chain_expr) => Expr::OptChain(opt_chain_expr),
            SimpleAssignTarget::TsAs(ts_as_expr) => Expr::TsAs(ts_as_expr),
            SimpleAssignTarget::TsSatisfies(ts_satisfies_expr) => {
                Expr::TsSatisfies(ts_satisfies_expr)
            }
            SimpleAssignTarget::TsNonNull(ts_non_null_expr) => Expr::TsNonNull(ts_non_null_expr),
            SimpleAssignTarget::TsTypeAssertion(ts_type_assertion) => {
                Expr::TsTypeAssertion(ts_type_assertion)
            }
            SimpleAssignTarget::TsInstantiation(ts_instantiation) => {
                Expr::TsInstantiation(ts_instantiation)
            }
            SimpleAssignTarget::Invalid(invalid) => Expr::Invalid(invalid),
        }
    }
}

// bridge_from!(SimpleAssignTarget<'a>, BindingIdent<'a>, Ident);

// impl SimpleAssignTarget {
//     pub fn leftmost(&self) -> Option<Cow<Ident>> {
//         match self {
//             SimpleAssignTarget::Ident(i) => {
//                 Some(Cow::Owned(Ident::new(i.sym.clone(), i.span, i.ctxt)))
//             }
//             SimpleAssignTarget::Member(MemberExpr { obj, .. }) =>
// obj.leftmost().map(Cow::Borrowed),             _ => None,
//         }
//     }
// }

// impl Take for SimpleAssignTarget {
//     fn dummy() -> Self {
//         SimpleAssignTarget::Invalid(Take::dummy())
//     }
// }

// macro_rules! bridge_assign_target {
//     ($bridge:ty, $src:ty) => {
//         bridge_from!($bridge, Box<'a, $src>, $src);
//         bridge_from!(Box<'a, $bridge>, $bridge, $src);
//         bridge_from!(AssignTarget<'a>, Box<'a, $bridge>, $src);
//     };
// }

// bridge_from!(AssignTarget<'a>, BindingIdent<'a>, Ident);
// bridge_assign_target!(SimpleAssignTarget<'a>, BindingIdent<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, MemberExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, SuperPropExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, ParenExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, TsAsExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, TsSatisfiesExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, TsNonNullExpr<'a>);
// bridge_assign_target!(SimpleAssignTarget<'a>, TsTypeAssertion<'a>);
// bridge_assign_target!(AssignTargetPat<'a>, ArrayPat<'a>);
// bridge_assign_target!(AssignTargetPat<'a>, ObjectPat<'a>);

// impl<'a> FromWith<'a, SimpleAssignTarget<'a>> for Expr<'a> {
//     fn from_with(s: SimpleAssignTarget<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {         match s {
//             SimpleAssignTarget::Ident(i) => Box::new_in(i.into_inner().id,
// allocator).into(),             SimpleAssignTarget::Member(m) =>
// m.into_with(allocator),             SimpleAssignTarget::SuperProp(s) =>
// s.into_with(allocator),             SimpleAssignTarget::Paren(s) =>
// s.into_with(allocator),             SimpleAssignTarget::OptChain(s) =>
// s.into_with(allocator),             SimpleAssignTarget::TsAs(a) =>
// a.into_with(allocator),             SimpleAssignTarget::TsSatisfies(s) =>
// s.into_with(allocator),             SimpleAssignTarget::TsNonNull(n) =>
// n.into_with(allocator),             SimpleAssignTarget::TsTypeAssertion(a) =>
// a.into_with(allocator),             SimpleAssignTarget::TsInstantiation(a) =>
// a.into_with(allocator),             SimpleAssignTarget::Invalid(i) =>
// i.into_with(allocator),         }
//     }
// }

// impl AssignTarget {
//     pub fn as_ident(&self) -> Option<&BindingIdent> {
//         self.as_simple()?.as_ident()
//     }

//     pub fn as_ident_mut(&mut self) -> Option<&mut BindingIdent> {
//         self.as_mut_simple()?.as_mut_ident()
//     }
// }

// impl Default for AssignTarget {
//     fn default() -> Self {
//         SimpleAssignTarget::dummy().into()
//     }
// }

// impl Take for AssignTarget {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

#[ast_node("OptionalChainingExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct OptChainExpr<'a> {
    pub span: Span,
    pub optional: bool,
    /// This is boxed to reduce the type size of [Expr].
    pub base: Box<'a, OptChainBase<'a>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum OptChainBase<'a> {
    // #[tag("MemberExpression")]
    Member(Box<'a, MemberExpr<'a>>),
    // #[tag("CallExpression")]
    Call(Box<'a, OptCall<'a>>),
}

// impl Default for OptChainBase {
//     fn default() -> Self {
//         OptChainBase::Member(Default::default())
//     }
// }

#[ast_node("CallExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct OptCall<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub callee: Expr<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "arguments"))]
    pub args: Vec<'a, ExprOrSpread<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
    // pub type_params: Option<TsTypeParamInstantiation>,
}

// impl Take for OptChainExpr {
//     fn dummy() -> Self {
//         Self {
//             span: DUMMY_SP,
//             optional: false,
//             base: Box::new(OptChainBase::Member(Take::dummy())),
//         }
//     }
// }

// impl<'a> FromWith<'a, OptChainBase<'a>> for Expr<'a> {
//     fn from_with(opt: OptChainBase<'a>, allocator: &'a
// swc_allocator::Allocator) -> Self {         match opt {
//             OptChainBase::Call(call) => {
//                 let OptCall {
//                     span,
//                     ctxt,
//                     callee,
//                     args,
//                     type_args,
//                 } = call.into_inner();
//                 Self::Call(Box::new_in(
//                     CallExpr {
//                         callee: Callee::Expr(callee),
//                         args,
//                         span,
//                         type_args,
//                         ctxt,
//                     },
//                     allocator,
//                 ))
//             }
//             OptChainBase::Member(member) => Self::Member(member),
//         }
//     }
// }

// impl Take for OptCall {
//     fn dummy() -> Self {
//         Self {
//             ..Default::default()
//         }
//     }
// }

impl<'a> From<OptCall<'a>> for CallExpr<'a> {
    fn from(
        OptCall {
            span,
            ctxt,
            callee,
            args,
            type_args,
        }: OptCall<'a>,
    ) -> Self {
        Self {
            span,
            callee: Callee::Expr(callee),
            args,
            type_args,
            ctxt,
        }
    }
}

// bridge_from!(Box<'a, CallExpr<'a>>, CallExpr<'a>, OptCall<'a>);
// bridge_from!(crate::Expr<'a>, Box<'a, CallExpr<'a>>, OptCall<'a>);
// bridge_from!(Box<'a, crate::Expr<'a>>, crate::Expr<'a>, OptCall<'a>);
