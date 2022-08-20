use self::private::Sealed;
use super::{ast::*, atoms::JsWord};

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
/// ## Typed variables
///
/// As this macro generates static AST, it can't substitute variables if an
/// ideitifier is not allowed in such position. In other words, this macro only
/// supports substituting
///
///  - Ident
///  - Expr
///  - Pat
///
/// You can use it like
///
/// ```rust
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::Ident;
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!(
///                 "const $name = $val;" as Stmt,
///                 name = Ident::new("ref".into(), DUMMY_SP),
///                 val: Expr = 4.into(),
///             );
/// ```
///
/// # Examples
///
/// ## Quote a variable declaration
/// ```rust
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::Ident;
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!("const $name = 4;" as Stmt, name =
/// Ident::new("ref".into(), DUMMY_SP));
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

/// Noop
pub trait ImplicitClone: Clone {
    fn clone_quote_var(&self) -> Self {
        self.clone()
    }
}

impl<T: Clone> ImplicitClone for T {}
