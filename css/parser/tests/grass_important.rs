#[macro_use]
mod grass_macros;

grass_test!(
    keyword_important_lowercase,
    "a {\n  height: !important;\n}\n",
    "a {\n  height: !important;\n}\n"
);
grass_test!(
    keyword_important_uppercase,
    "a {\n  height: !IMPORTANT;\n}\n",
    "a {\n  height: !important;\n}\n"
);
grass_test!(
    keyword_important_at_start_of_list,
    "a {\n  height: !important 1 2 3;\n}\n",
    "a {\n  height: !important 1 2 3;\n}\n"
);
grass_test!(
    keyword_important_at_end_of_list,
    "a {\n  height: 1 2 3 !important;\n}\n",
    "a {\n  height: 1 2 3 !important;\n}\n"
);
grass_test!(
    keyword_important_inside_list,
    "a {\n  color: 1 2 !important 3 4;\n}\n",
    "a {\n  color: 1 2 !important 3 4;\n}\n"
);
grass_test!(
    whitespace_after_exclamation,
    "a {\n  color: !    important;\n}\n",
    "a {\n  color: !important;\n}\n"
);
