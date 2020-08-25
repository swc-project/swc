use proc_macro2::TokenStream;
use syn::{ImplItem, ImplItemMethod, ItemImpl};

pub fn expand(attr: TokenStream, item: ItemImpl) -> ItemImpl {
    let mut expander = Expander {};

    ItemImpl {
        items: item
            .items
            .into_iter()
            .map(|item| match item {
                ImplItem::Method(m) => ImplItem::Method(expander.patch_method(m)),
                _ => item,
            })
            .collect(),
        ..item
    }
}

struct Expander {}

impl Expander {
    fn patch_method(&self, m: ImplItemMethod) -> ImplItemMethod {}
}
