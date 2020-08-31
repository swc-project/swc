use self::scope::Scope;
use crate::{Load, ModuleId, Resolve};
use anyhow::{Context, Error};
use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{sync::Lrc, FileName, Globals, Mark, SourceMap, DUMMY_SP, GLOBALS};
use swc_ecma_ast::Module;

mod chunk;
mod computed_key;
mod export;
mod finalize;
mod helpers;
mod import;
mod load;
mod scope;
#[cfg(test)]
mod tests;
mod usage_analysis;

#[derive(Debug)]
pub struct Config {
    /// If it's true, [Bundler] searches for require calls.
    pub require: bool,
    /// List of modules which should be preserved.
    pub external_modules: Vec<JsWord>,
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
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
    config: Config,

    globals: &'a Globals,
    cm: Lrc<SourceMap>,
    loader: L,
    resolver: R,

    /// [Mark] used while tree shaking
    used_mark: Mark,

    scope: Scope,
}

impl<'a, L, R> Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    pub fn new(
        globals: &'a Globals,
        cm: Lrc<SourceMap>,
        loader: L,
        resolver: R,
        config: Config,
    ) -> Self {
        GLOBALS.set(&globals, || {
            let used_mark = Mark::fresh(Mark::root());
            log::info!("Used mark: {:?}", DUMMY_SP.apply_mark(used_mark).ctxt());
            let top_level_mark = Mark::fresh(Mark::root());
            log::info!(
                "top-level mark: {:?}",
                DUMMY_SP.apply_mark(top_level_mark).ctxt()
            );

            Bundler {
                cm,
                loader,
                resolver,
                used_mark,
                scope: Default::default(),
                globals,
                config,
            }
        })
    }

    ///
    ///
    ///
    /// Note: This method will panic if entries references each other in
    /// circular manner. However, it applies only to the provided `entries`, and
    /// dependencies with circular reference is ok.
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
            let mut output = HashMap::default();

            for res in results {
                let (name, m) = res?;
                let m = m.unwrap();

                output.insert(name, m);
            }

            output
        };

        let bundles = self.chunk(local)?;

        let bundles = self.finalize(bundles)?;
        Ok(bundles)
    }

    /// Sets `swc_common::GLOBALS`
    #[inline]
    fn run<F, Ret>(&self, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        GLOBALS.set(self.globals, op)
    }
}
