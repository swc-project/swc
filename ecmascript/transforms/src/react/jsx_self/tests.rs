use super::*;

fn tr() -> impl Fold<Module> {
    jsx_self(true)
}

test!(
    tr(),
    basic_sample,
    r#"var x = <sometag />"#,
    r#"var x = <sometag __self={this} />;"#
);
