//// [tsxPreserveEmit1.tsx]
define([
    "require"
], function(require) {
    "use strict";
});
//// [react.d.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [test.tsx]
// Should emit 'react-router' in the AMD dependency list
define([
    "require",
    "exports",
    "react",
    "react-router"
], function(require, exports, _react, _reactRouter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Route = _reactRouter.Route;
    var routes1 = /*#__PURE__*/ _react.createElement(Route, null);
    var M;
    (function(M) {
        var X1;
        M.X = X1;
    })(M || (M = {}));
    (function(M) {
        // Should emit 'M.X' in both opening and closing tags
        var y = /*#__PURE__*/ _react.createElement(X, null);
    })(M || (M = {}));
});
