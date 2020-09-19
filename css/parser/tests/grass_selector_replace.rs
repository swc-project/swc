#[macro_use]
mod grass_macros;

grass_test!(
    simple,
    "a {\n  color: selector-replace(\"c\", \"c\", \"d\");\n}\n",
    "a {\n  color: d;\n}\n"
);
grass_test!(
    compound,
    "a {\n  color: selector-replace(\"c.d\", \"c\", \"e\");\n}\n",
    "a {\n  color: e.d;\n}\n"
);
grass_test!(
    complex,
    "a {\n  color: selector-replace(\"c d\", \"d\", \"e f\");\n}\n",
    "a {\n  color: c e f, e c f;\n}\n"
);
grass_test!(
    psuedo_matches,
    "a {\n  color: selector-replace(\":matches(c)\", \"c\", \"d\");\n}\n",
    "a {\n  color: :matches(d);\n}\n"
);
grass_test!(
    psuedo_not,
    "a {\n  color: selector-replace(\":not(c)\", \"c\", \"d\");\n}\n",
    "a {\n  color: :not(d);\n}\n"
);
grass_test!(
    no_op,
    "a {\n  color: selector-replace(\"c\", \"d\", \"e\");\n}\n",
    "a {\n  color: c;\n}\n"
);
grass_test!(
    partial_no_op,
    "a {\n  color: selector-replace(\"c, d\", \"d\", \"e\");\n}\n",
    "a {\n  color: c, e;\n}\n"
);
