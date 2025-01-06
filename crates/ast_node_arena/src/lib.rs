#![deny(clippy::all)]
#![recursion_limit = "1024"]

extern crate proc_macro;

use quote::quote;
use swc_macros_common::prelude::*;
use syn::{visit_mut::VisitMut, *};

mod ast_node_macro;
mod clone_in;

#[proc_macro_derive(CloneIn)]
pub fn derive_clone_in(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item = self::clone_in::derive(input);

    print("derive(CloneIn)", item.into_token_stream())
}

/// Derives `serde::Serialize` and `serde::Deserialize`.
///
/// # Struct attributes
///
/// `#[ast_serde("A")]` adds `"type": "A"` to json when serialized, and
/// deserializes as the type only if `type` field of json string is `A`.
///
/// # Enum attributes
///
/// ## Type-level attributes
///
/// This macro does not accept arguments if used on enum.
///
/// ## Variant attributes
///
/// ### `#[tag("Expr")]`
///
/// You can tell "Use this variant if `type` is `Expr`".
///
/// This attribute can be applied multiple time, if a variant consumes multiple
/// `type`s.
///
/// For example, `Lit` of swc_ecma_ast is an enum, but `Expr`, which contains
/// `Lit` as a variant, is also an enum.
/// So the `Lit` variant has multiple `#[tag]`-s like
///
/// ```rust,ignore
/// enum Expr {
///   #[tag("StringLiteral")]
///   #[tag("NumericLiteral")]
///   #[tag("BooleanLiteral")]
///   Lit(Lit),
/// }
/// ```
///
/// so the deserializer can decide which variant to use.
///
///
/// `#[tag]` also supports wildcard like `#[tag("*")]`. You can use this if
/// there are two many variants.
#[proc_macro_attribute]
pub fn ast_serde(
    args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let input: DeriveInput = parse(input).expect("failed to parse input as a DeriveInput");

    // we should use call_site
    let mut item = TokenStream::new();
    match input.data {
        Data::Enum(..) => {
            if !args.is_empty() {
                panic!("#[ast_serde] on enum does not accept any argument")
            }

            item.extend(quote!(
                #[derive(::serde::Serialize)]
                #[serde(untagged)]
                #input
            ));
        }
        _ => {
            let args: Option<ast_node_macro::Args> = if args.is_empty() {
                None
            } else {
                Some(parse(args).expect("failed to parse args of #[ast_serde]"))
            };

            let serde_tag = match input.data {
                Data::Struct(DataStruct {
                    fields: Fields::Named(..),
                    ..
                }) => {
                    if args.is_some() {
                        Some(quote!(#[serde(tag = "type")]))
                    } else {
                        None
                    }
                }
                _ => None,
            };

            let serde_rename = args.as_ref().map(|args| {
                let name = &args.ty;
                quote!(#[serde(rename = #name)])
            });

            item.extend(quote!(
                #[derive(::serde::Serialize)]
                #serde_tag
                #[serde(rename_all = "camelCase")]
                #serde_rename
                #input
            ));
        }
    };

    print("ast_serde", item)
}

struct AddAttr;

impl VisitMut for AddAttr {
    fn visit_field_mut(&mut self, f: &mut Field) {
        f.attrs
            .push(parse_quote!(#[cfg_attr(feature = "__rkyv", rkyv(omit_bounds))]));
    }
}

/// Alias for
/// `#[derive(Spanned, Fold, CloneIn, Debug, PartialEq)]` for a struct and
/// `#[derive(Spanned, Fold, CloneIn, Debug, PartialEq, FromVariant)]` for an
/// enum.
#[proc_macro_attribute]
pub fn ast_node(
    args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let mut input: DeriveInput = parse(input).expect("failed to parse input as a DeriveInput");

    AddAttr.visit_data_mut(&mut input.data);

    // we should use call_site
    let mut item = TokenStream::new();
    match input.data {
        Data::Enum(..) => {
            struct EnumArgs {
                clone: bool,
            }
            impl parse::Parse for EnumArgs {
                fn parse(i: parse::ParseStream<'_>) -> syn::Result<Self> {
                    let name: Ident = i.parse()?;
                    if name != "no_clone" {
                        return Err(i.error("unknown attribute"));
                    }
                    Ok(EnumArgs { clone: false })
                }
            }
            let args = if args.is_empty() {
                EnumArgs { clone: true }
            } else {
                parse(args).expect("failed to parse args of #[ast_node]")
            };

            let clone = if args.clone {
                Some(quote!(#[derive(::swc_common::arena::CloneIn)]))
            } else {
                None
            };

            let ident = input.ident.clone();
            let ident = if input.generics.lifetimes().count() > 0 {
                quote!(#ident<'a>)
            } else {
                quote!(#ident)
            };

            item.extend(quote!(
                #[allow(clippy::derive_partial_eq_without_eq)]
                #[cfg_attr(
                    feature = "serde-impl",
                    derive(
                        ::serde::Serialize,
                    )
                )]
                #[derive(
                    ::swc_common::FromVariant,
                    ::swc_common::Spanned,
                    Debug,
                    PartialEq,
                )]
                #clone
                #[cfg_attr(
                    feature = "rkyv-impl",
                    derive(rkyv::Archive, rkyv::Serialize)
                )]
                #[cfg_attr(feature = "rkyv-impl", repr(u32))]
                #[cfg_attr(
                    feature = "rkyv-impl",
                    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
                        __S::Error: rkyv::rancor::Source))
                )]
                #[cfg_attr(
                    feature = "rkyv-impl",
                    rkyv(bytecheck(bounds(
                        __C: rkyv::validation::ArchiveContext,
                        __C::Error: rkyv::rancor::Source
                    )))
                )]
                #[cfg_attr(
                    feature = "serde-impl",
                    serde(untagged)
                )]
                #input
            ));

            // item.extend(quote! {
            //     impl<'a> swc_allocator::IntoWith<'a, Box<'a, #ident>> for
            // #ident {         fn into_with(self, allocator: &'a
            // swc_allocator::Allocator) -> Box<'a, #ident> {
            //             swc_allocator::arena::Box::new_in(self, allocator)
            //         }
            //     }
            // });
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
                        Some(quote!(#[cfg_attr(
                            feature = "serde-impl",
                            serde(tag = "type")
                        )]))
                    } else {
                        None
                    }
                }
                _ => None,
            };

            let serde_rename = args.as_ref().map(|args| {
                let name = &args.ty;

                quote!(#[cfg_attr(
                    feature = "serde-impl",
                    serde(rename = #name)
                )])
            });

            let ast_node_impl = args
                .as_ref()
                .map(|args| ast_node_macro::expand_struct(args.clone(), input.clone()));

            let ident = input.ident.clone();
            let ident = if input.generics.lifetimes().count() > 0 {
                quote!(#ident<'a>)
            } else {
                quote!(#ident)
            };

            item.extend(quote!(
                #[allow(clippy::derive_partial_eq_without_eq)]
                #[derive(::swc_common::Spanned, ::swc_common::arena::CloneIn, Debug, PartialEq)]
                #[cfg_attr(
                    feature = "serde-impl",
                    derive(::serde::Serialize)
                )]
                #[cfg_attr(
                    feature = "rkyv-impl",
                    derive(rkyv::Archive, rkyv::Serialize)
                )]
                #[cfg_attr(
                    feature = "rkyv-impl",
                    rkyv(bytecheck(bounds(
                        __C: rkyv::validation::ArchiveContext,
                        __C::Error: rkyv::rancor::Source
                    )))
                )]
                #[cfg_attr(feature = "rkyv-impl", repr(C))]
                #[cfg_attr(
                    feature = "rkyv-impl",
                    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
                        __S::Error: rkyv::rancor::Source))
                )]
                #serde_tag
                #[cfg_attr(
                    feature = "serde-impl",
                    serde(rename_all = "camelCase")
                )]
                #serde_rename
                #input
            ));

            if let Some(items) = ast_node_impl {
                for item_impl in items {
                    item.extend(item_impl.into_token_stream());
                }
            }

            // item.extend(quote! {
            //     impl<'a> swc_allocator::IntoWith<'a, Box<'a, #ident>> for
            // #ident {         fn into_with(self, allocator: &'a
            // swc_allocator::Allocator) -> Box<'a, #ident> {
            //             swc_allocator::arean::Box::new_in(self, allocator)
            //         }
            //     }
            // });
        }
    };

    print("ast_node", item)
}
