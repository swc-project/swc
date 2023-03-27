define([
    "require",
    "exports",
    "./copyPaste"
], function(require, exports, _copy_paste) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class Thing {
        handleCopySomething() {
            (0, _copy_paste.copy)();
        }
        completelyUnrelated(copy = 123) {}
    }
});
