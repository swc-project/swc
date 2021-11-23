extern crate proc_macro;

use pmutil::{q, ToTokensExt};
use swc_macros_common::{call_site, span_to_token};
use syn::{Ident, ItemMod, VisPublic, Visibility};

use crate::ast::Flavor;

mod ast;

#[proc_macro_attribute]
pub fn estree_ast(
    args: proc_macro::TokenStream,
    module_tokens: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let args = syn::parse_macro_input!(args as syn::AttributeArgs);
    let module = syn::parse_macro_input!(module_tokens as ItemMod);

    let (_, content) = module
        .content
        .expect("#[estree_ast] requires a module with content");

    dbg!(&args);

    let flavors = Vec::<Flavor>::new();

    let new_modules = flavors.into_iter().map(|flavor| {
        let mut processor = self::ast::Processor { flavor: &flavor };
        let module_items = content
            .clone()
            .into_iter()
            .flat_map(|item| processor.process_module_item(item))
            .collect();

        ItemMod {
            attrs: Default::default(),
            vis: Visibility::Public(VisPublic {
                pub_token: span_to_token(flavor.span),
            }),
            mod_token: span_to_token(flavor.span),
            ident: Ident::new(&flavor.name, flavor.span),
            content: Some((call_site(), module_items)),
            semi: None,
        }
    });

    let mut q = q!({});
    for item in new_modules {
        q.push_tokens(&item);
    }

    q.dump().into()
}
