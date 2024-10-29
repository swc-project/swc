use swc_ecma_ast::Pass;
use swc_ecma_parser::{EsSyntax, Syntax};
use swc_ecma_transforms_proposal::import_assertions;
use swc_ecma_transforms_testing::test;

fn tr() -> impl Pass {
    import_assertions()
}

fn syntax() -> Syntax {
    Syntax::Es(EsSyntax {
        import_attributes: true,
        ..Default::default()
    })
}

test!(
    syntax(),
    |_| tr(),
    import_with_assertions,
    r#"import test from "./test.json" assert {type: "json"};"#
);

test!(
    syntax(),
    |_| tr(),
    side_effect_import_with_assertions,
    r#"import "./test.json" assert {type: "json"};"#
);

test!(
    syntax(),
    |_| tr(),
    named_export_with_assertions,
    r#"export {default as test} from "./test.json" assert {type: "json"};"#
);

test!(
    syntax(),
    |_| tr(),
    export_all_with_assertions,
    r#"export * from "./test.json" assert {type: "json"};"#
);
