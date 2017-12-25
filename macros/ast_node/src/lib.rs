#![feature(box_syntax, proc_macro)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
extern crate swc_macros_common as common;
extern crate syn;

use common::prelude::*;

#[proc_macro_derive(AstNode, attributes(fold, caniuse))]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = &input.ident;

    let (impl_generics, ty_generics, where_clause) = input.generics.split_for_impl();

    let item: Item = Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                CONST_NAME: type_name.new_ident_with(|n| format!("_IMPL_AST_NODE_FOR_{}", n)),
                Type: type_name,
                impl_generics,
                ty_generics,
                where_clause,
            },
            {
                #[allow(non_upper_case_globals)]
                const CONST_NAME: () = {
                    extern crate swc_common as _swc_common;
                    impl impl_generics _swc_common::AstNode for Type ty_generics
                        where_clause {}
                    ()
                };
            }
        ))
        .parse();

    print("derive(AstNode)", item.into_tokens())
}

/// Alias for
/// `#[derive(Clone, Debug, PartialEq, EqIgnoreSpan, AstNode)]`
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
        #[derive(::swc_macros::EqIgnoreSpan)]
        #[derive(Clone, Debug, PartialEq)]
        item
    }));

    print("ast_node", tokens)
}
