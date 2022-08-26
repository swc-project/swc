(function(o, a) {
    console.log(o, a);
}.apply("foo", [
    "bar"
]));
(function(o, a) {
    console.log(this, o, a);
}.apply("foo", [
    "bar"
]));
(function(o, a) {
    console.log(o, a);
}.apply("foo", [
    "bar"
], "baz"));
