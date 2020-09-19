#[macro_use]
mod grass_macros;

grass_test!(
    if_true,
    "a {\n  color: if(true, 1, 2)\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    if_equal,
    "a {\n  color: if(1 == 1, 1, 2)\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    if_not_equal,
    "a {\n  color: if(1 != 1, 1, 2)\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    if_named_args,
    "a {\n  color: if($condition: true, $if-true: 1, $if-false: 2)\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    if_false,
    "a {\n  color: if(false, 1, 2);\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    feature_exists_dbl_quoted,
    "a {\n  color: feature-exists(\"at-error\")\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_sgl_quoted,
    "a {\n  color: feature-exists('at-error')\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_no_quotes,
    "a {\n  color: feature-exists(at-error)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_at_error,
    "a {\n  color: feature-exists(at-error)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_named_arg,
    "a {\n  color: feature-exists($feature: at-error)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_case_sensitive,
    "a {\n  color: feature-exists(at-erroR)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    feature_exists_global_variable_shadowing,
    "a {\n  color: feature-exists(global-variable-shadowing)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_extend_selector_pseudoclass,
    "a {\n  color: feature-exists(extend-selector-pseudoclass)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_units_level_3,
    "a {\n  color: feature-exists(units-level-3)\n}\n",
    "a {\n  color: true;\n}\n"
);
// Unignore as more features are added
grass_test!(
    #[ignore]
    feature_exists_custom_property,
    "a {\n  color: feature-exists(custom-property)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    feature_exists_nonsense,
    "a {\n  color: feature-exists(foo)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    feature_exists_at_error_named_arg,
    "a {\n  color: feature-exists($feature: at-error)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    unit_px,
    "a {\n  color: unit(1px)\n}\n",
    "a {\n  color: \"px\";\n}\n"
);
grass_test!(
    unit_none,
    "a {\n  color: unit(1)\n}\n",
    "a {\n  color: \"\";\n}\n"
);
grass_test!(
    unit_named_args,
    "a {\n  color: unit($number: 1px)\n}\n",
    "a {\n  color: \"px\";\n}\n"
);
grass_test!(
    type_of_number,
    "a {\n  color: type-of(1)\n}\n",
    "a {\n  color: number;\n}\n"
);
grass_test!(
    type_of_number_unit,
    "a {\n  color: type-of(1px)\n}\n",
    "a {\n  color: number;\n}\n"
);
grass_test!(
    type_of_unquoted,
    "a {\n  color: type-of(foo)\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_sgl_unquoted,
    "a {\n  color: type-of('red')\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_dbl_unquoted,
    "a {\n  color: type-of(\"red\")\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_3_hex_color,
    "a {\n  color: type-of(#fff)\n}\n",
    "a {\n  color: color;\n}\n"
);
grass_test!(
    type_of_6_hex_color,
    "a {\n  color: type-of(#ffffff)\n}\n",
    "a {\n  color: color;\n}\n"
);
grass_test!(
    type_of_named_color,
    "a {\n  color: type-of(red)\n}\n",
    "a {\n  color: color;\n}\n"
);
grass_test!(
    type_of_empty_list,
    "a {\n  color: type-of(())\n}\n",
    "a {\n  color: list;\n}\n"
);
grass_test!(
    type_of_spaced_list,
    "a {\n  color: type-of(1 2 3)\n}\n",
    "a {\n  color: list;\n}\n"
);
grass_test!(
    type_of_important,
    "a {\n  color: type-of(!important)\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_true,
    "a {\n  color: type-of(true)\n}\n",
    "a {\n  color: bool;\n}\n"
);
grass_test!(
    type_of_false,
    "a {\n  color: type-of(false)\n}\n",
    "a {\n  color: bool;\n}\n"
);
grass_test!(
    type_of_null,
    "a {\n  color: type-of(null)\n}\n",
    "a {\n  color: null;\n}\n"
);
grass_test!(
    type_of_ident_plus_ident,
    "a {\n  color: type-of(hi + bye)\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_map,
    "a {\n  color: type-of((a: b, c: d))\n}\n",
    "a {\n  color: map;\n}\n"
);
grass_test!(
    type_of_parens,
    "a {\n  color: type-of(((a)))\n}\n",
    "a {\n  color: string;\n}\n"
);
grass_test!(
    type_of_unary_op,
    "a {\n  color: type-of(- 2)\n}\n",
    "a {\n  color: number;\n}\n"
);
grass_test!(
    type_of_nan,
    "a {\n  color: type-of((0 / 0))\n}\n",
    "a {\n  color: number;\n}\n"
);
grass_test!(
    type_of_arglist,
    "@mixin foo($a...) {color: type-of($a);}\na {@include foo(1, 2, 3, 4, 5);}",
    "a {\n  color: arglist;\n}\n"
);
grass_test!(
    unitless_px,
    "a {\n  color: unitless(1px)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    unitless_num,
    "a {\n  color: unitless(1)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_error!(
    unitless_string,
    "a {\n  color: unitless(foo)\n}\n",
    "Error: $number: foo is not a number."
);
grass_test!(
    variable_does_exist,
    "$a: red; a {\n  color: variable-exists(a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    variable_does_not_exist,
    "a {\n  color: variable-exists(a)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    variable_exists_named,
    "$a: red; a {\n  color: variable-exists($name: a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    variable_exists_quoted,
    "$a: red; a {\n  color: variable-exists('a')\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    variable_exists_local_is_null,
    "a {\n  $a: null; color: variable-exists(a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    variable_exists_global_is_null,
    "$a: null; a {\n  color: variable-exists(a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_error!(
    variable_exists_not_string,
    "a {\n  color: variable-exists(12px)\n}\n",
    "Error: $name: 12px is not a string."
);
grass_test!(
    mixin_does_exist,
    "@mixin a{} a {\n  color: mixin-exists(a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    mixin_does_not_exist,
    "a {\n  color: mixin-exists(a)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    mixin_exists_named,
    "@mixin a{} a {\n  color: mixin-exists($name: a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    function_does_exist,
    "@function a(){} a {\n  color: function-exists(a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    builtin_function_does_exist,
    "a {\n  color: function-exists(function-exists)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    function_does_not_exist,
    "a {\n  color: function-exists(a)\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    function_exists_named,
    "@function a(){} a {\n  color: function-exists($name: a)\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_error!(
    function_exists_non_string,
    "a {color: function-exists(12px)}",
    "Error: $name: 12px is not a string."
);
grass_error!(
    mixin_exists_non_string,
    "a {color: mixin-exists(12px)}",
    "Error: $name: 12px is not a string."
);
