"use strict";
console.log(function(a) {
    return a || a(), a;
}(42));
