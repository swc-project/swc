use swc_common::FileName;
use swc_ecma_loader::resolvers::node::NodeModulesResolver;
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
