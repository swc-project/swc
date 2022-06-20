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
    baz: function() {
        return baz;
    },
    bazbar: function() {
        return baz;
    },
    foo: function() {
        return foo;
    },
    foobar: function() {
        return foo;
    }
});
let foo = 1n;
foo++;
let bar = ++foo;
let baz = bar--;
--bar;
