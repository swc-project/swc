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
    baz: function() {
        return _moduleWithGetter.baz;
    },
    Foo: function() {
        return _moduleWithGetter.default;
    }
});
const _moduleWithGetter = /*#__PURE__*/ _interop_require_wildcard(require("./moduleWithGetter"));
