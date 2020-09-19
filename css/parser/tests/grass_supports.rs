#[macro_use]
mod grass_macros;

grass_test!(
    style_following,
    "@supports (a: b) {
        a {
            color: red;
        }
    }

    a {
        color: green;
    }",
    "@supports (a: b) {\n  a {\n    color: red;\n  }\n}\na {\n  color: green;\n}\n"
);
