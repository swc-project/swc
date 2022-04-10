"use strict";
while (!(foo || x + "0")) {
    console.log("unreachable");
    var foo;
}
for (var x = 10, y; x && (y || x) && !typeof x; ++x) {
    asdf();
    foo();
    var moo;
}
bar();
