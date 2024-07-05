function _check_in_rhs(value) {
    if (Object(value) !== value) {
        throw TypeError("right-hand side of 'in' should be an object, got " + (value !== null ? typeof value : "null"));
    }
    return value;
}
