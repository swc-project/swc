//! Ensure that wrong macro definitions are catched by swc monorepo.

use swc_ecma_visit::Fold;

fn drop_console(_: ()) -> impl Fold {
    DropConsole
}

struct DropConsole;

impl Fold for DropConsole {}
