#[macro_use]
mod grass_macros;

grass_test!(preserves_named_color_case, "a {\n  color: OrAnGe;\n}\n");
grass_test!(
    named_color_casing_is_color,
    "a {\n  color: hue(RED);\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(preserves_hex_color_case, "a {\n  color: #FfFfFf;\n}\n");
grass_test!(
    preserves_hex_8_val_10000000,
    "a {\n  color: #10000000;\n}\n"
);
grass_test!(
    preserves_hex_8_val_12312312,
    "a {\n  color: #12312312;\n}\n"
);
grass_test!(
    preserves_hex_8_val_ab234cff,
    "a {\n  color: #ab234cff;\n}\n"
);
grass_test!(preserves_hex_6_val_000000, "a {\n  color: #000000;\n}\n");
grass_test!(preserves_hex_6_val_123123, "a {\n  color: #123123;\n}\n");
grass_test!(preserves_hex_6_val_ab234c, "a {\n  color: #ab234c;\n}\n");
grass_test!(preserves_hex_4_val_0000, "a {\n  color: #0000;\n}\n");
grass_test!(preserves_hex_4_val_123a, "a {\n  color: #123a;\n}\n");
grass_test!(preserves_hex_4_val_ab2f, "a {\n  color: #ab2f;\n}\n");
grass_test!(preserves_hex_3_val_000, "a {\n  color: #000;\n}\n");
grass_test!(preserves_hex_3_val_123, "a {\n  color: #123;\n}\n");
grass_test!(preserves_hex_3_val_ab2, "a {\n  color: #ab2;\n}\n");
grass_test!(
    converts_rgb_to_named_color,
    "a {\n  color: rgb(0, 0, 0);\n}\n",
    "a {\n  color: black;\n}\n"
);
grass_test!(
    converts_rgba_to_named_color_red,
    "a {\n  color: rgb(255, 0, 0, 255);\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    rgb_negative,
    "a {\n  color: rgb(-1, 1, 1);\n}\n",
    "a {\n  color: #000101;\n}\n"
);
grass_test!(
    rgb_binop,
    "a {\n  color: rgb(1, 2, 1+2);\n}\n",
    "a {\n  color: #010203;\n}\n"
);
grass_test!(
    rgb_pads_0,
    "a {\n  color: rgb(1, 2, 3);\n}\n",
    "a {\n  color: #010203;\n}\n"
);
grass_test!(
    rgba_percent,
    "a {\n  color: rgba(159%, 169, 169%, 50%);\n}\n",
    "a {\n  color: rgba(255, 169, 255, 0.5);\n}\n"
);
grass_test!(
    rgba_percent_round_up,
    "a {\n  color: rgba(59%, 169, 69%, 50%);\n}\n",
    "a {\n  color: rgba(150, 169, 176, 0.5);\n}\n"
);
grass_test!(
    rgb_double_digits,
    "a {\n  color: rgb(254, 255, 255);\n}\n",
    "a {\n  color: #feffff;\n}\n"
);
grass_test!(
    rgb_double_digits_white,
    "a {\n  color: rgb(255, 255, 255);\n}\n",
    "a {\n  color: white;\n}\n"
);
grass_test!(
    alpha_function_4_hex,
    "a {\n  color: alpha(#0123);\n}\n",
    "a {\n  color: 0.2;\n}\n"
);
grass_test!(
    alpha_function_named_color,
    "a {\n  color: alpha(red);\n}\n",
    "a {\n  color: 1;\n}\n"
);
grass_test!(opacity_function_number, "a {\n  color: opacity(1);\n}\n");
grass_test!(
    opacity_function_number_unit,
    "a {\n  color: opacity(1px);\n}\n"
);
grass_test!(
    rgba_one_arg,
    "a {\n  color: rgba(1 2 3);\n}\n",
    "a {\n  color: #010203;\n}\n"
);
grass_test!(
    rgb_two_args,
    "a {\n  color: rgb(#123, 0);\n}\n",
    "a {\n  color: rgba(17, 34, 51, 0);\n}\n"
);
grass_test!(
    rgba_two_args,
    "a {\n  color: rgba(red, 0.5);\n}\n",
    "a {\n  color: rgba(255, 0, 0, 0.5);\n}\n"
);
grass_test!(
    rgba_opacity_over_1,
    "a {\n  color: rgba(1, 2, 3, 3);\n}\n",
    "a {\n  color: #010203;\n}\n"
);
grass_test!(
    rgba_negative_alpha,
    "a {\n  color: rgba(1, 2, 3, -10%);\n}\n",
    "a {\n  color: rgba(1, 2, 3, 0);\n}\n"
);
grass_test!(
    rgba_opacity_decimal,
    "a {\n  color: rgba(1, 2, 3, .6);\n}\n",
    "a {\n  color: rgba(1, 2, 3, 0.6);\n}\n"
);
grass_test!(
    rgba_opacity_percent,
    "a {\n  color: rgba(1, 2, 3, 50%);\n}\n",
    "a {\n  color: rgba(1, 2, 3, 0.5);\n}\n"
);
grass_test!(
    rgba_3_args,
    "a {\n  color: rgba(7.1%, 20.4%, 33.9%);\n}\n",
    "a {\n  color: #123456;\n}\n"
);
grass_error!(
    rgb_no_args,
    "a {\n  color: rgb();\n}\n",
    "Error: Missing argument $channels."
);
grass_error!(
    rgba_no_args,
    "a {\n  color: rgba();\n}\n",
    "Error: Missing argument $channels."
);
grass_error!(
    hsl_no_args,
    "a {\n  color: hsl();\n}\n",
    "Error: Missing argument $channels."
);
grass_error!(
    hsla_no_args,
    "a {\n  color: hsla();\n}\n",
    "Error: Missing argument $channels."
);
grass_test!(
    hsl_basic,
    "a {\n  color: hsl(193, 67%, 99);\n}\n",
    "a {\n  color: #fbfdfe;\n}\n"
);
grass_test!(
    hsla_basic,
    "a {\n  color: hsla(193, 67%, 99, .6);\n}\n",
    "a {\n  color: rgba(251, 253, 254, 0.6);\n}\n"
);
grass_test!(
    hsl_doesnt_care_about_units,
    "a {\n  color: hsl(193deg, 67foo, 99%);\n}\n",
    "a {\n  color: #fbfdfe;\n}\n"
);
grass_test!(
    hsl_named,
    "a {\n  color: hsl($hue: 193, $saturation: 67%, $lightness: 99);\n}\n",
    "a {\n  color: #fbfdfe;\n}\n"
);
grass_test!(
    hsl_four_args,
    "a {\n  color: hsl(0, 0, 0, 0.456);\n}\n",
    "a {\n  color: rgba(0, 0, 0, 0.456);\n}\n"
);
grass_test!(
    hsl_negative_hue,
    "a {\n  color: hsl(-60deg, 100%, 50%);\n}\n",
    "a {\n  color: fuchsia;\n}\n"
);
grass_test!(
    hsl_hue_above_max,
    "a {\n  color: hsl(540, 100%, 50%);\n}\n",
    "a {\n  color: aqua;\n}\n"
);
grass_test!(
    hsl_hue_below_min,
    "a {\n  color: hsl(-540, 100%, 50%);\n}\n",
    "a {\n  color: aqua;\n}\n"
);
grass_test!(
    hsla_named,
    "a {\n  color: hsla($hue: 193, $saturation: 67%, $lightness: 99, $alpha: .6);\n}\n",
    "a {\n  color: rgba(251, 253, 254, 0.6);\n}\n"
);
grass_test!(
    hue,
    "a {\n  color: hue(hsl(193, 67%, 28%));\n}\n",
    "a {\n  color: 193deg;\n}\n"
);
grass_test!(
    hue_maintains_value_when_created_through_hsl,
    "a {\n  color: hue(hsl(0.544, 100%, 100%));\n}\n",
    "a {\n  color: 0.544deg;\n}\n"
);
grass_test!(
    hue_red_equals_blue,
    "a {\n  color: hue(rgb(1, 0, 1));\n}\n",
    "a {\n  color: 300deg;\n}\n"
);
grass_test!(
    hue_of_360_becomes_0,
    "a {\n  color: hue(hsl(360, 10%, 20%));\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    hue_green_equals_blue,
    "a {\n  color: hue(rgb(0, 1, 1));\n}\n",
    "a {\n  color: 180deg;\n}\n"
);
grass_test!(
    hue_green_is_1,
    "a {\n  color: hue(rgb(0, 1, 0));\n}\n",
    "a {\n  color: 120deg;\n}\n"
);
grass_test!(
    hue_rgb_all_equal,
    "a {\n  color: hue(rgb(1, 1, 1));\n}\n",
    "a {\n  color: 0deg;\n}\n"
);
grass_test!(
    saturation,
    "a {\n  color: saturation(hsl(193, 67%, 28%));\n}\n",
    "a {\n  color: 67%;\n}\n"
);
grass_test!(
    saturation_2,
    "$a: hsl(1, 1, 10);\n\na {\n  color: saturation($a);\n}\n",
    "a {\n  color: 1%;\n}\n"
);
grass_test!(
    lightness,
    "a {\n  color: lightness(hsl(193, 67%, 28%));\n}\n",
    "a {\n  color: 28%;\n}\n"
);
grass_test!(
    invert_no_weight,
    "a {\n  color: invert(white);\n}\n",
    "a {\n  color: black;\n}\n"
);
grass_test!(invert_number, "a {\n  color: invert(10%);\n}\n");
grass_test!(invert_number_casing, "a {\n  color: iNveRt(10%);\n}\n");
grass_test!(
    invert_weight_percent,
    "a {\n  color: invert(white, 20%);\n}\n",
    "a {\n  color: #cccccc;\n}\n"
);
grass_test!(
    invert_weight_percent_turquoise,
    "a {\n  color: invert(turquoise, 23%);\n}\n",
    "a {\n  color: #5db4ab;\n}\n"
);
grass_test!(
    invert_weight_no_unit,
    "a {\n  color: invert(white, 20);\n}\n",
    "a {\n  color: #cccccc;\n}\n"
);
grass_test!(
    adjust_hue_positive,
    "a {\n  color: adjust-hue(hsl(120, 30%, 90%), 60deg);\n}\n",
    "a {\n  color: #deeded;\n}\n"
);
grass_test!(
    adjust_hue_negative,
    "a {\n  color: adjust-hue(hsl(120, 30%, 90%), -60deg);\n}\n",
    "a {\n  color: #ededde;\n}\n"
);
grass_test!(
    adjust_hue_3_hex,
    "a {\n  color: adjust-hue(#811, 45deg);\n}\n",
    "a {\n  color: #886a11;\n}\n"
);
grass_test!(
    adjust_hue_named_args,
    "a {\n  color: adjust-hue($color: hsl(120, 30%, 90%), $degrees: 60deg);\n}\n",
    "a {\n  color: #deeded;\n}\n"
);
grass_test!(
    lighten_named_args,
    "a {\n  color: lighten($color: hsl(0, 0%, 0%), $amount: 30%);\n}\n",
    "a {\n  color: #4d4d4d;\n}\n"
);
grass_test!(
    lighten_basic,
    "a {\n  color: lighten(hsl(0, 0%, 0%), 30%);\n}\n",
    "a {\n  color: #4d4d4d;\n}\n"
);
grass_test!(
    lighten_3_hex,
    "a {\n  color: lighten(#800, 20%);\n}\n",
    // eventually, this should become `#e00`
    // blocked on recognizing when to use 3-hex over 6-hex
    "a {\n  color: #ee0000;\n}\n"
);
grass_test!(
    darken_named_args,
    "a {\n  color: darken($color: hsl(25, 100%, 80%), $amount: 30%);\n}\n",
    "a {\n  color: #ff6a00;\n}\n"
);
grass_test!(
    darken_basic,
    "a {\n  color: darken(hsl(25, 100%, 80%), 30%);\n}\n",
    "a {\n  color: #ff6a00;\n}\n"
);
grass_test!(
    darken_3_hex,
    "a {\n  color: darken(#800, 20%);\n}\n",
    // eventually, this should become `#200`
    // blocked on recognizing when to use 3-hex over 6-hex
    "a {\n  color: #220000;\n}\n"
);
grass_test!(
    saturate_named_args,
    "a {\n  color: saturate($color: hsl(25, 100%, 80%), $amount: 30%);\n}\n",
    "a {\n  color: #ffc499;\n}\n"
);
grass_test!(
    saturate_one_arg,
    "a {\n  color: saturate($amount: 50%);\n}\n",
    "a {\n  color: saturate(50%);\n}\n"
);
grass_test!(
    saturate_basic,
    "a {\n  color: saturate(hsl(120, 30%, 90%), 20%);\n}\n",
    "a {\n  color: #d9f2d9;\n}\n"
);
grass_test!(
    saturate_3_hex,
    "a {\n  color: saturate(#855, 20%);\n}\n",
    "a {\n  color: #9e3f3f;\n}\n"
);
grass_test!(
    desaturate_named_args,
    "a {\n  color: desaturate($color: hsl(25, 100%, 80%), $amount: 30%);\n}\n",
    "a {\n  color: #f0c6a8;\n}\n"
);
grass_test!(
    desaturate_basic,
    "a {\n  color: desaturate(hsl(120, 30%, 90%), 20%);\n}\n",
    "a {\n  color: #e3e8e3;\n}\n"
);
grass_test!(
    desaturate_3_hex,
    "a {\n  color: desaturate(#855, 20%);\n}\n",
    "a {\n  color: #726b6b;\n}\n"
);
grass_test!(
    desaturate_correctly_calculates_hue,
    "a {\n  color: desaturate(plum, 14%);\n}\n",
    "a {\n  color: #d4a9d4;\n}\n"
);
grass_test!(
    transparentize,
    "a {\n  color: transparentize(rgba(0, 0, 0, 0.5), 0.1);\n}\n",
    "a {\n  color: rgba(0, 0, 0, 0.4);\n}\n"
);
grass_test!(
    fade_out,
    "a {\n  color: fade-out(rgba(0, 0, 0, 0.8), 0.2);\n}\n",
    "a {\n  color: rgba(0, 0, 0, 0.6);\n}\n"
);
grass_test!(
    opacify,
    "a {\n  color: opacify(rgba(0, 0, 0, 0.5), 0.1);\n}\n",
    "a {\n  color: rgba(0, 0, 0, 0.6);\n}\n"
);
grass_test!(
    fade_in,
    "a {\n  color: opacify(rgba(0, 0, 17, 0.8), 0.2);\n}\n",
    "a {\n  color: #000011;\n}\n"
);
grass_test!(
    grayscale_1,
    "a {\n  color: grayscale(plum);\n}\n",
    "a {\n  color: #bfbfbf;\n}\n"
);
grass_test!(
    grayscale_2,
    "a {\n  color: grayscale(red);\n}\n",
    "a {\n  color: gray;\n}\n"
);
grass_test!(
    grayscale_number,
    "a {\n  color: grayscale(15%);\n}\n",
    "a {\n  color: grayscale(15%);\n}\n"
);
grass_test!(
    complement,
    "a {\n  color: complement(red);\n}\n",
    "a {\n  color: aqua;\n}\n"
);
grass_test!(
    complement_hue_under_180,
    "a {\n  color: complement(#abcdef);\n}\n",
    "a {\n  color: #efcdab;\n}\n"
);
grass_test!(
    mix_no_weight,
    "a {\n  color: mix(#f00, #00f);\n}\n",
    "a {\n  color: purple;\n}\n"
);
grass_test!(
    mix_weight_25,
    "a {\n  color: mix(#f00, #00f, 25%);\n}\n",
    "a {\n  color: #4000bf;\n}\n"
);
grass_test!(
    mix_opacity,
    "a {\n  color: mix(rgba(255, 0, 0, 0.5), #00f);\n}\n",
    "a {\n  color: rgba(64, 0, 191, 0.75);\n}\n"
);
grass_test!(
    mix_sanity_check,
    "a {\n  color: mix(black, white);\n}\n",
    "a {\n  color: gray;\n}\n"
);
grass_test!(
    change_color_blue,
    "a {\n  color: change-color(#102030, $blue: 5);\n}\n",
    "a {\n  color: #102005;\n}\n"
);
grass_test!(
    change_color_red_blue,
    "a {\n  color: change-color(#102030, $red: 120, $blue: 5);\n}\n",
    "a {\n  color: #782005;\n}\n"
);
grass_test!(
    change_color_lum_alpha,
    "a {\n  color: change-color(hsl(25, 100%, 80%), $lightness: 40%, $alpha: 0.8);\n}\n",
    "a {\n  color: rgba(204, 85, 0, 0.8);\n}\n"
);
grass_test!(
    adjust_color_blue,
    "a {\n  color: adjust-color(#102030, $blue: 5);\n}\n",
    "a {\n  color: #102035;\n}\n"
);
grass_test!(
    adjust_color_negative,
    "a {\n  color: adjust-color(#102030, $red: -5, $blue: 5);\n}\n",
    "a {\n  color: #0b2035;\n}\n"
);
grass_test!(
    adjust_color_lum_alpha,
    "a {\n  color: adjust-color(hsl(25, 100%, 80%), $lightness: -30%, $alpha: -0.4);\n}\n",
    "a {\n  color: rgba(255, 106, 0, 0.6);\n}\n"
);
grass_test!(
    scale_color_lightness,
    "a {\n  color: scale-color(hsl(120, 70%, 80%), $lightness: 50%);\n}\n",
    "a {\n  color: #d4f7d4;\n}\n"
);
grass_test!(
    scale_color_negative,
    "a {\n  color: scale-color(rgb(200, 150%, 170%), $green: -40%, $blue: 70%);\n}\n",
    "a {\n  color: #c899ff;\n}\n"
);
grass_test!(
    scale_color_alpha,
    "a {\n  color: scale-color(hsl(200, 70%, 80%), $saturation: -90%, $alpha: -30%);\n}\n",
    "a {\n  color: rgba(200, 205, 208, 0.7);\n}\n"
);
grass_test!(
    scale_color_alpha_over_1,
    "a {\n  color: scale-color(sienna, $alpha: -70%);\n}\n",
    "a {\n  color: rgba(160, 82, 45, 0.3);\n}\n"
);
grass_test!(
    ie_hex_str_hex_3,
    "a {\n  color: ie-hex-str(#abc);\n}\n",
    "a {\n  color: #FFAABBCC;\n}\n"
);
grass_test!(
    ie_hex_str_hex_6,
    "a {\n  color: ie-hex-str(#3322BB);\n}\n",
    "a {\n  color: #FF3322BB;\n}\n"
);
grass_test!(
    ie_hex_str_rgb,
    "a {\n  color: ie-hex-str(rgba(0, 255, 0, 0.5));\n}\n",
    "a {\n  color: #8000FF00;\n}\n"
);
grass_test!(
    rgba_1_arg,
    "a {\n  color: rgba(74.7% 173 93%);\n}\n",
    "a {\n  color: #beaded;\n}\n"
);
grass_test!(
    hsla_1_arg,
    "a {\n  color: hsla(60 60% 50%);\n}\n",
    "a {\n  color: #cccc33;\n}\n"
);
grass_test!(
    hsla_1_arg_weird_units,
    "a {\n  color: hsla(60foo 60foo 50foo);\n}\n",
    "a {\n  color: #cccc33;\n}\n"
);
grass_test!(
    sass_spec__spec_colors_basic,
    "p {
  color: rgb(255, 128, 0);
  color: red green blue;
  color: (red) (green) (blue);
  color: red + hux;
  color: unquote(\"red\") + green;
  foo: rgb(200, 150%, 170%);
}
",
    "p {\n  color: #ff8000;\n  color: red green blue;\n  color: red green blue;\n  color: \
     redhux;\n  color: redgreen;\n  foo: #c8ffff;\n}\n"
);
grass_test!(
    sass_spec__spec_colors_change_color,
    "p {
  color: change-color(#102030, $blue: 5);
  color: change-color(#102030, $alpha: .325);
  color: change-color(#102030, $red: 120, $blue: 5);
  color: change-color(hsl(25, 100%, 80%), $lightness: 40%, $alpha: 0.8);
}
",
    "p {\n  color: #102005;\n  color: rgba(16, 32, 48, 0.325);\n  color: #782005;\n  color: \
     rgba(204, 85, 0, 0.8);\n}\n"
);
grass_test!(
    transparent_from_function,
    "a {\n  color: rgb(transparent, 0);\n}\n",
    "a {\n  color: rgba(0, 0, 0, 0);\n}\n"
);
grass_test!(
    named_color_transparent_opacity,
    "a {\n  color: opacity(transparent);\n}\n",
    "a {\n  color: 0;\n}\n"
);
grass_test!(
    negative_values_in_rgb,
    "a {\n  color: rgb(-1 -1 -1);\n}\n",
    "a {\n  color: black;\n}\n"
);
grass_test!(
    negative_values_in_hsl,
    "a {\n  color: hsl(-1 -1 -1);\n}\n",
    "a {\n  color: black;\n}\n"
);
grass_test!(
    interpolation_after_hash_containing_only_hex_chars,
    "a {\n  color: ##{123};\n  color: type-of(##{123});\n}\n",
    "a {\n  color: #123;\n  color: string;\n}\n"
);
grass_test!(
    non_hex_chars_after_hash_are_still_touching_hash,
    "a {\n  color: #ooobar;\n}\n",
    "a {\n  color: #ooobar;\n}\n"
);
grass_test!(
    more_than_8_hex_chars_after_hash_starts_with_letter,
    "a {\n  color: #ffffffffff;\n}\n",
    "a {\n  color: #ffffffffff;\n}\n"
);
grass_test!(
    more_than_8_hex_chars_after_hash_starts_with_number,
    "a {\n  color: #0000000000;\n}\n",
    "a {\n  color: #00000000 0;\n}\n"
);
grass_test!(
    more_than_8_hex_chars_after_hash_starts_with_number_contains_hex_char,
    "a {\n  color: #00000000f00;\n}\n",
    "a {\n  color: #00000000 f00;\n}\n"
);
grass_test!(
    all_three_rgb_channels_have_decimal,
    "a {\n  color: rgba(1.5, 1.5, 1.5, 1);\n}\n",
    "a {\n  color: #020202;\n}\n"
);
grass_test!(
    builtin_fn_red_rounds_channel,
    "a {\n  color: red(rgba(1.5, 1.5, 1.5, 1));\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    builtin_fn_green_rounds_channel,
    "a {\n  color: green(rgba(1.5, 1.5, 1.5, 1));\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    builtin_fn_blue_rounds_channel,
    "a {\n  color: blue(rgba(1.5, 1.5, 1.5, 1));\n}\n",
    "a {\n  color: 2;\n}\n"
);
grass_test!(
    color_equality_named_and_hex,
    "a {\n  color: red==#ff0000;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    color_equality_named_and_hsla,
    "a {\n  color: hsla(0deg, 100%, 50%)==red;\n}\n",
    "a {\n  color: true;\n}\n"
);
grass_test!(
    hsla_becomes_named_color,
    "a {\n  color: hsla(0deg, 100%, 50%);\n}\n",
    "a {\n  color: red;\n}\n"
);
grass_test!(
    alpha_filter_one_arg,
    "a {\n  color: alpha(a=a);\n}\n",
    "a {\n  color: alpha(a=a);\n}\n"
);
grass_test!(
    alpha_filter_multiple_args,
    "a {\n  color: alpha(a=a, b=b, c=d, d=d);\n}\n",
    "a {\n  color: alpha(a=a, b=b, c=d, d=d);\n}\n"
);
grass_test!(
    alpha_filter_whitespace,
    "a {\n  color: alpha(a   =    a);\n}\n",
    "a {\n  color: alpha(a=a);\n}\n"
);
grass_test!(
    alpha_filter_named,
    "a {\n  color: alpha($color: a=a);\n}\n",
    "a {\n  color: alpha(a=a);\n}\n"
);
grass_error!(
    alpha_filter_both_null,
    "a {\n  color: alpha(null=null);\n}\n",
    "Error: $color: = is not a color."
);
grass_error!(
    alpha_filter_multiple_args_one_not_valid_filter,
    "a {\n  color: alpha(a=a, b);\n}\n",
    "Error: Only 1 argument allowed, but 2 were passed."
);
grass_error!(
    alpha_filter_invalid_from_whitespace,
    "a {\n  color: alpha( A a   =    a  );\n}\n",
    "Error: $color: A a=a is not a color."
);
grass_error!(
    alpha_filter_invalid_non_alphabetic_start,
    "a {\n  color: alpha(1=a);\n}\n",
    "Error: $color: 1=a is not a color."
);
// todo: we need many more of these tests
grass_test!(
    rgba_special_fn_4th_arg_max,
    "a {\n  color: rgba(1 2 max(3, 3));\n}\n",
    "a {\n  color: rgba(1, 2, max(3, 3));\n}\n"
);
grass_test!(
    #[ignore = "we do not check if interpolation occurred"]
    interpolated_named_color_is_not_color,
    "a {\n  color: type-of(r#{e}d);\n}\n",
    "a {\n  color: string;\n}\n"
);
