use pmutil::{q, smart_quote, Quote, SpanExt};
use swc_macros_common::prelude::*;
use syn::{
    self,
    parse::{Parse, ParseStream},
    *,
};

struct VariantAttr {
    _paren_token: token::Paren,
    tags: Punctuated<Lit, Token![,]>,
}

impl Parse for VariantAttr {
    fn parse(input: ParseStream<'_>) -> syn::Result<Self> {
        let content;
        let _paren_token = parenthesized!(content in input);
        Ok(VariantAttr {
            _paren_token,
            tags: content.parse_terminated(Lit::parse)?,
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
                        let tags =
                            parse2(attr.tokens.clone()).expect("failed to parse #[tag] attribute");

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

                Arm {
                    attrs: Default::default(),
                    pat: q!(
                        Vars {
                            Variant: &variant.ident
                        },
                        (__TypeVariant::Variant)
                    )
                    .parse(),
                    guard: Default::default(),
                    fat_arrow_token: variant.ident.span().as_token(),
                    body: q!(
                        Vars {
                            Variant: &variant.ident,
                            FieldType: field_type,
                        },
                        {
                            swc_common::private::serde::Result::map(
                                <FieldType as serde::Deserialize>::deserialize(
                                    swc_common::private::serde::de::ContentDeserializer::<
                                        __D::Error,
                                    >::new(__content),
                                ),
                                Self::Variant,
                            )
                        }
                    )
                    .parse(),
                    comma: Some(variant.ident.span().as_token()),
                }
            })
            .collect::<Vec<Arm>>();

        let tag_expr = {
            let mut visit_str_arms = vec![];
            let mut visit_bytes_arms = vec![];

            for variant in &data.variants {
                let tags = variant
                    .attrs
                    .iter()
                    .filter_map(|attr| -> Option<VariantAttr> {
                        if !is_attr_name(attr, "tag") {
                            return None;
                        }
                        let tags =
                            parse2(attr.tokens.clone()).expect("failed to parse #[tag] attribute");

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
                                underscore_token: variant.ident.span().as_token(),
                            }),
                            Pat::Wild(PatWild {
                                attrs: Default::default(),
                                underscore_token: variant.ident.span().as_token(),
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
                                    expr: Box::new(Expr::Lit(ExprLit {
                                        attrs: Default::default(),
                                        lit,
                                    })),
                                }),
                                Pat::Lit(PatLit {
                                    attrs: Default::default(),
                                    expr: Box::new(Expr::Lit(ExprLit {
                                        attrs: Default::default(),
                                        lit: Lit::ByteStr(LitByteStr::new(
                                            s.as_bytes(),
                                            call_site(),
                                        )),
                                    })),
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
                    fat_arrow_token: variant.ident.span().as_token(),
                    body: q!(
                        Vars {
                            Variant: &variant.ident,
                        },
                        { Ok(__TypeVariant::Variant) }
                    )
                    .parse(),
                    comma: Some(variant.ident.span().as_token()),
                });
                visit_bytes_arms.push(Arm {
                    attrs: Default::default(),
                    pat: bytes_pat,
                    guard: None,
                    fat_arrow_token: variant.ident.span().as_token(),
                    body: q!(
                        Vars {
                            Variant: &variant.ident,
                        },
                        { Ok(__TypeVariant::Variant) }
                    )
                    .parse(),
                    comma: Some(variant.ident.span().as_token()),
                });
            }

            if !has_wildcard {
                visit_str_arms.push(Arm {
                    attrs: Default::default(),
                    pat: Pat::Wild(PatWild {
                        attrs: Default::default(),
                        underscore_token: ident.span().as_token(),
                    }),
                    guard: None,
                    fat_arrow_token: ident.span().as_token(),
                    body: q!({
                        swc_common::private::serde::Err(serde::de::Error::unknown_variant(
                            __value, VARIANTS,
                        ))
                    })
                    .parse(),
                    comma: Some(ident.span().as_token()),
                });
                visit_bytes_arms.push(Arm {
                    attrs: Default::default(),
                    pat: Pat::Wild(PatWild {
                        attrs: Default::default(),
                        underscore_token: ident.span().as_token(),
                    }),
                    guard: None,
                    fat_arrow_token: ident.span().as_token(),
                    body: q!({
                        {
                            let __value = &swc_common::private::serde::from_utf8_lossy(__value);
                            swc_common::private::serde::Err(serde::de::Error::unknown_variant(
                                __value, VARIANTS,
                            ))
                        }
                    })
                    .parse(),
                    comma: Some(ident.span().as_token()),
                });
            }

            let visit_str_body = Expr::Match(ExprMatch {
                attrs: Default::default(),
                match_token: call_site(),
                expr: q!((__value)).parse(),
                brace_token: call_site(),
                arms: visit_str_arms,
            });
            let visit_bytes_body = Expr::Match(ExprMatch {
                attrs: Default::default(),
                match_token: call_site(),
                expr: q!((__value)).parse(),
                brace_token: call_site(),
                arms: visit_bytes_arms,
            });

            q!(
                Vars {
                    visit_str_body,
                    visit_bytes_body,
                    all_tags: &all_tags,
                },
                {
                    {
                        static VARIANTS: &[&str] = &[all_tags];

                        struct __TypeVariantVisitor;

                        impl<'de> serde::de::Visitor<'de> for __TypeVariantVisitor {
                            type Value = __TypeVariant;
                            fn expecting(
                                &self,
                                __formatter: &mut swc_common::private::serde::Formatter,
                            ) -> swc_common::private::serde::fmt::Result
                            {
                                swc_common::private::serde::Formatter::write_str(
                                    __formatter,
                                    "variant identifier",
                                )
                            }

                            fn visit_str<__E>(
                                self,
                                __value: &str,
                            ) -> swc_common::private::serde::Result<Self::Value, __E>
                            where
                                __E: serde::de::Error,
                            {
                                visit_str_body
                            }

                            fn visit_bytes<__E>(
                                self,
                                __value: &[u8],
                            ) -> swc_common::private::serde::Result<Self::Value, __E>
                            where
                                __E: serde::de::Error,
                            {
                                visit_bytes_body
                            }
                        }

                        impl<'de> serde::Deserialize<'de> for __TypeVariant {
                            #[inline]
                            fn deserialize<__D>(
                                __deserializer: __D,
                            ) -> swc_common::private::serde::Result<Self, __D::Error>
                            where
                                __D: serde::Deserializer<'de>,
                            {
                                serde::Deserializer::deserialize_identifier(
                                    __deserializer,
                                    __TypeVariantVisitor,
                                )
                            }
                        }

                        let ty = swc_common::serializer::Type::deserialize(
                            swc_common::private::serde::de::ContentRefDeserializer::<__D::Error>::new(
                                &__content,
                            ),
                        )?;

                        let __tagged = __TypeVariant::deserialize(
                            swc_common::private::serde::de::ContentDeserializer::<__D::Error>::new(
                                swc_common::private::serde::de::Content::Str(&ty.ty),
                            )
                        )?;

                        __tagged
                    }
                }
            )
            .parse::<Expr>()
        };

        let match_type_expr = Expr::Match(ExprMatch {
            attrs: Default::default(),
            match_token: call_site(),
            expr: q!({ __tagged }).parse(),
            brace_token: call_site(),
            arms: tag_match_arms,
        });

        let variants: Punctuated<Variant, Token![,]> = {
            data.variants
                .iter()
                .cloned()
                .map(|variant| Variant {
                    attrs: Default::default(),
                    fields: Fields::Unit,
                    ..variant
                })
                .collect()
        };
        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    match_type_expr,
                    Enum: &ident,
                    tag_expr,
                    variants
                },
                {
                    impl<'de> serde::Deserialize<'de> for Enum {
                        #[allow(unreachable_code)]
                        fn deserialize<__D>(
                            __deserializer: __D,
                        ) -> ::std::result::Result<Self, __D::Error>
                        where
                            __D: serde::Deserializer<'de>,
                        {
                            enum __TypeVariant {
                                variants,
                            }

                            let __content = <swc_common::private::serde::de::Content as serde::Deserialize>::deserialize(
                                __deserializer,
                            )?;

                            let __tagged = tag_expr;

                            match_type_expr
                        }
                    }
                }
            ))
            .parse::<ItemImpl>()
            .with_generics(generics)
    };

    deserialize
}
