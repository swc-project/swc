use std::{collections::hash_map::Entry, sync::Arc};

use anyhow::Result;
use async_trait::async_trait;
use swc_common::{collections::AHashMap, FileName};
use swc_ecma_ast::Module;
use tokio::sync::Mutex;

use crate::{
    metadata::{FileContext, Metadata},
    resource::{Res, ResourceId},
};

pub(crate) mod deps;
pub mod loader;

/// Shared between module graphs.
#[derive(Default)]
pub struct EsmLoaderStorage {
    cache: Mutex<AHashMap<Arc<FileName>, AnalyzedFile>>,
}

#[derive(Debug, Clone)]
pub(crate) struct AnalyzedFile {
    pub res: Res<EsModule>,
    pub deps: Option<Arc<Vec<Res<EsModule>>>>,
}

impl EsmLoaderStorage {
    pub(crate) async fn get(&self, filename: &Arc<FileName>) -> Option<AnalyzedFile> {
        self.cache.lock().await.get(filename).cloned()
    }

    /// Returns true if this is first insert of `filename`.
    pub(crate) async fn insert(&self, filename: Arc<FileName>, module: Res<EsModule>) -> bool {
        match self.cache.lock().await.entry(filename) {
            Entry::Occupied(_) => false,
            Entry::Vacant(e) => {
                e.insert(AnalyzedFile {
                    res: module,
                    deps: None,
                });
                true
            }
        }
    }

    pub(crate) async fn insert_deps(&self, filename: Arc<FileName>, deps: Vec<Res<EsModule>>) {
        match self.cache.lock().await.entry(filename) {
            Entry::Occupied(mut e) => {
                let v = e.get().clone();

                e.insert(AnalyzedFile {
                    res: v.res,
                    deps: Some(Arc::new(deps)),
                });
            }
            Entry::Vacant(..) => {
                unreachable!("insert_deps called before insert")
            }
        }
    }

    pub(crate) async fn get_deps(
        &self,
        filename: &Arc<FileName>,
    ) -> Option<Arc<Vec<Res<EsModule>>>> {
        match self.cache.lock().await.get(filename) {
            Some(v) => v.deps.clone(),
            None => None,
        }
    }
}

///
///  - Applies typescript::strip and `resolver` pass.
///  - Caches modules.
#[async_trait]
pub trait EsmLoader: Send + Sync {
    async fn load_esm(
        &self,
        ctx: &mut EsmLoaderContext,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>>;
}

pub struct EsmLoaderContext<'a> {
    pub base: FileContext<'a>,
}

#[derive(Debug)]
pub struct EsModule {
    pub name: Arc<FileName>,
    pub ast: Module,
}

/// Work on each ES modules and can change imports.
///
/// This is called after parsing but before resolving/loading dependencies.
///
/// # Caching
///
/// The implementor should handle cache. This is because cache
/// invalidation logic is different per preprocessor.
///
/// See the documentation of [Res] to know how cache works with `swcpack`.
#[async_trait]
pub trait EsmPreprocessor: Send + Sync {
    async fn preprocess_esm(
        &self,
        ctx: &mut EsmPreprocessorContext,
        m: &mut Res<EsModule>,
    ) -> Result<()>;
}

pub struct EsmPreprocessorContext<'a> {
    pub base: FileContext<'a>,
}

/// Work on each es modules. Used for applying transforms like babel or swc.
///
/// This is invoked after loading all dependencies, including assets.
#[async_trait]
pub trait EsmProcessor: Send + Sync {
    async fn process_esm(&self, m: &mut Res<EsModule>) -> Result<()>;
}
