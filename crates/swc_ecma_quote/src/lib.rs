/// Not a public API.
#[doc(hidden)]
pub extern crate swc_common;
/// Not a public API.
#[doc(hidden)]
pub extern crate swc_ecma_ast;
/// Not a public API.
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

#[doc(hidden)]
pub use self::clone::ImplicitClone;

mod clone;

/// # Supported output types
///
///  - `Expr`
///  - `Pat`
///  - `Stmt`
///  - `ModuleItem`
///
///  - Option<T> where T is supported type
///  - Box<T> where T is supported type
///
/// For example, `Box<Expr>` and `Option<Box<Expr>>` are supported.
///
/// # Variable substitution
///
/// If an identifier starts with `$`, it is substituted with the value of the
/// parameter passed.
///
/// e.g.
///
/// ```rust
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::Ident;
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!("const $name = 4;" as Stmt, name = Ident::new("ref".into(), DUMMY_SP));
///
/// // Tip: Use private_ident!("ref") for real identifiers.
/// ```
///
///
/// # Examples
///
/// ## Quote a variable declaration
///
/// ```rust
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::Ident;
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!("const $name = 4;" as Stmt, name = Ident::new("ref".into(), DUMMY_SP));
///
/// // Tip: Use private_ident!("ref") for real identifiers.
/// ```
#[macro_export]
macro_rules! quote {
    ($($tt:tt)*) => {{
        $crate::swc_ecma_quote_macros::internal_quote!($($tt)*)
    }};
}

/// Creates a `Box<Expr>` from the source code.
///
/// This is an alias for [quote], but without `as Box<Expr>`.
#[macro_export]
macro_rules! quote_expr {
    ($src:tt) => {{
        $crate::quote!($src as Box<Expr>)
    }};

    ($src:tt, $($tt2:tt)*) => {{
        $crate::quote!($src as Box<Expr>, $($tt2)*)
    }};
}
