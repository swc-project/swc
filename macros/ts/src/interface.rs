use std::path::PathBuf;

use syn::Meta;
use syn::{Attribute, Data, DeriveInput};

pub(super) fn create(input: DeriveInput) {
    let attr = InterfaceAttr::parse(&input.attrs);

    match input.data {
        Data::Struct(s) => {}
        Data::Enum(e) => {}
        Data::Union(_) => {
            unimplemented!("#[derive(ts_macros::Interface)] does not support `union`")
        }
    }
}

struct InterfaceAttr {
    path: PathBuf,
}

impl InterfaceAttr {
    fn parse(attrs: &[Attribute]) -> Self {
        let mut base = InterfaceAttr {
            path: PathBuf::new(),
        };

        for attr in attrs {
            if let Some(name) = attr.path.get_ident() {
                if name == "interface" {
                    let meta = attr
                        .parse_meta()
                        .expect("failed to parse input provided to #[interface]");

                    match meta {
                        Meta::Path(_) => {}
                        Meta::List(_) => {}
                        Meta::NameValue(_) => {}
                    }
                }
            }
        }

        base
    }
}

struct InterfaceFieldAttr {}
