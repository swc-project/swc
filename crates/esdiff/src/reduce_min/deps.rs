use crate::util::parse;
use anyhow::{Context, Result};
use rayon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};
use swc_common::{collections::AHashMap, comments::NoopComments, FileName, SourceMap};
use swc_ecma_loader::resolve::Resolve;

pub fn collect_deps(cm: Arc<SourceMap>, entry: &Path) -> Vec<PathBuf> {}

struct DependencyCollector {
    cm: Arc<SourceMap>,

    working_dir: PathBuf,

    cache: Mutex<AHashMap<Arc<FileName>, Arc<ModuleData>>>,

    resolver: Box<dyn Resolve>,
}

impl DependencyCollector {
    fn load_recursively(&self, name: Arc<FileName>) -> Result<()> {
        if self.cache.lock().unwrap().contains_key(&name) {
            return Ok(());
        }

        let fm = match &*name {
            FileName::Real(path) => self.cm.load_file(&path)?,
            _ => {
                todo!("load({:?})", name)
            }
        };

        let module = parse(&fm)?;

        let deps = swc_ecma_dep_graph::analyze_dependencies(&module, &NoopComments);

        let res = deps
            .into_par_iter()
            .map(|dep| {
                self.resolver
                    .resolve(&fm.name, &dep.specifier)
                    .with_context(|| {
                        format!("failed to resolve `{}` from `{}`", dep.specifier, fm.name)
                    })
            })
            .map(|name| {
                name.map(Arc::new).and_then(|name| {
                    self.load_recursively(name)
                        .context("failed to load recursively")
                })
            })
            .collect::<Result<_>>()?;

        Ok(())
    }
}

struct ModuleData {}
