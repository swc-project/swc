define([
    "require",
    "exports",
    "./_root.js",
    "./stubFalse.js"
], function(require, exports1, _rootJs, _stubFalseJs) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    Object.defineProperty(exports1, "default", {
        get: ()=>_default,
        enumerable: true
    });
    _rootJs = _interopRequireDefault(_rootJs);
    _stubFalseJs = _interopRequireDefault(_stubFalseJs);
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? _rootJs.default.Buffer : undefined;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
    var isBuffer = nativeIsBuffer || _stubFalseJs.default;
    var _default = isBuffer;
});
