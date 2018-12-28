use super::*;

fn tr() -> impl Fold<Module> {
    jsx_self(true)
}

test!(
    ::swc_ecma_parser::Syntax::Jsx,
    tr(),
    basic_sample,
    r#"var x = <sometag />"#,
    r#"var x = <sometag __self={this} />;"#
);
