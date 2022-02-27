use syn::Token;

pub(super) struct Input {
    pub src: syn::LitStr,
    pub as_token: Token![as],
    pub output_type: syn::Type,
    pub vars: Vec<InputVar>,
}

pub(super) struct InputVar {
    pub name: syn::Ident,
    pub eq_token: Token![=],
    pub value: syn::Expr,
}
