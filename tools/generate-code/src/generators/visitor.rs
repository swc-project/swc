use syn::{File, Item};

pub fn generate(node_types: &[&Item]) -> File {
    let mut output = File {
        shebang: None,
        attrs: Vec::new(),
        items: Vec::new(),
    };

    for &item in node_types {
        match item {
            Item::Struct(_) | Item::Enum(_) => {
                output.items.push(item.clone());
            }

            _ => {}
        }
    }

    output
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum TraitKind {
    Visit,
    VisitMut,
    Fold,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Variant {
    Normal,
    AstPath,
}

fn declare_trait(kind: TraitKind, variant: Variant, node_types: &[&Item]) -> Item {}
