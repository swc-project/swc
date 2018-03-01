#![feature(box_syntax, proc_macro)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_macros_common as common;
extern crate syn;

use common::prelude::*;

mod fold;
mod to_code;

#[proc_macro_derive(Fold, attributes(fold))]
pub fn derive_fold(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item = self::fold::derive(input);

    print_item(item.dump())
}

#[proc_macro_derive(ToCode, attributes(code))]
pub fn derive_to_code(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = input.ident.clone();

    let item = self::to_code::derive(input);

    wrap_in_const(&format!("DERIVE_TO_CODE_FOR_{}", type_name), item.dump())
}

#[proc_macro_derive(AstNode)]
pub fn derive_ast_node(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = &input.ident;

    let item = Quote::new(Span::def_site())
        .quote_with(smart_quote!(Vars { Type: type_name }, {
            impl swc_common::AstNode for Type {}
        }))
        .parse::<ItemImpl>()
        .with_generics(input.generics);

    print_item(item.dump())
}

/// Alias for
/// `#[derive(Clone, Debug, PartialEq, AstNode)]`
#[proc_macro_attribute]
pub fn ast_node(
    args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    if !args.is_empty() {
        panic!("#[ast_node] takes no arguments");
    }

    let mut item: DeriveInput = parse(input).expect("failed to parse input as a DeriveInput");

    let attrs = item.attrs.clone();
    item.attrs = vec![];

    // If we use call_site with proc_macro feature enabled,
    // only attributes for first derive works.
    // https://github.com/rust-lang/rust/issues/46489

    let mut tokens = Tokens::new();

    for a in attrs {
        a.to_tokens(&mut tokens)
    }

    let item = Quote::new(Span::def_site()).quote_with(smart_quote!(Vars { item }, {
        #[derive(Fold, AstNode, Clone, Debug, PartialEq)]
        item
    }));
    item.to_tokens(&mut tokens);

    // let item=TokenStream::from(item).to_string().parse::<TokenStream>().unwrap();

    print("ast_node", tokens)
}

/// Workarounds https://github.com/rust-lang/rust/issues/44925
fn print_item<T: Into<TokenStream>>(item: T) -> proc_macro::TokenStream {
    let item = Quote::new(Span::def_site()).quote_with(smart_quote!(Vars { item: item.into() }, {
        extern crate swc_common;
        item
    }));
    item.into()
}
