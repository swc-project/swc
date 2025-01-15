use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use indexmap::IndexMap;
use serde::Deserialize;
use swc_common::FileName;
use swc_ecma_loader::resolvers::{node::NodeModulesResolver, tsc::TsConfigResolver};
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_module::{
    path::{ImportResolver, NodeImportResolver},
    rewriter::import_rewriter,
};
use swc_ecma_transforms_testing::{test_fixture, FixtureTestConfig};
use testing::run_test2;

type TestProvider = NodeImportResolver<NodeModulesResolver>;

#[test]
fn node_modules() {
    let provider = TestProvider::default();

    run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Real("foo".into()).into(), "".into());

        let resolved = provider
            .resolve_import(&fm.name, "core-js")
            .expect("should success");

        assert_eq!(&*resolved, "core-js");

        Ok(())
    })
    .unwrap();
}

#[test]
fn issue_4730() {
    let dir = Path::new("tests/fixture-manual/issue-4730")
        .canonicalize()
        .unwrap();
    let input_dir = dir.join("input");
    let output_dir = dir.join("output");

    test_fixture(
        Syntax::default(),
        &|_| {
            let mut paths = IndexMap::new();
            paths.insert(
                "@print/a".into(),
                vec![dir
                    .join("input")
                    .join("packages")
                    .join("a")
                    .join("src")
                    .join("index.js")
                    .display()
                    .to_string()],
            );
            paths.insert(
                "@print/b".into(),
                vec![dir
                    .join("input")
                    .join("packages")
                    .join("b")
                    .join("src")
                    .join("index.js")
                    .display()
                    .to_string()],
            );

            let rules = paths.into_iter().collect();

            let resolver = paths_resolver(&input_dir, rules);

            import_rewriter(
                FileName::Real(input_dir.join("src").join("index.js")),
                Arc::new(resolver),
            )
        },
        &input_dir.join("src").join("index.js"),
        &output_dir.join("index.js"),
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}

type JscPathsProvider = NodeImportResolver<TsConfigResolver<NodeModulesResolver>>;

fn paths_resolver(base_dir: &Path, rules: Vec<(String, Vec<String>)>) -> JscPathsProvider {
    let base_dir = base_dir
        .to_path_buf()
        .canonicalize()
        .expect("failed to canonicalize");
    dbg!(&base_dir);

    NodeImportResolver::with_config(
        TsConfigResolver::new(
            NodeModulesResolver::new(swc_ecma_loader::TargetEnv::Node, Default::default(), true),
            base_dir.clone(),
            rules,
        ),
        swc_ecma_transforms_module::path::Config {
            base_dir: Some(base_dir),
            resolve_fully: true,
            file_extension: swc_ecma_transforms_module::util::Config::default_js_ext(),
        },
    )
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct TestConfig {
    #[serde(default)]
    base_url: Option<PathBuf>,

    #[serde(default)]
    input_file: Option<String>,

    #[serde(default)]
    paths: IndexMap<String, Vec<String>>,
}

#[testing::fixture("tests/paths/**/input")]
fn fixture(input_dir: PathBuf) {
    let output_dir = input_dir.parent().unwrap().join("output");

    let paths_json_path = input_dir.join("config.json");
    let paths_json = std::fs::read_to_string(paths_json_path).unwrap();
    let config = serde_json::from_str::<TestConfig>(&paths_json).unwrap();

    let index_path = input_dir.join(config.input_file.as_deref().unwrap_or("index.ts"));
    dbg!(&index_path);

    let base_dir = input_dir
        .join(config.base_url.clone().unwrap_or(input_dir.clone()))
        .canonicalize()
        .unwrap();
    dbg!(&base_dir);
    test_fixture(
        Syntax::default(),
        &|_| {
            let rules = config.paths.clone().into_iter().collect();

            let resolver = paths_resolver(&base_dir, rules);

            import_rewriter(FileName::Real(index_path.clone()), Arc::new(resolver))
        },
        &index_path,
        &output_dir.join("index.ts"),
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}
