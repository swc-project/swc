"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get a () {
        return a;
    },
    get c () {
        return b;
    },
    get e () {
        return d;
    },
    get f () {
        return d;
    },
    get test () {
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
