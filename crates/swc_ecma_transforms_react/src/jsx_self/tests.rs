use swc_ecma_transforms_testing::test;

use super::*;

fn tr() -> impl Fold {
    jsx_self(true)
}

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: ::swc_ecma_parser::JSXKind::Bool(true),
        ..Default::default()
    }),
    |_| tr(),
    basic_sample,
    r#"var x = <sometag />"#,
    r#"var x = <sometag __self={this} />;"#
);
