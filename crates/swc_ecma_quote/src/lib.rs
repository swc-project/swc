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
///  - `AssignTarget`
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
/// # mod swc_core {
/// #     pub mod atoms { pub use swc_atoms::*; }
/// #     pub mod common { pub use swc_common::*; }
/// #     pub mod ecma { pub mod ast { pub use swc_ecma_ast::*; } }
/// #     pub mod quote { pub use swc_ecma_quote::*; }
/// # }
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::{Ident, Stmt};
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!("const $name = 4;" as Stmt, name = Ident::new_no_ctxt("ref".into(), DUMMY_SP));
///
/// // Tip: Use private_ident!("ref") for real identifiers.
/// ```
///
/// ## Typed variables
///
/// As this macro generates static AST, it can't substitute variables if an
/// identifier is not allowed in such position. In other words, this macro only
/// supports substituting
///
///  - [swc_ecma_ast::Ident]
///  - [swc_ecma_ast::Expr]
///  - [swc_ecma_ast::Pat]
///  - [swc_ecma_ast::Str]
///
/// You can use it like
///
/// ```rust
/// # mod swc_core {
/// #     pub mod atoms { pub use swc_atoms::*; }
/// #     pub mod common { pub use swc_common::*; }
/// #     pub mod ecma { pub mod ast { pub use swc_ecma_ast::*; } }
/// #     pub mod quote { pub use swc_ecma_quote::*; }
/// # }
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::{Expr, Ident, Stmt};
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!(
///                 "const $name = $val;" as Stmt,
///                 name = Ident::new_no_ctxt("ref".into(), DUMMY_SP),
///                 val: Expr = 4.into(),
///             );
/// ```
///
/// # Examples
///
/// ## Quote a variable declaration
/// ```rust
/// # mod swc_core {
/// #     pub mod atoms { pub use swc_atoms::*; }
/// #     pub mod common { pub use swc_common::*; }
/// #     pub mod ecma { pub mod ast { pub use swc_ecma_ast::*; } }
/// #     pub mod quote { pub use swc_ecma_quote::*; }
/// # }
/// use swc_common::DUMMY_SP;
/// use swc_ecma_ast::{Ident, Stmt};
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `const ref = 4;`
/// let _stmt = quote!("const $name = 4;" as Stmt, name =
/// Ident::new_no_ctxt("ref".into(), DUMMY_SP));
///
/// // Tip: Use private_ident!("ref") for real identifiers.
/// ```
///
/// ## Using `Str`
///
/// The grammar is `"$var_name"`.
///
/// ```rust
/// # mod swc_core {
/// #     pub mod atoms { pub use swc_atoms::*; }
/// #     pub mod common { pub use swc_common::*; }
/// #     pub mod ecma { pub mod ast { pub use swc_ecma_ast::*; } }
/// #     pub mod quote { pub use swc_ecma_quote::*; }
/// # }
/// use swc_ecma_ast::{ModuleItem, Str};
/// use swc_ecma_quote::quote;
///
/// // This will return ast for `import thing from "foo";`
/// let _stmt = quote!(
///                 "import thing from \"$thing\";" as ModuleItem,
///                 thing: Str = "foo".into(),
///             );
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
