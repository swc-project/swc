extern crate proc_macro;

use quote::ToTokens;

use crate::{ctxt::Ctx, input::QuoteInput, ret_type::parse_input_type};

mod ast;
mod ctxt;
mod input;
mod ret_type;

/// Don't invoke this macro directly, use the `quote!` macro from
/// `swc_ecma_quote` instead.
#[proc_macro]
pub fn internal_quote(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let QuoteInput {
        src,
        as_token: _,
        output_type,
        vars,
    } = syn::parse::<QuoteInput>(input).expect("failed to parse input to quote!()");

    let ret_type =
        parse_input_type(&src.value(), &output_type).expect("failed to parse input type");

    let mut cx = Ctx {
        vars: Default::default(),
    };
    ret_type.inner.to_code(&cx).to_token_stream().into()
}
