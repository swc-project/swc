#[macro_use]
mod macros;

error!(
    nothing_after_decimal,
    "a {color: 1.;}", "Error: Expected digit."
);
error!(
    ascii_control_character,
    "a {color: ;}", "Error: Expected expression."
);
error!(
    toplevel_invalid_atrule_ident,
    "@`or $i from 1 through 3 {}", "Error: Expected identifier."
);
error!(
    return_as_style,
    "a {@return foo;}", "Error: This at-rule is not allowed here."
);
error!(
    colon_inside_value,
    "a {foo: bar: baz;}", "Error: expected \";\"."
);
error!(
    question_mark_inside_value,
    "a {foo: bar?}", "Error: expected \";\"."
);
error!(
    interpolation_in_variable_declaration,
    "$base-#{lor}: #036;", "Error: expected \":\"."
);
error!(
    backslash_as_last_character,
    "a {colo\\: red;}", "Error: expected \"{\"."
);
error!(
    close_paren_without_opening,
    "a {color: foo);}", "Error: expected \";\"."
);
error!(
    symbol_after_hash,
    "a {color: bar + #}ar;}", "Error: Expected identifier."
);
error!(
    control_character_starts_selector_toplevel,
    "l {color: foo;}", "Error: expected selector."
);
error!(
    control_character_starts_selector_inner,
    "a{l {color: foo;}}", "Error: expected selector."
);
error!(backtick_in_selector, "a`{}", "Error: expected selector.");
error!(
    no_value_after_forward_slash,
    "a {color: 303/;}", "Error: Expected expression."
);
error!(xor_in_value, "a {color: a^;}", "Error: expected \";\".");
error!(
    nothing_after_at_sign,
    "a {color: red; @", "Error: Expected identifier."
);
error!(
    missing_colon_in_style,
    "a {color, red;}", "Error: expected \"{\"."
);
error!(
    toplevel_forward_slash,
    "/a {color: red;}", "Error: expected selector."
);
error!(
    close_bracket_in_value,
    "a {color: red]}", "Error: expected \";\"."
);
error!(
    no_ident_after_dollar_in_style,
    "a {$", "Error: Expected identifier."
);
error!(
    nothing_after_variable_in_style,
    "a {$a", "Error: expected \":\"."
);
error!(toplevel_comma, "a {},", "Error: expected \"{\".");
error!(toplevel_exclamation_alone, "!", "Error: expected \"}\".");
error!(toplevel_exclamation, "! {}", "Error: expected \"}\".");
error!(toplevel_backtick, "` {}", "Error: expected selector.");
// note that the message dart-sass gives is: `Error: expected "}".`
error!(
    toplevel_open_curly_brace,
    "{ {color: red;}", "Error: expected \"}\"."
);
error!(toplevel_open_paren, "(", "Error: expected \"{\".");
error!(toplevel_close_paren, ")", "Error: expected \"{\".");
error!(
    backtick_in_value,
    "a {color:`red;}", "Error: Expected expression."
);
error!(
    comma_begins_value,
    "a {color:,red;}", "Error: Expected expression."
);
// dart-sass gives `Error: expected "{".`
error!(nothing_after_hyphen, "a {-}", "Error: Expected identifier.");
error!(
    nothing_after_hyphen_variable,
    "a {$-", "Error: expected \":\"."
);
error!(
    closing_brace_after_hyphen_variable,
    "a {$-}", "Error: Expected identifier."
);
error!(
    dbl_quoted_selector,
    "\"a\" {color: red;}", "Error: expected selector."
);
error!(
    sgl_quoted_selector,
    "'a' {color: red;}", "Error: expected selector."
);
error!(
    toplevel_hash_no_closing_curly_brace_has_value,
    "#{f", "Error: expected \"}\"."
);
error!(
    toplevel_hash_no_closing_curly_brace_no_value,
    "#{", "Error: Expected expression."
);
error!(toplevel_hash, "#", "Error: expected \"{\".");
error!(
    #[ignore = "we use closing brace to end scope"]
    toplevel_closing_brace,
    "}", "Error: unmatched \"}\"."
);
error!(toplevel_at, "@", "Error: Expected identifier.");
error!(
    toplevel_ampersand,
    "& {}", "Error: Top-level selectors may not contain the parent selector \"&\"."
);
error!(toplevel_backslash, "\\", "Error: expected \"{\".");
error!(toplevel_var_no_colon, "$r", "Error: expected \":\".");
error!(bar_in_value, "a {color: a|b;}", "Error: expected \";\".");
error!(
    tilde_in_value,
    "a {color: ~a;}", "Error: Expected expression."
);
error!(
    subtract_rem,
    "a {color: 5 - %;}", "Error: Expected expression."
);
error!(
    operator_eq,
    "a {color: 5 - ==;}", "Error: Expected expression."
);
error!(
    operator_ne,
    "a {color: 5 - !=;}", "Error: Expected expression."
);
error!(
    operator_gt,
    "a {color: 5 - >;}", "Error: Expected expression."
);
error!(
    operator_lt,
    "a {color: 5 - <;}", "Error: Expected expression."
);
error!(
    operator_ge,
    "a {color: 5 - >=;}", "Error: Expected expression."
);
error!(
    operator_le,
    "a {color: 5 - <=;}", "Error: Expected expression."
);
error!(
    operator_mul,
    "a {color: 5 - *;}", "Error: Expected expression."
);
error!(
    ends_with_single_eq,
    "a {color: 1 =", "Error: expected \"=\"."
);
error!(
    nothing_after_gt,
    "a {color: 1 >", "Error: Expected expression."
);
error!(toplevel_eq_alone, "=", "Error: expected \"{\".");
error!(toplevel_gt_alone, ">", "Error: expected \"{\".");
error!(toplevel_lt_alone, "<", "Error: expected \"{\".");
error!(toplevel_question_alone, "?", "Error: expected \"{\".");
error!(toplevel_caret_alone, "^", "Error: expected \"{\".");
test!(toplevel_gt_as_selector, "> {}", "");
test!(toplevel_tilde_as_selector, "~ {}", "");
error!(toplevel_lt_as_selector, "< {}", "Error: expected selector.");
error!(toplevel_pipe, "| {}", "Error: Expected identifier.");
error!(
    toplevel_question_as_selector,
    "? {}", "Error: expected selector."
);
error!(
    toplevel_caret_as_selector,
    "^ {}", "Error: expected selector."
);
error!(toplevel_eq, "= {}", "Error: expected selector.");
error!(value_after_style, "a {}a", "Error: expected \"{\".");
test!(whitespace_after_style, "a {}\t\n ", "");
test!(toplevel_semicolon, ";", "");
test!(toplevel_semicolon_after_style, "a {};", "");
error!(
    nothing_after_hash_in_interpolated_ident_body,
    "a {color: foo#", "Error: Expected identifier."
);
error!(
    at_else_alone,
    "@else {}", "Error: This at-rule is not allowed here."
);
error!(
    no_expression_for_variable,
    "a {$color: {ed;}", "Error: Expected expression."
);
error!(
    empty_style_value_no_semicolon,
    "a {color:}", "Error: Expected expression."
);
error!(
    empty_style_value_semicolon,
    "a {color:;}", "Error: Expected expression."
);
error!(
    ident_colon_closing_brace,
    "r:}", "Error: Expected expression."
);
error!(dollar_sign_alone, "$", "Error: Expected identifier.");
error!(
    nothing_after_dbl_quote,
    "a {color: \"", "Error: Expected \"."
);
error!(nothing_after_sgl_quote, "a {color: '", "Error: Expected '.");
error!(
    invalid_binop_in_list,
    "a {color: foo % bar, baz;}", "Error: Undefined operation \"foo % bar\"."
);
error!(
    improperly_terminated_nested_style,
    "a {foo: {bar: red", "Error: Expected identifier."
);
error!(toplevel_nullbyte, "\u{0}", "Error: expected selector.");
error!(
    double_escaped_bang_at_toplevel,
    "\\!\\!", "Error: expected \"{\"."
);
error!(
    nothing_after_escape_inside_brackets,
    "a { color: [\\", "Error: Expected expression."
);
error!(
    unclosed_bracketed_list,
    "a { color: [a", "Error: expected \"]\"."
);
