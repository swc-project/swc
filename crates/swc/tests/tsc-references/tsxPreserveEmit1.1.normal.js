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
    "react",
    "react-router"
], function(require, React, ReactRouter) {
    "use strict";
    var Route = ReactRouter.Route;
    var routes1 = /*#__PURE__*/ React.createElement(Route, null);
    (function(M) {})(M || (M = {}));
    (function(M) {
        // Should emit 'M.X' in both opening and closing tags
        var y = /*#__PURE__*/ React.createElement(X, null);
    })(M || (M = {}));
    var M;
});
