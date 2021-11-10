use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_compat::es2020::export_namespace_from;
use swc_ecma_transforms_proposal::export_default_from;
use swc_ecma_transforms_testing::test;
use swc_ecma_visit::Fold;

fn syntax_default() -> Syntax {
    Syntax::Es(EsConfig {
        export_default_from: true,
        ..Default::default()
    })
}
fn syntax_namespace() -> Syntax {
    Syntax::Es(EsConfig {
        export_namespace_from: true,
        ..Default::default()
    })
}

fn tr() -> impl Fold {
    chain!(export_default_from(), export_namespace_from())
}

test!(
    syntax_default(),
    |_| tr(),
    default_es6,
    r#"export foo from "bar";"#,
    r#"
import _foo from "bar";
export { _foo as foo };
"#
);

test!(
    syntax_default(),
    |_| tr(),
    default_compounded_es6,
    r#"export v, { x, y as w } from "mod";"#,
    r#"
import _v from "mod";
export { _v as v };
export { x, y as w } from "mod";
"#
);

test!(
    syntax_namespace(),
    |_| tr(),
    namespace_compound_es6,
    r"export * as foo, { bar } from 'bar';",
    "import * as _foo from 'bar';
export { _foo as foo };
export { bar } from 'bar';
"
);

test!(
    syntax_namespace(),
    |_| tr(),
    namespace_default,
    "export * as default from 'foo';",
    "import * as _default from 'foo';
export { _default as default };"
);

test!(
    syntax_namespace(),
    |_| tr(),
    namespace_es6,
    "export * as foo from 'bar';",
    "import * as _foo from 'bar';
export { _foo as foo };"
);
