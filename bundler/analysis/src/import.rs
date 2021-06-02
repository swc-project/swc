use crate::specifier::{Source, Specifier};

#[derive(Debug, Default)]
pub struct Imports {
    /// If imported ids are empty, it is a side-effect import.
    pub specifiers: Vec<(Source, Vec<Specifier>)>,
}
