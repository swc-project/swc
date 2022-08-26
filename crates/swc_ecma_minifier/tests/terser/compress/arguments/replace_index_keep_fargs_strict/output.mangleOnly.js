"use strict";
(function() {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
(function(o, f) {
    console.log(arguments[1], arguments["1"], arguments["foo"]);
})("bar", 42);
