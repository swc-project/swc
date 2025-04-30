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
    get Foo () {
        return _moduleWithGetter.default;
    },
    get baz () {
        return _moduleWithGetter.baz;
    }
});
const _moduleWithGetter = /*#__PURE__*/ _interop_require_wildcard(require("./moduleWithGetter"));
