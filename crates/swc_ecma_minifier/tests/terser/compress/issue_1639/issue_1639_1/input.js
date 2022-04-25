var a = 100,
    b = 10;
var L1 = 5;
while (--L1 > 0) {
    if ((--b, false)) {
        if (b) {
            var ignore = 0;
        }
    }
}
console.log(a, b);
