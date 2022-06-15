define([
    "require",
    "exports"
], function(require, _exports) {
    "use strict";
    Object.defineProperty(_exports, "__esModule", {
        value: true
    });
    _export(_exports, {
        bar: function() {
            return bar;
        },
        bar2: function() {
            return bar;
        },
        default: function() {
            return bar;
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
    bar = 3;
});
