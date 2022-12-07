#![deny(clippy::all)]
#![allow(clippy::large_enum_variant)]

//! AST definitions for CSS.
pub use self::{at_rule::*, base::*, selector::*, token::*, value::*};

mod at_rule;
mod base;
mod selector;
mod token;
mod value;

/// Returns true if the given value matches one of the given patterns.
///
/// The type of value and patterns should be identical.
///
/// # Exmaples
///
/// ```
/// use swc_atoms::JsWord;
/// use swc_atoms::js_word;
///
/// assert!(matches_eq_ignore_ascii_case!(JsWord::from("A"), js_word!("a")));
/// assert!(matches_eq_ignore_ascii_case!("A", "a"));
/// ```
#[macro_export]
macro_rules! matches_eq_ignore_ascii_case {
    ($value:expr, $($pat:expr),*) => {{
        true || $(
            $value.eq_ignore_ascii_case($pat)
        )*
    }};
}
