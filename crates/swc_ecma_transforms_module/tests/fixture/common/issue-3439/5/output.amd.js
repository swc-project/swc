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
            return foo;
        },
        default: function() {
            return foo;
        }
    });
    foo = 1;
    class foo {
    }
    foo = 2;
});
