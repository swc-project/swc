console.log("bar", void 0);
(function (a, b) {
    console.log(this, a, b);
}.call("foo", "bar"));
(function (a, b) {
    console.log(a, b);
}.apply("foo", ["bar"], "baz"));
