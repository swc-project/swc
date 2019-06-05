use crate::errors::Error;
use std::path::PathBuf;
use swc_atoms::JsWord;

///
pub trait Resolve: Send + Sync {
    fn resolve(&self, base: PathBuf, src: &JsWord) -> Result<PathBuf, Error>;
}

pub struct Resolver {
    r: node_resolve::Resolver,
}

impl Resolver {
    pub fn new() -> Self {
        Resolver {
            r: node_resolve::Resolver::new()
                .with_extensions(&[".js", ".ts", ".tsx", ".json", ".node"]),
        }
    }
}

impl Resolve for Resolver {
    fn resolve(&self, base: PathBuf, src: &JsWord) -> Result<PathBuf, Error> {
        // TODO: Handle error gracefully.

        let p = self
            .r
            .with_basedir(base)
            .resolve(&*src)
            .expect("failed to resolve");
        return Ok(p);
    }
}
