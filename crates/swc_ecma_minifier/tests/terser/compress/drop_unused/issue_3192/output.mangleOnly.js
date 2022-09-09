(function (o) {
    console.log((o = "foo"), arguments[0]);
})("bar");
(function (o) {
    "use strict";
    console.log((o = "foo"), arguments[0]);
})("bar");
