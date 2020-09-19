#[macro_use]
mod grass_macros;

test!(
    utf8_input,
    "a {\n  color: 🦆;\n}\n",
    "@charset \"UTF-8\";\na {\n  color: 🦆;\n}\n"
);
test!(
    ascii_charset_utf8,
    "@charset \"UTF-8\";\na {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    unknown_charset,
    "@charset \"foo\";\na {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
