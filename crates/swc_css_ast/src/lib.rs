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
/// # Examples
///
/// ```
/// use swc_atoms::Atom;
/// use swc_atoms::js_word;
/// use swc_css_ast::*;
///
/// assert!(matches_eq_ignore_ascii_case!(Atom::from("A"), "a"));
/// assert!(matches_eq_ignore_ascii_case!("A", "a"));
/// ```
#[macro_export]
macro_rules! matches_eq_ignore_ascii_case {
    ($value:expr, $($pat:expr),*) => {{
        $(
            $value.eq_ignore_ascii_case(&$pat) ||
        )* false
    }};
}

/// Returns true if the given value matches one of the given patterns.
///
/// The type of value and patterns should be identical.
///
/// # Examples
///
/// ```
/// use swc_atoms::Atom;
/// use swc_atoms::js_word;
/// use swc_css_ast::*;
///
/// assert!(matches_eq!(Atom::from("a"), "a"));
/// assert!(matches_eq!("a", "a"));
/// ```
#[macro_export]
macro_rules! matches_eq {
    ($value:expr, $($pat:expr),*) => {{
        $(
            $value == $pat ||
        )* false
    }};
}
