use quote::{format_ident, quote};
use swc_macros_common::prelude::*;
use syn::{parse_quote, DeriveInput, GenericParam, Ident, ItemImpl};

pub fn derive(input: DeriveInput) -> ItemImpl {
    let ty_ident = input.ident;
    let has_lifetime = input
        .generics
        .params
        .iter()
        .any(|p| matches!(p, GenericParam::Lifetime(_)));
    match input.data {
        syn::Data::Struct(data_struct) => {
            let (alloc_ident, body) = if data_struct.fields.is_empty() {
                (format_ident!("_"), quote!(#ty_ident))
            } else {
                let mut is_tuple = false;
                let fields = data_struct.fields.into_iter().enumerate().map(|(index, field)| {
                    let ident = field.ident;
                    if let Some(ident) = ident {
                        quote!(#ident: swc_allocator::arena::CloneIn::clone_in(&self.#ident, allocator))
                    } else {
                        is_tuple = true;
                        let index = syn::Index::from(index);
                        quote!(swc_allocator::arena::CloneIn::clone_in(&self.#index, allocator))
                    }
                }).collect::<Vec<_>>();
                (
                    format_ident!("allocator"),
                    if is_tuple {
                        quote!(#ty_ident(#(#fields),* ))
                    } else {
                        quote!(#ty_ident { #(#fields),* })
                    },
                )
            };
            impl_clone_in(&ty_ident, has_lifetime, &alloc_ident, &body)
        }
        syn::Data::Enum(data_enum) => {
            let mut need_alloc = false;
            let matches = data_enum.variants.into_iter().map(|variant| {
                let ident = variant.ident;
                if variant.fields.is_empty() {
                    quote!(Self :: #ident => #ty_ident :: #ident)
                } else {
                    need_alloc = true;
                    quote!(Self :: #ident(it) => #ty_ident :: #ident(swc_allocator::arena::CloneIn::clone_in(it, allocator)))
                }
            }).collect::<Vec<_>>();
            let alloc_ident = if need_alloc {
                format_ident!("allocator")
            } else {
                format_ident!("_")
            };
            let body = quote! {
                match self {
                    #(#matches),*
                }
            };

            impl_clone_in(&ty_ident, has_lifetime, &alloc_ident, &body)
        }
        syn::Data::Union(_) => unimplemented!(),
    }
}

fn impl_clone_in(
    ty_ident: &Ident,
    has_lifetime: bool,
    alloc_ident: &Ident,
    body: &TokenStream,
) -> ItemImpl {
    if has_lifetime {
        parse_quote! {
            impl <'old_alloc, 'new_alloc> swc_allocator::arena::CloneIn<'new_alloc> for #ty_ident<'old_alloc> {
                type Cloned = #ty_ident<'new_alloc>;
                fn clone_in(&self, #alloc_ident: &'new_alloc swc_allocator::arena::Allocator) -> Self::Cloned {
                    #body
                }
            }
        }
    } else {
        parse_quote! {
            impl <'alloc> swc_allocator::arena::CloneIn<'alloc> for #ty_ident {
                type Cloned = #ty_ident;
                fn clone_in(&self, #alloc_ident: &'alloc swc_allocator::arena::Allocator) -> Self::Cloned {
                    #body
                }
            }
        }
    }
}
