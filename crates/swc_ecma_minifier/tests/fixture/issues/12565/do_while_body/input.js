var n = 0;
do {
    function g() {
        return n;
    }
} while (n++ < 2);
console.log(typeof g, g());
