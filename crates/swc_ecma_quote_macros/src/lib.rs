extern crate proc_macro;

mod ast;
mod ctxt;
mod input;

/// Don't invoke this macro directly, use the `quote!` macro from
/// `swc_ecma_quote` instead.
#[proc_macro]
pub fn internal_quote(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    input
}
