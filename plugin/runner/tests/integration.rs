use std::path::PathBuf;

use swc_plugin_runner::resolve;

#[test]
fn test_resolve_1() {
    let path = resolve("internal-test").expect("failed to resolve");
}
