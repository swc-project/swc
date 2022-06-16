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
            return Foo;
        }
    });
    const Base = getBase("");
    class Foo extends Base {
    }
});
