/// Not a public API.
#[doc(hidden)]
pub extern crate swc_ecma_quote_macros;

///
///
/// # Variable substitution
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

/// Alias for [quote], but without `as Expr`.
#[macro_export]
macro_rules! quote_expr {
    ($($tt1:tt)*) => {{
        $crate::quote!($($tt1)* as Expr)
    }};

    ($($tt1:tt)*, $($tt2:tt)*) => {{
        $crate::quote!($($tt1)* as Expr, $($tt2)*)
    }};
}
