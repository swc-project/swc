use syn::{
    parse::{Parse, ParseStream},
    punctuated::Punctuated,
    Token,
};

pub(super) struct QuoteInput {
    pub src: syn::LitStr,
    #[allow(unused)]
    pub as_token: Token![as],
    pub output_type: syn::Type,

    pub vars: Option<(Token![,], Punctuated<QuoteVar, Token![,]>)>,
}

pub(super) struct QuoteVar {
    pub name: syn::Ident,
    #[allow(unused)]
    pub eq_token: Token![=],
    pub value: syn::Expr,
    /// Defaults to `swc_ecma_ast::Ident`
    pub ty: Option<syn::Type>,
}

impl Parse for QuoteInput {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let src = input.parse()?;
        let as_token = input.parse()?;
        let output_type = input.parse()?;
        let vars = if input.is_empty() {
            None
        } else {
            let comma_token = input.parse()?;
            let vars = Punctuated::parse_terminated(input)?;
            Some((comma_token, vars))
        };

        Ok(Self {
            src,
            as_token,
            output_type,
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
