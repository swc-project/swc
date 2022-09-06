var a = 1;
var o = (a += 1),
    a = NaN;
console.log(o, a);
