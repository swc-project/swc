#![feature(box_syntax, proc_macro)]

#[macro_use]
extern crate pmutil;
extern crate proc_macro;
extern crate proc_macro2;
extern crate quote;
extern crate swc_macros_common as common;
extern crate syn;

use common::prelude::*;

mod fold;
mod to_code;

#[proc_macro_derive(Fold, attributes(fold))]
pub fn derive_fold(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = input.ident.clone();

    let mut tokens = Tokens::new();
    self::fold::derive(input).to_tokens(&mut tokens);

    wrap_in_const(&format!("DERIVE_FOLD_FOR_{}", type_name), tokens)
}

#[proc_macro_derive(ToCode, attributes(code))]
pub fn derive_to_code(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = input.ident.clone();

    let mut tokens = Tokens::new();
    self::to_code::derive(input).to_tokens(&mut tokens);

    wrap_in_const(&format!("DERIVE_TO_CODE_{}", type_name), tokens)
}

#[proc_macro_derive(AstNode)]
pub fn derive_ast_node(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    let input = parse::<DeriveInput>(input).expect("failed to parse input as DeriveInput");
    let type_name = &input.ident;

    let item = Quote::new(Span::call_site())
        .quote_with(smart_quote!(Vars { Type: type_name }, {
            impl swc_common::AstNode for Type {}
        }))
        .parse::<ItemImpl>()
        .with_generics(input.generics);

    wrap_in_const(&format!("DERIVE_AST_NODE_FOR_{}", type_name), item.dump())
}

/// Alias for
/// `#[derive(Clone, Debug, PartialEq, AstNode)]`
#[proc_macro_attribute]
pub fn ast_node(
    args: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    if !args.is_empty() {
        panic!("#[ast_node] takes no arguments");
    }

    // let item: DeriveInput = parse(input).expect("failed to parse input as a
    // DeriveInput");
    let input: TokenStream = input.into();

    // If we use call_site with proc_macro feature enabled,
    // only attributes for first derive works.
    // https://github.com/rust-lang/rust/issues/46489

    let item = Quote::new(Span::def_site()).quote_with(smart_quote!(Vars { item: &input }, {
        #[derive(Fold, ToCode, AstNode, Clone, Debug, PartialEq)]
        item
    }));

    let item=TokenStream::from(item).to_string().parse::<TokenStream>().unwrap();

    print("ast_node", item)
}

/// Workarounds https://github.com/rust-lang/rust/issues/44925
fn wrap_in_const<T: Into<TokenStream>>(const_name: &str, item: T) -> proc_macro::TokenStream {
    let item = Quote::new(Span::call_site()).quote_with(smart_quote!(
        Vars {
            item: item.into(),
            CONST_NAME: Ident::new(const_name, call_site()),
        },
        {
            #[allow(dead_code, non_upper_case_globals)]
            const CONST_NAME: () = {
                extern crate swc_common;
                item
            };
        }
    ));
    item.into()
}
