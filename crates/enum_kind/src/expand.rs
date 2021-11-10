use crate::{input::*, util::is_bool};
use pmutil::{smart_quote, Quote, SpanExt};
use swc_macros_common::prelude::*;
use syn::*;

pub fn expand(
    Input {
        attrs,
        name,
        variants,
        generics,
        vis,
    }: Input,
) -> Item {
    // verify variant attributes.
    {
        for v in &variants {
            if v.attrs.has_delegate {
                match v.data {
                    Fields::Named(FieldsNamed {
                        named: ref fields, ..
                    })
                    | Fields::Unnamed(FieldsUnnamed {
                        unnamed: ref fields,
                        ..
                    }) if fields.len() == 1 => {}
                    _ => panic!(
                        "currently #[kind(delegate)] can be applied to variant with only one field"
                    ),
                }
            }
            for value in &v.attrs.fn_values {
                let used = attrs
                    .fns
                    .iter()
                    .map(|f| &f.name)
                    .any(|fn_name| value.fn_name == *fn_name || value.fn_name == "delegate");
                if !used {
                    panic!("Unknown function `{}` on variant {}", value.fn_name, v.name)
                }
            }
        }
    }

    let items = attrs
        .fns
        .into_iter()
        .map(|f| f.expand(&name, vis.clone(), &variants))
        .map(ImplItem::Method)
        .fold(TokenStream::new(), |mut t, i| {
            i.to_tokens(&mut t);
            t
        });

    Quote::new_call_site()
        .quote_with(smart_quote!(
            Vars {
                Type: name,
                items,
            },
            {
                impl Type {
                    items
                }
            }
        ))
        .parse::<ItemImpl>()
        .with_generics(generics)
        .into()
}

impl FnDef {
    fn expand(self, enum_name: &Ident, vis: Visibility, variants: &[EnumVar]) -> ImplItemMethod {
        let FnDef {
            name,
            return_type,
            default_value,
        } = self;

        let name_span = name.span();

        let arms =
            variants
                .iter()
                .map(|v| -> Arm {
                    // Bind this variant.
                    let (pat, mut fields) =
                        VariantBinder::new(Some(enum_name), &v.name, &v.data, &v.attrs.extras)
                            .bind("_", Some(call_site()), None);

                    let body = {
                        let value = match v
                            .attrs
                            .fn_values
                            .iter()
                            .find(|fn_val| fn_val.fn_name == name)
                            .map(|attr| attr.value.clone())
                        {
                            Some(Some(value)) => Some(value),

                            // not specified, but has `#[kind(delegate)]`
                            None if v.attrs.has_delegate => {
                                assert_eq!(fields.len(), 1);
                                let field = fields.remove(0);
                                Some(
                                    Quote::new_call_site()
                                        .quote_with(smart_quote!(
                                            Vars {
                                                field,
                                                method: &name,
                                            },
                                            { field.method() }
                                        ))
                                        .parse(),
                                )
                            }

                            // if return type is bool and attribute is specified, value is true.
                            Some(None) if is_bool(&return_type) => Some(Expr::Lit(ExprLit {
                                attrs: Default::default(),
                                lit: Lit::Bool(LitBool {
                                    value: true,
                                    span: Span::call_site(),
                                }),
                            })),
                            _ => None,
                        };

                        value
                            .or_else(|| default_value.clone())
                            .map(Box::new)
                            .unwrap_or_else(|| {
                                panic!(
                                    "value of {fn_name} for {variant} is not specified.",
                                    fn_name = name,
                                    variant = v.name
                                );
                            })
                    };

                    Arm {
                        pat,
                        body,

                        // Forward cfg attributes.
                        attrs: v
                            .attrs
                            .extras
                            .iter()
                            .filter(|attr| is_attr_name(attr, "cfg"))
                            .cloned()
                            .collect(),
                        fat_arrow_token: call_site(),
                        comma: Some(call_site()),
                        guard: None,
                    }
                })
                .collect();

        // match self {}
        let match_expr = Expr::Match(ExprMatch {
            attrs: Default::default(),
            match_token: call_site(),
            brace_token: call_site(),

            expr: Quote::new_call_site()
                .quote_with(smart_quote!(Vars {}, { self }))
                .parse::<Expr>()
                .into(),

            arms,
        });

        ImplItemMethod {
            // fn (&self) -> ReturnTpe
            sig: Signature {
                asyncness: None,
                constness: None,
                unsafety: None,
                abi: None,
                fn_token: name.span().as_token(),
                paren_token: name.span().as_token(),
                inputs: vec![
                    // TODO
                    Element::End(FnArg::Receiver(Receiver {
                        reference: Some((name_span.as_token(), None)),
                        self_token: name_span.as_token(),
                        mutability: None,
                        attrs: Default::default(),
                    })),
                ]
                .into_iter()
                .collect(),
                ident: name,
                generics: Default::default(),
                variadic: None,
                output: ReturnType::Type(name_span.as_token(), Box::new(return_type)),
            },

            block: Block {
                brace_token: call_site(),
                stmts: vec![Stmt::Expr(match_expr)],
            },

            // TODO
            vis,

            attrs: Default::default(),
            defaultness: None,
        }
    }
}
