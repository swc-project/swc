(function(l, c) {
    console.log(l, c);
}.call("foo", "bar"));
(function(l, c) {
    console.log(this, l, c);
}.call("foo", "bar"));
