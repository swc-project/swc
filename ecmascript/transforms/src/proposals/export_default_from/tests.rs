use super::export_default_from;
use ast::*;
use swc_common::Fold;
use swc_ecma_parser::{EsConfig, Syntax};

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        export_default_from: true,
        ..Default::default()
    })
}

fn tr() -> impl Fold<Module> {
    export_default_from()
}

test!(
    syntax(),
    |_| tr(),
    default_es6,
    r#"export foo from "bar";"#,
    r#"
import _foo from "bar";
export { _foo as foo };
"#
);

test!(
    syntax(),
    |_| tr(),
    default_compounded_es6,
    r#"export v, { x, y as w } from "mod";"#,
    r#"
import _v from "mod";
export { _v as v };
export { x, y as w } from "mod";
"#
);
