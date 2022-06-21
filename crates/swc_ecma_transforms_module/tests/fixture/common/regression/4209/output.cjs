"use strict";
const _copyPaste = require("./copyPaste");
class Thing {
    handleCopySomething() {
        (0, _copyPaste.copy)();
    }
    completelyUnrelated(copy = 123) {}
}
