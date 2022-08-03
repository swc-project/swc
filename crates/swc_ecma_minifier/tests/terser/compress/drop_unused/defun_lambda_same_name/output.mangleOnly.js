function n(r) {
    return r ? r * n(r - 1) : 1;
}
console.log((function n(r) {
    return r ? r * n(r - 1) : 1;
})(5));
