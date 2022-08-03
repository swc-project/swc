function n() {
    return (function n() {
        return (n = 0), !!n;
    })();
}
console.log(n());
