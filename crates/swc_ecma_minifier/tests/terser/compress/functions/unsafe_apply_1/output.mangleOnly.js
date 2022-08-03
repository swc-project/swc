(function(l, n) {
    console.log(l, n);
}.apply("foo", [
    "bar"
]));
(function(l, n) {
    console.log(this, l, n);
}.apply("foo", [
    "bar"
]));
(function(l, n) {
    console.log(l, n);
}.apply("foo", [
    "bar"
], "baz"));
