use self::scope::Scope;
use crate::{Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use fxhash::FxHashMap;
use load::TransformedModule;
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{FileName, Globals, Mark, DUMMY_SP, GLOBALS};
use swc_ecma_ast::Module;

mod chunk;
mod export;
mod helpers;
mod import;
mod load;
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
    /// Merged module.
    ///
    /// You **should** run fixer.
    pub module: Module,
}

pub struct Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    globals: &'a Globals,
    loader: L,
    resolver: R,

    external_modules: Vec<JsWord>,

    /// [Mark] used while tree shaking
    used_mark: Mark,
    /// [Mark] used while tree shaking
    top_level_mark: Mark,

    scope: Scope,
}

impl<'a, L, R> Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    pub fn new(
        globals: &'a Globals,
        loader: L,
        resolver: R,
        external_modules: Vec<JsWord>,
    ) -> Self {
        let used_mark = GLOBALS.set(globals, || Mark::fresh(Mark::root()));
        log::info!("Used mark: {:?}", DUMMY_SP.apply_mark(used_mark).ctxt());
        let top_level_mark = GLOBALS.set(globals, || Mark::fresh(Mark::root()));
        log::info!(
            "top-level mark: {:?}",
            DUMMY_SP.apply_mark(top_level_mark).ctxt()
        );

        Bundler {
            loader,
            resolver,
            used_mark,
            top_level_mark,
            scope: Default::default(),
            globals,
            external_modules,
        }
    }

    pub fn bundle(&self, entries: HashMap<String, FileName>) -> Result<Vec<Bundle>, Error> {
        let results = entries
            .into_iter()
            .map(|(name, path)| -> Result<_, Error> {
                let res = self
                    .load_transformed(&path)
                    .context("load_transformed failed")?;
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

        Ok(bundles)
    }
}
