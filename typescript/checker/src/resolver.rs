use crate::errors::Error;
use std::path::{Path, PathBuf};
use swc_atoms::JsWord;
use swc_common::Span;

///
pub trait Resolve: Send + Sync {
    fn resolve(&self, cur_file: PathBuf, span: Span, src: &JsWord) -> Result<PathBuf, Error>;
}

pub struct Resolver {
    r: node_resolve::Resolver,
}

impl Resolver {
    pub fn new() -> Self {
        Resolver {
            r: node_resolve::Resolver::new()
                .with_extensions(&[".js", ".ts", ".tsx", ".d.ts", ".json", ".node"])
                .with_main_fields(&["types"]),
        }
    }
}

impl Resolve for Resolver {
    fn resolve(&self, cur_file: PathBuf, span: Span, src: &JsWord) -> Result<PathBuf, Error> {
        // TODO: Handle error gracefully.

        let base = match cur_file.file_name() {
            Some(..) => cur_file
                .parent()
                .expect("file_name() is not null, so there should be parent")
                .to_path_buf(),
            None => cur_file,
        };

        match find_types(&base, src) {
            Ok(v) => return Ok(v),
            Err(()) => {}
        }

        let p = self
            .r
            .with_basedir(base.clone())
            .resolve(&*src)
            .map_err(|_| Error::ResolvedFailed {
                span,
                base,
                src: src.clone(),
            })?;
        return Ok(p);
    }
}

#[inline]
fn find_types(base: &Path, src: &JsWord) -> Result<PathBuf, ()> {
    if src.starts_with(".") {
        return Err(());
    }

    let mut base_dir = Some(base);
    while let Some(mut base) = base_dir {
        let types_dir = base.join("node_modules").join("@types");

        if types_dir.exists() {
            let v = src.split("/").next().unwrap();

            let v = types_dir.join(v);
            if v.exists() {
                return Ok(v.join("index.d.ts"));
            }
        }

        base_dir = base.parent();
    }

    Err(())
}
