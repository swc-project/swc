use std::path::{Path, PathBuf};

use swc_common::FileName;
use swc_ecma_loader::resolvers::{node::NodeModulesResolver, tsc::TsConfigResolver};
use swc_ecma_transforms_module::path::{ImportResolver, NodeImportResolver};
use testing::run_test2;

type TestProvider = NodeImportResolver<NodeModulesResolver>;

#[test]
fn node_modules() {
    let provider = TestProvider::default();

    run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Real("foo".into()), "".into());

        let resolved = provider
            .resolve_import(&fm.name, "core-js")
            .expect("should success");

        assert_eq!(&*resolved, "core-js");

        Ok(())
    })
    .unwrap();
}

type JscPathsProvider = NodeImportResolver<TsConfigResolver<NodeModulesResolver>>;

fn paths_resolver(
    base_url: impl AsRef<Path>,
    rules: Vec<(String, Vec<String>)>,
) -> JscPathsProvider {
    NodeImportResolver::new(TsConfigResolver::new(
        NodeModulesResolver::new(swc_ecma_loader::TargetEnv::Node, Default::default(), true),
        base_url.as_ref().to_path_buf(),
        rules,
    ))
}

#[testing::fixture("tests/paths/**/input")]
fn fixture(input_dir: PathBuf) {}

/// Test for preserving user-specified extension
#[test]
fn jsc_paths_issue_4619_1() {
    let provider = paths_resolver("tests/paths/issue-4619/1/", vec![]);

    run_test2(false, |cm, _| {
        let fm = cm
            .load_file(Path::new("tests/paths/issue-4619/1/index.ts"))
            .unwrap();

        let resolved = provider
            .resolve_import(&fm.name, "./rel.decorator.js")
            .expect("should success");

        assert_eq!(&*resolved, "./rel.decorator.js");

        Ok(())
    })
    .unwrap();
}

/// Test for preserving user-specified extension
#[test]
fn jsc_paths_issue_4619_2() {
    let provider = paths_resolver("tests/paths/issue-4619/2/", vec![]);

    run_test2(false, |cm, _| {
        let fm = cm
            .load_file(Path::new("tests/paths/issue-4619/2/index.ts"))
            .unwrap();

        let resolved = provider
            .resolve_import(&fm.name, "./rel.decorator")
            .expect("should success");

        assert_eq!(&*resolved, "./rel.decorator");

        Ok(())
    })
    .unwrap();
}

#[test]
fn jsc_paths_1() {
    let provider = paths_resolver("paths/1/", vec![("@/src/*".into(), vec!["./src".into()])]);

    run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Real("src/foo".into()), "".into());

        let resolved = provider
            .resolve_import(&fm.name, "@/src/bar.js")
            .expect("should success");

        assert_eq!(&*resolved, "core-js");

        Ok(())
    })
    .unwrap();
}
