use pmutil::ToTokensExt;
use proc_macro::TokenStream;
use swc_macros_common::print;

mod fast;

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
