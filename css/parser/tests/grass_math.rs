#[macro_use]
mod grass_macros;

grass_test!(
    percentage_decimal,
    "a {\n  color: percentage(0.2);\n}\n",
    "a {\n  color: 20%;\n}\n"
);
grass_test!(
    percentage_division,
    "a {\n  color: percentage(100px / 50px);\n}\n",
    "a {\n  color: 200%;\n}\n"
);
grass_test!(
    integer_division,
    "a {\n  color: percentage(2);\n}\n",
    "a {\n  color: 200%;\n}\n"
);
grass_test!(
    rounds_down,
    "a {\n  color: round(10.4px);\n}\n",
    "a {\n  color: 10px;\n}\n"
);
grass_test!(
    rounds_up,
    "a {\n  color: round(10.6px);\n}\n",
    "a {\n  color: 11px;\n}\n"
);
grass_test!(
    floor_below_pt_5,
    "a {\n  color: floor(10.4px);\n}\n",
    "a {\n  color: 10px;\n}\n"
);
grass_test!(
    floor_above_pt_5,
    "a {\n  color: floor(10.6px);\n}\n",
    "a {\n  color: 10px;\n}\n"
);
grass_test!(
    floor_big_int,
    "a {\n  color: floor(1.000000000000000001);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    ceil_below_pt_5,
    "a {\n  color: ceil(10.4px);\n}\n",
    "a {\n  color: 11px;\n}\n"
);
grass_test!(
    ceil_above_pt_5,
    "a {\n  color: ceil(10.6px);\n}\n",
    "a {\n  color: 11px;\n}\n"
);
grass_test!(
    ceil_big_int,
    "a {\n  color: ceil(1.000000000000000001);\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    abs_positive,
    "a {\n  color: abs(10);\n}\n",
    "a {\n  color: 10;\n}\n"
);
grass_test!(
    abs_negative,
    "a {\n  color: abs(-10);\n}\n",
    "a {\n  color: 10;\n}\n"
);
grass_test!(
    abs_unit,
    "a {\n  color: abs(-10px);\n}\n",
    "a {\n  color: 10px;\n}\n"
);
grass_test!(
    comparable_unitless,
    "a {\n  color: comparable(1, 2);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    comparable_none_px,
    "a {\n  color: comparable(1, 2px);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    comparable_px_px,
    "a {\n  color: comparable(1px, 2px);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    comparable_absolute,
    "a {\n  color: comparable(1px, 2in);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    comparable_absolute_font_relative,
    "a {\n  color: comparable(1px, 2em);\n}\n",
    "a {\n  color: false;\n}\n"
);
grass_test!(
    comparable_named,
    "a {\n  color: comparable($number1: 1, $number2: 2);\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    random_limit_one,
    "a {\n  color: random(1);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    random_limit_big_one,
    "a {\n  color: random(1000000000000000001 - 1000000000000000000);\n}\n",
    "a {\n  color: 1;\n}\n"
);
