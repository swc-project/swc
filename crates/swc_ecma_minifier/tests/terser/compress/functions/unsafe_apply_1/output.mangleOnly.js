(function (o, l) {
    console.log(o, l);
}.apply("foo", ["bar"]));
(function (o, l) {
    console.log(this, o, l);
}.apply("foo", ["bar"]));
(function (o, l) {
    console.log(o, l);
}.apply("foo", ["bar"], "baz"));
