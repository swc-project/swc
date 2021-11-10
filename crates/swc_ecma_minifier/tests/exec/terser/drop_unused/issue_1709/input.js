console.log(
    (function x() {
        var x = 1;
        return x;
    })(),
    (function y() {
        const y = 2;
        return y;
    })(),
    (function z() {
        function z() {}
        return z;
    })()
);
