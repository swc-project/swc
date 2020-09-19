#[macro_use]
mod grass_macros;

test!(
    px_mod_px,
    "a {\n  color: 10px % 2px;\n}\n",
    "a {\n  color: 0px;\n}\n"
);
test!(
    px_mod_in,
    "a {\n  color: 10px % 2in;\n}\n",
    "a {\n  color: 10px;\n}\n"
);
test!(
    px_mod_none,
    "a {\n  color: 10px % 2;\n}\n",
    "a {\n  color: 0px;\n}\n"
);
test!(
    none_mod_px,
    "a {\n  color: 10 % 2px;\n}\n",
    "a {\n  color: 0px;\n}\n"
);
test!(
    none_mod_none,
    "a {\n  color: 10 % 2;\n}\n",
    "a {\n  color: 0;\n}\n"
);
test!(
    zero_mod_zero,
    "a {\n  color: 0 % 0;\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    positive_mod_zero,
    "a {\n  color: 1 % 0;\n}\n",
    "a {\n  color: NaN;\n}\n"
);
test!(
    positive_unit_mod_zero,
    "a {\n  color: 1px % 0;\n}\n",
    "a {\n  color: NaNpx;\n}\n"
);
test!(
    positive_mod_zero_unit,
    "a {\n  color: 1 % 0px;\n}\n",
    "a {\n  color: NaNpx;\n}\n"
);
test!(
    positive_unit_mod_zero_unit_same,
    "a {\n  color: 1px % 0px;\n}\n",
    "a {\n  color: NaNpx;\n}\n"
);
test!(
    positive_unit_mod_zero_unit_different_compatible_takes_first_1,
    "a {\n  color: 1px % 0in;\n}\n",
    "a {\n  color: NaNpx;\n}\n"
);
test!(
    positive_unit_mod_zero_unit_different_compatible_takes_first_2,
    "a {\n  color: 1in % 0px;\n}\n",
    "a {\n  color: NaNin;\n}\n"
);
error!(
    positive_unit_mod_zero_unit_incompatible_units,
    "a {\n  color: 1rem % 0px;\n}\n", "Error: Incompatible units rem and px."
);
