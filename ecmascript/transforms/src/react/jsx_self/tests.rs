use super::*;

fn tr() -> impl Fold<Module> {
    jsx_self(true)
}

test!(
    ::swc_ecma_parser::Syntax::Es(::swc_ecma_parser::EsConfig {
        jsx: true,
        ..Default::default()
    }),
    |_, _| tr(),
    basic_sample,
    r#"var x = <sometag />"#,
    r#"var x = <sometag __self={this} />;"#
);
