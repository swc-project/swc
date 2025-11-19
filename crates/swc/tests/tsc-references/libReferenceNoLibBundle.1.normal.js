//// [libReferenceNoLibBundle.ts]
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
        get: function() {
            return elem;
        }
    });
    const elem = {
        field: 'a'
    };
});
