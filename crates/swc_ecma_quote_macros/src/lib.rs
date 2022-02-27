extern crate proc_macro;

use crate::input::QuoteInput;

mod ast;
mod ctxt;
mod input;
mod ret_type;

/// Don't invoke this macro directly, use the `quote!` macro from
/// `swc_ecma_quote` instead.
#[proc_macro]
pub fn internal_quote(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = syn::parse::<QuoteInput>(input).expect("failed to parse input to quote!()");
}
