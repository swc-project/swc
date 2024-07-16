use syn::File;

pub fn generate(files: &[File]) -> File {
    let mut output = File {
        shebang: None,
        attrs: Vec::new(),
        items: Vec::new(),
    };

    for file in files {
        output.items.extend(file.items.clone());
    }

    output
}
