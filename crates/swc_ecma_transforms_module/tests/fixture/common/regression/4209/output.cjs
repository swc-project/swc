"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _copy_paste = require("./copyPaste");
class Thing {
    handleCopySomething() {
        (0, _copy_paste.copy)();
    }
    completelyUnrelated(copy = 123) {}
}
