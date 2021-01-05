use super::*;
use swc_ecma_transforms_testing::test;

fn tr() -> impl Fold {
    jsx_self(true)
}

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(),
    basic_sample,
    r#"var x = <sometag />"#,
    r#"var x = <sometag __self={this} />;"#
);
