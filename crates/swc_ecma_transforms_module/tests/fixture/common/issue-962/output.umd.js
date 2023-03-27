(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("./_root.js"), require("./stubFalse.js"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "./_root.js",
        "./stubFalse.js"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.rootJs, global.stubFalseJs);
})(this, function(exports1, _root_js, _stub_false_js) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    Object.defineProperty(exports1, "default", {
        enumerable: true,
        get: ()=>_default
    });
    _root_js = /*#__PURE__*/ _interop_require_default(_root_js);
    _stub_false_js = /*#__PURE__*/ _interop_require_default(_stub_false_js);
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? _root_js.default.Buffer : undefined;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    var isBuffer = nativeIsBuffer || _stub_false_js.default;
    const _default = isBuffer;
});
