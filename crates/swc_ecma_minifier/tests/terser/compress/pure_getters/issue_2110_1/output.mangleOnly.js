function n() {
    function n() {}
    function t() {
        return this;
    }
    n.g = t;
    return n.g();
}
console.log(typeof n());
