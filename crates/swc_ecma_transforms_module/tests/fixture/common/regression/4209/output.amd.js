define([
    "require",
    "exports",
    "./copyPaste"
], function(require, exports, _copyPaste) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class Thing {
        handleCopySomething() {
            (0, _copyPaste.copy)();
        }
        completelyUnrelated(copy = 123) {}
    }
});
