use common::prelude::*;
use input::*;
use std::fmt::Display;
use std::ops::AddAssign;
use synom::Synom;
use util::{is_attr_name, is_bool};

impl From<DeriveInput> for Input {
    fn from(
        DeriveInput {
            ident: name,
            vis,
            attrs,
            generics,
            body,
        }: DeriveInput,
    ) -> Self {
        let variants = match body {
            Body::Enum(body) => body.variants
                .into_iter()
                .map(Element::into_item)
                .map(From::from)
                .collect(),
            _ => panic!("#[derive(Kind)] only works for enums"),
        };

        Input {
            name,
            vis,
            generics,
            attrs: parse_attrs(attrs),
            variants,
        }
    }
}

impl Synom for EnumAttrs {
    named!(parse -> Self, do_parse!(
        _function: syn!(Ident) >>
        fns: parens!(
            call!(Delimited::parse_terminated)
        ) >>
        ({
            let fns: Delimited<_, tokens::Comma> = fns.0;
            // TODO: Verify `functions`.
            EnumAttrs {
                fns: fns.into_vec(),
                extras: Default::default(),
            }
        })
    ));
}

impl AddAssign<Result<Self, Attribute>> for EnumAttrs {
    fn add_assign(&mut self, rhs: Result<Self, Attribute>) {
        match rhs {
            Ok(attr) => {
                self.fns.extend(attr.fns);
                self.extras.extend(attr.extras);
            }
            Err(attr) => self.extras.push(attr),
        }
    }
}

impl FnDef {
    fn def_value_for_type(ty: &Type) -> Option<Expr> {
        if is_bool(ty) {
            return Some(
                ExprKind::Lit(Lit {
                    value: LitKind::Bool(false),
                    span: SynSpan(Span::call_site()),
                }).into(),
            );
        }

        None
    }
}

impl Synom for FnDef {
    named!(parse -> Self, do_parse!(
        name: syn!(Ident) >>
        syn!(tokens::Eq) >>
        return_type: syn!(Lit) >>
        ({
            let return_type = parse_str_as_tokens(return_type);
            FnDef {
                default_value: FnDef::def_value_for_type(&return_type),
                name,
                return_type,
            }
        })
    ));
}

impl From<Variant> for EnumVar {
    fn from(
        Variant {
            attrs,
            data,
            ident: name,
            ..
        }: Variant,
    ) -> Self {
        EnumVar {
            name,
            data,
            attrs: parse_attrs(attrs),
        }
    }
}

impl Synom for VariantAttrs {
    named!(parse -> Self, do_parse!(
        fn_values: call!(Delimited::parse_terminated)
        >>
        ({
            let fn_values: Delimited<_, tokens::Comma> = fn_values;
            VariantAttrs {
                fn_values: fn_values.into_vec(),
                extras: Default::default(),
            }
        })
    ));
}

impl AddAssign<Result<Self, Attribute>> for VariantAttrs {
    fn add_assign(&mut self, rhs: Result<Self, Attribute>) {
        match rhs {
            Ok(attr) => {
                self.fn_values.extend(attr.fn_values);
                self.extras.extend(attr.extras);
            }
            Err(attr) => self.extras.push(attr),
        }
    }
}

impl Synom for VariantAttr {
    named!(parse -> Self, do_parse!(
            fn_name: syn!(Ident) >>
            value: option!(
                do_parse!(
                    syn!(tokens::Eq) >>
                    p: syn!(Lit) >>
                    ({
                        parse_str_as_tokens(p)
                    })
                )
            ) >>
            (VariantAttr{ fn_name, value, })
        )
    );
}

/// Parse kind attr as MetaItem.
fn parse_attrs<T>(attrs: Vec<Attribute>) -> T
where
    T: Default + Synom + AddAssign<Result<T, Attribute>>,
{
    /// returns `tokens` where `tts` = `vec![Group(Paren, tokens)]`
    fn unwrap_paren<I>(tts: I) -> TokenStream
    where
        I: IntoIterator<Item = TokenTree>,
    {
        let mut tts = tts.into_iter();
        let mut tt = tts.next();

        match tt {
            Some(TokenTree {
                kind: TokenNode::Group(Delimiter::Parenthesis, tokens),
                span,
            }) => {
                if tts.next().is_none() {
                    return tokens;
                }
                tt = Some(TokenTree {
                    kind: TokenNode::Group(Delimiter::Parenthesis, tokens),
                    span,
                });
            }
            _ => {}
        }

        panic!(
            "expected tokens to be wrpped in a paren like #[kind(tokens)]\ngot {}",
            match tt {
                Some(ref tt) => tt as &Display,
                None => &"None" as &Display,
            }
        )
    }

    let mut res = Default::default();
    for attr in attrs {
        if attr.is_sugared_doc {
            continue;
        }

        if is_attr_name(&attr, "kind") {
            let tts = attr.tts.into_iter().map(|t| {
                // syn::parse doesn't like Vec<syn::TokenTree>.
                t.0
            });
            let tts = unwrap_paren(tts);
            let parsed: T = parse(tts.into())
                .unwrap_or_else(|err| panic!("failed to parse attribute: {}", err));

            res += Ok(parsed);
        } else {
            res += Err(attr)
        }
    }

    res
}

/// Parse content of string literal as if it's tts.
fn parse_str_as_tokens<T>(lit: Lit) -> T
where
    T: Synom,
{
    let span = lit.span.0;
    // WTF? Literal does not provide a way to get string...
    let tt = lit.value.to_string();

    // TODO:Remove '"' only for first and last.
    let tts = tt.replace("\"", "")
        .parse::<TokenStream>()
        .expect("failed to create TokenStream for return type")
        .into_iter()
        .map(|tt| TokenTree { span, ..tt })
        .collect::<TokenStream>();

    parse(tts.into()).expect("failed to parse string literal")
}
