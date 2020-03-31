use parse::Args;
use proc_macro::TokenStream;
use proc_macro2::{Span, TokenStream as TokenStream2};
use quote::quote;

pub mod parse;

fn refs(n: usize) -> TokenStream2 {
    let mut refs = TokenStream2::new();
    for _ in 0..n {
        refs.extend(quote![&]);
    }
    refs
}

pub fn spez_impl(args: Args) -> TokenStream2 {
    let mut traits = TokenStream2::new();

    let param_def = match args.param {
        Some(param) => quote! {
            let #param = self.0.take().unwrap();
        },
        None => quote! {},
    };

    let n_arms = args.arms.len();

    for (i, arm) in args.arms.into_iter().enumerate() {
        let name = syn::Ident::new(&format!("Match{}", i + 1), Span::call_site());
        let body = arm.body;
        let ty = arm.ty;
        let generics = &arm.generics;
        let where_clause = &arm.generics.where_clause;
        let refs = refs(n_arms - i - 1);
        let return_type = match arm.return_type {
            Some(return_type) => quote! { #return_type },
            None => quote! { () },
        };

        traits.extend(quote! {
            trait #name {
                type Return;
                fn spez(&self) -> Self::Return;
            }
            impl #generics #name for #refs Match<#ty> #where_clause {
                type Return = #return_type;
                fn spez(&self) -> Self::Return {
                    #param_def
                    #body
                }
            }
        });
    }

    let expr = args.expr;
    let refs = refs(n_arms);

    quote! {
        {
            struct Match<T>(core::cell::Cell<Option<T>>);
            #traits
            (#refs Match(core::cell::Cell::new(Some(#expr)))).spez()
        }
    }
}
