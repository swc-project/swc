use swc_ecma_transforms_testing::test;

use super::*;

fn tr() -> impl Pass {
    jsx_self(true)
}

test!(
    module,
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsSyntax {
        jsx: true,
        ..Default::default()
    }),
    |_| tr(),
    basic_sample,
    r#"var x = <sometag />"#
);
