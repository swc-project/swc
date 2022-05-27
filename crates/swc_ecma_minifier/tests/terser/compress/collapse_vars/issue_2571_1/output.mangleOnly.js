var a = 1;
try {
    var b = (function b(a) {
        throw a;
    })(2);
    var c = --a + b;
} catch (d) {}
console.log(a);
