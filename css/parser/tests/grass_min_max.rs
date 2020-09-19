#[macro_use]
mod grass_macros;

test!(
    min_not_evaluated_units_percent,
    "a {\n  color: min(1%, 2%);\n}\n",
    "a {\n  color: min(1%, 2%);\n}\n"
);
test!(
    min_not_evaluated_units_px,
    "a {\n  color: min(1px, 2px);\n}\n",
    "a {\n  color: min(1px, 2px);\n}\n"
);
test!(
    min_not_evaluated_no_units,
    "a {\n  color: min(1, 2);\n}\n",
    "a {\n  color: min(1, 2);\n}\n"
);
test!(
    min_not_evaluated_incompatible_units,
    "a {\n  color: min(1%, 2vh);\n}\n",
    "a {\n  color: min(1%, 2vh);\n}\n"
);
test!(
    min_not_evaluated_interpolation,
    "$a: 1%;\n$b: 2%;\na {\n  color: min(#{$a}, #{$b});;\n}\n",
    "a {\n  color: min(1%, 2%);\n}\n"
);
test!(
    min_evaluated_variable_units_percent,
    "$a: 1%;\n$b: 2%;\na {\n  color: min($a, $b);\n}\n",
    "a {\n  color: 1%;\n}\n"
);
test!(
    min_evaluated_variable_units_px,
    "$a: 1px;\n$b: 2px;\na {\n  color: min($a, $b);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
error!(
    min_arg_of_incorrect_type,
    "$a: 1px;\n$b: 2px;\na {\n  color: min($a, $b, foo);\n}\n", "Error: foo is not a number."
);
error!(
    min_too_few_args,
    "a {\n  color: min();\n}\n", "Error: At least one argument must be passed."
);
// note: we explicitly have units in the opposite order of `dart-sass`.
// see https://github.com/sass/dart-sass/issues/766
error!(
    min_incompatible_units,
    "$a: 1px;\n$b: 2%;\na {\n  color: min($a, $b);\n}\n", "Error: Incompatible units px and %."
);
test!(
    max_not_evaluated_units_percent,
    "a {\n  color: max(1%, 2%);\n}\n",
    "a {\n  color: max(1%, 2%);\n}\n"
);
test!(
    max_not_evaluated_units_px,
    "a {\n  color: max(1px, 2px);\n}\n",
    "a {\n  color: max(1px, 2px);\n}\n"
);
test!(
    max_not_evaluated_no_units,
    "a {\n  color: max(1, 2);\n}\n",
    "a {\n  color: max(1, 2);\n}\n"
);
test!(
    max_not_evaluated_incompatible_units,
    "a {\n  color: max(1%, 2vh);\n}\n",
    "a {\n  color: max(1%, 2vh);\n}\n"
);
test!(
    max_not_evaluated_interpolation,
    "$a: 1%;\n$b: 2%;\na {\n  color: max(#{$a}, #{$b});;\n}\n",
    "a {\n  color: max(1%, 2%);\n}\n"
);
test!(
    max_evaluated_variable_units_percent,
    "$a: 1%;\n$b: 2%;\na {\n  color: max($a, $b);\n}\n",
    "a {\n  color: 2%;\n}\n"
);
test!(
    max_evaluated_variable_units_px,
    "$a: 1px;\n$b: 2px;\na {\n  color: max($a, $b);\n}\n",
    "a {\n  color: 2px;\n}\n"
);
test!(
    max_evaluated_binop,
    "a {\n  color: max(100% - lightness(red) - 2%);\n}\n",
    "a {\n  color: 48%;\n}\n"
);
error!(
    max_arg_of_incorrect_type,
    "$a: 1px;\n$b: 2px;\na {\n  color: max($a, $b, foo);\n}\n", "Error: foo is not a number."
);
error!(
    max_too_few_args,
    "a {\n  color: max();\n}\n", "Error: At least one argument must be passed."
);
// note: we explicitly have units in the opposite order of `dart-sass`.
// see https://github.com/sass/dart-sass/issues/766
error!(
    max_incompatible_units,
    "$a: 1px;\n$b: 2%;\na {\n  color: max($a, $b);\n}\n", "Error: Incompatible units px and %."
);
// todo: special functions, min(calc(1), $b);
