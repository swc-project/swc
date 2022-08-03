(function(n) {
    console.log((n = "foo"), arguments[0]);
})("bar");
(function(n) {
    "use strict";
    console.log((n = "foo"), arguments[0]);
})("bar");
