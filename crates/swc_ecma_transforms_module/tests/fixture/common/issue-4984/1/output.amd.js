define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        default: function() {
            return MyClass;
        }
    });
    const VALUE = "hello";
    class MyClass {
        static MEMBER = VALUE;
    }
});
