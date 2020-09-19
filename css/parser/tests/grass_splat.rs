#[macro_use]
mod grass_macros;

grass_test!(
    splat_list_two_elements,
    "@function foo($a, $b) {
        @return $a+$b;
    }
    a {
        color: foo([1, 2]...);
    }",
    "a {\n  color: 3;\n}\n"
);
grass_test!(
    splat_map_single_key,
    "@function foo($a) {
        @return $a;
    }
    a {
        color: foo((a: b)...);
    }",
    "a {\n  color: b;\n}\n"
);
grass_test!(
    splat_single_value,
    "@function foo($a) {
        @return $a;
    }
    a {
        color: foo(1...);
    }",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    splat_map_quoted_string_as_key,
    "a {
        color: red((\"color\": red)...);
    }",
    "a {\n  color: 255;\n}\n"
);
grass_error!(
    splat_missing_last_period,
    "@function foo($a) {
        @return $a;
    }
    a {
        color: foo(1..);
    }",
    "Error: expected \".\"."
);
grass_error!(
    splat_with_named_arg,
    "@function foo($a) {
        @return $a;
    }
    a {
        color: foo($a: 1...);
    }",
    "Error: expected \")\"."
);
grass_error!(
    splat_map_with_non_string_key_map,
    "a {
        color: red(((a: b): red)...);
    }",
    "Error: (a: b) is not a string in ((a: b): red)."
);
grass_error!(
    splat_map_with_non_string_key_number,
    "a {
        color: red((1: red)...);
    }",
    "Error: 1 is not a string in (1: red)."
);
