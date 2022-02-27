/// Not a public API.
#[doc(hidden)]
pub extern crate swc_common;
/// Not a public API.
#[doc(hidden)]
pub extern crate swc_ecma_ast;
/// Not a public API.
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

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
/// (**Not implemented**)
///
/// If an identifier starts with `$`, it is substituted with the value of the
/// parameter passed.
///
/// e.g.
///
/// ```rust,ignore
/// quote!("const $name = 4;" as Stmt, name = private_ident!("ref"))
/// ```
///
///
/// # Examples
///
/// ## Quote a variable declaration
///
/// (**Not implemented**)
///
/// ```rust
/// use swc_ecma_ast::*;
/// use swc_ecma_quote::quote;
///
/// let stmt = quote!("const $name = 4;" as Stmt, name = private_ident!("ref"));
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
    ($($tt1:tt)*) => {{
        $crate::quote!($($tt1)* as Box<Expr>)
    }};

    ($($tt1:tt)*, $($tt2:tt)*) => {{
        $crate::quote!($($tt1)* as Box<Expr>, $($tt2)*)
    }};
}
