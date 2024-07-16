use syn::{File, Item};

pub fn generate(files: &[File]) -> File {
    let mut output = File {
        shebang: None,
        attrs: Vec::new(),
        items: Vec::new(),
    };

    for file in files {
        for item in &file.items {
            match item {
                Item::Struct(_) | Item::Enum(_) => {
                    output.items.push(item.clone());
                }

                _ => {}
            }
        }
    }

    output
}
