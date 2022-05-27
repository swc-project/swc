"use strict";
console.log((function(a) {
    return a;
})(!(function() {
    return this;
})()));
