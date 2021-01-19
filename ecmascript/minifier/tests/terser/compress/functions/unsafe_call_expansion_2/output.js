var values = [2, 3];
console,
    (function (...a) {
        console.log(...a);
    })(1, ...values, 4);
