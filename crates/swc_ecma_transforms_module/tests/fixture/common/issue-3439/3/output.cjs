"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    bar: function() {
        return bar;
    },
    foo1: function() {
        return foo;
    },
    bar2: function() {
        return bar;
    },
    foo: function() {
        return foo;
    },
    default: function() {
        return bar;
    }
});
const foo = 1;
let bar = 2;
bar = 3;
