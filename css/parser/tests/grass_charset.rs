#[macro_use]
mod grass_macros;

grass_test!(
    utf8_input,
    "a {\n  color: 🦆;\n}\n",
    "@charset \"UTF-8\";\na {\n  color: 🦆;\n}\n"
);
grass_test!(
    ascii_charset_utf8,
    "@charset \"UTF-8\";\na {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    unknown_charset,
    "@charset \"foo\";\na {\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
