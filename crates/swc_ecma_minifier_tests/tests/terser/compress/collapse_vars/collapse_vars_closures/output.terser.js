function constant_vars_can_be_replaced_in_any_scope() {
    return function () {
        return 3;
    };
}
function non_constant_vars_can_only_be_replace_in_same_scope(x) {
    var outer = x;
    return function () {
        return outer;
    };
}
