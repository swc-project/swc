extern crate proc_macro;

use syn;

use swc_macros_common::prelude::*;

mod expand;
mod input;
mod parse;
mod util;

/// # Attributes on enum
/// ## functions
/// `#[kind(functions(name = "return_type"))]`
///
/// ```rust,ignore
/// #[macro_use]
/// extern crate enum_kind;
///
/// /// You can split attributes if you want.
/// #[derive(Kind)]
/// #[kind(functions(is_a = "bool", is_b = "bool"))]
/// #[kind(functions(is_a_or_b = "bool", num = "u8"))]
/// pub enum E {
///     #[kind(is_a, is_a_or_b, num = "1")]
///     A,
///     /// You can split attributes if you want.
///     #[kind(is_b)]
///     #[kind(is_a_or_b)]
///     #[kind(num = "2")]
///     B(u8),
///     /// Default value of bool is false if not specified and true if specified.
///     ///
///     /// Both struct like variant and tuple like variant are supported.
///     #[kind(num = "3")]
///     C {},
/// }
///
/// # fn main() {
/// assert!(E::A.is_a() && E::A.is_a_or_b() && !E::A.is_b());
/// assert_eq!(E::A.num(), 1);
///
/// assert!(!E::B(0).is_a() && E::B(0).is_a_or_b() && E::B(0).is_b());
/// assert_eq!(E::B(0).num(), 2);
///
/// assert!(!E::C {}.is_a() && !E::C {}.is_a_or_b() && !E::C {}.is_b());
/// assert_eq!(E::C {}.num(), 3);
///
/// # }
/// ```
///
/// -----
///
/// # Real usecase
///
/// ```rust,ignore
/// #[macro_use]
/// extern crate enum_kind;
///
/// #[derive(Kind, Debug, Clone, Eq, PartialEq, Hash)]
/// #[kind(function(precedence = "u8"))]
/// pub enum BinOpToken {
///     /// `==`
///     #[kind(precedence = "6")]
///     EqEq,
///     /// `!=`
///     #[kind(precedence = "6")]
///     NotEq,
///     /// `===`
///     #[kind(precedence = "6")]
///     EqEqEq,
///     /// `!==`
///     #[kind(precedence = "6")]
///     NotEqEq,
///     /// `<`
///     #[kind(precedence = "7")]
///     Lt,
///     /// `<=`
///     #[kind(precedence = "7")]
///     LtEq,
///     /// `>`
///     #[kind(precedence = "7")]
///     Gt,
///     #[kind(precedence = "7")]
///     /// `>=`
///     #[kind(precedence = "7")]
///     GtEq,
///     /// `<<`
///     #[kind(precedence = "8")]
///     LShift,
///     /// `>>`
///     #[kind(precedence = "8")]
///     RShift,
///     /// `>>>`
///     #[kind(precedence = "8")]
///     ZeroFillRShift,
///     /// `+`
///     #[kind(precedence = "9")]
///     Plus,
///     /// `-`
///     #[kind(precedence = "9")]
///     Minus,
///     /// `*`
///     #[kind(precedence = "10")]
///     Mul,
///     /// `/`
///     #[kind(precedence = "10")]
///     Div,
///     /// `%`
///     #[kind(precedence = "10")]
///     Mod,
///     /// `|`
///     #[kind(precedence = "3")]
///     BitOr,
///     /// `^`
///     #[kind(precedence = "4")]
///     BitXor,
///     /// `&`
///     #[kind(precedence = "5")]
///     BitAnd,
///     /// `in`
///     #[kind(precedence = "7")]
///     In,
///     /// `instanceof`
///     #[kind(precedence = "7")]
///     InstanceOf,
///     /// `**`
///     #[kind(precedence = "10")]
///     Exp,
///     /// `||`
///     #[kind(precedence = "1")]
///     LogicalOr,
///     /// `&&`
///     #[kind(precedence = "2")]
///     LogicalAnd,
/// }
///
/// # fn main() {}
/// ```
#[proc_macro_derive(Kind, attributes(kind))]
pub fn derive_kind(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse::<syn::DeriveInput>(input)
        .map(From::from)
        .expect("failed to parse derive input");
    let item = expand::expand(input);
    let tokens = item.into_token_stream();

    // println!("Expanded:{}", tokens);

    tokens.into()
}
