use swc_macros_common::prelude::*;
use syn::{
    parse::{Parse, ParseStream},
    *,
};

#[derive(Clone)]
pub struct Args {
    pub ty: Literal,
}

impl Parse for Args {
    fn parse(i: ParseStream<'_>) -> syn::Result<Self> {
        Ok(Args { ty: i.parse()? })
    }
}

pub fn expand_struct(args: Args, i: DeriveInput) -> Vec<ItemImpl> {
    let mut items = Vec::new();
    // let generics = i.generics.clone();
    // let item_ident = Ident::new("Item", i.ident.span());

    {
        let ty = &i.ident;
        let type_str = &args.ty;
        let has_lifetime = i.generics.lifetimes().count() > 0;
        let item: ItemImpl = if has_lifetime {
            parse_quote!(
                impl<'a> ::swc_common::arena::AstNode<'a> for #ty<'a> {
                    const TYPE: &'static str = #type_str;
                }
            )
        } else {
            parse_quote!(
                impl<'a> ::swc_common::arena::AstNode<'a> for #ty {
                    const TYPE: &'static str = #type_str;
                }
            )
        };
        items.push(item);
    }
    items
}
