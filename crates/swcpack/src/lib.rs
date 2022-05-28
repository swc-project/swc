use std::sync::Arc;

use anyhow::{bail, Context, Result};
use async_trait::async_trait;
use swc_common::{FileName, SourceMap};
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use swcpack_core::{
    asset::{AssetGraphPlugin, AssetLoader, AssetLoaderContext, AssetProcessor},
    bundle::BundleProcessor,
    esm::{EsModule, EsmLoader, EsmLoaderContext, EsmPreprocessor, EsmProcessor},
    resource::{Res, ResourceIdGenerator},
};

pub struct TestEsmLaoder {
    pub id_gen: ResourceIdGenerator,
    pub cm: Arc<SourceMap>,
}

#[async_trait]
impl EsmLoader for TestEsmLaoder {
    async fn load_esm(
        &self,
        ctx: &mut EsmLoaderContext,
        file: Arc<FileName>,
    ) -> Result<Res<EsModule>> {
        let fm = match &*file {
            FileName::Real(path) => self.cm.load_file(path).context("failed to load file")?,

            _ => {
                bail!("TestEsmLoader does not support {:?}", file)
            }
        };

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

        Ok(Res::new(
            &self.id_gen,
            EsModule {
                name: file.clone(),
                ast: m,
            },
        ))
    }
}

pub struct TestEsmPreprocessor {}

#[async_trait]
impl EsmPreprocessor for TestEsmPreprocessor {
    async fn preprocess_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
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
        ctx: AssetLoaderContext<'a>,
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
