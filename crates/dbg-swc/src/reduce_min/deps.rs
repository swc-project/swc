use crate::util::parse;
use anyhow::{Context, Result};
use rayon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};
use swc_common::{
    collections::AHashMap, comments::NoopComments, errors::HANDLER, FileName, SourceFile,
    SourceMap, GLOBALS,
};
use swc_ecma_loader::{resolve::Resolve, resolvers::node::NodeModulesResolver, TargetEnv};
use tracing::info;

pub fn collect_deps(cm: Arc<SourceMap>, working_dir: &Path, entry: &Path) -> Result<Vec<PathBuf>> {
    let collector = DependencyCollector {
        cm,
        working_dir: working_dir.to_path_buf(),
        cache: Default::default(),
        resolver: Box::new(NodeModulesResolver::new(
            TargetEnv::Node,
            Default::default(),
        )),
    };

    collector.load_recursively(Arc::new(FileName::Real(entry.to_path_buf())))?;

    let files = collector.cache.into_inner()?;

    Ok(files
        .into_iter()
        .map(|(_, file)| file.fm.name.clone())
        .filter_map(|f| match f {
            FileName::Real(v) => Some(v),
            _ => None,
        })
        .collect())
}

struct DependencyCollector {
    cm: Arc<SourceMap>,

    #[allow(unused)]
    working_dir: PathBuf,

    cache: Mutex<AHashMap<Arc<FileName>, Arc<ModuleData>>>,

    resolver: Box<dyn Resolve>,
}

impl DependencyCollector {
    fn load_recursively(&self, name: Arc<FileName>) -> Result<()> {
        if self.cache.lock().unwrap().contains_key(&name) {
            return Ok(());
        }

        info!("Loading {}", name);

        let fm = match &*name {
            FileName::Real(path) => self.cm.load_file(&path)?,
            FileName::Custom(..) => return Ok(()),
            _ => {
                todo!("load({:?})", name)
            }
        };

        self.cache
            .lock()
            .unwrap()
            .insert(name.clone(), Arc::new(ModuleData { fm: fm.clone() }));

        match &*name {
            FileName::Real(name) => match name.extension() {
                Some(ext) => {
                    if ext == "json" {
                        return Ok(());
                    }
                }

                _ => {}
            },

            _ => {}
        }

        let module = parse(&fm)?;

        let deps = swc_ecma_dep_graph::analyze_dependencies(&module, &NoopComments);
        let deps = deps
            .into_iter()
            .filter(|dep| &*dep.specifier != "next")
            .collect::<Vec<_>>();

        let _res = GLOBALS.with(|globals| {
            HANDLER.with(|handler| {
                deps.into_par_iter()
                    .map(|dep| {
                        GLOBALS.set(globals, || {
                            HANDLER.set(handler, || {
                                let res = self
                                    .resolver
                                    .resolve(&fm.name, &dep.specifier)
                                    .with_context(|| {
                                        format!(
                                            "failed to resolve `{}` from `{}`",
                                            dep.specifier, fm.name
                                        )
                                    })?;

                                Ok((res, dep))
                            })
                        })
                    })
                    .map(|res| {
                        GLOBALS.set(globals, || {
                            HANDLER.set(handler, || {
                                res.and_then(|(name, dep)| {
                                    let name = Arc::new(name);
                                    self.load_recursively(name.clone()).with_context(|| {
                                        format!("failed to load `{}` (`{}`)", name, dep.specifier)
                                    })
                                })
                            })
                        })
                    })
                    .collect::<Result<_>>()
            })
        })?;

        Ok(())
    }
}

struct ModuleData {
    fm: Arc<SourceFile>,
}
