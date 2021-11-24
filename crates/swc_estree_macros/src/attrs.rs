use proc_macro2::Span;
use swc_macros_common::is_attr_name;
use syn::{Attribute, Meta, NestedMeta};

pub fn remove_flatten_attrs(attrs: &mut Vec<Attribute>) {
    attrs.retain(|attr| {
        if attr.path.is_ident("flavor") {
            return false;
        }

        true
    })
}

pub struct Flavor {
    pub span: Span,
    pub name: String,
}

impl Flavor {
    pub fn should_remove(&self, attrs: &mut Vec<Attribute>) -> bool {
        if attrs.is_empty() {
            return false;
        }

        let res = attrs
            .iter()
            .filter(|attr| is_attr_name(attr, "flavor"))
            .map(|attr| attr.parse_meta().unwrap())
            .all(|meta| {
                match meta {
                    Meta::Path(_) => todo!("flavor(Meta::Path)"),
                    Meta::List(meta) => {
                        for item in meta.nested.iter() {
                            match item {
                                NestedMeta::Meta(item) => {
                                    if let Some(flavor_name) = item.path().get_ident() {
                                        if *flavor_name == self.name {
                                            return false;
                                        }
                                    }
                                }
                                NestedMeta::Lit(_) => todo!(),
                            }
                        }
                    }
                    Meta::NameValue(_) => todo!("flavor(Meta::NameValue)"),
                }

                true
            });

        remove_flatten_attrs(attrs);

        res
    }
}
