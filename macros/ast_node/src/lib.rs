#![feature(box_syntax)]

#[macro_use]
extern crate darling;
#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_macros_common;
extern crate syn;

use swc_macros_common::prelude::*;

mod fold;
mod from_variant;
mod spanned;

#[proc_macro_derive(Fold, attributes(fold))]
pub fn derive_fold(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item = self::fold::derive(input);

    print_item("derive(Fold)", item.dump())
}

#[proc_macro_derive(Spanned, attributes(span))]
pub fn derive_spanned(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item = self::spanned::derive(input);

    print_item("derive(Spanned)", item.dump())
}

#[proc_macro_derive(FromVariant)]
pub fn derive_from_variant(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item =
        self::from_variant::derive(input)
            .into_iter()
            .fold(TokenStream::new(), |mut t, item| {
                item.to_tokens(&mut t);
                t
            });

    print_item("derive(FromVariant)", item.dump())
}

/// Alias for
/// `#[derive(Spanned, Fold, Clone, Debug, PartialEq)]` for a struct and
/// `#[derive(Spanned, Fold, Clone, Debug, PartialEq, FromVariant)]` for an
/// enum.
#[proc_macro_attribute]
pub fn ast_node(
    args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    if !args.is_empty() {
        panic!("#[ast_node] takes no arguments");
    }

    let input: DeriveInput = parse(input).expect("failed to parse input as a DeriveInput");

    // we should use call_site
    let mut item = Quote::new(Span::call_site());
    item = match input.data {
        Data::Enum(..) => item.quote_with(smart_quote!(Vars { input }, {
            #[derive(FromVariant, Spanned, Fold, Clone, Debug, PartialEq)]
            input
        })),
        _ => item.quote_with(smart_quote!(Vars { input }, {
            #[derive(Spanned, Fold, Clone, Debug, PartialEq)]
            input
        })),
    };

    print("ast_node", item)
}

/// Workarounds https://github.com/rust-lang/rust/issues/44925
fn print_item<T: Into<TokenStream>>(name: &'static str, item: T) -> proc_macro::TokenStream {
    let item =
        Quote::new(def_site::<Span>()).quote_with(smart_quote!(Vars { item: item.into() }, {
            extern crate swc_common;
            item
        }));
    print(name, item)
}
