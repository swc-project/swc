use swc_atoms::JsWord;
use swc_ecma_ast::*;

use self::private::Sealed;

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

/// Not a public API.
///
/// Implemented for types which will be implicitly cloned when used as a
/// variable in [crate::quote] macro calls.
pub trait ImplicitClone: Clone + Sealed {
    fn clone_quote_var(&self) -> Self {
        self.clone()
    }
}

macro_rules! impl_for {
    ($T:ty) => {
        impl ImplicitClone for $T {}
        impl Sealed for $T {}
    };
}

impl_for!(Id);
impl_for!(Ident);
impl_for!(JsWord);

impl_for!(Str);
impl_for!(Number);
impl_for!(Bool);

mod private {
    pub trait Sealed {}
}
