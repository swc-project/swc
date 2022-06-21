"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    Foo: ()=>_moduleWithGetter.default,
    baz: ()=>_moduleWithGetter.baz
});
const _moduleWithGetter = _interopRequireWildcard(require("./moduleWithGetter"));
