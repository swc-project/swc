use swc_ecmascript::Fold;
use swc_plugin::define_js_plugin;

define_js_plugin!(internal_test);

fn internal_test(_: ()) -> impl Fold {
    InternalTest
}

struct InternalTest;

impl Fold for InternalTest {}
