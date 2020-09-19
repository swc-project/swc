#[macro_use]
mod macros;

test!(
    basic_variable,
    "$height: 1px;\na {\n  height: $height;\n}\n",
    "a {\n  height: 1px;\n}\n"
);
test!(
    variable_redeclaration,
    "$a: 1px;\n$a: 2px;\na {\n  height: $a;\n}\n",
    "a {\n  height: 2px;\n}\n"
);
test!(
    variable_shadowing,
    "$a: 1px;\n$b: $a;\na {\n  height: $b;\n}\n",
    "a {\n  height: 1px;\n}\n"
);
test!(
    variable_shadowing_val_does_not_change,
    "$a: 1px;\n$b: $a; $a: 2px;\na {\n  height: $b;\n}\n",
    "a {\n  height: 1px;\n}\n"
);
test!(
    variable_shadowing_val_does_not_change_complex,
    "a {\n  color: red;\n}\n$y: before;\n$x: 1 2 $y;\n$y: after;\nfoo {\n  a: $x;\n}",
    "a {\n  color: red;\n}\n\nfoo {\n  a: 1 2 before;\n}\n"
);
test!(
    variable_whitespace,
    "$a   :    1px   ;\na {\n  height: $a;\n}\n",
    "a {\n  height: 1px;\n}\n"
);
test!(
    style_after_variable,
    "$a: 1px;\na {\n  height: $a;\n  color: red;\n}\n",
    "a {\n  height: 1px;\n  color: red;\n}\n"
);
test!(
    literal_and_variable_as_val,
    "$a: 1px;\na {\n  height: 1 $a;\n}\n",
    "a {\n  height: 1 1px;\n}\n"
);
test!(
    literal_and_variable_as_var,
    "$a: 1px;\n$b: 1 $a;\na {\n  height: $b;\n}\n",
    "a {\n  height: 1 1px;\n}\n"
);
test!(
    eats_whitespace_after_variable_value,
    "a {\n  b {\n    $c: red;\n  }\n  color: red;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    variable_changes_through_new_ruleset,
    "a {\n  $c: red;\nb {\n    $c: blue;\n  }\n  color: $c;\n}\n",
    "a {\n  color: blue;\n}\n"
);
test!(
    nested_interpolation,
    "$a: red; a {\n  color: #{#{$a}};\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    numbers_in_variable,
    "$var1: red; a {\n  color: $var1;\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    default_var_after,
    "$a: red;\n$a: blue !default;\na {\n  color: $a;\n}",
    "a {\n  color: red;\n}\n"
);
test!(
    default_var_before,
    "$a: red !default;\n$a: blue;\na {\n  color: $a;\n}",
    "a {\n  color: blue;\n}\n"
);
test!(
    default_var_whitespace,
    "$a: red     !default          ;\na {\n  color: $a;\n}",
    "a {\n  color: red;\n}\n"
);
test!(
    default_var_inside_rule,
    "a {\n  $a: red;\n  $a: blue !default;\n  color: $a;\n}",
    "a {\n  color: red;\n}\n"
);
test!(
    interpolation_in_variable,
    "$a: #{red};\na {\n  color: $a\n}\n",
    "a {\n  color: red;\n}\n"
);
test!(
    variable_decl_doesnt_end_in_semicolon,
    "a {\n  $a: red\n}\n\nb {\n  color: blue;\n}\n",
    "b {\n  color: blue;\n}\n"
);
test!(
    unicode_in_variables,
    "$vär: foo;\na {\n  color: $vär;\n}\n",
    "a {\n  color: foo;\n}\n"
);
test!(
    variable_does_not_include_interpolation,
    "$input: foo;\na {\n  color: $input#{\"literal\"};\n}\n",
    "a {\n  color: foo literal;\n}\n"
);
test!(
    whitespace_after_variable_name_in_declaration,
    "a {\n  $x : true;\n  color: $x;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    important_in_variable,
    "$a: !important;\n\na {\n  color: $a;\n}\n",
    "a {\n  color: !important;\n}\n"
);
test!(
    important_in_variable_casing,
    "$a: !ImPoRtAnT;\n\na {\n  color: $a;\n}\n",
    "a {\n  color: !important;\n}\n"
);
test!(
    exclamation_in_quoted_string,
    "$a: \"big bang!\";\n\na {\n  color: $a;\n}\n",
    "a {\n  color: \"big bang!\";\n}\n"
);
test!(
    flag_uses_escape_sequence,
    "$a: red;\n\na {\n  $a: green !\\67 lobal;\n}\n\na {\n  color: $a;\n}\n",
    "a {\n  color: green;\n}\n"
);
test!(
    not_equal_in_variable_decl,
    "$a: red != blue;\n\na {\n    color: $a;\n}\n",
    "a {\n  color: true;\n}\n"
);
test!(
    error_in_default_value_already_set_is_ignored,
    "$a: red;

    $a: hue(\"not a color, should error\") !default;

    a {
        color: $a;
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    multiline_comments_everywhere,
    "  /**/  $a  /**/  :  /**/  red  /**/  ;  /**/  ",
    "/**/\n/**/\n"
);
test!(
    default_var_overrides_when_null_declared_global,
    "$a: null;
    $a: red !default;

    a {
        color: $a;
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    default_var_overrides_when_null_declared_local,
    "a {
        $a: null;
        $a: red !default;

        color: $a;
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    default_var_overrides_when_null_declared_local_with_global_flags,
    "a {
        $a: null !global;
        $a: red !default !global;

        color: $a;
    }",
    "a {\n  color: red;\n}\n"
);
test!(
    default_at_root_inside_control_flow,
    "$a: initial;

    @if true {
        $a: outer !default;
    }

    a {
        color: $a;
    }",
    "a {\n  color: initial;\n}\n"
);
test!(
    default_at_root_inside_control_flow_outer_is_null,
    "$a: null;

    @if true {
        $a: outer !default;
    }

    a {
        color: $a;
    }",
    "a {\n  color: outer;\n}\n"
);
test!(
    variable_declared_at_root_inside_if,
    "@if true {
        $a: outer;
    }

    a {
        color: variable-exists(a);
    }",
    "a {\n  color: false;\n}\n"
);
test!(
    variable_declared_at_root_inside_if_default,
    "@if true {
        $a: outer !default;
    }

    a {
        color: variable-exists(a);
    }",
    "a {\n  color: false;\n}\n"
);
test!(
    variable_declared_at_root_inside_if_global,
    "@if true {
        $a: outer !global;
    }

    a {
        color: variable-exists(a);
    }",
    "a {\n  color: true;\n}\n"
);
test!(
    variable_declared_at_root_and_globally_inside_if_default,
    "$a: null;

    @if true {
        $a: null;
        $a: outer !default;

        a {
            color: $a;
        }
    }

    a {
        color: $a;
    }",
    "a {\n  color: outer;\n}\n\na {\n  color: outer;\n}\n"
);
test!(
    global_inside_style_inside_control_flow_declared_outer,
    "$y: a;

    a {
        $y: b;

        @if true {
            $y: c !global;
        }

        color: $y;
    }",
    "a {\n  color: b;\n}\n"
);
test!(
    inside_style_inside_control_flow_declared_outer,
    "$y: a;

    a {
        $y: b;

        @if true {
            $y: c;
        }

        color: $y;
    }",
    "a {\n  color: c;\n}\n"
);
test!(
    inside_style_inside_control_flow_declared_outer_global_comes_prior,
    "$a: a;

    a {
        $a: b;

        @if true {
            $a: c !global;
            color: $a;
            $a: e;
        }

        color: $a;
    }",
    "a {\n  color: b;\n  color: e;\n}\n"
);
// https://github.com/Kixiron/lasso/issues/7
test!(
    regression_test_for_lasso_0_3_0,
    "$a: foo;
    $b: foo;
    $c: foo;
    $d: foo;
    $e: foo;
    $f: foo;
    $g: foo;
    $h: foo;
    $i: foo;
    $j: foo;
    $k: foo;
    $l: foo;
    $m: foo;
    $n: foo;
    $o: foo;
    $p: foo;
    $q: foo;
    $r: foo;
    $s: foo;
    $t: foo;
    $u: foo;
    $v: foo;
    $w: foo;
    $x: foo;
    $y: foo;
    $z: foo;
    $aa: foo;
    $bb: foo;
    $cc: foo;
    $dd: foo;
    $ee: foo;
    $ff: foo;
    $gg: foo;
    $hh: foo;
    $ii: foo;
    $jj: foo;
    $kk: foo;
    $ll: foo;
    $mm: foo;
    $nn: foo;
    $oo: foo;
    $pp: foo;
    $qq: foo;
    $rr: foo;
    $ss: foo;
    $tt: foo;
    $uu: foo;
    $vv: foo;
    $ww: foo;
    $xx: foo;
    $yy: foo;
    $zz: foo;
    $aaa: foo;
    $bbb: foo;
    $ccc: foo;

    $global-inverse-color: #fff;

    $inverse-global-muted-color: $global-inverse-color;
    a {
        color: $inverse-global-muted-color;
    }
    ",
    "a {\n  color: #fff;\n}\n"
);
error!(ends_with_bang, "$a: red !;", "Error: Expected identifier.");
error!(unknown_flag, "$a: red !foo;", "Error: Invalid flag name.");
error!(
    flag_in_middle_of_value,
    "$a: a !default b;", "Error: expected \";\"."
);
// note: dart-sass expects !important
error!(
    no_value_only_flag,
    "$a: !default;", "Error: Expected expression."
);
error!(
    uppercase_flag,
    "$a: 1 !GLOBAL;", "Error: Invalid flag name."
);
error!(
    undefined_variable,
    "a {color: $a;}", "Error: Undefined variable."
);
error!(
    invalid_escape,
    "$\\110000: red;", "Error: Invalid escape sequence."
);
error!(
    nothing_after_hash_in_variable_decl,
    "$color: #", "Error: Expected identifier."
);
error!(
    only_semicolon_after_hash_in_variable_decl,
    "$color: #;", "Error: Expected identifier."
);
