use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_compat::es2020::export_namespace_from;
use swc_ecma_transforms_proposal::export_default_from;
use swc_ecma_transforms_testing::test;

fn syntax_default() -> Syntax {
    Syntax::Es(EsSyntax {
        export_default_from: true,
        ..Default::default()
    })
}
fn syntax_namespace() -> Syntax {
    Syntax::Es(Default::default())
}

fn tr() -> impl Pass {
    (export_default_from(), export_namespace_from())
}

test!(
    syntax_default(),
    |_| tr(),
    default_es6,
    r#"export foo from "bar";"#
);

test!(
    syntax_default(),
    |_| tr(),
    default_compounded_es6,
    r#"export v, { x, y as w } from "mod";"#
);

test!(
    syntax_default(),
    |_| tr(),
    namespace_compound_es6,
    r"export * as foo, { bar } from 'bar';"
);

test!(
    syntax_namespace(),
    |_| tr(),
    namespace_default,
    "export * as default from 'foo';"
);

test!(
    syntax_namespace(),
    |_| tr(),
    namespace_es6,
    "export * as foo from 'bar';"
);
