"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "safe", {
    enumerable: true,
    get: function() {
        return safe;
    }
});
var safe = function(fn) {
    try {
        var data = fn();
        return {
            data: data,
            error: undefined
        };
    } catch (error) {
        return {
            data: undefined,
            error: error
        };
    }
};
