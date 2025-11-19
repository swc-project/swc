//// [tsxPreserveEmit3.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [file.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [test.d.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "React", {
        enumerable: true,
        get: function() {
            return React;
        }
    });
    var React;
});
//// [react-consumer.tsx]
// This import should be elided
define([
    "require",
    "exports",
    "./test"
], function(require, exports, _test) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});
