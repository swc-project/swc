//// [file1.ts]
/// <reference lib="dom" preserve="true" />
define([
    "require"
], function(require) {
    "use strict";
});
//// [file2.ts]
/// <reference lib="dom" preserve="true" />
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
