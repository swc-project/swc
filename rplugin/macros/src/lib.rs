extern crate proc_macro;

use pmutil::{q, Quote, ToTokensExt};
use swc_macros_common::call_site;
use syn::{parse, Item, ItemImpl, ItemMod, ItemStruct, Lit, Path};

#[proc_macro_attribute]
pub fn ast_for_plugin(
    input: proc_macro::TokenStream,
    module: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let normal_crate_path: Lit = parse(input).expect("failed to parse argument as path");

    let module: ItemMod = parse(module).expect("failed to parse input as a module");
    let content = module.content.expect("module should have content").1;

    let mut mod_items = vec![];

    for item in content {
        match &item {
            Item::Struct(s) => {
                // q.push_tokens(&make_unstable_ast_impl_for_struct(&
                // normal_crate_path, &s));
            }

            Item::Enum(s) => {}

            _ => {
                todo!("Support: {:?}", item)
            }
        }

        mod_items.push(item);
    }

    ItemMod {
        content: Some((call_site(), mod_items)),
        ..module
    }
    .dump()
    .into()
}

// fn make_unstable_ast_impl_for_struct(normal_crate_path: &Path, src:
// &ItemStruct) -> ItemImpl {}
