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
    bar2: function() {
        return bar;
    },
    default: function() {
        return _default;
    },
    foo: function() {
        return foo;
    },
    foo1: function() {
        return foo;
    }
});
const foo = 1;
let bar = 2;
const _default = bar;
bar = 3;
