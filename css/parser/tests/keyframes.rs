#[macro_use]
mod macros;

// @content inside keyframes
test!(
    content_inside_keyframes,
    "@mixin foo {
        @keyframes {
          @content;
        }
      }
      a {
        @include foo {
          color: red;
        };
      }",
    "@keyframes {\n  color: red;\n}\n"
);

test!(
    empty_keyframes_is_emitted_exact,
    "@keyframes {}",
    "@keyframes {}\n"
);
test!(
    keyframes_is_at_root,
    "a {\n    @keyframes {}\n}\n",
    "@keyframes {}\n"
);
test!(
    keyframes_inside_ruleset_with_other_styles,
    "a {
        color: red;
        @keyframes {}
        color: green;
    }",
    "a {\n  color: red;\n  color: green;\n}\n@keyframes {}\n"
);
test!(
    keyframes_lowercase_to,
    "@keyframes {to {color: red;}}",
    "@keyframes {\n  to {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_lowercase_from,
    "@keyframes {from {color: red;}}",
    "@keyframes {\n  from {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_uppercase_to,
    "@keyframes {TO {color: red;}}",
    "@keyframes {\n  to {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_uppercase_from,
    "@keyframes {FROM {color: red;}}",
    "@keyframes {\n  from {\n    color: red;\n  }\n}\n"
);
error!(
    keyframes_invalid_selector_beginning_with_f,
    "@keyframes {foo {}}", "Error: Expected \"to\" or \"from\"."
);
error!(
    keyframes_invalid_selector_beginning_with_t,
    "@keyframes {too {}}", "Error: Expected \"to\" or \"from\"."
);
error!(
    keyframes_invalid_selector_beginning_with_ascii_char,
    "@keyframes {a {}}", "Error: Expected \"to\" or \"from\"."
);
error!(
    keyframes_invalid_selector_number_missing_percent,
    "@keyframes {10 {}}", "Error: expected \"%\"."
);
test!(
    keyframes_simple_percent_selector,
    "@keyframes {0% {color: red;}}",
    "@keyframes {\n  0% {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_comma_separated_percent_selectors,
    "@keyframes {0%, 5%, 10%, 15% {color: red;}}",
    "@keyframes {\n  0%, 5%, 10%, 15% {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_empty_with_name,
    "@keyframes foo {}",
    "@keyframes foo {}\n"
);
test!(
    keyframes_variable_in_name,
    "@keyframes $foo {}",
    "@keyframes $foo {}\n"
);
test!(
    keyframes_arithmetic_in_name,
    "@keyframes 1 + 2 {}",
    "@keyframes 1 + 2 {}\n"
);
test!(
    keyframes_interpolation_in_name,
    "@keyframes #{1 + 2} {}",
    "@keyframes 3 {}\n"
);
test!(
    keyframes_contains_multiline_comment,
    "@keyframes foo {/**/}",
    "@keyframes foo {\n  /**/\n}\n"
);
test!(
    keyframes_multiple_rulesets,
    "@keyframes {
        to {
            color: red;
        }
        from {
            color: green;
        }
    }",
    "@keyframes {\n  to {\n    color: red;\n  }\n  from {\n    color: green;\n  }\n}\n"
);
test!(
    keyframes_vendor_prefix,
    "@-webkit-keyframes foo {
        0% {
            color: red;
        }
    }",
    "@-webkit-keyframes foo {\n  0% {\n    color: red;\n  }\n}\n"
);
test!(
    keyframes_allow_decimal_selector,
    "@keyframes foo {
        12.5% {
            color: red;
        }
    }",
    "@keyframes foo {\n  12.5% {\n    color: red;\n  }\n}\n"
);
