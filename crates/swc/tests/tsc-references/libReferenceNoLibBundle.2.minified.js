//// [libReferenceNoLibBundle.ts]
define([
    "require"
], function(require) {});
//// [fakelib.ts]
define([
    "require"
], function(require) {});
//// [file1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "elem", {
        enumerable: !0,
        get: ()=>elem
    });
    let elem = {
        field: 'a'
    };
});
