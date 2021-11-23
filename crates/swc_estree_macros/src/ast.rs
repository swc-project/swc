use crate::attrs::remove_flatten_attrs;
use proc_macro2::Span;
use swc_macros_common::is_attr_name;
use syn::{Attribute, Item, ItemStruct};

/// Generates AST definition for one flavor.
pub struct Processor<'a> {
    pub flavor: &'a Flavor,
}

pub struct Flavor {
    pub span: Span,
    pub name: String,
}

impl Flavor {
    pub fn should_remove(&self, attrs: &[Attribute]) -> bool {
        attrs
            .iter()
            .filter(|attr| is_attr_name(attr, "flavor"))
            .map(|attr| attr.parse_meta().unwrap())
            .any(|meta| {
                if let Some(flavor_name) = meta.path().get_ident() {
                    if *flavor_name == self.name {
                        return true;
                    }
                }

                false
            })
    }
}

impl Processor<'_> {
    pub(crate) fn process_module_item(&mut self, item: Item) -> Vec<Item> {
        match item {
            Item::Struct(item) => self.process_struct(item),
            _ => {
                vec![item]
            }
        }
    }

    fn process_struct(&mut self, mut item: ItemStruct) -> Vec<Item> {
        if self.flavor.should_remove(&item.attrs) {
            remove_flatten_attrs(&mut item.attrs);
            return vec![];
        }
        remove_flatten_attrs(&mut item.attrs);

        vec![Item::Struct(item)]
    }
}
