use pmutil::{q, smart_quote, Quote};
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
) -> Vec<ItemImpl> {
    let data = match data {
        Data::Enum(data) => data,
        _ => unreachable!("expand_enum is called with none-enum item"),
    };

    let deserialize = {
        let mut all_tags: Punctuated<_, token::Comma> = Default::default();
        let match_type = data
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
                if tags.len() == 1
                    && match tags.first() {
                        Some(Lit::Str(s)) => &*s.value() == "*",
                        _ => false,
                    }
                {
                    Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars {
                                Enum: &ident,
                                Variant: &variant.ident,
                                VariantFieldType: &field_type,
                            },
                            {
                                match std::result::Result::map(
                                    <VariantFieldType as serde::Deserialize>::deserialize(
                                        swc_common::private::serde::de::ContentRefDeserializer::<D::Error>::new(
                                            &content,
                                        ),
                                    ),
                                    Enum::Variant,
                                ) {
                                    Ok(v) => return Ok(v),
                                    Err(err) => return Err(err),
                                }
                            }
                        ))
                        .parse()
                } else {
                    for tag in tags.iter() {
                        all_tags.push(tag.clone());
                    }
                    Quote::new_call_site()
                        .quote_with(smart_quote!(
                            Vars {
                                Enum: &ident,
                                Variant: &variant.ident,
                                VariantFieldType: &field_type,
                                tags,
                            },
                            {
                                {
                                    const TAGS: &[&str] = &[tags];
                                    if TAGS.contains(&&*ty.ty) {
                                        return std::result::Result::map(
                                            <VariantFieldType as serde::Deserialize>::deserialize(
                                                swc_common::private::serde::de::ContentRefDeserializer::<
                                                    D::Error,
                                                >::new(
                                                    &content
                                                ),
                                            ),
                                            Enum::Variant,
                                        );
                                    }
                                }
                            }
                        ))
                        .parse()
                }
            })
            .collect::<Vec<Expr>>();

        let mut match_type_expr = Quote::new_call_site();
        for expr in match_type {
            match_type_expr = match_type_expr.quote_with(smart_quote!(Vars { expr }, { expr }));
        }

        match_type_expr = match_type_expr.quote_with(smart_quote!(Vars { all_tags }, {
            return Err(serde::de::Error::unknown_variant(&ty.ty, &[all_tags]));
        }));

        let tag_expr = {
            q!(Vars {}, {
                {
                    enum __TypeVariant {}
                    struct __TypeVariantVisitor;

                    impl<'de> serde::de::Visitor<'de> for __FieldVisitor {
                        type Value = __TypeVariant;
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
                                0u64 => swc_common::private::serde::Ok(__Field::__field0),
                                1u64 => swc_common::private::serde::Ok(__Field::__field1),
                                _ => swc_common::private::serde::Err(
                                    serde::de::Error::invalid_value(
                                        serde::de::Unexpected::Unsigned(__value),
                                        &"variant index 0 <= i < 2",
                                    ),
                                ),
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
                                "Request" => swc_common::private::serde::Ok(__Field::__field0),
                                "Response" => swc_common::private::serde::Ok(__Field::__field1),
                                _ => swc_common::private::serde::Err(
                                    serde::de::Error::unknown_variant(__value, VARIANTS),
                                ),
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
                                b"Request" => swc_common::private::serde::Ok(__Field::__field0),
                                b"Response" => swc_common::private::serde::Ok(__Field::__field1),
                                _ => {
                                    let __value =
                                        &swc_common::private::serde::from_utf8_lossy(__value);
                                    swc_common::private::serde::Err(
                                        serde::de::Error::unknown_variant(__value, VARIANTS),
                                    )
                                }
                            }
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

                    let __tagged = match serde::Deserializer::deserialize_any(
                        __deserializer,
                        swc_common::private::serde::de::TaggedContentVisitor::<__TypeVariant>::new(
                            "type",
                            "ast node defined by #[ast_serde]",
                        ),
                    ) {
                        swc_common::private::serde::Ok(__val) => __val,
                        swc_common::private::serde::Err(__err) => {
                            return swc_common::private::serde::Err(__err);
                        }
                    };

                    __tagged
                }
            })
            .parse::<Expr>()
        };

        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    match_type_expr,
                    Enum: &ident,
                    tag_expr
                },
                {
                    impl<'de> serde::Deserialize<'de> for Enum {
                        #[allow(unreachable_code)]
                        fn deserialize<D>(__deserializer: D) -> ::std::result::Result<Self, D::Error>
                        where
                            D: serde::Deserializer<'de>,
                        {
                            let __tagged = tag_expr;


                            let content =
                                <swc_common::private::serde::de::Content as serde::Deserialize>::deserialize(
                                    __deserializer,
                                )?;

                            let ty = swc_common::serializer::Type::deserialize(
                                swc_common::private::serde::de::ContentRefDeserializer::<D::Error>::new(
                                    &content,
                                ),
                            )?;

                            match_type_expr
                        }
                    }
                }
            ))
            .parse::<ItemImpl>()
            .with_generics(generics)
    };

    vec![deserialize]
}
