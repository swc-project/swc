"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _rootJs = /*#__PURE__*/ _interopRequireDefault(require("./_root.js"));
const _stubFalseJs = /*#__PURE__*/ _interopRequireDefault(require("./stubFalse.js"));
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer = moduleExports ? _rootJs.default.Buffer : undefined;
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
var isBuffer = nativeIsBuffer || _stubFalseJs.default;
const _default = isBuffer;
