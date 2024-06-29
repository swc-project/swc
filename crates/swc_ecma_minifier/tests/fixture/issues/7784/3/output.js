function f(i, e, cmp) {
    function g() {
        return i++, e || 0;
    }
    return e = g(e), cmp(i, e) && console.log(e), g;
}
export { f };
