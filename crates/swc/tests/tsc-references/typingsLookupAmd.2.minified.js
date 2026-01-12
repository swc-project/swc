//// [typingsLookupAmd.ts]
define([
    "require"
], function(require) {});
//// [/node_modules/@types/a/index.d.ts]
define([
    "require"
], function(require) {});
//// [/x/node_modules/@types/b/index.d.ts]
define([
    "require",
    "exports",
    "a"
], function(require, exports, _a) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
//// [/x/y/foo.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
