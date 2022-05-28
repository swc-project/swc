use std::sync::Arc;

use anyhow::{bail, Context, Result};
use async_trait::async_trait;
use swc_common::{FileName, SourceMap};
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use swcpack_core::{
    asset::{AssetGraphPlugin, AssetLoader, AssetLoaderContext, AssetProcessor},
    bundle::BundleProcessor,
    esm::{
        EsModule, EsmLoader, EsmLoaderContext, EsmPreprocessor, EsmPreprocessorContext,
        EsmProcessor,
    },
    file::FileLoader,
    resource::{Res, ResourceIdGenerator},
};

pub struct TestFileLoader {
    pub id_gen: ResourceIdGenerator,
}

#[async_trait]
impl FileLoader for TestFileLoader {
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Res<Vec<u8>>> {
        match &*filename {
            FileName::Real(path) => {
                let content = std::fs::read(&path)?;
                return Ok(Res::new(&self.id_gen, content));
            }
            _ => {
                unimplemented!()
            }
        }
    }
}

pub struct TestEsmPreprocessor {}

#[async_trait]
impl EsmPreprocessor for TestEsmPreprocessor {
    async fn preprocess_esm(
        &self,
        ctx: &mut EsmPreprocessorContext,
        m: &mut Res<EsModule>,
    ) -> Result<()> {
        Ok(())
    }
}

pub struct TestEsmProcessor {}

#[async_trait]
impl EsmProcessor for TestEsmProcessor {
    async fn process_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
        Ok(())
    }
}

pub struct TestAssetLoader {}

#[async_trait]
impl AssetLoader for TestAssetLoader {
    async fn load_asset<'a>(
        &'a self,
        ctx: &mut AssetLoaderContext<'a>,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>> {
        bail!("todo")
    }
}

pub struct TestAssetPlugin {}

#[async_trait]
impl AssetProcessor for TestAssetPlugin {
    async fn process_asset(&self, m: &mut Res<EsModule>) -> Result<()> {
        todo!()
    }
}

pub struct TestAssetGraphPlugin {}

#[async_trait]
impl AssetGraphPlugin for TestAssetGraphPlugin {}

pub struct TestBundleProcessor {}

#[async_trait]
impl BundleProcessor for TestBundleProcessor {
    async fn process_bundle(&self, bundle: Vec<Res<EsModule>>) -> Result<()> {
        Ok(())
    }
}
