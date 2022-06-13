use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
    path::Path,
};

pub struct StyleHash;

impl StyleHash {
    ///
    /// Generated content_hash from article content
    fn generate_hash_by_content(content: &str) -> String {
        let mut hasher = DefaultHasher::new();
        content.hash(&mut hasher);
        hasher.finish().to_string()
    }

    ///
    /// Generate the prefix corresponding to css_modules according to the css
    /// file path and file content
    pub fn generate_css_module_hash(abs_filepath: &str, content: &str) -> String {
        let path = Path::new(abs_filepath);
        let mut perfix = "".to_string();
        if let Some(parent_path) = path.parent() {
            if let Some(parent_dir) = parent_path.file_name() {
                perfix += parent_dir.to_str().unwrap();
                perfix += "_";
            }
        }
        perfix += path
            .file_stem()
            .unwrap()
            .to_str()
            .unwrap()
            .replace('.', "_")
            .as_str();
        let content_hash = Self::generate_hash_by_content(content);
        format!("{}_{}", perfix, content_hash)
    }
}
