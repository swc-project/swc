#[macro_use]
mod grass_macros;

grass_test!(
    clamp_in_the_middle,
    "@use 'sass:math';\na {\n  color: math.clamp(0, 1, 2);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    clamp_first_is_bigger,
    "@use 'sass:math';\na {\n  color: math.clamp(2, 1, 0);\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    clamp_all_same_unit,
    "@use 'sass:math';\na {\n  color: math.clamp(0px, 1px, 2px);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
grass_test!(
    clamp_all_different_but_compatible_unit,
    "@use 'sass:math';\na {\n  color: math.clamp(0mm, 1cm, 2in);\n}\n",
    "a {\n  color: 1cm;\n}\n"
);
grass_error!(
    clamp_only_min_has_no_unit,
    "@use 'sass:math';\na {\n  color: math.clamp(0, 1cm, 2in);\n}\n",
    "Error: $min is unitless but $number has unit cm. Arguments must all have units or all be \
     unitless."
);
grass_error!(
    clamp_only_number_has_no_unit,
    "@use 'sass:math';\na {\n  color: math.clamp(0mm, 1, 2in);\n}\n",
    "Error: $min has unit mm but $number is unitless. Arguments must all have units or all be \
     unitless."
);
grass_error!(
    clamp_only_max_has_no_unit,
    "@use 'sass:math';\na {\n  color: math.clamp(0mm, 1cm, 2);\n}\n",
    "Error: $min has unit mm but $max is unitless. Arguments must all have units or all be \
     unitless."
);
grass_test!(
    sqrt_zero,
    "@use 'sass:math';\na {\n  color: math.sqrt(0);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    sqrt_small_positive,
    "@use 'sass:math';\na {\n  color: math.sqrt(99);\n}\n",
    "a {\n  color: 9.9498743711;\n}\n"
);
grass_test!(
    sqrt_small_negative,
    "@use 'sass:math';\na {\n  color: math.sqrt(-99);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    sqrt_big_positive,
    "@use 'sass:math';\na {\n  color: \
     math.sqrt(9999999999999999999999999999999999999999999999999);\n}\n",
    "a {\n  color: 3162277660168379038695424;\n}\n"
);
grass_test!(
    sqrt_big_negative,
    "@use 'sass:math';\na {\n  color: \
     math.sqrt(-9999999999999999999999999999999999999999999999999);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    sqrt_irrational,
    "@use 'sass:math';\na {\n  color: math.sqrt(2);\n}\n",
    "a {\n  color: 1.4142135624;\n}\n"
);
grass_test!(
    sqrt_of_nan,
    "@use 'sass:math';\na {\n  color: math.sqrt((0 / 0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_error!(
    sqrt_with_units,
    "@use 'sass:math';\na {\n  color: math.sqrt(1px);\n}\n",
    "Error: $number: Expected 1px to have no units."
);
grass_error!(
    cos_non_angle,
    "@use 'sass:math';\na {\n  color: math.cos(1px);\n}\n",
    "Error: $number: Expected 1px to be an angle."
);
grass_test!(
    cos_small_degree,
    "@use 'sass:math';\na {\n  color: math.cos(1deg);\n}\n",
    "a {\n  color: 0.9998476952;\n}\n"
);
grass_test!(
    cos_small_radian,
    "@use 'sass:math';\na {\n  color: math.cos(1rad);\n}\n",
    "a {\n  color: 0.5403023059;\n}\n"
);
grass_test!(
    cos_small_no_unit,
    "@use 'sass:math';\na {\n  color: math.cos(1);\n}\n",
    "a {\n  color: 0.5403023059;\n}\n"
);
grass_test!(
    cos_small_negative_degree,
    "@use 'sass:math';\na {\n  color: math.cos(-1deg);\n}\n",
    "a {\n  color: 0.9998476952;\n}\n"
);
grass_test!(
    cos_small_negative_radian,
    "@use 'sass:math';\na {\n  color: math.cos(-1rad);\n}\n",
    "a {\n  color: 0.5403023059;\n}\n"
);
grass_test!(
    cos_small_negative_no_unit,
    "@use 'sass:math';\na {\n  color: math.cos(-1);\n}\n",
    "a {\n  color: 0.5403023059;\n}\n"
);
grass_test!(
    cos_pi,
    "@use 'sass:math';\na {\n  color: math.cos(math.$pi);\n}\n",
    "a {\n  color: -1;\n}\n"
);
grass_test!(
    cos_two_pi,
    "@use 'sass:math';\na {\n  color: math.cos(2 * math.$pi);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_error!(
    sin_non_angle,
    "@use 'sass:math';\na {\n  color: math.sin(1px);\n}\n",
    "Error: $number: Expected 1px to be an angle."
);
grass_test!(
    sin_small_degree,
    "@use 'sass:math';\na {\n  color: math.sin(1deg);\n}\n",
    "a {\n  color: 0.0174524064;\n}\n"
);
grass_test!(
    sin_small_radian,
    "@use 'sass:math';\na {\n  color: math.sin(1rad);\n}\n",
    "a {\n  color: 0.8414709848;\n}\n"
);
grass_test!(
    sin_small_no_unit,
    "@use 'sass:math';\na {\n  color: math.sin(1);\n}\n",
    "a {\n  color: 0.8414709848;\n}\n"
);
grass_test!(
    sin_small_negative_degree,
    "@use 'sass:math';\na {\n  color: math.sin(-1deg);\n}\n",
    "a {\n  color: -0.0174524064;\n}\n"
);
grass_test!(
    sin_small_negative_radian,
    "@use 'sass:math';\na {\n  color: math.sin(-1rad);\n}\n",
    "a {\n  color: -0.8414709848;\n}\n"
);
grass_test!(
    sin_small_negative_no_unit,
    "@use 'sass:math';\na {\n  color: math.sin(-1);\n}\n",
    "a {\n  color: -0.8414709848;\n}\n"
);
grass_test!(
    sin_pi,
    "@use 'sass:math';\na {\n  color: math.sin(math.$pi);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    sin_two_pi,
    "@use 'sass:math';\na {\n  color: math.sin(2 * math.$pi);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_error!(
    tan_non_angle,
    "@use 'sass:math';\na {\n  color: math.tan(1px);\n}\n",
    "Error: $number: Expected 1px to be an angle."
);
grass_test!(
    tan_small_degree,
    "@use 'sass:math';\na {\n  color: math.tan(1deg);\n}\n",
    "a {\n  color: 0.0174550649;\n}\n"
);
grass_test!(
    tan_small_radian,
    "@use 'sass:math';\na {\n  color: math.tan(1rad);\n}\n",
    "a {\n  color: 1.5574077247;\n}\n"
);
grass_test!(
    tan_small_no_unit,
    "@use 'sass:math';\na {\n  color: math.tan(1);\n}\n",
    "a {\n  color: 1.5574077247;\n}\n"
);
grass_test!(
    tan_small_negative_degree,
    "@use 'sass:math';\na {\n  color: math.tan(-1deg);\n}\n",
    "a {\n  color: -0.0174550649;\n}\n"
);
grass_test!(
    tan_small_negative_radian,
    "@use 'sass:math';\na {\n  color: math.tan(-1rad);\n}\n",
    "a {\n  color: -1.5574077247;\n}\n"
);
grass_test!(
    tan_small_negative_no_unit,
    "@use 'sass:math';\na {\n  color: math.tan(-1);\n}\n",
    "a {\n  color: -1.5574077247;\n}\n"
);
grass_test!(
    tan_pi,
    "@use 'sass:math';\na {\n  color: math.tan(math.$pi);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    tan_two_pi,
    "@use 'sass:math';\na {\n  color: math.tan(2 * math.$pi);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    acos_above_one,
    "@use 'sass:math';\na {\n  color: math.acos(2);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    acos_below_negative_one,
    "@use 'sass:math';\na {\n  color: math.acos(-2);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    acos_one,
    "@use 'sass:math';\na {\n  color: math.acos(1);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    acos_negative_one,
    "@use 'sass:math';\na {\n  color: math.acos(-1);\n}\n",
    "a {\n  color: 180deg;\n}\n"
);
grass_test!(
    acos_zero,
    "@use 'sass:math';\na {\n  color: math.acos(0);\n}\n",
    "a {\n  color: 90deg;\n}\n"
);
grass_test!(
    acos_point_five,
    "@use 'sass:math';\na {\n  color: math.acos(.5);\n}\n",
    "a {\n  color: 60deg;\n}\n"
);
grass_test!(
    acos_nan,
    "@use 'sass:math';\na {\n  color: math.acos((0 / 0));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    asin_above_one,
    "@use 'sass:math';\na {\n  color: math.asin(2);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    asin_below_negative_one,
    "@use 'sass:math';\na {\n  color: math.asin(-2);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    asin_one,
    "@use 'sass:math';\na {\n  color: math.asin(1);\n}\n",
    "a {\n  color: 90deg;\n}\n"
);
grass_test!(
    asin_negative_one,
    "@use 'sass:math';\na {\n  color: math.asin(-1);\n}\n",
    "a {\n  color: -90deg;\n}\n"
);
grass_test!(
    asin_zero,
    "@use 'sass:math';\na {\n  color: math.asin(0);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    asin_point_five,
    "@use 'sass:math';\na {\n  color: math.asin(.5);\n}\n",
    "a {\n  color: 30deg;\n}\n"
);
grass_test!(
    asin_nan,
    "@use 'sass:math';\na {\n  color: math.asin((0 / 0));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    atan_above_one,
    "@use 'sass:math';\na {\n  color: math.atan(2);\n}\n",
    "a {\n  color: 63.4349488229deg;\n}\n"
);
grass_test!(
    atan_below_negative_one,
    "@use 'sass:math';\na {\n  color: math.atan(-2);\n}\n",
    "a {\n  color: -63.4349488229deg;\n}\n"
);
grass_test!(
    atan_one,
    "@use 'sass:math';\na {\n  color: math.atan(1);\n}\n",
    "a {\n  color: 45deg;\n}\n"
);
grass_test!(
    atan_negative_one,
    "@use 'sass:math';\na {\n  color: math.atan(-1);\n}\n",
    "a {\n  color: -45deg;\n}\n"
);
grass_test!(
    atan_zero,
    "@use 'sass:math';\na {\n  color: math.atan(0);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    atan_point_five,
    "@use 'sass:math';\na {\n  color: math.atan(.5);\n}\n",
    "a {\n  color: 26.5650511771deg;\n}\n"
);
grass_test!(
    atan_nan,
    "@use 'sass:math';\na {\n  color: math.atan((0 / 0));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    log_above_one,
    "@use 'sass:math';\na {\n  color: math.log(2);\n}\n",
    "a {\n  color: 0.6931471806;\n}\n"
);
grass_test!(
    log_below_negative_one,
    "@use 'sass:math';\na {\n  color: math.log(-2);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    log_one,
    "@use 'sass:math';\na {\n  color: math.log(1);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    log_negative_one,
    "@use 'sass:math';\na {\n  color: math.log(-1);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    #[ignore = "we do not support Infinity"]
    log_zero,
    "@use 'sass:math';\na {\n  color: math.log(0);\n}\n",
    "a {\n  color: -Infinity;\n}\n"
);
grass_test!(
    log_point_five,
    "@use 'sass:math';\na {\n  color: math.log(.5);\n}\n",
    "a {\n  color: -0.6931471806;\n}\n"
);
grass_test!(
    log_nan,
    "@use 'sass:math';\na {\n  color: math.log((0 / 0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    log_base_nan,
    "@use 'sass:math';\na {\n  color: math.log(1, (0 / 0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    log_base_above_one,
    "@use 'sass:math';\na {\n  color: math.log(2, 2);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    log_base_below_negative_one,
    "@use 'sass:math';\na {\n  color: math.log(2, -2);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    #[ignore = "we do not support Infinity"]
    log_base_one,
    "@use 'sass:math';\na {\n  color: math.log(2, 1);\n}\n",
    "a {\n  color: Infinity;\n}\n"
);
grass_test!(
    log_base_negative_one,
    "@use 'sass:math';\na {\n  color: math.log(2, -1);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    log_base_zero,
    "@use 'sass:math';\na {\n  color: math.log(2, 0);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    log_base_point_five,
    "@use 'sass:math';\na {\n  color: math.log(2, .5);\n}\n",
    "a {\n  color: -1;\n}\n"
);

grass_test!(
    pow_exponent_and_base_one,
    "@use 'sass:math';\na {\n  color: math.pow(1, 1);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    pow_exponent_and_base_ten,
    "@use 'sass:math';\na {\n  color: math.pow(10, 10);\n}\n",
    "a {\n  color: 10000000000;\n}\n"
);
grass_test!(
    pow_base_negative_exponent_positive,
    "@use 'sass:math';\na {\n  color: math.pow(-2, 3);\n}\n",
    "a {\n  color: -8;\n}\n"
);
grass_test!(
    pow_base_positive_exponent_negative,
    "@use 'sass:math';\na {\n  color: math.pow(2, -3);\n}\n",
    "a {\n  color: 0.125;\n}\n"
);
grass_test!(
    pow_base_negative_exponent_negative,
    "@use 'sass:math';\na {\n  color: math.pow(-2, -3);\n}\n",
    "a {\n  color: -0.125;\n}\n"
);
grass_test!(
    pow_base_decimal,
    "@use 'sass:math';\na {\n  color: math.pow(2.4, 3);\n}\n",
    "a {\n  color: 13.824;\n}\n"
);
grass_test!(
    pow_exponent_decimal,
    "@use 'sass:math';\na {\n  color: math.pow(2, 3.5);\n}\n",
    "a {\n  color: 11.313708499;\n}\n"
);
grass_test!(
    pow_base_nan,
    "@use 'sass:math';\na {\n  color: math.pow((0 / 0), 3);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    pow_exponent_nan,
    "@use 'sass:math';\na {\n  color: math.pow(2, (0 / 0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    pow_base_and_exponent_nan,
    "@use 'sass:math';\na {\n  color: math.pow((0 / 0), (0 / 0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
grass_test!(
    pow_exponent_zero,
    "@use 'sass:math';\na {\n  color: math.pow(2, 0);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    hypot_all_same_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1px, 2px, 3px, 4px, 5px);\n}\n",
    "a {\n  color: 7.4161984871px;\n}\n"
);
grass_test!(
    hypot_negative,
    "@use 'sass:math';\na {\n  color: math.hypot(1px, 2px, 3px, 4px, 5px, -20px);\n}\n",
    "a {\n  color: 21.3307290077px;\n}\n"
);
grass_test!(
    hypot_all_different_but_comparable_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1in, 2cm, 3mm, 4pt, 5pc);\n}\n",
    "a {\n  color: 1.5269191636in;\n}\n"
);
grass_test!(
    hypot_all_no_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1, 2, 3);\n}\n",
    "a {\n  color: 3.7416573868;\n}\n"
);
grass_test!(
    hypot_nan_has_comparable_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1deg, 2deg, math.acos(2));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_error!(
    hypot_no_args,
    "@use 'sass:math';\na {\n  color: math.hypot();\n}\n",
    "Error: At least one argument must be passed."
);
grass_error!(
    hypot_first_has_no_unit_third_has_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1, 2, 3px);\n}\n",
    "Error: Argument 1 is unitless but argument 3 has unit px. Arguments must all have units or \
     all be unitless."
);
grass_error!(
    hypot_non_numeric_argument,
    "@use 'sass:math';\na {\n  color: math.hypot(1, red, 3);\n}\n",
    "Error: red is not a number."
);
grass_error!(
    hypot_units_not_comparable,
    "@use 'sass:math';\na {\n  color: math.hypot(1px, 2in, 3rem);\n}\n",
    "Error: Incompatible units px and rem."
);
grass_error!(
    hypot_nan_has_no_unit_but_first_has_unit,
    "@use 'sass:math';\na {\n  color: math.hypot(1deg, 2deg, (0 / 0));\n}\n",
    "Error: Argument 1 has unit deg but argument 3 is unitless. Arguments must all have units or \
     all be unitless."
);
grass_test!(
    atan2_both_positive,
    "@use 'sass:math';\na {\n  color: math.atan2(3, 4);\n}\n",
    "a {\n  color: 36.8698976458deg;\n}\n"
);
grass_test!(
    atan2_first_negative,
    "@use 'sass:math';\na {\n  color: math.atan2(-3, 4);\n}\n",
    "a {\n  color: -36.8698976458deg;\n}\n"
);
grass_test!(
    atan2_second_negative,
    "@use 'sass:math';\na {\n  color: math.atan2(3, -4);\n}\n",
    "a {\n  color: 143.1301023542deg;\n}\n"
);
grass_test!(
    atan2_both_negative,
    "@use 'sass:math';\na {\n  color: math.atan2(-3, -4);\n}\n",
    "a {\n  color: -143.1301023542deg;\n}\n"
);
grass_test!(
    atan2_first_positive_second_zero,
    "@use 'sass:math';\na {\n  color: math.atan2(3, 0);\n}\n",
    "a {\n  color: 90deg;\n}\n"
);
grass_test!(
    atan2_first_negative_second_zero,
    "@use 'sass:math';\na {\n  color: math.atan2(-3, 0);\n}\n",
    "a {\n  color: -90deg;\n}\n"
);
grass_test!(
    atan2_first_zero_second_positive,
    "@use 'sass:math';\na {\n  color: math.atan2(0, 4);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    atan2_first_zero_second_negative,
    "@use 'sass:math';\na {\n  color: math.atan2(0, -4);\n}\n",
    "a {\n  color: 180deg;\n}\n"
);
grass_test!(
    atan2_both_zero,
    "@use 'sass:math';\na {\n  color: math.atan2(0, 0);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    atan2_both_same_unit,
    "@use 'sass:math';\na {\n  color: math.atan2(3px, 4px);\n}\n",
    "a {\n  color: 36.8698976458deg;\n}\n"
);
grass_test!(
    atan2_both_different_but_comparable_unit,
    "@use 'sass:math';\na {\n  color: math.atan2(3px, 4in);\n}\n",
    "a {\n  color: 0.4476141709deg;\n}\n"
);
grass_error!(
    atan2_first_unitless_second_unit,
    "@use 'sass:math';\na {\n  color: math.atan2(3, 4rem);\n}\n",
    "Error: $y is unitless but $x has unit rem. Arguments must all have units or all be unitless."
);
grass_error!(
    atan2_first_unit_second_unitless,
    "@use 'sass:math';\na {\n  color: math.atan2(3px, 4);\n}\n",
    "Error: $y has unit px but $x is unitless. Arguments must all have units or all be unitless."
);
grass_error!(
    atan2_incompatible_units,
    "@use 'sass:math';\na {\n  color: math.atan2(3px, 4rem);\n}\n",
    "Error: Incompatible units px and rem."
);
grass_error!(
    atan2_nan_incompatible_units,
    "@use 'sass:math';\na {\n  color: math.atan2(math.acos(2), 3);\n}\n",
    "Error: $y has unit deg but $x is unitless. Arguments must all have units or all be unitless."
);
grass_test!(
    atan2_first_nan,
    "@use 'sass:math';\na {\n  color: math.atan2((0/0), 0);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    atan2_second_nan,
    "@use 'sass:math';\na {\n  color: math.atan2(0, (0/0));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    atan2_both_nan,
    "@use 'sass:math';\na {\n  color: math.atan2((0/0), (0/0));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
grass_test!(
    atan2_nan_with_same_units,
    "@use 'sass:math';\na {\n  color: math.atan2(math.acos(2), 3deg);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
