#[macro_use]
mod grass_macros;

grass_test!(unit_none, "a {\n  height: 1;\n}\n");
grass_test!(unit_not_attached, "a {\n  height: 1 px;\n}\n");
grass_test!(unit_px, "a {\n  height: 1px;\n}\n");
grass_test!(unit_em, "a {\n  height: 1em;\n}\n");
grass_test!(unit_rem, "a {\n  height: 1rem;\n}\n");
grass_test!(unit_percent, "a {\n  height: 1%;\n}\n");
grass_test!(
    unit_times_none,
    "a {\n  color: 3px * 2;\n}\n",
    "a {\n  color: 6px;\n}\n"
);
grass_test!(
    none_times_unit,
    "a {\n  color: 2 * 3px;\n}\n",
    "a {\n  color: 6px;\n}\n"
);
grass_test!(
    unit_fn_unit_times_none,
    "a {\n  color: unit(1px * 1);\n}\n",
    "a {\n  color: \"px\";\n}\n"
);
grass_test!(
    unit_fn_none_times_unit,
    "a {\n  color: unit(1 * 1px);\n}\n",
    "a {\n  color: \"px\";\n}\n"
);
grass_test!(
    unit_fn_unit_times_unit,
    "a {\n  color: unit(1px*1px);\n}\n",
    "a {\n  color: \"px*px\";\n}\n"
);
grass_test!(
    unit_fn_unit_times_unit_times_unit,
    "a {\n  color: unit(1px * 1rad * 1em);\n}\n",
    "a {\n  color: \"px*rad*em\";\n}\n"
);
grass_test!(
    unit_none_times_none_times_none,
    "a {\n  color: 1 * 1 * 1;\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(
    unit_plus_none,
    "a {\n  color: 10px + 10;\n}\n",
    "a {\n  color: 20px;\n}\n"
);
grass_test!(
    none_plus_unit,
    "a {\n  color: 10 + 10px;\n}\n",
    "a {\n  color: 20px;\n}\n"
);
grass_test!(
    unit_minus_none,
    "a {\n  color: 10px - 10;\n}\n",
    "a {\n  color: 0px;\n}\n"
);
grass_test!(
    none_minus_unit,
    "a {\n  color: 10 - 10px;\n}\n",
    "a {\n  color: 0px;\n}\n"
);
grass_test!(
    percent_plus_none,
    "a {\n  color: 10% + 10;\n}\n",
    "a {\n  color: 20%;\n}\n"
);
grass_test!(
    unit_no_hyphen,
    "a {\n  color: 1px-2px;\n}\n",
    "a {\n  color: -1px;\n}\n"
);
grass_test!(
    unit_starts_with_escape_sequence,
    "a {\n  color: 1\\9;\n}\n",
    "a {\n  color: 1\\9 ;\n}\n"
);
grass_test!(
    unit_fn_starts_with_escape_sequence,
    "a {\n  color: unit(1\\9);\n}\n",
    "a {\n  color: \"\\\\9 \";\n}\n"
);
grass_test!(
    non_ascii_numeric_interpreted_as_unit,
    "a {\n  color: 2߄;\n}\n",
    "@charset \"UTF-8\";\na {\n  color: 2߄;\n}\n"
);
grass_test!(
    unit_div_same,
    "a {\n  color: unit(1em / 1em);\n}\n",
    "a {\n  color: \"\";\n}\n"
);
grass_test!(
    unit_div_first_none,
    "a {\n  color: unit(1 / 1em);\n}\n",
    "a {\n  color: \"em^-1\";\n}\n"
);
grass_test!(
    unit_div_second_none,
    "a {\n  color: unit(1em / 1);\n}\n",
    "a {\n  color: \"em\";\n}\n"
);
grass_test!(
    unit_div_comparable,
    "a {\n  color: unit(1in / 1px);\n  color: (1in / 1px);\n}\n",
    "a {\n  color: \"\";\n  color: 96;\n}\n"
);
grass_test!(
    unit_mul_times_mul,
    "a {\n  color: unit((1em * 1px) * (1em * 1px));\n}\n",
    "a {\n  color: \"em*px*em*px\";\n}\n"
);
grass_test!(
    unit_single_times_mul,
    "a {\n  color: unit(1in * (1em * 1px));\n}\n",
    "a {\n  color: \"in*em*px\";\n}\n"
);
grass_test!(
    unit_div_lhs_mul_uncomparable,
    "a {\n  color: unit((1 / 1in) * 1em);\n}\n",
    "a {\n  color: \"em/in\";\n}\n"
);
grass_test!(
    unit_div_lhs_mul_same,
    "a {\n  color: unit((1 / 1in) * 1in);\n}\n",
    "a {\n  color: \"\";\n}\n"
);
grass_test!(
    unit_begins_with_single_hyphen,
    "a {\n  color: unit(1-em);\n}\n",
    "a {\n  color: \"-em\";\n}\n"
);
grass_test!(
    unit_begins_with_two_hyphens,
    "a {\n  color: 1--em;\n}\n",
    "a {\n  color: 1 --em;\n}\n"
);
grass_test!(
    unit_begins_with_escape_sequence,
    "a {\n  color: unit(1\\65);\n}\n",
    "a {\n  color: \"e\";\n}\n"
);
grass_test!(
    unit_begins_with_escape_sequence_followed_by_space_and_hyphen,
    "a {\n  color: unit(1\\65 -);\n}\n",
    "a {\n  color: \"e-\";\n}\n"
);
grass_test!(
    unit_begins_with_single_hyphen_followed_by_escape_sequence,
    "a {\n  color: unit(1-\\65);\n}\n",
    "a {\n  color: \"-e\";\n}\n"
);
grass_error!(
    display_single_div_with_none_numerator,
    "a {\n  color: (1 / 1em);\n}\n",
    "Error: 1em^-1 isn't a valid CSS value."
);
grass_error!(
    #[ignore = "non-comparable inverse units"]
    display_single_div_with_non_comparable_numerator,
    "a {\n  color: (1px / 1em);\n}\n",
    "Error: 1px/em isn't a valid CSS value."
);
grass_error!(
    display_single_mul,
    "a {\n  color: 1rem * 1px;\n}\n",
    "Error: 1rem*px isn't a valid CSS value."
);
grass_error!(
    display_arbitrary_mul,
    "a {\n  color: 1rem * 1px * 1rad * 1foo;\n}\n",
    "Error: 1rem*px*rad*foo isn't a valid CSS value."
);
grass_error!(
    display_single_div_with_none_numerator_percent,
    "a {\n  color: (35 / 7%);\n}\n",
    "Error: 5%^-1 isn't a valid CSS value."
);

macro_rules! test_unit_addition {
    ($u1:ident, $u2:ident, $out:literal) => {
        paste::item!(
            grass_test!(
                [<$u1 _plus_ $u2>],
                concat!("a {\n  color: 1", stringify!($u1), " + 1", stringify!($u2), ";\n}\n"),
                format!("a {{\n  color: {}{};\n}}\n", $out, stringify!($u1))
            );
        );
    };
}

test_unit_addition!(in, in, "2");
test_unit_addition!(in, cm, "1.3937007874");
test_unit_addition!(in, pc, "1.1666666667");
test_unit_addition!(in, mm, "1.0393700787");
test_unit_addition!(in, q, "1.0098425197");
test_unit_addition!(in, pt, "1.0138888889");
test_unit_addition!(in, px, "1.0104166667");

test_unit_addition!(cm, in, "3.54");
test_unit_addition!(cm, cm, "2");
test_unit_addition!(cm, pc, "1.4233333333");
test_unit_addition!(cm, mm, "1.1");
test_unit_addition!(cm, q, "1.025");
test_unit_addition!(cm, pt, "1.0352777778");
test_unit_addition!(cm, px, "1.0264583333");

test_unit_addition!(pc, in, "7");
test_unit_addition!(pc, cm, "3.3622047244");
test_unit_addition!(pc, pc, "2");
test_unit_addition!(pc, mm, "1.2362204724");
test_unit_addition!(pc, q, "1.0590551181");
test_unit_addition!(pc, pt, "1.0833333333");
test_unit_addition!(pc, px, "1.0625");

test_unit_addition!(mm, in, "26.4");
test_unit_addition!(mm, cm, "11");
test_unit_addition!(mm, pc, "5.2333333333");
test_unit_addition!(mm, mm, "2");
test_unit_addition!(mm, q, "1.25");
test_unit_addition!(mm, pt, "1.3527777778");
test_unit_addition!(mm, px, "1.2645833333");

test_unit_addition!(q, in, "102.6");
test_unit_addition!(q, cm, "41");
test_unit_addition!(q, pc, "17.9333333333");
test_unit_addition!(q, mm, "5");
test_unit_addition!(q, q, "2");
test_unit_addition!(q, pt, "2.4111111111");
test_unit_addition!(q, px, "2.0583333333");

test_unit_addition!(pt, in, "73");
test_unit_addition!(pt, cm, "29.3464566929");
test_unit_addition!(pt, pc, "13");
test_unit_addition!(pt, mm, "3.8346456693");
test_unit_addition!(pt, q, "1.7086614173");
test_unit_addition!(pt, pt, "2");
test_unit_addition!(pt, px, "1.75");

test_unit_addition!(px, in, "97");
test_unit_addition!(px, cm, "38.7952755906");
test_unit_addition!(px, pc, "17");
test_unit_addition!(px, mm, "4.7795275591");
test_unit_addition!(px, q, "1.9448818898");
test_unit_addition!(px, pt, "2.3333333333");
test_unit_addition!(px, px, "2");

test_unit_addition!(deg, deg, "2");
test_unit_addition!(deg, grad, "1.9");
test_unit_addition!(deg, rad, "58.2957795131");
test_unit_addition!(deg, turn, "361");

test_unit_addition!(grad, deg, "2.1111111111");
test_unit_addition!(grad, grad, "2");
test_unit_addition!(grad, rad, "64.6619772368");
test_unit_addition!(grad, turn, "401");

test_unit_addition!(rad, deg, "1.0174532925");
test_unit_addition!(rad, grad, "1.0157079633");
test_unit_addition!(rad, rad, "2");
test_unit_addition!(rad, turn, "7.2831853072");

test_unit_addition!(turn, deg, "1.0027777778");
test_unit_addition!(turn, grad, "1.0025");
test_unit_addition!(turn, rad, "1.1591549431");
test_unit_addition!(turn, turn, "2");

test_unit_addition!(s, s, "2");
test_unit_addition!(s, ms, "1.001");

test_unit_addition!(ms, s, "1001");
test_unit_addition!(ms, ms, "2");

test_unit_addition!(Hz, Hz, "2");
test_unit_addition!(Hz, kHz, "1001");

test_unit_addition!(kHz, Hz, "1.001");
test_unit_addition!(kHz, kHz, "2");

test_unit_addition!(dpi, dpi, "2");
test_unit_addition!(dpi, dpcm, "3.54");
test_unit_addition!(dpi, dppx, "97");

test_unit_addition!(dpcm, dpi, "1.3937007874");
test_unit_addition!(dpcm, dpcm, "2");
test_unit_addition!(dpcm, dppx, "38.7952755906");

test_unit_addition!(dppx, dpi, "1.0104166667");
test_unit_addition!(dppx, dpcm, "1.0264583333");
test_unit_addition!(dppx, dppx, "2");
