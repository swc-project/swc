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
var _default = bar;
bar = 3;
