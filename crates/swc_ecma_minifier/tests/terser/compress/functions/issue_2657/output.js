"use strict";
console.log(function(a) {
    var b;
    return a || a(), a;
}(42));
