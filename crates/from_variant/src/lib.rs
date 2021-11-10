extern crate proc_macro;

use pmutil::{smart_quote, Quote, ToTokensExt};
use swc_macros_common::prelude::*;
use syn::*;

#[proc_macro_derive(FromVariant)]
pub fn derive_from_variant(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");

    let item = derive(input)
        .into_iter()
        .fold(TokenStream::new(), |mut t, item| {
            item.to_tokens(&mut t);
            t
        });

    print("derive(FromVariant)", item.dump())
}

fn derive(
    DeriveInput {
        generics,
        data,
        ident,
        ..
    }: DeriveInput,
) -> Vec<ItemImpl> {
    let variants = match data {
        Data::Enum(DataEnum { variants, .. }) => variants,
        _ => panic!("#[derive(FromVariant)] only works for an enum."),
    };

    let mut from_impls: Vec<ItemImpl> = vec![];

    for v in variants {
        let variant_name = v.ident;
        match v.fields {
            Fields::Unnamed(FieldsUnnamed { unnamed, .. }) => {
                if unnamed.len() != 1 {
                    panic!(
                        "#[derive(FromVariant)] requires all variants to be tuple with exactly \
                         one field"
                    )
                }
                let field = unnamed.into_iter().next().unwrap();

                let from_impl = Quote::new(def_site::<Span>())
                    .quote_with(smart_quote!(
                        Vars {
                            VariantType: field.ty,
                            Variant: variant_name,
                            Type: &ident,
                        },
                        {
                            impl From<VariantType> for Type {
                                fn from(v: VariantType) -> Self {
                                    Type::Variant(v)
                                }
                            }
                        }
                    ))
                    .parse();

                from_impls.push(from_impl);
            }
            _ => panic!(
                "#[derive(FromVariant)] requires all variants to be tuple with exactly one field"
            ),
        }
    }

    from_impls
        .into_iter()
        .map(|item| item.with_generics(generics.clone()))
        .collect()
}
