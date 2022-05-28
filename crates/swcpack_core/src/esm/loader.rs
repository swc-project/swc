use std::{collections::hash_map::Entry, sync::Arc};

use anyhow::Result;
use async_trait::async_trait;
use rustc_hash::FxHashMap;
use swc_common::{FileName, SourceMap};
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use tokio::sync::Mutex;

use super::{EsModule, EsmLoader, EsmLoaderContext};
use crate::{
    file::FileLoader,
    resource::{Res, ResourceIdGenerator},
};

pub struct ParsingEsmLoader<FL>
where
    FL: FileLoader,
{
    cm: Arc<SourceMap>,
    id_gen: ResourceIdGenerator,
    cache: Option<Mutex<FxHashMap<Arc<FileName>, CacheEntry>>>,
    file_loader: FL,
}

impl<FL> ParsingEsmLoader<FL>
where
    FL: FileLoader,
{
    pub fn new(
        cm: Arc<SourceMap>,
        id_gen: ResourceIdGenerator,
        cache: bool,
        file_loader: FL,
    ) -> Self {
        Self {
            cm,
            id_gen,
            cache: if cache {
                Some(Default::default())
            } else {
                None
            },
            file_loader,
        }
    }
}

struct CacheEntry {
    prev: Res<Vec<u8>>,
    parsed: Res<EsModule>,
}

#[async_trait]
impl<FL> EsmLoader for ParsingEsmLoader<FL>
where
    FL: FileLoader,
{
    async fn load_esm(
        &self,
        _: &mut EsmLoaderContext,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>> {
        let content = self.file_loader.load_file(filename.clone()).await?;

        if let Some(cache) = &self.cache {
            match cache.lock().await.entry(filename.clone()) {
                Entry::Occupied(e) => {
                    // If the cache is fresh, return it.
                    if content.ptr_eq(&e.get().prev) {
                        return Ok(e.get().parsed.clone());
                    }

                    if **content == **e.get().prev {
                        // warn!(
                        //     "File content is not changed, but the file loader created a new \
                        //      Resource"
                        // );
                        return Ok(e.get().parsed.clone());
                    }
                }
                Entry::Vacant(..) => {}
            }
        }

        let fm = self.cm.new_source_file(
            (*filename).clone(),
            String::from_utf8_lossy(&content).into_owned(),
        );

        let m = parse_file_as_module(
            &fm,
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            swc_ecma_ast::EsVersion::latest(),
            None,
            &mut vec![],
        )
        .map_err(|e| anyhow::anyhow!("failed to parse file: {:?}", e))?;

        let result = Res::new(
            &self.id_gen,
            EsModule {
                name: filename.clone(),
                ast: m,
            },
        );

        if let Some(cache) = &self.cache {
            cache.lock().await.insert(
                filename.clone(),
                CacheEntry {
                    prev: content,
                    parsed: result.clone(),
                },
            );
        }

        Ok(result)
    }
}
