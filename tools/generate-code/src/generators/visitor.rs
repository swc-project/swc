use syn::File;

pub fn generate(files: &[File]) -> File {
    File {
        shebang: None,
        attrs: Vec::new(),
        items: Vec::new(),
    }
}
