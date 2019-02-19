use swc_macros_common::prelude::*;
use syn::{
    self,
    parse::{Parse, ParseStream},
    parse2, Token,
};
struct Args {
    ty: Literal,
}

impl Parse for Args {
    fn parse(i: ParseStream) -> syn::Result<Self> {
        Ok(Args { ty: i.parse()? })
    }
}

pub fn expand(args: TokenStream, i: DeriveInput) -> Vec<Item> {
    if args.is_empty() {
        return vec![];
    }
    let args: Args = parse2(args).expect("failed to parse args of #[ast_node]");

    let mut items = vec![];

    items.push(
        Quote::new_call_site()
            .quote_with(smart_quote!(
                Vars {
                    Type: i.ident,
                    type_str: args.ty
                },
                {
                    impl ::swc_common::AstNode for Type {
                        fn types() -> &'static [&'static str] {
                            &[type_str]
                        }
                    }
                }
            ))
            .parse(),
    );

    items
}
