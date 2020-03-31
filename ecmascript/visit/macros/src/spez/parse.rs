use std::iter::{once, FromIterator};
use syn::{punctuated::Punctuated, Token};

pub struct Args {
    pub for_token: Token![for],
    pub param: Option<syn::Ident>,
    pub at_token: Option<Token![=]>,
    pub expr: syn::Expr,
    pub semicolon_token: Token![;],
    pub arms: Vec<Arm>,
}

pub struct Arm {
    pub match_token: Token![match],
    pub generics: syn::Generics,
    pub ty: syn::Type,
    pub arrow_token: Option<Token![->]>,
    pub return_type: Option<syn::Type>,
    pub body: syn::Block,
}

impl syn::parse::Parse for Args {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let for_token = input.parse()?;
        let param;
        let at_token;
        let expr;
        if input.peek2(Token![=]) {
            param = Some(input.parse()?);
            at_token = Some(input.parse()?);
            expr = input.parse()?;
        } else if input.peek(syn::Ident) && input.peek2(Token![;]) {
            let ident: syn::Ident = input.parse()?;
            param = Some(ident.clone());
            at_token = None;
            expr = ident_to_expr(ident);
        } else {
            param = None;
            at_token = None;
            expr = input.parse()?;
        }
        Ok(Self {
            for_token,
            param,
            at_token,
            expr,
            semicolon_token: input.parse()?,
            arms: {
                let mut arms = Vec::new();
                while !input.is_empty() {
                    arms.push(input.parse()?);
                }
                arms
            },
        })
    }
}

impl syn::parse::Parse for Arm {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let match_token = input.parse()?;
        let generics = if input.peek(Token![<]) {
            input.parse()?
        } else {
            syn::Generics::default()
        };
        let ty = input.parse()?;
        let where_clause: Option<syn::WhereClause> = input.parse()?;
        let (arrow_token, return_type) = if input.peek(Token![->]) {
            (Some(input.parse()?), Some(input.parse()?))
        } else {
            (None, None)
        };
        let body = input.parse()?;
        Ok(Self {
            match_token,
            generics: syn::Generics {
                where_clause,
                ..generics
            },
            ty,
            arrow_token,
            return_type,
            body,
        })
    }
}

fn ident_to_expr(ident: syn::Ident) -> syn::Expr {
    syn::Expr::Path(syn::ExprPath {
        attrs: Vec::new(),
        qself: None,
        path: syn::Path {
            leading_colon: None,
            segments: Punctuated::from_iter(once(syn::PathSegment {
                ident,
                arguments: syn::PathArguments::None,
            })),
        },
    })
}
