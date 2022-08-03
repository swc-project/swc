var r = 1;
try {
    var a = (function r(a) {
        throw a;
    })(2);
    var t = --r + a;
} catch (c) {}
console.log(r);
