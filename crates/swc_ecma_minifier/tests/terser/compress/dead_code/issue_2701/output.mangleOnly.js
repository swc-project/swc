function n(n) {
    return (n = (function () {
        return function () {
            return n;
        };
    })());
}
console.log(typeof n()());
