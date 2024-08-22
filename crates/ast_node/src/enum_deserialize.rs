use swc_macros_common::prelude::*;
use syn::{
    parse::{Parse, ParseStream},
    *,
};

struct VariantAttr {
    tags: Punctuated<Lit, Token![,]>,
}

impl Parse for VariantAttr {
    fn parse(input: ParseStream<'_>) -> syn::Result<Self> {
        Ok(VariantAttr {
            tags: input.call(Punctuated::parse_terminated)?,
        })
    }
}

pub fn expand(
    DeriveInput {
        generics,
        ident,
        data,
        ..
    }: DeriveInput,
) -> ItemImpl {
    let data = match data {
        Data::Enum(data) => data,
        _ => unreachable!("expand_enum is called with none-enum item"),
    };

    let mut has_wildcard = false;

    let deserialize = {
        let mut all_tags: Punctuated<_, token::Comma> = Default::default();
        let tag_match_arms = data
            .variants
            .iter()
            .map(|variant| {
                let field_type = match variant.fields {
                    Fields::Unnamed(ref fields) => {
                        assert_eq!(
                            fields.unnamed.len(),
                            1,
                            "#[ast_node] enum cannot contain variant with multiple fields"
                        );

                        fields.unnamed.last().unwrap().ty.clone()
                    }
                    _ => {
                        unreachable!("#[ast_node] enum cannot contain named fields or unit variant")
                    }
                };
                let tags = variant
                    .attrs
                    .iter()
                    .filter_map(|attr| -> Option<VariantAttr> {
                        if !is_attr_name(attr, "tag") {
                            return None;
                        }
                        let tokens = match &attr.meta {
                            Meta::List(meta) => meta.tokens.clone(),
                            _ => {
                                panic!("#[tag] attribute must be in form of #[tag(..)]")
                            }
                        };
                        let tags = parse2(tokens).expect("failed to parse #[tag] attribute");

                        Some(tags)
                    })
                    .flat_map(|v| v.tags)
                    .collect::<Punctuated<_, token::Comma>>();

                assert!(
                    !tags.is_empty(),
                    "All #[ast_node] enum variants have one or more tag"
                );

                // TODO: Clean up this code
                if tags.len() == 1
                    && match tags.first() {
                        Some(Lit::Str(s)) => &*s.value() == "*",
                        _ => false,
                    }
                {
                    has_wildcard = true;
                } else {
                    for tag in tags.iter() {
                        all_tags.push(tag.clone());
                    }
                }

                let vi = &variant.ident;

                Arm {
                    attrs: Default::default(),
                    pat: Pat::Path(parse_quote!(__Field::#vi)),
                    guard: Default::default(),
                    fat_arrow_token: Token![=>](variant.ident.span()),
                    body: parse_quote!(
                        swc_common::private::serde::Result::map(
                            <#field_type as serde::Deserialize>::deserialize(
                                swc_common::private::serde::de::ContentDeserializer::<
                                    __D::Error,
                                >::new(__content),
                            ),
                            Self::#vi,
                        )
                    ),
                    comma: Some(Token![,](variant.ident.span())),
                }
            })
            .collect::<Vec<Arm>>();

        let deserialize_body: Expr = {
            let mut visit_str_arms = Vec::new();
            let mut visit_bytes_arms = Vec::new();

            for variant in &data.variants {
                let tags = variant
                    .attrs
                    .iter()
                    .filter_map(|attr| -> Option<VariantAttr> {
                        if !is_attr_name(attr, "tag") {
                            return None;
                        }
                        let tokens = match &attr.meta {
                            Meta::List(meta) => meta.tokens.clone(),
                            _ => {
                                panic!("#[tag] attribute must be in form of #[tag(..)]")
                            }
                        };
                        let tags = parse2(tokens).expect("failed to parse #[tag] attribute");

                        Some(tags)
                    })
                    .flat_map(|v| v.tags)
                    .collect::<Punctuated<_, token::Comma>>();

                assert!(
                    !tags.is_empty(),
                    "All #[ast_node] enum variants have one or more tag"
                );
                let (str_pat, bytes_pat) = {
                    if tags.len() == 1
                        && match tags.first() {
                            Some(Lit::Str(s)) => &*s.value() == "*",
                            _ => false,
                        }
                    {
                        (
                            Pat::Wild(PatWild {
                                attrs: Default::default(),
                                underscore_token: Token![_](variant.ident.span()),
                            }),
                            Pat::Wild(PatWild {
                                attrs: Default::default(),
                                underscore_token: Token![_](variant.ident.span()),
                            }),
                        )
                    } else {
                        fn make_pat(lit: Lit) -> (Pat, Pat) {
                            let s = match lit.clone() {
                                Lit::Str(s) => s.value(),
                                _ => {
                                    unreachable!()
                                }
                            };
                            (
                                Pat::Lit(PatLit {
                                    attrs: Default::default(),
                                    lit,
                                }),
                                Pat::Lit(PatLit {
                                    attrs: Default::default(),
                                    lit: Lit::ByteStr(LitByteStr::new(s.as_bytes(), call_site())),
                                }),
                            )
                        }
                        if tags.len() == 1 {
                            make_pat(tags.first().unwrap().clone())
                        } else {
                            let mut str_cases = Punctuated::new();
                            let mut bytes_cases = Punctuated::new();

                            for tag in tags {
                                let (str_pat, bytes_pat) = make_pat(tag.clone());
                                str_cases.push(str_pat);
                                bytes_cases.push(bytes_pat);
                            }

                            (
                                Pat::Or(PatOr {
                                    attrs: Default::default(),
                                    leading_vert: Default::default(),
                                    cases: str_cases,
                                }),
                                Pat::Or(PatOr {
                                    attrs: Default::default(),
                                    leading_vert: Default::default(),
                                    cases: bytes_cases,
                                }),
                            )
                        }
                    }
                };
                visit_str_arms.push(Arm {
                    attrs: Default::default(),
                    pat: str_pat,
                    guard: None,
                    fat_arrow_token: Token![=>](variant.ident.span()),
                    body: {
                        let vi = &variant.ident;

                        parse_quote!(Ok(__Field::#vi))
                    },
                    comma: Some(Token![,](variant.ident.span())),
                });
                visit_bytes_arms.push(Arm {
                    attrs: Default::default(),
                    pat: bytes_pat,
                    guard: None,
                    fat_arrow_token: Token![=>](variant.ident.span()),
                    body: {
                        let vi = &variant.ident;

                        parse_quote!(Ok(__Field::#vi))
                    },
                    comma: Some(Token![,](variant.ident.span())),
                });
            }

            if !has_wildcard {
                visit_str_arms.push(Arm {
                    attrs: Default::default(),
                    pat: Pat::Wild(PatWild {
                        attrs: Default::default(),
                        underscore_token: Token![_](ident.span()),
                    }),
                    guard: None,
                    fat_arrow_token: Token![=>](ident.span()),
                    body: parse_quote!(swc_common::private::serde::Err(
                        serde::de::Error::unknown_variant(__value, VARIANTS,)
                    )),
                    comma: Some(Token![,](ident.span())),
                });
                visit_bytes_arms.push(Arm {
                    attrs: Default::default(),
                    pat: Pat::Wild(PatWild {
                        attrs: Default::default(),
                        underscore_token: Token!(_)(ident.span()),
                    }),
                    guard: None,
                    fat_arrow_token: Token![=>](ident.span()),
                    body: parse_quote!({
                        let __value = &swc_common::private::serde::from_utf8_lossy(__value);
                        swc_common::private::serde::Err(serde::de::Error::unknown_variant(
                            __value, VARIANTS,
                        ))
                    }),
                    comma: Some(Token![,](ident.span())),
                });
            }

            let description = format!("AST enum {}", ident);

            let field_variants = data
                .variants
                .iter()
                .map(|v| v.ident.clone())
                .collect::<Vec<_>>();

            let visit_u64_arms = data
                .variants
                .iter()
                .enumerate()
                .map(|(idx, v)| {
                    let idx = idx as u64;
                    let ident = &v.ident;
                    {
                        parse_quote!(
                            #idx => {
                                Ok(__Field::#ident)
                            }
                        )
                    }
                })
                .collect::<Vec<Arm>>();

            let tag_match_arms = data
                .variants
                .iter()
                .map(|v| {
                    let vi = &v.ident;
                    let ty = &v.fields.iter().last().unwrap().ty;

                    parse_quote!(
                        __Field::#vi => {
                            swc_common::private::serde::Result::map(
                                <#ty as serde::Deserialize>::deserialize(__deserializer),
                                #ident::#vi,
                            )
                        }
                    )
                })
                .collect::<Vec<Arm>>();

            let expected_variant_index = format!("variant index 0 <= i < {}", data.variants.len());

            parse_quote!({
                #[allow(non_camel_case_types)]
                #[doc(hidden)]
                enum __Field {
                    #(#field_variants),*
                }

                #[doc(hidden)]
                struct __FieldVisitor;

                impl<'de> serde::de::Visitor<'de> for __FieldVisitor {
                    type Value = __Field;
                    fn expecting(
                        &self,
                        __formatter: &mut swc_common::private::serde::Formatter,
                    ) -> swc_common::private::serde::fmt::Result {
                        swc_common::private::serde::Formatter::write_str(
                            __formatter,
                            "variant identifier",
                        )
                    }
                    fn visit_u64<__E>(
                        self,
                        __value: u64,
                    ) -> swc_common::private::serde::Result<Self::Value, __E>
                    where
                        __E: serde::de::Error,
                    {
                        match __value {
                            #(#visit_u64_arms),*
                            _ => {
                                swc_common::private::serde::Err(
                                    serde::de::Error::invalid_value(
                                        serde::de::Unexpected::Unsigned(__value),
                                        &#expected_variant_index,
                                    ),
                                )
                            }
                        }
                    }
                    fn visit_str<__E>(
                        self,
                        __value: &str,
                    ) -> swc_common::private::serde::Result<Self::Value, __E>
                    where
                        __E: serde::de::Error,
                    {
                        match __value {
                            #(#visit_str_arms)*
                        }
                    }
                    fn visit_bytes<__E>(
                        self,
                        __value: &[u8],
                    ) -> swc_common::private::serde::Result<Self::Value, __E>
                    where
                        __E: serde::de::Error,
                    {
                        match __value {
                            #(#visit_bytes_arms)*
                        }
                    }
                }
                impl<'de> serde::Deserialize<'de> for __Field {
                    #[inline]
                    fn deserialize<__D>(
                        __deserializer: __D,
                    ) -> swc_common::private::serde::Result<Self, __D::Error>
                    where
                        __D: serde::Deserializer<'de>,
                    {
                        serde::Deserializer::deserialize_identifier(
                            __deserializer,
                            __FieldVisitor,
                        )
                    }
                }

                let (__tag, __content) = serde::Deserializer::deserialize_any(
                    __deserializer,
                    swc_common::private::serde::de::TaggedContentVisitor::<
                        __Field,
                    >::new("type", #description),
                )?;
                let __deserializer = swc_common::private::serde::de::ContentDeserializer::<
                    __D::Error,
                >::new(__content);
                match __tag {
                    #(#tag_match_arms)*
                }
            })
        };

        let item: ItemImpl = parse_quote!(
            #[cfg(feature = "serde-impl")]
            impl<'de> serde::Deserialize<'de> for #ident {
                #[allow(unreachable_code)]
                fn deserialize<__D>(__deserializer: __D) -> ::std::result::Result<Self, __D::Error>
                where
                    __D: serde::Deserializer<'de>,
                {
                    #deserialize_body
                }
            }
        );

        item.with_generics(generics)
    };

    deserialize
}
