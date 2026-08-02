//// [a/b/c.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
//// [a/inner.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "c", {
        enumerable: !0,
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
        value: !0
    }), Object.defineProperty(exports, "d", {
        enumerable: !0,
        get: function() {
            return d;
        }
    });
    var d = {
        x: 12
    };
});
