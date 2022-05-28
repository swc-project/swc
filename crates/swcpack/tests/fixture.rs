#![feature(box_syntax)]

use std::{fs::read_dir, path::PathBuf, sync::Arc};

use swc_common::{FileName, SourceMap};
use swc_ecma_loader::resolvers::node::NodeModulesResolver;
use swcpack::{
    TestAssetGraphPlugin, TestAssetLoader, TestAssetPlugin, TestBundleProcessor,
    TestEsmPreprocessor, TestEsmProcessor,
};
use swcpack_core::{
    driver::Driver, esm::loader::ParsingEsmLoader, resource::ResourceIdGenerator, Bundler, Mode,
};

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

        let id_generator = ResourceIdGenerator::default();

        let mut bundler = Bundler::new(Driver::new(
            Mode {
                resolver: Arc::new(NodeModulesResolver::default()),
                esm_loader: Arc::new(ParsingEsmLoader::new()),
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
