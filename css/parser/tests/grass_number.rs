#[macro_use]
mod grass_macros;

// this is `1` for node-sass, but .999999etc for web compiler
grass_test!(
    precision_does_not_round_up,
    "a {\n  color: 0.99999999991;\n}\n",
    "a {\n  color: 0.9999999999;\n}\n"
);
// this is `1` for node-sass, but .999999etc for web compiler
grass_test!(
    precision_does_round_up,
    "a {\n  color: 1.00000000009;\n}\n",
    "a {\n  color: 1.0000000001;\n}\n"
);
grass_test!(
    many_nines_becomes_one,
    "a {\n  color: 0.9999999999999999;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    many_nines_becomes_one_neg,
    "a {\n  color: -0.9999999999999999;\n}\n",
    "a {\n  color: -1;\n}\n"
);
grass_test!(
    negative_zero,
    "a {\n  color: -0;\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    decimal_is_zero,
    "a {\n  color: 1.0000;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(many_nines_not_rounded, "a {\n  color: 0.999999;\n}\n");
grass_test!(positive_integer, "a {\n  color: 1;\n}\n");
grass_test!(negative_integer, "a {\n  color: -1;\n}\n");
grass_test!(
    positive_float_no_leading_zero,
    "a {\n  color: .1;\n}\n",
    "a {\n  color: 0.1;\n}\n"
);
grass_test!(
    negative_float_no_leading_zero,
    "a {\n  color: -.1;\n}\n",
    "a {\n  color: -0.1;\n}\n"
);
grass_test!(positive_float_leading_zero, "a {\n  color: 0.1;\n}\n");
grass_test!(negative_float_leading_zero, "a {\n  color: -0.1;\n}\n");
grass_test!(
    negative_near_zero_no_sign,
    "a {\n  color: -0.000000000001;\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    equality_unit_conversions,
    "a {\n  color: 1in == 96px;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    positive_scientific_notation,
    "a {\n  color: 1e5;\n}\n",
    "a {\n  color: 100000;\n}\n"
);
grass_test!(
    positive_scientific_notation_leading_zeroes,
    "a {\n  color: 1e05;\n}\n",
    "a {\n  color: 100000;\n}\n"
);
grass_test!(
    positive_scientific_notation_capital,
    "a {\n  color: 1E5;\n}\n",
    "a {\n  color: 100000;\n}\n"
);
grass_test!(
    negative_scientific_notation,
    "a {\n  color: 1e-5;\n}\n",
    "a {\n  color: 0.00001;\n}\n"
);
grass_test!(
    negative_scientific_notation_leading_zeroes,
    "a {\n  color: 1e-05;\n}\n",
    "a {\n  color: 0.00001;\n}\n"
);
grass_test!(
    negative_scientific_notation_capital,
    "a {\n  color: 1E-5;\n}\n",
    "a {\n  color: 0.00001;\n}\n"
);
grass_test!(
    positive_scientific_notation_decimal,
    "a {\n  color: 1.2e5;\n}\n",
    "a {\n  color: 120000;\n}\n"
);
grass_test!(
    negative_scientific_notation_decimal,
    "a {\n  color: 1.2e-5;\n}\n",
    "a {\n  color: 0.000012;\n}\n"
);
grass_test!(unit_e, "a {\n  color: 1e;\n}\n");
grass_test!(
    positive_scientific_notation_zero,
    "a {\n  color: 1e0;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    negative_scientific_notation_zero,
    "a {\n  color: 1e-0;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    scientific_notation_decimal,
    "a {\n  color: 1.2e5.5;\n}\n",
    "a {\n  color: 120000 0.5;\n}\n"
);
grass_test!(
    binary_op_with_e_as_unit,
    "a {\n  color: 1e - 2;\n}\n",
    "a {\n  color: -1e;\n}\n"
);
grass_error!(
    scientific_notation_nothing_after_dash_in_style,
    "a {\n  color: 1e-;\n}\n",
    "Error: Expected digit."
);
grass_error!(
    scientific_notation_nothing_after_dash,
    "a {\n  color: 1e-",
    "Error: Expected digit."
);
grass_error!(
    scientific_notation_whitespace_after_dash,
    "a {\n  color: 1e- 2;\n}\n",
    "Error: Expected digit."
);
grass_error!(
    scientific_notation_ident_char_after_dash,
    "a {\n  color: 1e-a;\n}\n",
    "Error: Expected digit."
);
grass_test!(
    number_overflow_from_addition,
    "a {\n  color: 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999
                + 999999999999999999;\n}\n",
    "a {\n  color: 9999999999999999990;\n}\n"
);
grass_test!(
    number_overflow_from_multiplication,
    "a {\n  color: 999999999999999999 * 10;\n}\n",
    "a {\n  color: 9999999999999999990;\n}\n"
);
grass_test!(
    number_overflow_from_division,
    "a {\n  color: (999999999999999999 / .1);\n}\n",
    "a {\n  color: 9999999999999999990;\n}\n"
);
// we use arbitrary precision, so it is necessary to limit the size of exponents
// in order to prevent hangs
grass_error!(
    scientific_notation_too_positive,
    "a {\n  color: 1e100;\n}\n",
    "Error: Exponent too large."
);
grass_error!(
    scientific_notation_too_negative,
    "a {\n  color: 1e-100;\n}\n",
    "Error: Exponent too negative."
);
