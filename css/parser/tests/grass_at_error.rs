#[macro_use]
mod grass_macros;

error!(
    error_dblquoted_string,
    "a {\n  @error \"hi\";\n}\n", "Error: \"hi\""
);
error!(
    error_sglquoted_string,
    "a {\n  @error 'hi';\n}\n", "Error: \"hi\""
);
error!(error_unquoted_string, "a {\n  @error hi;\n}\n", "Error: hi");
error!(error_arithmetic, "a {\n  @error 1 + 1;\n}\n", "Error: 2");
error!(
    error_is_inspected,
    "a {\n  @error null;\n}\n", "Error: null"
);
