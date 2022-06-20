define([
    "require",
    "exports",
    "./evens"
], function(require, exports, _evens) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        isOdd: function() {
            return isOdd;
        },
        nextOdd: function() {
            return nextOdd;
        }
    });
    function nextOdd(n) {
        return (0, _evens.isEven)(n) ? n + 1 : n + 2;
    }
    var isOdd = function(isEven) {
        return function(n) {
            return !isEven(n);
        };
    }(_evens.isEven);
});
