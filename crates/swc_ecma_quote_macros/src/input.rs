use syn::{parse::Parse, punctuated::Punctuated, Token};

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

impl Parse for QuoteInput {}

impl Parse for QuoteVar {}
