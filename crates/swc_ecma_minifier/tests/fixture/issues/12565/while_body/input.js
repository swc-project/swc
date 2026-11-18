var n = 0;
while (n++ < 2) {
    function g() {
        return n;
    }
}
console.log(typeof g, g());
