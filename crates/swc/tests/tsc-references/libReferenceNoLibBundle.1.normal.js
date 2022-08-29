//// [libReferenceNoLibBundle.ts]
// Test that passing noLib disables <reference lib> resolution.
define([
    "require"
], function(require) {
    "use strict";
});
//// [fakelib.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file1.ts]
/// <reference lib="dom" />
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "elem", {
        enumerable: true,
        get: ()=>elem
    });
    const elem = {
        field: 'a'
    };
});
