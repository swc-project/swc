define([
    "require",
    "exports",
    "dep-a",
    "dep-b",
    "dep-c"
], function(require, exports, _depa, _depb, _depc) {
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
