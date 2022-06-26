var a = 1;
try {
    var b = (function a(b) {
        throw b;
    })(2);
    var c = --a + b;
} catch (d) {}
console.log(a);
