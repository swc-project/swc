use self::{config::Cache, scope::Scope};
use crate::{
    bundler::load_transformed::TransformedModule,
    config::{Config, EntryConfig},
    load::Load,
    resolve::Resolve,
    ModuleId,
};
use anyhow::{Context, Error};
use fxhash::FxHashMap;
use rayon::prelude::*;
use std::{path::PathBuf, sync::Arc};
use swc::config::ModuleConfig;
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_ast::Module;

mod chunk;
mod config;
mod export;
mod helpers;
mod import;
mod load_transformed;
mod rename;
mod scope;
#[cfg(test)]
mod tests;
mod usage_analysis;

pub struct Bundler<'a> {
    cache: Cache,
    /// Javascript compiler.
    swc: Arc<swc::Compiler>,
    swc_options: swc::config::Options,

    scope: Scope,
}

impl<'a> Bundler<'a> {
    pub fn new(
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

        if swc_options.config.is_none() {
            swc_options.config = Some(Default::default());
        }

        if let Some(c) = &mut swc_options.config {
            // Preserve es6 modules
            c.module = Some(ModuleConfig::Es6);
        }

        Bundler {
            swc,
            cache: Default::default(),
            swc_options,
            used_mark,
            top_level_mark,
            resolver,
            loader,
            scope: Default::default(),
        }
    }



    pub fn swc(&self) -> &swc::Compiler {
        &self.swc
    }
}
