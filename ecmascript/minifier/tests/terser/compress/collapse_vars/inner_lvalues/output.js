var b = 10;
var a = (--b || a || 3).toString(),
    c = --b + -a;
console.log(null, a, b);
