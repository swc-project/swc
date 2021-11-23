use syn::Item;

pub struct Config {
    pub flavors: Vec<Flavor>,
}

pub struct Flavor {
    pub name: String,
}

pub(crate) fn process_module_item(config: &Config, item: Item) -> Vec<Item> {}
