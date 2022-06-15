"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
_export(exports, {
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
