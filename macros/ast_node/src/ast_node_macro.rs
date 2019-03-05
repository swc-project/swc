use pmutil::Quote;
use swc_macros_common::prelude::*;
use syn::{
    self,
    parse::{Parse, ParseStream},
    *,
};

#[derive(Clone)]
pub struct Args {
    pub ty: Literal,
}

impl Parse for Args {
    fn parse(i: ParseStream) -> syn::Result<Self> {
        Ok(Args { ty: i.parse()? })
    }
}

struct VariantAttr {
    _paren_token: token::Paren,
    tags: Punctuated<Lit, Token![,]>,
}

impl Parse for VariantAttr {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let content;
        Ok(VariantAttr {
            _paren_token: parenthesized!(content in input),
            tags: content.parse_terminated(Lit::parse)?,
        })
    }
}

pub fn expand_enum(
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
        let mut match_type = data
            .variants
            .iter()
            .map(|variant| {
                let field_type = match variant.fields {
                    Fields::Unnamed(ref fields) => {
                        assert!(
                            fields.unnamed.len() == 1,
                            "#[ast_node] enum cannot contain variant with multiple fields"
                        );

                        fields.unnamed.last().unwrap().into_value().ty.clone()
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
                            parse2(attr.tts.clone()).expect("failed to parse #[tag] attribute");

                        Some(tags)
                    })
                    .flat_map(|v| v.tags)
                    .collect::<Punctuated<_, token::Comma>>();

                assert!(
                    tags.len() >= 1,
                    "All #[ast_node] enum variants have one or more tag"
                );
                if tags.len() == 1
                    && match tags.first().map(Pair::into_value) {
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
                                if let Ok(v) = std::result::Result::map(
                                    <VariantFieldType as serde::Deserialize>::deserialize(
                                        serde::private::de::ContentRefDeserializer::<D::Error>::new(
                                            &content,
                                        ),
                                    ),
                                    Enum::Variant,
                                ) {
                                    return Ok(v);
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
                                        if let Ok(v) = std::result::Result::map(
                                            <VariantFieldType as serde::Deserialize>::deserialize(
                                                serde::private::de::ContentRefDeserializer::<
                                                    D::Error,
                                                >::new(
                                                    &content
                                                ),
                                            ),
                                            Enum::Variant,
                                        ) {
                                            return Ok(v);
                                        }
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

        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    match_type_expr,
                    Enum: &ident
                },
                {
                    impl<'de> serde::Deserialize<'de> for Enum {
                        fn deserialize<D>(Deserializer: D) -> ::std::result::Result<Self, D::Error>
                        where
                            D: serde::Deserializer<'de>,
                        {
                            let content =
                                <serde::private::de::Content as serde::Deserialize>::deserialize(
                                    Deserializer,
                                )?;

                            let ty = swc_common::serializer::Type::deserialize(
                                serde::private::de::ContentRefDeserializer::<D::Error>::new(
                                    &content,
                                ),
                            )?;

                            match_type_expr
                        }
                    }
                }
            ))
            .parse::<ItemImpl>()
            .with_generics(generics.clone())
    };

    vec![deserialize]
}

pub fn expand_struct(args: Args, i: DeriveInput) -> Vec<ItemImpl> {
    let mut items = vec![];
    let generics = i.generics.clone();
    let item_ident = Ident::new("Item", i.ident.span());

    items.push(
        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    Type: i.ident.clone(),
                    type_str: args.ty
                },
                {
                    impl ::swc_common::AstNode for Type {
                        const TYPE: &'static str = type_str;
                    }
                }
            ))
            .parse::<ItemImpl>()
            .with_generics(generics.clone()),
    );

    let ident = i.ident.clone();
    let cloned = i.clone();

    items.push({
        let (fields, item_data) = match i.data {
            Data::Struct(DataStruct {
                struct_token,
                semi_token,
                fields: Fields::Named(FieldsNamed { brace_token, named }),
            }) => {
                let fields: Punctuated<_, token::Comma> = named
                    .clone()
                    .into_iter()
                    .map(|field| FieldValue {
                        member: Member::Named(field.ident.clone().unwrap()),
                        expr: Quote::new_call_site()
                            .quote_with(smart_quote!(
                                Vars {
                                    field: &field.ident
                                },
                                { node.node.field }
                            ))
                            .parse(),

                        attrs: field
                            .attrs
                            .into_iter()
                            .filter(|attr| is_attr_name(attr, "cfg"))
                            .collect(),
                        colon_token: Some(call_site()),
                    })
                    .collect();

                let item_data = Data::Struct(DataStruct {
                    struct_token,
                    semi_token,
                    fields: Fields::Named(FieldsNamed {
                        brace_token,
                        named: named
                            .into_pairs()
                            .map(|pair| {
                                let handle = |v: Field| Field {
                                    vis: Visibility::Inherited,
                                    attrs: v
                                        .attrs
                                        .into_iter()
                                        .filter(|attr| {
                                            is_attr_name(attr, "serde") || is_attr_name(attr, "cfg")
                                        })
                                        .collect(),
                                    ..v
                                };

                                match pair {
                                    Pair::End(v) => Pair::End(handle(v)),
                                    Pair::Punctuated(v, p) => Pair::Punctuated(handle(v), p),
                                }
                            })
                            .collect(),
                    }),
                });

                (fields, item_data)
            }
            _ => unreachable!("enum / tuple struct / union with #[ast_node(\"Foo\")]"),
        };

        let convert_item_to_self = Quote::new_call_site().quote_with(smart_quote!(
            Vars {
                fields,
                Type: &ident
            },
            { Type { fields } }
        ));

        let body = Quote::new_call_site().quote_with(smart_quote!(
            Vars {
                convert_item_to_self
            },
            {
                let node = ::swc_common::serializer::Node::<Item>::deserialize(deserializer)?;

                if node.ty != <Self as ::swc_common::AstNode>::TYPE {
                    return Err(D::Error::unknown_variant(
                        &node.ty,
                        &[<Self as ::swc_common::AstNode>::TYPE],
                    ));
                }

                Ok(convert_item_to_self)
            }
        ));

        let item = DeriveInput {
            vis: Visibility::Inherited,
            ident: item_ident,
            attrs: vec![],
            data: item_data,
            ..cloned
        };
        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    // A new item which implements Deserialize
                    item,
                    Type: ident,
                    body
                },
                {
                    impl<'de> ::serde::Deserialize<'de> for Type {
                        fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
                        where
                            D: ::serde::Deserializer<'de>,
                        {
                            use ::serde::de::Error;
                            #[derive(::serde::Deserialize)]
                            #[serde(rename_all = "camelCase")]
                            item
                            body
                        }
                    }
                }
            ))
            .parse::<ItemImpl>()
            .with_generics(generics)
    });

    items
}
