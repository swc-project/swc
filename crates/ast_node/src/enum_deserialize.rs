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

        let tag_expr = q!(Vars {}, {
            {
                enum __TypeVariant {}
                struct __TypeVariantVisitor;

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
        .parse::<Expr>();

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
