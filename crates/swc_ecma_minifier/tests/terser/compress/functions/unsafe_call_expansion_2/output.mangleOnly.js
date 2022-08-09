var l = [
    2,
    3
];
(function(...l) {
    console.log(...l);
}.call(console, 1, ...l, 4));
