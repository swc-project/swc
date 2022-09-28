"use strict";
console.log((function(n) {
    return n;
})(!(function() {
    return this;
})()));
