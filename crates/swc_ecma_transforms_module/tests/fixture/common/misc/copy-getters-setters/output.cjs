"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Foo: function() {
        return _moduleWithGetter.default;
    },
    baz: function() {
        return _moduleWithGetter.baz;
    }
});
const _moduleWithGetter = /*#__PURE__*/ _interop_require_wildcard(require("./moduleWithGetter"));
