//// [tsxPreserveEmit1.tsx]
define([
    "require"
], function(require) {});
//// [react.d.ts]
define([
    "require"
], function(require) {});
//// [test.tsx]
// Should emit 'react-router' in the AMD dependency list
define([
    "require",
    "exports",
    "react",
    "react-router"
], function(require, exports, _react, _reactrouter) {
    var M, X1;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _reactrouter.Route, Object.defineProperty(M || (M = {}), "X", {
        enumerable: !0,
        get: function() {
            return X1;
        },
        set: function(v) {
            X1 = v;
        }
    }), M || (M = {}), X;
});
