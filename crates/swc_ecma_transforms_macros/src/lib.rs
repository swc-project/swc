#![deny(clippy::all)]
#![recursion_limit = "2048"]

use pmutil::ToTokensExt;
use proc_macro::TokenStream;
use swc_macros_common::print;

mod common;
mod fast;
mod parallel;

/// This macro adds fast-path to the `swc_ecma_visit::Fold` and
/// `swc_ecma_visit::Visit`.
///
/// Currently this macro modifies handler of `Expr`, `Stmt`, `ModuleItem`,
/// `Decl`, `Pat` and some vector types.
///
///
///
///
/// # Usage
///
/// `#[fast_path(ArrowVisitor)]`
///
/// where `ShouldWork` implements `swc_ecma_transforms::perf::Check`
#[proc_macro_attribute]
pub fn fast_path(attr: TokenStream, item: TokenStream) -> TokenStream {
    let item = syn::parse(item).expect("failed to parse input as an item");
    let expanded = fast::expand(attr.into(), item);
    print("fast_path", expanded.dump())
}

///
/// # Input
///
/// Basically, input for each types are wrapped in the suffix of the visitor
/// method for the type.
///
/// ## `#[threashold]`
///
/// ```ignore,
/// #[parallel(module_items(threshold = "4"))]
/// impl VisitMut for Pass {}
/// ```
#[proc_macro_attribute]
pub fn parallel(attr: TokenStream, item: TokenStream) -> TokenStream {
    let item = syn::parse(item).expect("failed to parse input as an item");
    let expanded = parallel::expand(attr.into(), item);
    print("parallel", expanded.dump())
}
