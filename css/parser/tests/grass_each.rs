#[macro_use]
mod grass_macros;

grass_test!(
    each_space_separated_inner,
    "a {\n  @each $i in 1 2 3 {\n    color: $i;\n  }\n}\n",
    "a {\n  color: 1;\n  color: 2;\n  color: 3;\n}\n"
);
grass_test!(
    each_comma_separated_inner,
    "a {\n  @each $i in 1, 2, 3 {\n    color: $i;\n  }\n}\n",
    "a {\n  color: 1;\n  color: 2;\n  color: 3;\n}\n"
);
grass_test!(
    each_space_separated_outer,
    "@each $i in 1 2 3 {\n  a {\n    color: $i;\n  }\n}\n",
    "a {\n  color: 1;\n}\n\na {\n  color: 2;\n}\n\na {\n  color: 3;\n}\n"
);
grass_test!(
    each_two_variables_one_null,
    "a {\n  @each $i, $c in 1 2 3 {\n    color: $i;\n  }\n}\n",
    "a {\n  color: 1;\n  color: 2;\n  color: 3;\n}\n"
);
grass_test!(
    each_one_var_in_one_map,
    "a {\n  @each $i in (a: b) {\n    color: $i;\n  }\n}\n",
    "a {\n  color: a b;\n}\n"
);
grass_test!(
    each_two_vars_in_one_map,
    "a {\n  @each $i, $c in (a: b) {\n    color: $i;\n  }\n}\n",
    "a {\n  color: a;\n}\n"
);
grass_test!(
    each_two_vars_in_3_2_list,
    "a {\n  @each $i, $c in (1 2 3, 4 5) {\n    color: $i, $c;\n  }\n}\n",
    "a {\n  color: 1, 2;\n  color: 4, 5;\n}\n"
);
grass_test!(
    each_paren_space_separated,
    "a {\n  @each $i in (1 2 3) {\n    color: $i;\n  }\n}\n",
    "a {\n  color: 1;\n  color: 2;\n  color: 3;\n}\n"
);
grass_test!(
    type_of_each_space_separated_single_var,
    "a {\n  @each $i in 1 2 3 {\n    color: type-of($i);\n  }\n}\n",
    "a {\n  color: number;\n  color: number;\n  color: number;\n}\n"
);
grass_test!(
    list_of_single_map_with_multiple_elements,
    "a {
        $settings: ();

        @each $config in [(a: b, c: d)] {
            $settings: map-merge($settings, $config);
        }

        color: inspect($settings);
    }",
    "a {\n  color: (a: b, c: d);\n}\n"
);
grass_test!(
    indexing_variable_does_not_affect_outer_scopes,
    "a {
        $a: 1;
        $b: 1;

        @each $a in a b {
            color: $a;
            $b: $a;
        }

        color: $a;
        color: $b;
    }",
    "a {\n  color: a;\n  color: b;\n  color: 1;\n  color: b;\n}\n"
);
// todo: newlines are not correct
grass_test!(
    multiline_comments_everywhere,
    "  /**/  @each  /**/  $a  /**/  ,  /**/  $b  /**/  in  /**/  (  /**/  a  /**/  ,  /**/  b  \
     /**/  )  /**/  {  /**/  
        a {
            color: $a;
            color: $b;
        }
    }  /**/  ",
    "/**/\n/**/\na {\n  color: a;\n}\n/**/\n\na {\n  color: b;\n}\n/**/\n"
);
grass_error!(
    list_of_single_map,
    "a {
        @each $a in [(a: b)] {
          color: $a;
        }
      }",
    "Error: (a: b) isn't a valid CSS value."
);
grass_error!(
    missing_closing_curly_brace,
    "@each $i in 1 {",
    "Error: expected \"}\"."
);
