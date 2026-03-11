export function f(i, e, cmp) {
    function g() {
        return i++, e || 0;
    }
    return e = g(), cmp(i, e) && console.log(e), g;
}
