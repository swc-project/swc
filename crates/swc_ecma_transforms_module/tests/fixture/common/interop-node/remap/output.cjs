"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    a: null,
    c: null,
    e: null,
    f: null,
    test: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    a: function() {
        return a;
    },
    c: function() {
        return b;
    },
    e: function() {
        return d;
    },
    f: function() {
        return d;
    },
    test: function() {
        return test;
    }
});
var test = 2;
test = 5;
test++;
(function() {
    var test = 2;
    test = 3;
    test++;
})();
var a = 2;
a = 3;
var b = 2;
b = 3;
var d = 3;
d = 4;
