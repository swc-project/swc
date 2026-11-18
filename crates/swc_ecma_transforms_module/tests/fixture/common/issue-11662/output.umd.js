(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("dep-a"), require("dep-b"), require("dep-c"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "dep-a",
        "dep-b",
        "dep-c"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.depA, global.depB, global.depC);
})(this, function(exports, _depa, _depb, _depc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get a () {
            return localA;
        },
        get b () {
            return _depb.default;
        },
        get c () {
            return localC;
        },
        get d () {
            return _depc;
        },
        get m () {
            return _depa.zed;
        },
        get z () {
            return _depa.alpha;
        }
    });
    _depb = /*#__PURE__*/ _interop_require_default(_depb);
    _depc = /*#__PURE__*/ _interop_require_wildcard(_depc);
    const localC = 3;
    const localA = 1;
});
