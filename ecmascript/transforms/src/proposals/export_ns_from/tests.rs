use super::export_namespace_from;
use ast::*;
use swc_common::Fold;
use swc_ecma_parser::{EsConfig, Syntax};

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        export_namespace_from: true,
        ..Default::default()
    })
}

fn tr() -> impl Fold<Module> {
    export_namespace_from()
}

test!(
    syntax(),
    |_| tr(),
    namespace_compound_es6,
    r"export * as foo, { bar } from 'bar';",
    "import * as _foo from 'bar';
export { _foo as foo };
export { bar } from 'bar';
"
);

test!(
    syntax(),
    |_| tr(),
    namespace_default,
    "export * as default from 'foo';",
    "import * as _default from 'foo';
export { _default as default };"
);

test!(
    syntax(),
    |_| tr(),
    namespace_es6,
    "export * as foo from 'bar';",
    "import * as _foo from 'bar';
export { _foo as foo };"
);
