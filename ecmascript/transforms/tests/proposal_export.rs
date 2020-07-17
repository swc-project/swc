#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]

use swc_common::Fold;
use swc_ecma_ast::*;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms::proposals::export;

#[macro_use]
mod common;

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

fn tr() -> impl Fold<Module> {
    export()
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
