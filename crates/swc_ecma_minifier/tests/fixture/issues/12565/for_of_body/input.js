for (var v of [1, 2]) {
    function g() {
        return v;
    }
}
console.log(typeof g, g());
