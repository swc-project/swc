use proc_macro2::Span;
use syn::Item;

/// Generates AST definition for one flavor.
pub struct Processor<'a> {
    pub flavor: &'a Flavor,
}

pub struct Flavor {
    pub span: Span,
    pub name: String,
}

impl Processor<'_> {
    pub(crate) fn process_module_item(&mut self, item: Item) -> Vec<Item> {}
}
