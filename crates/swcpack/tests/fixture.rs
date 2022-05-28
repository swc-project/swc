#![feature(box_syntax)]

use std::{fs::read_dir, path::PathBuf, sync::Arc};

use anyhow::{bail, Context, Result};
use async_trait::async_trait;
use swc_common::{FileName, SourceMap};
use swc_ecma_loader::resolvers::node::NodeModulesResolver;
use swc_ecma_parser::{parse_file_as_module, EsConfig, Syntax};
use swcpack_core::{
    asset::{AssetGraphPlugin, AssetLoader, AssetLoaderContext, AssetProcessor},
    bundle::BundleProcessor,
    driver::Driver,
    esm::{EsModule, EsmLoader, EsmLoaderContext, EsmPreprocessor, EsmProcessor},
    resource::{Res, ResourceIdGenerator},
    Bundler, Mode,
};

struct TestEsmLaoder {
    generator: Arc<ResourceIdGenerator>,
    cm: Arc<SourceMap>,
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
            &self.generator,
            EsModule {
                name: file.clone(),
                ast: m,
            },
        ))
    }
}

struct TestEsmPreprocessor {}

#[async_trait]
impl EsmPreprocessor for TestEsmPreprocessor {
    async fn preprocess_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
        Ok(())
    }
}

struct TestEsmProcessor {}

#[async_trait]
impl EsmProcessor for TestEsmProcessor {
    async fn process_esm(&self, m: &mut Res<EsModule>) -> Result<()> {
        Ok(())
    }
}

struct TestAssetLoader {}

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

struct TestAssetPlugin {}

#[async_trait]
impl AssetProcessor for TestAssetPlugin {
    async fn process_asset(&self, m: &mut Res<EsModule>) -> Result<()> {
        todo!()
    }
}

struct TestAssetGraphPlugin {}

#[async_trait]
impl AssetGraphPlugin for TestAssetGraphPlugin {}

struct TestBundleProcessor {}

#[async_trait]
impl BundleProcessor for TestBundleProcessor {
    async fn process_bundle(&self, bundle: Vec<Res<EsModule>>) -> Result<()> {
        Ok(())
    }
}

#[testing::fixture("tests/projects/**/input")]
fn fixture(input_dir: PathBuf) {
    let _log = testing::init();

    let rt = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();

    rt.block_on(async move {
        let cm = Arc::new(SourceMap::default());

        let entries = read_dir(&input_dir)
            .unwrap()
            .into_iter()
            .filter_map(|e| e.ok())
            .filter(|e| e.file_name().to_string_lossy().starts_with("entry"))
            .map(|e| e.path())
            .map(FileName::Real)
            .map(Arc::new)
            .collect::<Vec<_>>();

        dbg!(&entries);

        let id_generator = Arc::new(ResourceIdGenerator::default());

        let mut bundler = Bundler::new(Driver::new(
            Mode {
                resolver: Arc::new(NodeModulesResolver::default()),
                esm_loader: Arc::new(TestEsmLaoder {
                    cm: cm.clone(),
                    generator: id_generator,
                }),
                esm_preprocessor: Arc::new(TestEsmPreprocessor {}),
                esm_processor: Arc::new(TestEsmProcessor {}),
                asset_loader: Arc::new(TestAssetLoader {}),
                asset_processor: Arc::new(TestAssetPlugin {}),
                asset_graph_plugin: Arc::new(TestAssetGraphPlugin {}),
                bundle_processor: Arc::new(TestBundleProcessor {}),
            },
            box entries,
        ));

        let res = bundler.bundle().await;

        res.unwrap();
    });
}
