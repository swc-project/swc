var b = 1;
var a = (b += 1),
    b = NaN;
console.log(a, b);
