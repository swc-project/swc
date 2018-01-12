#![feature(box_syntax, proc_macro)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
extern crate swc_macros_common as common;
extern crate syn;

use self::fold::derive_fold;
use common::prelude::*;

mod fold;

#[proc_macro_derive(AstNode, attributes(fold))]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = &input.ident;

    let mut tokens = Tokens::new();
    derive_fold(&input).to_tokens(&mut tokens);

    let item = Quote::new_call_site()
        .quote_with(smart_quote!(Vars { Type: type_name }, {
            impl ::swc_common::AstNode for Type {}
        }))
        .parse::<ItemImpl>()
        .with_generics(input.generics);
    item.to_tokens(&mut tokens);

    print("derive(AstNode)", tokens)
}

/// Alias for
/// `#[derive(Clone, Debug, PartialEq, AstNode)]`
#[proc_macro_attribute]
pub fn ast_node(
    _attr: proc_macro::TokenStream,
    s: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let item: Item = syn::parse(s).expect("failed to parse tokens as an item");

    // With proc_macro feature enabled, only attributes for first derive works.
    // https://github.com/rust-lang/rust/issues/44925
    let tokens = pmutil::Quote::new_call_site().quote_with(smart_quote!(Vars { item }, {
        #[derive(::swc_macros::AstNode)]
        #[derive(Clone, Debug, PartialEq)]
        item
    }));

    print("ast_node", tokens)
}
