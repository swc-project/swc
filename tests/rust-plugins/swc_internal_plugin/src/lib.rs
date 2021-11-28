use serde::Deserialize;
use swc_ecmascript::visit::Fold;
use swc_plugin::define_js_plugin;

define_js_plugin!(internal_test);

fn internal_test(_: Config) -> impl Fold {
    InternalTest
}

#[derive(Debug, Deserialize)]
struct Config {}

struct InternalTest;

impl Fold for InternalTest {}
