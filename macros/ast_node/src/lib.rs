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
mod visit;

/// Implements `FoldWith<F>` and `VisitWith<F>`.
///
/// ## Attributes
/// `#[fold(ignore)]`
/// Skip a field.
///
/// `#[fold(bound)]`
/// Add bound to the generated impl block.
/// Generic fields typically requires this attribute.
#[proc_macro_derive(Fold, attributes(fold))]
pub fn derive_fold(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let name = input.ident.clone();

    let fold_item = self::fold::derive(input.clone());
    let visit_item = self::visit::derive(input);
    let item = Quote::new(def_site::<Span>()).quote_with(smart_quote!(
        Vars {
            fold_item: fold_item,
            visit_item: visit_item,
            NAME: Ident::new(&format!("IMPL_FOLD_FOR_{}",name), Span::call_site()),
        },
        {
            const NAME: () = {
                extern crate swc_common;
                fold_item
                visit_item
            };
        }
    ));

    print("derive(Fold)", item.dump())
}

#[proc_macro_derive(Spanned, attributes(span))]
pub fn derive_spanned(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let name = input.ident.clone();

    let item = self::spanned::derive(input);

    print_item(
        "derive(Spanned)",
        &format!("IMPL_SPANNED_FOR_{}", name),
        item.dump(),
    )
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

    print("derive(FromVariant)", item.dump())
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
            #[derive(::swc_common::FromVariant, ::swc_common::Spanned,
            ::swc_common::Fold, Clone, Debug, PartialEq)]
            input
        })),
        _ => item.quote_with(smart_quote!(Vars { input }, {
            #[derive(::swc_common::Spanned, ::swc_common::Fold, Clone, Debug, PartialEq)]
            input
        })),
    };

    print("ast_node", item)
}

/// Workarounds https://github.com/rust-lang/rust/issues/44925
fn print_item<T: Into<TokenStream>>(
    name: &'static str,
    const_name: &str,
    item: T,
) -> proc_macro::TokenStream {
    let item = Quote::new(def_site::<Span>()).quote_with(smart_quote!(
        Vars {
            item: item.into(),
            NAME: Ident::new(&const_name, Span::call_site())
        },
        {
            const NAME: () = {
                extern crate swc_common;
                item
            };
        }
    ));
    print(name, item)
}
