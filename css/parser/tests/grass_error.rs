#[macro_use]
mod grass_macros;

grass_error!(
    nothing_after_decimal,
    "a {color: 1.;}",
    "Error: Expected digit."
);
grass_error!(
    ascii_control_character,
    "a {color: ;}",
    "Error: Expected expression."
);
grass_error!(
    toplevel_invalid_atrule_ident,
    "@`or $i from 1 through 3 {}",
    "Error: Expected identifier."
);
grass_error!(
    return_as_style,
    "a {@return foo;}",
    "Error: This at-rule is not allowed here."
);
grass_error!(
    colon_inside_value,
    "a {foo: bar: baz;}",
    "Error: expected \";\"."
);
grass_error!(
    question_mark_inside_value,
    "a {foo: bar?}",
    "Error: expected \";\"."
);
grass_error!(
    interpolation_in_variable_declaration,
    "$base-#{lor}: #036;",
    "Error: expected \":\"."
);
grass_error!(
    backslash_as_last_character,
    "a {colo\\: red;}",
    "Error: expected \"{\"."
);
grass_error!(
    close_paren_without_opening,
    "a {color: foo);}",
    "Error: expected \";\"."
);
grass_error!(
    symbol_after_hash,
    "a {color: bar + #}ar;}",
    "Error: Expected identifier."
);
grass_error!(
    control_character_starts_selector_toplevel,
    "l {color: foo;}",
    "Error: expected selector."
);
grass_error!(
    control_character_starts_selector_inner,
    "a{l {color: foo;}}",
    "Error: expected selector."
);
grass_error!(backtick_in_selector, "a`{}", "Error: expected selector.");
grass_error!(
    no_value_after_forward_slash,
    "a {color: 303/;}",
    "Error: Expected expression."
);
grass_error!(xor_in_value, "a {color: a^;}", "Error: expected \";\".");
grass_error!(
    nothing_after_at_sign,
    "a {color: red; @",
    "Error: Expected identifier."
);
grass_error!(
    missing_colon_in_style,
    "a {color, red;}",
    "Error: expected \"{\"."
);
grass_error!(
    toplevel_forward_slash,
    "/a {color: red;}",
    "Error: expected selector."
);
grass_error!(
    close_bracket_in_value,
    "a {color: red]}",
    "Error: expected \";\"."
);
grass_error!(
    no_ident_after_dollar_in_style,
    "a {$",
    "Error: Expected identifier."
);
grass_error!(
    nothing_after_variable_in_style,
    "a {$a",
    "Error: expected \":\"."
);
grass_error!(toplevel_comma, "a {},", "Error: expected \"{\".");
grass_error!(toplevel_exclamation_alone, "!", "Error: expected \"}\".");
grass_error!(toplevel_exclamation, "! {}", "Error: expected \"}\".");
grass_error!(toplevel_backtick, "` {}", "Error: expected selector.");
// note that the message dart-sass gives is: `Error: expected "}".`
grass_error!(
    toplevel_open_curly_brace,
    "{ {color: red;}",
    "Error: expected \"}\"."
);
grass_error!(toplevel_open_paren, "(", "Error: expected \"{\".");
grass_error!(toplevel_close_paren, ")", "Error: expected \"{\".");
grass_error!(
    backtick_in_value,
    "a {color:`red;}",
    "Error: Expected expression."
);
grass_error!(
    comma_begins_value,
    "a {color:,red;}",
    "Error: Expected expression."
);
// dart-sass gives `Error: expected "{".`
grass_error!(nothing_after_hyphen, "a {-}", "Error: Expected identifier.");
grass_error!(
    nothing_after_hyphen_variable,
    "a {$-",
    "Error: expected \":\"."
);
grass_error!(
    closing_brace_after_hyphen_variable,
    "a {$-}",
    "Error: Expected identifier."
);
grass_error!(
    dbl_quoted_selector,
    "\"a\" {color: red;}",
    "Error: expected selector."
);
grass_error!(
    sgl_quoted_selector,
    "'a' {color: red;}",
    "Error: expected selector."
);
grass_error!(
    toplevel_hash_no_closing_curly_brace_has_value,
    "#{f",
    "Error: expected \"}\"."
);
grass_error!(
    toplevel_hash_no_closing_curly_brace_no_value,
    "#{",
    "Error: Expected expression."
);
grass_error!(toplevel_hash, "#", "Error: expected \"{\".");
grass_error!(
    #[ignore = "we use closing brace to end scope"]
    toplevel_closing_brace,
    "}",
    "Error: unmatched \"}\"."
);
grass_error!(toplevel_at, "@", "Error: Expected identifier.");
grass_error!(
    toplevel_ampersand,
    "& {}",
    "Error: Top-level selectors may not contain the parent selector \"&\"."
);
grass_error!(toplevel_backslash, "\\", "Error: expected \"{\".");
grass_error!(toplevel_var_no_colon, "$r", "Error: expected \":\".");
grass_error!(bar_in_value, "a {color: a|b;}", "Error: expected \";\".");
grass_error!(
    tilde_in_value,
    "a {color: ~a;}",
    "Error: Expected expression."
);
grass_error!(
    subtract_rem,
    "a {color: 5 - %;}",
    "Error: Expected expression."
);
grass_error!(
    operator_eq,
    "a {color: 5 - ==;}",
    "Error: Expected expression."
);
grass_error!(
    operator_ne,
    "a {color: 5 - !=;}",
    "Error: Expected expression."
);
grass_error!(
    operator_gt,
    "a {color: 5 - >;}",
    "Error: Expected expression."
);
grass_error!(
    operator_lt,
    "a {color: 5 - <;}",
    "Error: Expected expression."
);
grass_error!(
    operator_ge,
    "a {color: 5 - >=;}",
    "Error: Expected expression."
);
grass_error!(
    operator_le,
    "a {color: 5 - <=;}",
    "Error: Expected expression."
);
grass_error!(
    operator_mul,
    "a {color: 5 - *;}",
    "Error: Expected expression."
);
grass_error!(
    ends_with_single_eq,
    "a {color: 1 =",
    "Error: expected \"=\"."
);
grass_error!(
    nothing_after_gt,
    "a {color: 1 >",
    "Error: Expected expression."
);
grass_error!(toplevel_eq_alone, "=", "Error: expected \"{\".");
grass_error!(toplevel_gt_alone, ">", "Error: expected \"{\".");
grass_error!(toplevel_lt_alone, "<", "Error: expected \"{\".");
grass_error!(toplevel_question_alone, "?", "Error: expected \"{\".");
grass_error!(toplevel_caret_alone, "^", "Error: expected \"{\".");
grass_test!(toplevel_gt_as_selector, "> {}", "");
grass_test!(toplevel_tilde_as_selector, "~ {}", "");
grass_error!(toplevel_lt_as_selector, "< {}", "Error: expected selector.");
grass_error!(toplevel_pipe, "| {}", "Error: Expected identifier.");
grass_error!(
    toplevel_question_as_selector,
    "? {}",
    "Error: expected selector."
);
grass_error!(
    toplevel_caret_as_selector,
    "^ {}",
    "Error: expected selector."
);
grass_error!(toplevel_eq, "= {}", "Error: expected selector.");
grass_error!(value_after_style, "a {}a", "Error: expected \"{\".");
grass_test!(whitespace_after_style, "a {}\t\n ", "");
grass_test!(toplevel_semicolon, ";", "");
grass_test!(toplevel_semicolon_after_style, "a {};", "");
grass_error!(
    nothing_after_hash_in_interpolated_ident_body,
    "a {color: foo#",
    "Error: Expected identifier."
);
grass_error!(
    at_else_alone,
    "@else {}",
    "Error: This at-rule is not allowed here."
);
grass_error!(
    no_expression_for_variable,
    "a {$color: {ed;}",
    "Error: Expected expression."
);
grass_error!(
    empty_style_value_no_semicolon,
    "a {color:}",
    "Error: Expected expression."
);
grass_error!(
    empty_style_value_semicolon,
    "a {color:;}",
    "Error: Expected expression."
);
grass_error!(
    ident_colon_closing_brace,
    "r:}",
    "Error: Expected expression."
);
grass_error!(dollar_sign_alone, "$", "Error: Expected identifier.");
grass_error!(
    nothing_after_dbl_quote,
    "a {color: \"",
    "Error: Expected \"."
);
grass_error!(nothing_after_sgl_quote, "a {color: '", "Error: Expected '.");
grass_error!(
    invalid_binop_in_list,
    "a {color: foo % bar, baz;}",
    "Error: Undefined operation \"foo % bar\"."
);
grass_error!(
    improperly_terminated_nested_style,
    "a {foo: {bar: red",
    "Error: Expected identifier."
);
grass_error!(toplevel_nullbyte, "\u{0}", "Error: expected selector.");
grass_error!(
    double_escaped_bang_at_toplevel,
    "\\!\\!",
    "Error: expected \"{\"."
);
grass_error!(
    nothing_after_escape_inside_brackets,
    "a { color: [\\",
    "Error: Expected expression."
);
grass_error!(
    unclosed_bracketed_list,
    "a { color: [a",
    "Error: expected \"]\"."
);
