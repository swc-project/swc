use swc_common::{chain, pass::Repeat, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_optimization::simplify::dce::{dce, Config};
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn tr() -> impl Fold {
    Repeat::new(dce(
        Config {
            top_level: true,
            preserve_imports_with_side_effects: false,
            ..Default::default()
        },
        Mark::new(),
    ))
}

macro_rules! to {
    ($name:ident, $src:expr) => {
        test!(
            Syntax::Es(EsConfig {
                decorators: true,
                ..Default::default()
            }),
            |_| chain!(resolver(Mark::new(), Mark::new(), false), tr()),
            $name,
            $src
        );
    };
}

macro_rules! optimized_out {
    ($name:ident, $src:expr) => {
        to!($name, $src);
    };
}

macro_rules! noop {
    ($name:ident, $src:expr) => {
        to!($name, $src);
    };
}

to!(
    single_pass,
    "
    const a = 1;

    if (a) {
        const b = 2;
    }
    "
);

optimized_out!(import_default_unused, "import foo from 'foo'");

optimized_out!(import_specific_unused, "import {foo} from 'foo'");

optimized_out!(import_mixed_unused, "import foo, { bar } from 'foo'");

noop!(
    import_export_named,
    "import foo from 'src'; export { foo };"
);

to!(
    import_unused_export_named,
    "import foo, { bar } from 'src'; export { foo }; "
);
