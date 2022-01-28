function constant_vars_can_be_replaced_in_any_scope() {
    var outer = 3;
    return function () {
        return outer;
    };
}
function non_constant_vars_can_only_be_replace_in_same_scope(x) {
    var outer = x;
    return function () {
        return outer;
    };
}
