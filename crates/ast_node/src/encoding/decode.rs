use syn::{ DeriveInput, Data };
use super::{ is_unknown, is_with };

pub fn expand(
    DeriveInput {
        ident,
        data,
        ..
    }: DeriveInput,
) -> syn::ItemImpl {
    match data {
        Data::Struct(data) => {
            let is_named = data.fields.iter().any(|field| field.ident.is_some());

            let fields = data.fields.iter()
                .enumerate()
                .map(|(idx, field)| -> syn::Stmt {
                    let ty = &field.ty;
                    let value: syn::Expr = match is_with(&field.attrs) {
                        Some(with_type) => syn::parse_quote!(<#with_type<#ty> as cbor4ii::core::dec::Decode<'_>>::decode(reader)?.0),
                        None => syn::parse_quote!(<#ty as cbor4ii::core::dec::Decode<'_>>::decode(reader)?)
                    };
                    
                    match field.ident.as_ref() {
                        Some(name) => syn::parse_quote!{
                            let #name = #value;
                        },
                        None => {
                            let name = format!("unit{}", idx);
                            syn::parse_quote!{
                                let #name = #value;
                            }
                        }
                    }
                });
            let build_struct = data.fields.iter()
                .enumerate()
                .map(|(idx, field)| -> syn::FieldValue {
                    match field.ident.as_ref() {
                        Some(name) => syn::parse_quote!(#name),
                        None => {
                            let name = format!("unit{}", idx);
                            syn::parse_quote!(#name)
                        }
                    }
                })
                .collect::<syn::punctuated::Punctuated<_, syn::Token![,]>>();
            let build_struct: syn::ExprStruct = if is_named {
                syn::parse_quote!{
                    #ident { #build_struct }
                }
            } else {
                syn::parse_quote!{
                    #ident(#build_struct)
                }
            };

            let count = data.fields.len();
            let head: Option<syn::Expr> = (count != 1).then(|| syn::parse_quote!{{
                let n = <cbor4ii::core::types::Array<()>>::len(reader)?;
                debug_assert_eq!(n, Some(#count));
            }});
            
            syn::parse_quote! {
                impl<'de> cbor4ii::core::dec::Decode<'de> for #ident {
                    #[inline]
                    fn decode<R: cbor4ii::core::dec::Read<'de>>(reader: &mut R)
                        -> Result<Self, cbor4ii::core::error::DecodeError<R::Error>>
                    {
                        #head;
                        #(#fields)*
                        Ok(#build_struct)
                    }
                }
            }
        },
        Data::Enum(data) => {
            let mut iter = data.variants.iter().peekable();
            let mut is_unit = None;

            assert!(!data.variants.is_empty(), "empty enums are not allowed");

            let unknown_arm: Option<syn::Arm> = if let Some(unknown) =
                iter.next_if(|variant| is_unknown(&variant.attrs))
            {
                let name = &unknown.ident;
                assert!(unknown.discriminant.is_none(), "custom discriminant unsupport");
                assert!(is_with(&unknown.attrs).is_none(), "unknown member is not allowed with type");
                
                Some(match &unknown.fields {
                    syn::Fields::Unnamed(fields) => {
                        match fields.unnamed.len() {
                            1 => {
                                is_unit = Some(true);
                                syn::parse_quote!{
                                    tag => #ident::#name(tag),
                                }
                            },
                            2 => {
                                is_unit = Some(false);
                                let val_ty = &fields.unnamed[1].ty;
                
                                syn::parse_quote!{
                                    tag => {
                                        let val = <#val_ty as cbor4ii::core::dec::Decode<'_>>::decode(reader)?;
                                        #ident::#name(tag, val)
                                    },
                                }
                            },
                            _ => panic!("unknown member must be a tag and a value")
                        }
                    },
                    _ => panic!("named enum unsupported")
                })
            } else {
                None
            };
            
            let fields = iter
                .enumerate()
                .map(|(idx, field)| -> syn::Arm {
                    let idx: u32 = idx.try_into().expect("enum tag max 32bit");
                    let idx = idx + 1; // skip zero
                    let name = &field.ident;

                    assert!(field.discriminant.is_none(), "custom discriminant unsupport");
                    assert!(!is_unknown(&field.attrs), "unknown member must be first");

                    match &field.fields {
                        syn::Fields::Unnamed(fields) => {
                            if fields.unnamed.len() != 1 {
                                panic!("enum member only allows one field");
                            }

                            if *is_unit.get_or_insert(false) != false {
                                panic!("The number of fields in member must be consistent");
                            }
                            let val_ty = &fields.unnamed[0].ty;
                            let value: syn::Expr = match is_with(&field.attrs) {
                                Some(with_type) => syn::parse_quote!(<#with_type<#val_ty> as cbor4ii::core::dec::Decode<'_>>::decode(reader)?.0),
                                None => syn::parse_quote!(<#val_ty as cbor4ii::core::dec::Decode<'_>>::decode(reader)?)
                            };                            

                            syn::parse_quote!{
                                #idx => {
                                    let val = #value;
                                    #ident::#name(val)
                                },
                            }
                        },
                        syn::Fields::Unit => {
                            if *is_unit.get_or_insert(true) != true {
                                panic!("The number of fields in member must be consistent");
                            }
                            assert!(is_with(&field.attrs).is_none(), "unit member is not allowed with type");

                            syn::parse_quote!{
                                #idx => #ident::#name,
                            }
                        },
                        syn::Fields::Named(_) => panic!("named enum unsupported")
                    }
                })
                .collect::<Vec<_>>();

            let unknown_arm = match unknown_arm {
                Some(arm) => arm,
                None => {
                    syn::parse_quote!{
                        _ => {
                            let err = cbor4ii::core::error::DecodeError::Mismatch {
                                 name: &stringify!(#ident),
                                 found: 0
                            };
                            return Err(err);
                        }
                    }                    
                }
            };

            let head: syn::Expr = {
                let count: usize = match is_unit {
                    Some(true) => 1,
                    Some(false) => 2,
                    None => panic!()
                };
                syn::parse_quote!{{
                    let n = <cbor4ii::core::types::Array<()>>::len(reader)?;
                    debug_assert_eq!(n, Some(#count));
                }}
            };
            
            syn::parse_quote!{
                impl<'de> cbor4ii::core::dec::Decode<'de> for #ident {
                    #[inline]
                    fn decode<R: cbor4ii::core::dec::Read<'de>>(reader: &mut R)
                        -> Result<Self, cbor4ii::core::error::DecodeError<R::Error>>
                    {
                        #head;
                        let tag = <u32 as cbor4ii::core::dec::Decode<'_>>::decode(reader)?;
                        let value = match tag {
                            #(#fields)*
                            #unknown_arm
                        };
                        Ok(value)
                    }
                }
            }
        },
        Data::Union(_) => panic!("union unsupported")
    }
}
