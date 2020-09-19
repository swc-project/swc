#[macro_use]
mod grass_macros;

test!(
    not_number,
    "a {\n  color: not 1;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    not_true,
    "a {\n  color: not true;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    not_false,
    "a {\n  color: not false;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    not_null,
    "a {\n  color: not null;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    not_unquoted,
    "a {\n  color: not foo;\n}\n",
    "a {\n  color: false;\n}\n"
);
test!(
    not_not_true,
    "a {\n  color: not not true;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    not_not_false,
    "a {\n  color: not not false;\n}\n",
    "a {\n  color: false;\n}\n"
);
