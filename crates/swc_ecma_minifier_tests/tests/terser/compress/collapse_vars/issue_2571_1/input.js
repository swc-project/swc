var b = 1;
try {
    var a = (function f0(c) {
        throw c;
    })(2);
    var d = --b + a;
} catch (e) {}
console.log(b);
