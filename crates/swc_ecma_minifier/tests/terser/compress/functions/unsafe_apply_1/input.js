(function (a, b) {
    console.log(a, b);
}.apply("foo", ["bar"]));
(function (a, b) {
    console.log(this, a, b);
}.apply("foo", ["bar"]));
(function (a, b) {
    console.log(a, b);
}.apply("foo", ["bar"], "baz"));
