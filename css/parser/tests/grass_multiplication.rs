#[macro_use]
mod grass_macros;

grass_error!(
    map_lhs_mul,
    "a {color: (a: b) * 1;}",
    "Error: Undefined operation \"(a: b) * 1\"."
);
grass_error!(
    map_rhs_mul,
    "a {color: 1 * (a: b);}",
    "Error: Undefined operation \"1 * (a: b)\"."
);
grass_error!(
    function_lhs_mul,
    "a {color: get-function(lighten) * 1;}",
    "Error: Undefined operation \"get-function(\"lighten\") * 1\"."
);
grass_error!(
    function_rhs_mul,
    "a {color: 1 * get-function(lighten);}",
    "Error: Undefined operation \"1 * get-function(\"lighten\")\"."
);
grass_error!(
    null_mul_number,
    "a {color: null * 1;}",
    "Error: Undefined operation \"null * 1\"."
);
