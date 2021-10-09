//! Ensure that worng macro definitions are catched by swc monorepo.

use swc_ecma_visit::Fold;
use swc_plugin::define_js_plugin;

define_js_plugin!(drop_console);

fn drop_console(_: ()) -> impl Fold {
    DropConsole
}

struct DropConsole;

impl Fold for DropConsole {}
