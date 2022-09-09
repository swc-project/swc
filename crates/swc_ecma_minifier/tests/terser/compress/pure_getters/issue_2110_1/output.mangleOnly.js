function n() {
    function n() {}
    function o() {
        return this;
    }
    n.g = o;
    return n.g();
}
console.log(typeof n());
