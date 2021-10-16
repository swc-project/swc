use proc_macro2::TokenStream;
use syn::{ImplItem, ItemImpl};

pub fn expand(attr: TokenStream, item: ItemImpl) -> ItemImpl {
    ItemImpl {
        items: items
            .into_iter()
            .map(|item| match item {
                ImplItem::Method(m) => ImplItem::Method(expander.patch_method(m)),
                _ => item,
            })
            .collect(),
        ..item
    }
}
