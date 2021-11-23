extern crate proc_macro;

use pmutil::{q, ToTokensExt};

mod ast;

#[proc_macro_attribute]
pub fn estree_ast(
    args: proc_macro::TokenStream,
    module_tokens: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let args = syn::parse_macro_input!(args as syn::AttributeArgs);
    let module = syn::parse_macro_input!(module_tokens as syn::ItemMod);

    let (_, content) = module
        .content
        .expect("#[define_ast] requires a module with content");

    let mut q = q!({});
    for item in content.into_iter().flat_map(self::ast::process_module_item) {
        q.push_tokens(&item);
    }

    q.dump().into()
}
