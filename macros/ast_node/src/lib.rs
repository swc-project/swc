#![recursion_limit = "1024"]

extern crate darling;
#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_macros_common;
extern crate syn;

use swc_macros_common::prelude::*;

mod ast_node_macro;
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
    let input: DeriveInput = parse(input).expect("failed to parse input as a DeriveInput");

    // we should use call_site
    let mut item = Quote::new(Span::call_site());
    item = match input.data {
        Data::Enum(..) => {
            if !args.is_empty() {
                panic!("#[ast_node] on enum does not accept any argument")
            }
            item.quote_with(smart_quote!(Vars { input }, {
                #[derive(::swc_common::FromVariant, ::swc_common::Spanned, Clone, Debug, PartialEq)]
                #[derive(::serde::Serialize, ::serde::Deserialize)]
                #[serde(untagged)]
                #[cfg_attr(feature = "fold", derive(::swc_common::Fold))]
                input
            }))
        }
        _ => {
            let args: Option<ast_node_macro::Args> = if args.is_empty() {
                None
            } else {
                Some(parse(args).expect("failed to parse args of #[ast_node]"))
            };

            let serde_tag = match input.data {
                Data::Struct(DataStruct {
                    fields: Fields::Named(..),
                    ..
                }) => {
                    if args.is_some() {
                        Some(Quote::new_call_site().quote_with(smart_quote!(Vars {}, {
                            #[serde(tag = "type")]
                        })))
                    } else {
                        None
                    }
                }
                _ => None,
            };

            let serde_rename = args.as_ref().map(|args| {
                Quote::new_call_site().quote_with(smart_quote!(Vars { name: &args.ty },{
                    #[serde(rename = name)]
                }))
            });

            let ast_node_impl = match args {
                Some(ref args) => Some(ast_node_macro::expand(args.clone(), input.clone())),
                None => None,
            };

            let mut quote =
                item.quote_with(smart_quote!(Vars { input, serde_tag, serde_rename }, {
                    #[derive(::swc_common::Spanned, Clone, Debug, PartialEq)]
                    #[derive(::serde::Serialize)]
                    serde_tag
                    #[serde(rename_all = "camelCase")]
                    serde_rename
                    #[cfg_attr(feature = "fold", derive(::swc_common::Fold))]
                    input
                }));

            if let Some(items) = ast_node_impl {
                for item in items {
                    quote = quote.quote_with(smart_quote!(Vars { item }, { item }))
                }
            }

            quote
        }
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
