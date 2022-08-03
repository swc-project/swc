(function(...l) {
    console.log(...l);
}.call(console, 1, ...[
    2,
    3
], 4));
