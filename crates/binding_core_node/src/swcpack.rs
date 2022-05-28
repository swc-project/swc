use std::sync::Arc;

use napi::{Env, JsFunction, JsObject};
use swc_common::{FileName, SourceMap};
use swc_ecma_loader::resolvers::node::NodeModulesResolver;
use swcpack::{
    TestAssetGraphPlugin, TestAssetLoader, TestAssetPlugin, TestBundleProcessor,
    TestEsmPreprocessor, TestEsmProcessor, TestFileLoader,
};
use swcpack_core::{
    driver::Driver,
    esm::{loader::ParsingEsmLoader, EsmLoader, EsmPreprocessor},
    file::FileLoader,
    resource::ResourceIdGenerator,
    Bundler, Mode,
};
use swcpack_node_interop::{JsEsmPreprocessor, JsFileLoader};

#[napi]
fn swcpack(env: Env, inputs: Vec<String>, hooks: JsObject) -> napi::Result<JsObject> {
    swc_nodejs_common::init_default_trace_subscriber();

    let cm = Arc::new(SourceMap::default());
    let id_gen = ResourceIdGenerator::default();

    let file_loader = hooks.get::<_, JsFunction>("loadEsm")?;
    let file_loader = file_loader
        .map(|f| JsFileLoader::new(id_gen.clone(), &env, &f))
        .transpose()?
        .map(|v| Arc::new(v) as Arc<dyn FileLoader>)
        .unwrap_or_else(|| {
            Arc::new(TestFileLoader {
                id_gen: id_gen.clone(),
            }) as Arc<dyn FileLoader>
        });

    let esm_preprocessor = hooks.get::<_, JsFunction>("preprocessEsm")?;

    let mode = Mode {
        resolver: Arc::new(NodeModulesResolver::default()),
        esm_loader: Arc::new(ParsingEsmLoader::new(
            cm,
            id_gen.clone(),
            false,
            file_loader,
        )),
        esm_preprocessor: esm_preprocessor
            .map(|f| JsEsmPreprocessor::new(id_gen.clone(), &env, &f))
            .transpose()?
            .map(|v| Arc::new(v) as Arc<dyn EsmPreprocessor>)
            .unwrap_or_else(|| Arc::new(TestEsmPreprocessor {}) as Arc<dyn EsmPreprocessor>),
        esm_processor: Arc::new(TestEsmProcessor {}),
        asset_loader: Arc::new(TestAssetLoader {}),
        asset_processor: Arc::new(TestAssetPlugin {}),
        asset_graph_plugin: Arc::new(TestAssetGraphPlugin {}),
        bundle_processor: Arc::new(TestBundleProcessor {}),
    };

    env.execute_tokio_future(
        async move {
            // Type annotation

            let mut bundler = Bundler::new(Driver::new(
                mode,
                Box::new(
                    inputs
                        .into_iter()
                        .map(|s| Arc::new(FileName::Real(s.into())))
                        .collect::<Vec<_>>(),
                ),
            ));

            let output = bundler.bundle().await.map_err(|e| {
                napi::Error::new(napi::Status::Unknown, format!("failed to bundle, {}", e))
            })?;

            Ok(String::new())
        },
        |&mut env, data| env.create_string(&data),
    )
}
