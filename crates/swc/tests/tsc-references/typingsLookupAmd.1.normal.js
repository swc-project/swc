//// [typingsLookupAmd.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [/node_modules/@types/a/index.d.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//// [/x/node_modules/@types/b/index.d.ts]
define([
    "require",
    "exports",
    "a"
], function(require, exports, _a) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//// [/x/y/foo.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
