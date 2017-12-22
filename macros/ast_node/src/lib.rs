#![feature(box_syntax, proc_macro)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro2;
extern crate proc_macro;
#[macro_use]
extern crate swc_macros_common as common;
extern crate syn;

use common::prelude::*;

#[proc_macro_derive(AstNode)]
pub fn derive(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = &input.ident;

    let item: Item = Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                CONST_NAME: type_name.new_ident_with(|n| format!("_IMPL_AST_NODE_FOR_{}", n)),
                Type: type_name,
            },
            {
                #[allow(non_upper_case_globals)]
                const CONST_NAME: () = {
                    extern crate swc_common as _swc_common;
                    impl _swc_common::AstNode for Type {}
                    ()
                };
            }
        ))
        .parse();

    print("derive(AstNode)", item.into_tokens())
}

/// Alias for
///
/// `#[derive(Clone, Debug, Eq, PartialEq, Hash, EqIgnoreSpan, AstNode)]`
#[proc_macro_attribute]
pub fn ast_node(
    _attr: proc_macro::TokenStream,
    s: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let item: Item = syn::parse(s).expect("failed to parse tokens as an item");

    let tokens = pmutil::Quote::new_call_site().quote_with(smart_quote!(Vars { item }, {
        #[derive(
                Clone, Debug, Eq, PartialEq, Hash,
                ::swc_macros::EqIgnoreSpan,
                ::swc_macros::AstNode
        )]
        item
    }));

    print("ast_node", tokens)
}
