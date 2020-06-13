use self::scope::Scope;
use crate::{
    bundler::load_transformed::TransformedModule, load::Load, resolve::Resolve, Config, ModuleId,
};
use anyhow::{Context, Error};
use fxhash::FxHashMap;
use rayon::prelude::*;
use std::{path::PathBuf, sync::Arc};
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_ast::Module;

mod chunk;
mod export;
mod import;
mod load_transformed;
mod scope;
#[cfg(test)]
mod tests;
mod usage_analysis;

pub struct Bundler<'a> {
    working_dir: PathBuf,
    _config: Config,

    /// Javascript compiler.
    swc: Arc<swc::Compiler>,
    swc_options: swc::config::Options,
    used_mark: Mark,
    top_level_mark: Mark,

    resolver: &'a dyn Resolve,
    loader: &'a dyn Load,

    scope: Scope,
}

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

impl<'a> Bundler<'a> {
    pub fn new(
        working_dir: PathBuf,
        swc: Arc<swc::Compiler>,
        mut swc_options: swc::config::Options,
        resolver: &'a dyn Resolve,
        loader: &'a dyn Load,
    ) -> Self {
        let used_mark = swc.run(|| Mark::fresh(Mark::root()));
        log::info!("Used mark: {:?}", DUMMY_SP.apply_mark(used_mark).ctxt());
        let top_level_mark = swc.run(|| Mark::fresh(Mark::root()));
        log::info!(
            "top-level mark: {:?}",
            DUMMY_SP.apply_mark(top_level_mark).ctxt()
        );

        swc_options.disable_fixer = true;
        swc_options.disable_hygiene = true;
        swc_options.global_mark = Some(top_level_mark);

        Bundler {
            working_dir,
            _config: Config { tree_shake: true },
            swc,
            swc_options,
            loader,
            resolver,
            scope: Default::default(),
            used_mark,
            top_level_mark,
        }
    }

    pub fn bundle(&self, entries: FxHashMap<String, PathBuf>) -> Result<Vec<Bundle>, Error> {
        let results = entries
            .into_par_iter()
            .map(|(name, path)| -> Result<_, Error> {
                let path = self.resolve(&self.working_dir, &path.to_string_lossy())?;
                let res = self
                    .load_transformed(path)
                    .context("load_transformed failed")?;
                Ok((name, res))
            })
            .collect::<Vec<_>>();

        // We collect at here to handle dynamic imports
        // TODO: Handle dynamic imports

        let local = self.swc.run(|| -> Result<_, Error> {
            let mut output = FxHashMap::default();

            for res in results {
                let (name, m): (String, TransformedModule) = res?;

                output.insert(name, m);
            }

            Ok(output)
        })?;

        self.chunk(local)
    }

    pub fn swc(&self) -> &swc::Compiler {
        &self.swc
    }
}
