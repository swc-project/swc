define([
    "require",
    "./copyPaste"
], function(require, _copyPaste) {
    "use strict";
    class Thing {
        handleCopySomething() {
            (0, _copyPaste.copy)();
        }
        completelyUnrelated(copy = 123) {}
    }
});
