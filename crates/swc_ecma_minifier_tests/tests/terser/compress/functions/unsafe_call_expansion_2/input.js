var values = [2, 3];
(function (...a) {
    console.log(...a);
}.call(console, 1, ...values, 4));
