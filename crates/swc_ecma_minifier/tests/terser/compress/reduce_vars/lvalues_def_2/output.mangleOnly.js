var a = 1;
var b = (a += 1), a = NaN;
console.log(b, a);
