var o = 1;
try {
    var r = (function o(r) {
        throw r;
    })(2);
    var a = --o + r;
} catch (c) {}
console.log(o);
