var o = [2, 3];
(function (...o) {
    console.log(...o);
}.call(console, 1, ...o, 4));
