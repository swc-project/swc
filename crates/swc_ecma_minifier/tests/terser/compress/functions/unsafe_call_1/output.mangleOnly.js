(function (o, l) {
    console.log(o, l);
}.call("foo", "bar"));
(function (o, l) {
    console.log(this, o, l);
}.call("foo", "bar"));
