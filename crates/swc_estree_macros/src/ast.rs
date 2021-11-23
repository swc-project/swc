use crate::attrs::remove_flatten_attrs;
use proc_macro2::Span;
use swc_macros_common::is_attr_name;
use syn::{punctuated::Pair, Attribute, Item, ItemEnum, ItemStruct, Meta, NestedMeta, Variant};

/// Generates AST definition for one flavor.
pub struct Processor<'a> {
    pub flavor: &'a Flavor,
}

pub struct Flavor {
    pub span: Span,
    pub name: String,
}

impl Flavor {
    pub fn should_remove(&self, attrs: &mut Vec<Attribute>) -> bool {
        let res = attrs
            .iter()
            .filter(|attr| is_attr_name(attr, "flavor"))
            .map(|attr| attr.parse_meta().unwrap())
            .any(|meta| {
                match meta {
                    Meta::Path(_) => todo!("flavor(Meta::Path)"),
                    Meta::List(meta) => {
                        for item in meta.nested.iter() {
                            match item {
                                NestedMeta::Meta(item) => {
                                    if let Some(flavor_name) = item.path().get_ident() {
                                        if *flavor_name == self.name {
                                            return true;
                                        }
                                    }
                                }
                                NestedMeta::Lit(_) => todo!(),
                            }
                        }
                    }
                    Meta::NameValue(_) => todo!("flavor(Meta::NameValue)"),
                }

                false
            });

        remove_flatten_attrs(attrs);

        res
    }
}

impl Processor<'_> {
    pub(crate) fn process_module_item(&mut self, item: Item) -> Vec<Item> {
        match item {
            Item::Struct(item) => self.process_struct(item),
            Item::Enum(item) => self.process_enum(item),
            _ => {
                vec![item]
            }
        }
    }

    fn process_struct(&mut self, mut item: ItemStruct) -> Vec<Item> {
        if self.flavor.should_remove(&mut item.attrs) {
            return vec![];
        }

        vec![Item::Struct(item)]
    }

    fn process_enum(&mut self, mut item: ItemEnum) -> Vec<Item> {
        if self.flavor.should_remove(&mut item.attrs) {
            return vec![];
        }

        item.variants = item
            .variants
            .into_pairs()
            .filter_map(|v| {
                Some(match v {
                    Pair::Punctuated(v, c) => Pair::Punctuated(self.process_variant(v)?, c),
                    Pair::End(v) => Pair::End(self.process_variant(v)?),
                })
            })
            .collect();

        vec![Item::Enum(item)]
    }

    fn process_variant(&mut self, mut variant: Variant) -> Option<Variant> {
        if self.flavor.should_remove(&mut variant.attrs) {
            return None;
        }

        Some(variant)
    }
}
