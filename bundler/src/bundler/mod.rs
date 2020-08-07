use self::scope::Scope;
use crate::{Load, ModuleId, Resolve};
use anyhow::Error;
use fxhash::FxHashMap;
use module::TransformedModule;
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{comments::Comments, FileName, Mark};
use swc_ecma_ast::Module;

mod chunk;
mod export;
mod helpers;
mod import;
mod load;
mod module;
mod scope;
#[cfg(test)]
mod tests;
mod usage_analysis;

#[derive(Debug)]
pub enum BundleKind {
    /// User-provided entry
    Named { name: String },
    /// Auto-generated entry (created by import expression)
    Dynamic,
    /// A lazy-loaded shared library
    Lib { name: String },
}

/// Built bundle
#[derive(Debug)]
pub struct Bundle {
    pub kind: BundleKind,
    pub id: ModuleId,
    /// Merged module
    pub module: Module,
}

pub struct Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    loader: L,
    resolver: R,

    comments: Option<&'a dyn Comments>,

    external_modules: Vec<JsWord>,

    /// [Mark] used while tree shaking
    used_mark: Mark,
    /// [Mark] used while tree shaking
    top_level_mark: Mark,

    scope: Scope,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub fn bundle(&self, entries: HashMap<String, FileName>) -> Result<Vec<Bundle>, Error> {
        let results = entries
            .into_iter()
            .map(|(name, path)| -> Result<_, Error> {
                let res = self.load(path).context("load_transformed failed")?;
                Ok((name, res))
            })
            .collect::<Vec<_>>();

        // We collect at here to handle dynamic imports
        // TODO: Handle dynamic imports

        let local = {
            let mut output = FxHashMap::default();

            for res in results {
                let (name, m): (String, TransformedModule) = res?;

                output.insert(name, m);
            }

            output
        };

        let bundles = self.chunk(local)?;

        Ok(self.finalize(bundles)?)
    }
}
