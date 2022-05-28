use std::sync::Arc;

use napi::{CallContext, Env, JsFunction, JsObject, Task};
use swc_common::{collections::AHashMap, FileName, SourceFile, SourceMap};
use swc_ecma_loader::resolvers::node::NodeModulesResolver;
use swcpack::{
    TestAssetGraphPlugin, TestAssetLoader, TestAssetPlugin, TestBundleProcessor, TestEsmLaoder,
    TestEsmPreprocessor, TestEsmProcessor,
};
use swcpack_core::{driver::Driver, esm::EsmLoader, resource::ResourceIdGenerator, Bundler, Mode};
use swcpack_node_interop::JsEsmLoader;

use crate::TransformOutput;

#[napi]
fn swcpack(env: Env, inputs: Vec<String>, hooks: JsObject) -> napi::Result<()> {
    let cm = Arc::new(SourceMap::default());
    let id_gen = ResourceIdGenerator::default();

    let esm_loader = hooks.get::<_, JsFunction>("esmLoader")?;

    let mode = Mode {
        resolver: Arc::new(NodeModulesResolver::default()),
        esm_loader: esm_loader
            .map(|f| JsEsmLoader::new(cm.clone(), id_gen.clone(), &env, &f))
            .transpose()?
            .map(|v| Arc::new(v) as Arc<dyn EsmLoader>)
            .unwrap_or_else(|| {
                Arc::new(TestEsmLaoder {
                    cm: cm.clone(),
                    id_gen: id_gen.clone(),
                }) as Arc<dyn EsmLoader>
            }),
        esm_preprocessor: Arc::new(TestEsmPreprocessor {}),
        esm_processor: Arc::new(TestEsmProcessor {}),
        asset_loader: Arc::new(TestAssetLoader {}),
        asset_processor: Arc::new(TestAssetPlugin {}),
        asset_graph_plugin: Arc::new(TestAssetGraphPlugin {}),
        bundle_processor: Arc::new(TestBundleProcessor {}),
    };

    let rt = tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap();

    let task = rt.spawn(async move {
        // Type annotation
        if false {
            return Err(anyhow::anyhow!(""));
        }

        let mut bundler = Bundler::new(Driver::new(
            mode,
            Box::new(
                inputs
                    .into_iter()
                    .map(|s| Arc::new(FileName::Real(s.into())))
                    .collect::<Vec<_>>(),
            ),
        ));

        let output = bundler.bundle().await?;

        Ok(())
    });

    Ok(())
}
