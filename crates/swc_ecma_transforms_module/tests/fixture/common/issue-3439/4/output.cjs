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
        return foo;
    },
    default: function() {
        return foo;
    }
});
foo = 1;
function foo() {}
foo = 2;
