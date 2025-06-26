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
    get bar () {
        return foo;
    },
    get default () {
        return foo;
    }
});
foo = 1;
function foo() {}
foo = 2;
