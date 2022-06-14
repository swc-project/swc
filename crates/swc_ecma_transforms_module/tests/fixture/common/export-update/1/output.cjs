"use strict";
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
module.exports = __toCJS(exports);
let foo = 1n;
foo++;
let bar = ++foo;
let baz = bar--;
--bar;
