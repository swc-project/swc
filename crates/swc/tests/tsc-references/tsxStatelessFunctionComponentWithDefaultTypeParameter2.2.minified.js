//// [file.tsx]
define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    function MyComponent1(attr) {
        return <div>attr.values</div>;
    }
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), <MyComponent1 values={5}/>;
});
