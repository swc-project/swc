(function (...o) {
    console.log(...o);
}.call(console, 1, ...[2, 3], 4));
