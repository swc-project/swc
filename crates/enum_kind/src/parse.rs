use crate::{input::*, util::is_bool};
use std::{fmt::Display, ops::AddAssign, result::Result as StdResult};
use swc_macros_common::prelude::*;
use syn::{
    parse::{Parse, ParseStream},
    *,
};

impl From<DeriveInput> for Input {
    fn from(
        DeriveInput {
            ident: name,
            vis,
            attrs,
            generics,
            data,
        }: DeriveInput,
    ) -> Self {
        let variants = match data {
            Data::Enum(data) => data.variants.into_iter().map(From::from).collect(),
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

impl Parse for EnumAttrs {
    fn parse(input: ParseStream<'_>) -> Result<Self> {
        let _function: Ident = input.parse()?;

        let fns;
        let _paren_token = parenthesized!(fns in input);

        let fns: Punctuated<FnDef, Token![,]> = fns.parse_terminated(FnDef::parse)?;
        Ok(EnumAttrs {
            fns: fns.into_iter().collect(),
            extras: Default::default(),
        })
    }
}

impl AddAssign<StdResult<Self, Attribute>> for EnumAttrs {
    fn add_assign(&mut self, rhs: StdResult<Self, Attribute>) {
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
            return Some(Expr::Lit(ExprLit {
                attrs: Default::default(),
                lit: Lit::Bool(LitBool {
                    value: false,
                    span: def_site::<Span>(),
                }),
            }));
        }

        None
    }
}

impl Parse for FnDef {
    fn parse(input: ParseStream<'_>) -> Result<Self> {
        let name: Ident = input.parse()?;
        let _: Token!(=) = input.parse()?;
        let return_type: LitStr = input.parse()?;

        if name == "delegate" {
            panic!("function name cannot be `delegate`")
        }

        let return_type = parse_str_as_tokens(return_type);
        Ok(FnDef {
            default_value: FnDef::def_value_for_type(&return_type),
            name,
            return_type,
        })
    }
}

impl From<Variant> for EnumVar {
    fn from(
        Variant {
            attrs,
            fields,
            ident: name,
            ..
        }: Variant,
    ) -> Self {
        EnumVar {
            name,
            data: fields,
            attrs: parse_attrs(attrs),
        }
    }
}

impl Parse for VariantAttrs {
    fn parse(input: ParseStream<'_>) -> Result<Self> {
        let fn_values: Punctuated<_, token::Comma> = Punctuated::parse_terminated(input)?;
        let has_delegate = fn_values
            .iter()
            .any(|f: &VariantAttr| f.fn_name == "delegate");
        Ok(VariantAttrs {
            fn_values: fn_values.into_iter().collect(),
            extras: Default::default(),
            has_delegate,
        })
    }
}

impl AddAssign<StdResult<Self, Attribute>> for VariantAttrs {
    fn add_assign(&mut self, rhs: StdResult<Self, Attribute>) {
        #[allow(clippy::suspicious_op_assign_impl)]
        match rhs {
            Ok(attr) => {
                self.fn_values.extend(attr.fn_values);
                self.extras.extend(attr.extras);
                self.has_delegate = self.has_delegate || attr.has_delegate;
            }
            Err(attr) => self.extras.push(attr),
        }
    }
}

impl Parse for VariantAttr {
    fn parse(input: ParseStream<'_>) -> Result<Self> {
        let fn_name: Ident = input.parse()?;

        let lookahead = input.lookahead1();
        let value = if lookahead.peek(Token![=]) {
            let _: Token![=] = input.parse()?;
            Some(input.parse().map(parse_str_as_tokens)?)
        } else {
            None
        };

        Ok(VariantAttr { fn_name, value })
    }
}

/// Parse kind attr as MetaItem.
fn parse_attrs<T>(attrs: Vec<Attribute>) -> T
where
    T: Default + Parse + AddAssign<StdResult<T, Attribute>>,
{
    /// returns `tokens` where `tts` = `vec![Group(Paren, tokens)]`
    fn unwrap_paren<I>(tts: I) -> TokenStream
    where
        I: IntoIterator<Item = TokenTree>,
    {
        let mut tts = tts.into_iter();
        let tt = tts.next();

        match tt {
            Some(TokenTree::Group(ref g)) if g.delimiter() == Delimiter::Parenthesis => {
                if tts.next().is_none() {
                    return g.stream();
                }
                g.stream()
            }
            tt => panic!(
                "expected tokens to be wrapped in a paren like #[kind(tokens)]\ngot {}",
                match tt {
                    Some(ref tt) => tt as &dyn Display,
                    None => &"None" as &dyn Display,
                }
            ),
        }
    }

    let mut res = Default::default();
    for attr in attrs {
        if is_attr_name(&attr, "doc") {
            continue;
        }

        if is_attr_name(&attr, "kind") {
            let tts = unwrap_paren(attr.tokens);
            let parsed: T = parse(tts.into())
                .unwrap_or_else(|err| panic!("failed to parse attribute: {}", err));

            res += Ok(parsed);
        } else {
            res += Err(attr)
        }
    }

    res
}

/// Parse content of string literal.
fn parse_str_as_tokens<T>(lit: LitStr) -> T
where
    T: Parse,
{
    let span = lit.span();
    // WTF? Literal does not provide a way to get string...
    let tt = lit.value();

    // TODO:Remove '"' only for first and last.
    let tts = tt
        .replace("\"", "")
        .parse::<TokenStream>()
        .expect("failed to create TokenStream for return type")
        .into_iter()
        .map(|mut tt| {
            tt.set_span(span);
            tt
        })
        .collect::<TokenStream>();

    parse(tts.into()).expect("failed to parse string literal")
}
