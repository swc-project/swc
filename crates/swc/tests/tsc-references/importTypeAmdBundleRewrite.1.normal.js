//// [a/b/c.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
//// [a/inner.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "c", {
        enumerable: true,
        get: function() {
            return c;
        }
    });
    var c = {
        x: 12
    };
});
//// [index.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "d", {
        enumerable: true,
        get: function() {
            return d;
        }
    });
    var d = {
        x: 12
    };
});
