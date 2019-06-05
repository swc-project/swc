use crate::errors::Error;
use std::path::{Path, PathBuf};
use swc_atoms::JsWord;

///
pub trait Resolve: Send + Sync {
    fn resolve(&self, base: PathBuf, src: &JsWord) -> Result<PathBuf, Error>;
}

#[derive(Debug)]
pub struct Resolver {}

impl Resolver {
    pub fn new() -> Self {
        Resolver {}
    }
}

impl Resolve for Resolver {
    fn resolve(&self, base: PathBuf, src: &JsWord) -> Result<PathBuf, Error> {
        if src.starts_with(".") {
            let p = base.join(Path::new(src.as_ref()));
            return Ok(p);
        }

        unimplemented!("resolve({}, {})", base.display(), src)
    }
}
