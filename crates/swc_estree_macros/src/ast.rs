use crate::attrs::Flavor;
use syn::{punctuated::Pair, Item, ItemEnum, ItemStruct, Variant};

/// Generates AST definition for one flavor.
pub struct Processor<'a> {
    pub flavor: &'a Flavor,
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
