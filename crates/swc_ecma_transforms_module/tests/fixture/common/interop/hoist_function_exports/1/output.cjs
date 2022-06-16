"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export(exports, {
    isOdd: function() {
        return isOdd;
    },
    nextOdd: function() {
        return nextOdd;
    }
});
var _evens = require("./evens");
function nextOdd(n) {
    return (0, _evens.isEven)(n) ? n + 1 : n + 2;
}
var isOdd = function(isEven) {
    return function(n) {
        return !isEven(n);
    };
}(_evens.isEven);
