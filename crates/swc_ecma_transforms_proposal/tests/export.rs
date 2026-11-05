use std::path::PathBuf;

use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax, TsSyntax};
use swc_ecma_transforms_compat::es2020::export_namespace_from;
use swc_ecma_transforms_proposal::export_default_from;
use swc_ecma_transforms_testing::{test, test_fixture, FixtureTestConfig};

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

test!(
    module,
    syntax_default(),
    |_| export_default_from(),
    empty_module,
    ""
);

test!(
    module,
    syntax_default(),
    |_| export_default_from(),
    module_unchanged,
    r#"
    import value from "input";
    export { value };
    export { other as renamed } from "other";
    export * as namespace from "namespace";
    export default function read() { return () => value; }
    "#
);

test!(
    syntax_default(),
    |_| export_default_from(),
    interleaved_default_exports,
    r#"
    before();
    export first from "one";
    between();
    export second, { value as renamed } from "two";
    after();
    "#
);

test!(
    syntax_default(),
    |_| export_default_from(),
    default_namespace_named,
    r#"export value, * as namespace, { other as renamed } from "source";"#
);

test!(
    syntax_default(),
    |_| tr(),
    default_namespace_named_composed,
    r#"export value, * as namespace, { other as renamed } from "source";"#
);

test!(
    syntax_default(),
    |_| export_default_from(),
    default_export_attributes,
    r#"
    export value from "first" with { type: "json" };
    export other, * as namespace from "second" with { type: "json" };
    "#
);

#[testing::fixture("tests/export-default-from/scripts/**/input.js")]
#[testing::fixture("tests/export-default-from/scripts/**/input.ts")]
fn script_unchanged(input: PathBuf) {
    let syntax = if input.extension().is_some_and(|ext| ext == "ts") {
        Syntax::Typescript(TsSyntax::default())
    } else {
        syntax_default()
    };
    test_fixture(
        syntax,
        &|_| export_default_from(),
        &input,
        &input.with_file_name("output.js"),
        FixtureTestConfig {
            module: Some(false),
            ..Default::default()
        },
    );
}
