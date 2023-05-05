(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./_root.js"), require("./stubFalse.js"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./_root.js",
        "./stubFalse.js"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.rootJs, global.stubFalseJs);
})(this, function(exports1, _root, _stubFalse) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    Object.defineProperty(exports1, "default", {
        enumerable: true,
        get: function() {
            return _default;
        }
    });
    _root = /*#__PURE__*/ _interop_require_default(_root);
    _stubFalse = /*#__PURE__*/ _interop_require_default(_stubFalse);
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? _root.default.Buffer : undefined;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    var isBuffer = nativeIsBuffer || _stubFalse.default;
    const _default = isBuffer;
});
