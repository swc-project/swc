use is_macro::Is;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, Take},
    EqIgnoreSpan, Span, DUMMY_SP,
};

use super::{
    expr::Expr,
    function::Function,
    ident::Ident,
    lit::{BigInt, Number, Str},
    stmt::BlockStmt,
    typescript::TsTypeAnn,
    Id, IdentName, Lit, MemberProp, Pat,
};

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Prop<'a> {
    /// `a` in `{ a, }`
    // #[tag("Identifier")]
    Shorthand(Box<'a, Ident>),

    /// `key: value` in `{ key: value, }`
    // #[tag("KeyValueProperty")]
    KeyValue(Box<'a, KeyValueProp<'a>>),

    /// This is **invalid** for object literal.
    // #[tag("AssignmentProperty")]
    Assign(Box<'a, AssignProp<'a>>),

    // #[tag("GetterProperty")]
    Getter(Box<'a, GetterProp<'a>>),

    // #[tag("SetterProperty")]
    Setter(Box<'a, SetterProp<'a>>),

    // #[tag("MethodProperty")]
    Method(Box<'a, MethodProp<'a>>),
}

// bridge_from!(Box<'a, Ident>, Ident, IdentName);
// bridge_from!(Prop<'a>, Box<'a, Ident>, IdentName);

#[ast_node("KeyValueProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct KeyValueProp<'a> {
    #[span(lo)]
    pub key: PropName<'a>,

    #[span(hi)]
    pub value: Expr<'a>,
}

#[ast_node("AssignmentProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AssignProp<'a> {
    pub span: Span,
    pub key: Ident,
    pub value: Expr<'a>,
}

#[ast_node("GetterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct GetterProp<'a> {
    pub span: Span,
    pub key: PropName<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<BlockStmt<'a>>,
}
#[ast_node("SetterProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct SetterProp<'a> {
    pub span: Span,
    pub key: PropName<'a>,
    pub this_param: Option<Pat<'a>>,
    pub param: Pat<'a>,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<BlockStmt<'a>>,
}
#[ast_node("MethodProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct MethodProp<'a> {
    pub key: PropName<'a>,

    #[cfg_attr(feature = "serde-impl", serde(flatten))]
    #[span]
    pub function: Box<'a, Function<'a>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum PropName<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, IdentName>),
    /// String literal.
    // #[tag("StringLiteral")]
    Str(Box<'a, Str>),
    /// Numeric literal.
    // #[tag("NumericLiteral")]
    Num(Box<'a, Number>),
    // #[tag("Computed")]
    Computed(Box<'a, ComputedPropName<'a>>),
    // #[tag("BigIntLiteral")]
    BigInt(Box<'a, BigInt<'a>>),
}

// bridge_from!(Box<'a, IdentName>, IdentName, Ident);
// bridge_from!(PropName<'a>, Box<'a, IdentName>, Ident);
// bridge_from!(PropName<'a>, Ident, Id);

// impl Default for PropName {
//     fn default() -> Self {
//         PropName::Ident(Default::default())
//     }
// }

// impl Take for PropName {
//     fn dummy() -> Self {
//         PropName::Ident(Take::dummy())
//     }
// }

// impl<'a> FromWith<'a, PropName<'a>> for MemberProp<'a> {
//     fn from_with(p: PropName<'a>, allocator: &'a swc_allocator::Allocator) ->
// Self {         match p {
//             PropName::Ident(p) => MemberProp::Ident(p),
//             PropName::Computed(p) => MemberProp::Computed(p),
//             PropName::Str(p) => MemberProp::Computed(Box::new_in(
//                 ComputedPropName {
//                     span: DUMMY_SP,
//                     expr: Expr::Lit(Box::new_in(Lit::Str(p), allocator)),
//                 },
//                 allocator,
//             )),
//             PropName::Num(p) => MemberProp::Computed(Box::new_in(
//                 ComputedPropName {
//                     span: DUMMY_SP,
//                     expr: Expr::Lit(Box::new_in(Lit::Num(p), allocator)),
//                 },
//                 allocator,
//             )),
//             PropName::BigInt(p) => MemberProp::Computed(Box::new_in(
//                 ComputedPropName {
//                     span: DUMMY_SP,
//                     expr: Expr::Lit(Box::new_in(Lit::BigInt(p), allocator)),
//                 },
//                 allocator,
//             )),
//         }
//     }
// }

#[ast_node("Computed")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ComputedPropName<'a> {
    /// Span including `[` and `]`.
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

// impl Take for ComputedPropName {
//     fn dummy() -> Self {
//         Self {
//             span: DUMMY_SP,
//             expr: Take::dummy(),
//         }
//     }
// }
