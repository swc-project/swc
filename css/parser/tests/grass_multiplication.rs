#[macro_use]
mod grass_macros;

error!(
    map_lhs_mul,
    "a {color: (a: b) * 1;}", "Error: Undefined operation \"(a: b) * 1\"."
);
error!(
    map_rhs_mul,
    "a {color: 1 * (a: b);}", "Error: Undefined operation \"1 * (a: b)\"."
);
error!(
    function_lhs_mul,
    "a {color: get-function(lighten) * 1;}",
    "Error: Undefined operation \"get-function(\"lighten\") * 1\"."
);
error!(
    function_rhs_mul,
    "a {color: 1 * get-function(lighten);}",
    "Error: Undefined operation \"1 * get-function(\"lighten\")\"."
);
error!(
    null_mul_number,
    "a {color: null * 1;}", "Error: Undefined operation \"null * 1\"."
);
