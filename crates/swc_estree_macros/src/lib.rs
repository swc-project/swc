extern crate proc_macro;

use crate::attrs::Flavor;
use pmutil::{q, ToTokensExt};
use swc_macros_common::span_to_token;
use syn::{Attribute, Ident, ItemMod, ItemStruct, Meta, NestedMeta, VisPublic, Visibility};

mod ast;
mod attrs;

/// `#[flavor]`
///
/// Applied on `use`, `struct`, `enum`, enum variant.
///
/// If flavor is e.g. `babel`, then the item is used only if flavor is babel.
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

    let mut flavors = vec![];

    for arg in args {
        match &arg {
            NestedMeta::Meta(Meta::List(meta)) => {
                if meta.path.is_ident("flavors") {
                    for flavor in meta.nested.iter() {
                        match flavor {
                            NestedMeta::Meta(Meta::Path(ident)) => {
                                let ident = ident.get_ident().unwrap();
                                flavors.push(Flavor {
                                    span: ident.span(),
                                    name: ident.to_string(),
                                });
                            }
                            _ => panic!("#[estree_ast] requires a list of flavors"),
                        }
                    }
                    continue;
                }
            }
            _ => {}
        }

        panic!("#[estree_ast] Unknown attribute input: {:?}", arg);
    }

    let new_modules = flavors.into_iter().map(|flavor| {
        let mut processor = self::ast::Processor { flavor: &flavor };
        let module_items = content
            .clone()
            .into_iter()
            .flat_map(|item| processor.process_module_item(item))
            .collect();

        ItemMod {
            attrs: vec![make_cfg_feature_attr(&format!("{}-ast", flavor.name))],
            vis: Visibility::Public(VisPublic {
                pub_token: span_to_token(flavor.span),
            }),
            mod_token: span_to_token(flavor.span),
            ident: Ident::new(&flavor.name, flavor.span),
            content: Some((span_to_token(flavor.span), module_items)),
            semi: None,
        }
    });

    let mut q = q!({});
    for item in new_modules {
        q.push_tokens(&item);
    }

    q.dump().into()
}

fn make_cfg_feature_attr(feat: &str) -> Attribute {
    let s = q!(Vars { feat }, {
        #[cfg(feature = feat)]
        struct Dummy;
    })
    .parse::<ItemStruct>();

    s.attrs.into_iter().next().unwrap()
}
