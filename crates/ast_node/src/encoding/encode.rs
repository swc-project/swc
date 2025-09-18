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
            let fields = data.fields.iter()
                .enumerate()
                .map(|(idx, field)| -> syn::Stmt {
                    let fieldpath: syn::ExprField = match field.ident.as_ref() {
                        Some(name) => syn::parse_quote!(self.#name),
                        None => syn::parse_quote!(self.#idx)
                    };
                    
                    match is_with(&field.attrs) {
                        Some(with_type) => syn::parse_quote!{
                            cbor4ii::core::enc::Encode::encode(&#with_type(&#fieldpath), writer)?;
                        },
                        None => syn::parse_quote!{
                            cbor4ii::core::enc::Encode::encode(&#fieldpath, writer)?;
                        }
                    }
                });
            let count = data.fields.len();
            let head: Option<syn::Stmt> =  (count != 1).then(|| syn::parse_quote!{
                <cbor4ii::core::types::Array<()>>::bounded(#count, writer)?;
            });
            
            syn::parse_quote! {
                impl cbor4ii::core::enc::Encode for #ident {
                    #[inline]
                    fn encode<W: cbor4ii::core::enc::Write>(&self, writer: &mut W)
                        -> Result<(), cbor4ii::core::error::EncodeError<W::Error>>
                    {
                        #head
                        #(#fields)*;
                        Ok(())
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
                assert!(unknown.discriminant.is_none(), "custom discriminant is not allowed");
                assert!(is_with(&unknown.attrs).is_none(), "unknown member is not allowed with type");
                
                match &unknown.fields {
                    syn::Fields::Unnamed(fields) => {
                        match fields.unnamed.len() {
                            1 => {
                                is_unit = Some(true);
                
                                Some(syn::parse_quote!{
                                    #ident::#name(tag) => {
                                        cbor4ii::core::types::Array::bounded(1, writer)?;
                                        cbor4ii::core::enc::Encode::encode(&tag, writer)?;
                                    },
                                })
                            },
                            2 => {
                                is_unit = Some(false);
                
                                Some(syn::parse_quote!{
                                    #ident::#name(tag, value) => {
                                        cbor4ii::core::types::Array::bounded(2, writer)?;
                                        cbor4ii::core::enc::Encode::encode(&tag, writer)?;
                                        cbor4ii::core::enc::Encode::encode(&*value, writer)?;
                                    },
                                })
                            },
                            _ => panic!("unknown member must be a tag and a value")
                        }
                    },
                    _ => panic!("named enum unsupported")
                }
            } else {
                None
            };
            
            let fields = iter
                .enumerate()
                .map(|(idx, field)| -> syn::Arm {
                    let idx = idx + 1; // skip zero
                    let idx: u32 = idx.try_into().expect("enum tags must not exceed 32 bits");
                    let name = &field.ident;

                    assert!(field.discriminant.is_none(), "custom discriminant is not allowed");
                    assert!(!is_unknown(&field.attrs), "unknown member must be first: {:?}", field.attrs.len());

                    match &field.fields {
                        syn::Fields::Unnamed(fields) => {
                            if fields.unnamed.len() != 1 {
                                panic!("enum member only allows one field");
                            }

                            if *is_unit.get_or_insert(false) {
                                panic!("the number of fields in member must be consistent");
                            }

                            let value: syn::Stmt = match is_with(&field.attrs) {
                                Some(ty) => syn::parse_quote!{
                                    cbor4ii::core::enc::Encode::encode(&#ty(&*value), writer)?;
                                },
                                None => syn::parse_quote!{
                                    cbor4ii::core::enc::Encode::encode(&*value, writer)?;
                                }
                            };

                            syn::parse_quote!{
                                #ident::#name(value) => {
                                    cbor4ii::core::types::Array::bounded(2, writer)?;
                                    cbor4ii::core::enc::Encode::encode(&#idx, writer)?;
                                    #value
                                },
                            }
                        },
                        syn::Fields::Unit => {
                            if !*is_unit.get_or_insert(true) {
                                panic!("the number of fields in member must be consistent");
                            }
                            assert!(is_with(&field.attrs).is_none(), "unit member is not allowed with type");

                            syn::parse_quote!{
                                #ident::#name => {
                                    cbor4ii::core::types::Array::bounded(1, writer)?;
                                    cbor4ii::core::enc::Encode::encode(&#idx, writer)?;
                                },
                            }
                        },
                        syn::Fields::Named(_) => panic!("named enum unsupported")
                    }
                });
            
            syn::parse_quote!{
                impl cbor4ii::core::enc::Encode for #ident {
                    #[inline]
                    fn encode<W: cbor4ii::core::enc::Write>(&self, writer: &mut W)
                        -> Result<(), cbor4ii::core::error::EncodeError<W::Error>>
                    {
                        match self {
                            #(#fields)*
                            #unknown_arm
                        }
                        Ok(())
                    }
                }
            }
        },
        Data::Union(_) => panic!("union unsupported")
    }
}
