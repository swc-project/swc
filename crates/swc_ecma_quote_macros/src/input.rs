use syn::{
    parse::{Parse, ParseStream},
    punctuated::Punctuated,
    Token,
};

pub(super) struct QuoteInput {
    pub src: syn::LitStr,
    pub as_token: Token![as],
    pub output_type: syn::Type,

    pub comma_for_vars: Token![,],

    pub vars: Punctuated<QuoteVar, Token![,]>,
}

pub(super) struct QuoteVar {
    pub name: syn::Ident,
    pub eq_token: Token![=],
    pub value: syn::Expr,
}

impl Parse for QuoteInput {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let src = input.parse()?;
        let as_token = input.parse()?;
        let output_type = input.parse()?;
        let comma_for_vars = input.parse()?;
        let vars = Punctuated::parse_terminated(input)?;

        Ok(Self {
            src,
            as_token,
            output_type,
            comma_for_vars,
            vars,
        })
    }
}

impl Parse for QuoteVar {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Ok(Self {
            name: input.parse()?,
            eq_token: input.parse()?,
            value: input.parse()?,
        })
    }
}
