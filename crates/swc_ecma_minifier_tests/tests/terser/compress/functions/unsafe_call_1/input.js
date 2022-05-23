(function (a, b) {
    console.log(a, b);
}.call("foo", "bar"));
(function (a, b) {
    console.log(this, a, b);
}.call("foo", "bar"));
