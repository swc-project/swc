// The fact that this exports both a normal default, and all of the names via
// re-export is an edge case that is important not to miss. See
// https://github.com/babel/babel/issues/8306 as an example.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get () {
        return _default;
    }
});
0 && __export(require("react"));
const _react = _exportStar(require("react"), exports);
const _default = _react;
