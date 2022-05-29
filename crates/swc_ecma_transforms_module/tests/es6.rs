use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax, TsConfig};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_module::{
    es6::{es6, Config},
    hoist::module_hoister,
};
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        ..Default::default()
    })
}
fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsConfig {
        ..Default::default()
    })
}

fn tr(config: Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        module_hoister(),
        es6(config)
    )
}

test!(
    ts_syntax(),
    |_| tr(Config {
        create_require: true,
        ..Default::default()
    }),
    issue_4101,
    "expressionBeforeImports;
import {unrelated} from \"unrelated\";
import foo = require(\"foo\");
import bar = require(\"bar\");
const require = \"this var should be renamed to avoid conflict with require function\";
foo, bar, unrelated;",
    "import {createRequire as _createRequire} from \"module\";
const require = _createRequire(import.meta.url);
import {unrelated} from \"unrelated\";
expressionBeforeImports;
import foo = require(\"foo\");
import bar = require(\"bar\");
const require1 = \"this var should be renamed to avoid conflict with require function\";
foo, bar, unrelated;
"
);
