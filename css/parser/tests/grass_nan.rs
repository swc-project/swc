#[macro_use]
mod grass_macros;

error!(
    unitless_nan_str_slice_start_at,
    "a {\n  color: str-slice(\"\", (0/0));\n}\n", "Error: NaN is not an int."
);
error!(
    unitless_nan_str_slice_end_at,
    "a {\n  color: str-slice(\"\", 0, (0/0));\n}\n", "Error: NaN is not an int."
);
error!(
    unitless_nan_str_insert_index,
    "a {\n  color: str-insert(\"\", \"\", (0/0));\n}\n", "Error: $index: NaN is not an int."
);
test!(
    unitless_nan_percentage_number,
    "a {\n  color: percentage((0/0));\n}\n",
    "a {\n  color: NaN%;\n}\n"
);
test!(
    unitless_nan_abs_number,
    "a {\n  color: abs((0/0));\n}\n",
    "a {\n  color: NaN;\n}\n"
);
error!(
    unitless_nan_round_number,
    "a {\n  color: round((0/0));\n}\n", "Error: Infinity or NaN toInt"
);
error!(
    unitless_nan_ceil_number,
    "a {\n  color: ceil((0/0));\n}\n", "Error: Infinity or NaN toInt"
);
error!(
    unitless_nan_floor_number,
    "a {\n  color: floor((0/0));\n}\n", "Error: Infinity or NaN toInt"
);
error!(
    unitless_nan_random_limit,
    "a {\n  color: random((0/0));\n}\n", "Error: $limit: NaN is not an int."
);
error!(
    unitless_nan_nth_n,
    "a {\n  color: nth([a], (0/0));\n}\n", "Error: $n: NaN is not an int."
);
error!(
    unitless_nan_set_nth_n,
    "a {\n  color: set-nth([a], (0/0), b);\n}\n", "Error: $n: NaN is not an int."
);
test!(
    unitless_nan_min_first_arg,
    "$n: (0/0);\na {\n  color: min($n, 1px);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    unitless_nan_min_last_arg,
    "$n: (0/0);\na {\n  color: min(1px, $n);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    unitless_nan_min_middle_arg,
    "$n: (0/0);\na {\n  color: min(1px, $n, 0);\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    unitless_nan_max_first_arg,
    "$n: (0/0);\na {\n  color: max($n, 1px);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    unitless_nan_max_last_arg,
    "$n: (0/0);\na {\n  color: max(1px, $n);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    unitless_nan_max_middle_arg,
    "$n: (0/0);\na {\n  color: max(1px, $n, 0);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
error!(
    unitful_nan_str_slice_start,
    "@use \"sass:math\";\na {\n  color: str-slice(\"\", math.acos(2));\n}\n",
    "Error: $start: Expected NaNdeg to have no units."
);
error!(
    unitful_nan_str_slice_end,
    "@use \"sass:math\";\na {\n  color: str-slice(\"\", 0, math.acos(2));\n}\n",
    "Error: $end: Expected NaNdeg to have no units."
);
error!(
    unitful_nan_str_insert_index,
    "@use \"sass:math\";\na {\n  color: str-insert(\"\", \"\", math.acos(2));\n}\n",
    "Error: $index: Expected NaNdeg to have no units."
);
error!(
    unitful_nan_percentage,
    "@use \"sass:math\";\na {\n  color: percentage(math.acos(2));\n}\n",
    "Error: $number: Expected NaNdeg to have no units."
);
error!(
    unitful_nan_round,
    "@use \"sass:math\";\na {\n  color: round(math.acos(2));\n}\n", "Error: Infinity or NaN toInt"
);
error!(
    unitful_nan_ceil,
    "@use \"sass:math\";\na {\n  color: ceil(math.acos(2));\n}\n", "Error: Infinity or NaN toInt"
);
error!(
    unitful_nan_floor,
    "@use \"sass:math\";\na {\n  color: floor(math.acos(2));\n}\n", "Error: Infinity or NaN toInt"
);
test!(
    unitful_nan_abs,
    "@use \"sass:math\";\na {\n  color: abs(math.acos(2));\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
error!(
    unitful_nan_random,
    "@use \"sass:math\";\na {\n  color: random(math.acos(2));\n}\n",
    "Error: $limit: NaNdeg is not an int."
);
test!(
    unitful_nan_min_first_arg,
    "@use \"sass:math\";\na {\n  color: min(math.acos(2), 1px);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
test!(
    unitful_nan_min_last_arg,
    "@use \"sass:math\";\na {\n  color: min(1px, math.acos(2));\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    unitful_nan_min_middle_arg,
    "@use \"sass:math\";\na {\n  color: min(1px, math.acos(2), 0);\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    unitful_nan_max_first_arg,
    "@use \"sass:math\";\na {\n  color: max(math.acos(2), 1px);\n}\n",
    "a {\n  color: NaNdeg;\n}\n"
);
test!(
    unitful_nan_max_last_arg,
    "@use \"sass:math\";\na {\n  color: max(1px, math.acos(2));\n}\n",
    "a {\n  color: 1px;\n}\n"
);
test!(
    unitful_nan_max_middle_arg,
    "@use \"sass:math\";\na {\n  color: max(1px, math.acos(2), 0);\n}\n",
    "a {\n  color: 1px;\n}\n"
);
error!(
    unitful_nan_nth_n,
    "@use \"sass:math\";\na {\n  color: nth([a], math.acos(2));\n}\n",
    "Error: $n: NaNdeg is not an int."
);
error!(
    unitful_nan_set_nth_n,
    "@use \"sass:math\";\na {\n  color: set-nth([a], math.acos(2), b);\n}\n",
    "Error: $n: NaNdeg is not an int."
);
test!(
    nan_unary_negative,
    "a {\n  color: -(0/0);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    nan_unary_plus,
    "a {\n  color: +(0/0);\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    nan_unary_div,
    "a {\n  color: /(0/0);\n}\n",
    "a {\n  color: /NaN;\n}\n"
);
