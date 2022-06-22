"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    Foo: ()=>_moduleWithGetter.default,
    baz: ()=>_moduleWithGetter.baz
});
const _moduleWithGetter = _interopRequireWildcard(require("./moduleWithGetter"));
