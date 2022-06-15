define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
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
